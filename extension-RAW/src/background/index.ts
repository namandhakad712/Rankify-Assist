import { ChatAgent, LLMs } from "@eko-ai/eko";
import { BrowserAgent } from "@eko-ai/eko-extension";
import { TuyaAPI } from "./tuya_api";

let tuyaClient: TuyaAPI | null = null;
let lastInstruction = "";
let isRunning = false;
let pollingInterval: any = null;

const DP_INSTRUCTION_ID = "101";
const DP_RESULT_ID = "102";

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
        console.log("Tuya Client Initialized");
        startPolling(config.tuyaDeviceId, config.llmConfig);
    } else {
        console.log("Tuya Config Missing - Open Options");
    }
}

function startPolling(deviceId: string, llmConfig: any) {
    if (pollingInterval) clearInterval(pollingInterval);
    if (!deviceId) return;

    console.log("Started Polling Tuya Device:", deviceId);

    pollingInterval = setInterval(async () => {
        if (!tuyaClient || isRunning) return;

        try {
            const res = await tuyaClient.getDeviceStatus(deviceId);
            if (res.success && res.result) {
                const dp = res.result.find(
                    (d: any) => d.code === "browser_instruction" || d.dp_id === 101
                );

                if (dp) {
                    const instruction = dp.value;
                    if (instruction !== lastInstruction && instruction !== "") {
                        console.log("New Instruction:", instruction);
                        lastInstruction = instruction;
                        runEko(instruction, deviceId, llmConfig);
                    }
                }
            }
        } catch (e) {
            console.error("Polling Error:", e);
        }
    }, 2000);
}

async function runEko(instruction: string, deviceId: string, llmConfig: any) {
    if (!llmConfig) {
        console.error("LLM Config Missing");
        return;
    }

    isRunning = true;

    try {
        const llms: LLMs = {
            default: {
                provider: llmConfig.llm || "openai",
                model: llmConfig.modelName || "gpt-4o",
                apiKey: llmConfig.apiKey,
            },
        };

        const agent = new ChatAgent({
            llms,
            agents: [new BrowserAgent()],
        });

        console.log("Running Eko...");

        const result = await agent.chat({
            user: [{ type: "text", text: instruction }],
            messageId: Date.now().toString(),
        });

        const outputText = result.output[0]?.text || "Task Done";
        console.log("Eko Result:", outputText);

        if (tuyaClient) {
            await tuyaClient.sendCommand(deviceId, [
                {
                    code: "browser_result",
                    value: outputText,
                },
            ]);
        }
    } catch (e) {
        console.error("Eko Execution Failed:", e);
        if (tuyaClient) {
            await tuyaClient.sendCommand(deviceId, [
                {
                    code: "browser_result",
                    value: "Error: " + String(e),
                },
            ]);
        }
    } finally {
        isRunning = false;
    }
}

chrome.runtime.onInstalled.addListener(initTuya);
chrome.runtime.onStartup.addListener(initTuya);
chrome.storage.onChanged.addListener(initTuya);
