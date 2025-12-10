/**
 * Tuya API Client - Standalone (no dependencies)
 */
class TuyaAPI {
    constructor(region, accessId, accessSecret) {
        this.baseUrl = this.getRegionUrl(region);
        this.accessId = accessId;
        this.accessSecret = accessSecret;
        this.token = "";
        this.tokenExpireTime = 0;
    }

    getRegionUrl(region) {
        const urls = {
            CN: "https://openapi.tuyacn.com",
            US: "https://openapi.tuyaus.com",
            EU: "https://openapi.tuyaeu.com",
            IN: "https://openapi.tuyain.com",
        };
        return urls[region] || urls.US;
    }

    async getAccessToken() {
        if (this.token && Date.now() < this.tokenExpireTime) return this.token;

        const method = "GET";
        const path = "/v1.0/token?grant_type=1";
        const headers = await this.signRequest(method, path, "", "");

        try {
            const res = await fetch(`${this.baseUrl}${path}`, { method, headers });
            const data = await res.json();
            if (data.success) {
                this.token = data.result.access_token;
                this.tokenExpireTime = Date.now() + data.result.expire_time * 1000 - 60000;
                return this.token;
            }
            throw new Error(data.msg);
        } catch (e) {
            console.error("Tuya Token Error", e);
            throw e;
        }
    }

    async getDeviceStatus(deviceId) {
        await this.getAccessToken();
        const method = "GET";
        const path = `/v1.0/devices/${deviceId}/status`;
        const headers = await this.signRequest(method, path, "", this.token);

        const res = await fetch(`${this.baseUrl}${path}`, { method, headers });
        return await res.json();
    }

    async sendCommand(deviceId, commands) {
        await this.getAccessToken();
        const method = "POST";
        const path = `/v1.0/devices/${deviceId}/commands`;
        const body = JSON.stringify({ commands });
        const headers = await this.signRequest(method, path, body, this.token);

        const res = await fetch(`${this.baseUrl}${path}`, { method, headers, body });
        return await res.json();
    }

    async signRequest(method, path, body, token) {
        const t = Date.now().toString();
        const contentHash = await this.sha256(body);
        const stringToSign = [method, contentHash, "", path].join("\n");
        const signStr = this.accessId + token + t + stringToSign;
        const sign = await this.hmacSha256(this.accessSecret, signStr);

        return {
            client_id: this.accessId,
            sign: sign.toUpperCase(),
            t: t,
            sign_method: "HMAC-SHA256",
            access_token: token,
            "Content-Type": "application/json",
        };
    }

    async sha256(str) {
        const msgBuffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        return this.buf2hex(hashBuffer);
    }

    async hmacSha256(key, data) {
        const enc = new TextEncoder();
        const keyData = await crypto.subtle.importKey(
            "raw",
            enc.encode(key),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", keyData, enc.encode(data));
        return this.buf2hex(signature);
    }

    buf2hex(buffer) {
        return [...new Uint8Array(buffer)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("");
    }
}

// Extension State
let tuyaClient = null;
let lastCommand = "";
let isRunning = false;
let pollingInterval = null;

async function initTuya() {
    const config = await chrome.storage.sync.get([
        "tuyaRegion",
        "tuyaAccessId",
        "tuyaAccessSecret",
        "tuyaDeviceId",
        "llmConfig"
    ]);

    if (config.tuyaAccessId && config.tuyaAccessSecret) {
        tuyaClient = new TuyaAPI(
            config.tuyaRegion || "US",
            config.tuyaAccessId,
            config.tuyaAccessSecret
        );
        console.log("[Rankify] Tuya Client Initialized");
        if (config.tuyaDeviceId) {
            startPolling(config.tuyaDeviceId, config.llmConfig);
        }
    } else {
        console.log("[Rankify] Tuya Config Missing - Open Options");
    }
}

function startPolling(deviceId, llmConfig) {
    if (pollingInterval) clearInterval(pollingInterval);
    if (!deviceId) return;

    console.log("[Rankify] Started Polling Device:", deviceId);

    pollingInterval = setInterval(async () => {
        if (!tuyaClient || isRunning) return;

        try {
            const res = await tuyaClient.getDeviceStatus(deviceId);
            if (res.success && res.result) {
                // NEW: Poll DP 104 (exec_command) instead of DP 101
                const execDp = res.result.find(
                    (d) => d.code === "exec_command" || d.dp_id === 104
                );

                if (execDp && execDp.value !== lastCommand && execDp.value !== "") {
                    console.log("[Rankify] New Command DP 104:", execDp.value);

                    try {
                        // Parse JSON command from AI
                        const command = JSON.parse(execDp.value);

                        // Only execute if intent is "browser"
                        if (command.intent === "browser") {
                            lastCommand = execDp.value;
                            await executeBrowserTask(command, deviceId, llmConfig);
                        } else {
                            console.log("[Rankify] Skipping non-browser intent:", command.intent);
                        }
                    } catch (parseError) {
                        console.error("[Rankify] Failed to parse command JSON:", parseError);
                    }
                }
            }
        } catch (e) {
            console.error("[Rankify] Polling Error:", e);
        }
    }, 2000);
}

async function executeBrowserTask(command, deviceId, llmConfig) {
    isRunning = true;
    console.log("[Rankify] Executing Browser Task:", command);

    try {
        // Extract the actual command text from AI's JSON
        const instruction = command.command || command.plan;

        console.log("[Rankify] Sending to Eko:", instruction);

        // Send message to Eko's built-in chat agent
        const result = await chrome.runtime.sendMessage({
            type: "chat",
            data: {
                user: [{ type: "text", text: instruction }],
                messageId: Date.now().toString(),
            },
        });

        const outputText = result?.result?.output?.[0]?.text || "Task completed";
        console.log("[Rankify] Eko Result:", outputText);

        // Report to DP 105 (exec_result)
        await tuyaClient.sendCommand(deviceId, [
            { code: "exec_result", value: outputText },
        ]);
    } catch (e) {
        console.error("[Rankify] Browser Task Failed:", e);
        await tuyaClient.sendCommand(deviceId, [
            { code: "exec_result", value: "Error: " + String(e) },
        ]);
    } finally {
        isRunning = false;
    }
}

// Initialize on startup
chrome.runtime.onInstalled.addListener(initTuya);
chrome.runtime.onStartup.addListener(initTuya);
chrome.storage.onChanged.addListener(initTuya);

console.log("[Rankify Assist] Loaded");
