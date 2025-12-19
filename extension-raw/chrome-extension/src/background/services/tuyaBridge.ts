/**
 * Tuya Cloud Bridge Client for Rankify Assist Extension
 * 
 * This module connects the Chrome extension to the cloud bridge service,
 * which connects to Tuya AI Workflow via MCP.
 * 
 * Flow:
 * Tuya Workflow MCP → Cloud Bridge (Vercel) → This Client → Extension → Browser
 */

// Cloud bridge configuration - loaded from storage
let CLOUD_BRIDGE_URL = 'https://your-cloud-bridge-server.vercel.app'; // Default, can be customized
const POLL_INTERVAL = 3000; // 3 seconds

// Authentication credentials - loaded from storage
let credentials = {
    username: '',
    password: '',
};

// State
let isPolling = false;
let isPaused = false;

/**
 * Load configuration from storage
 */
async function loadConfig() {
    return new Promise<void>((resolve) => {
        chrome.storage.local.get(['cloudBridgeUrl', 'bridge_url', 'bridge_credentials', 'cloudBridgeCredentials'], (result) => {
            console.log('[Tuya Bridge] RAW STORAGE:', result);  // ← DEBUG: See everything!

            // Support both old and new key names
            if (result.cloudBridgeUrl) {
                CLOUD_BRIDGE_URL = result.cloudBridgeUrl;
            } else if (result.bridge_url) {
                CLOUD_BRIDGE_URL = result.bridge_url;
            }

            // Check both possible credential keys
            if (result.bridge_credentials) {
                credentials = result.bridge_credentials;
                console.log('[Tuya Bridge] Loaded from bridge_credentials:', credentials);
            } else if (result.cloudBridgeCredentials) {
                credentials = result.cloudBridgeCredentials;
                console.log('[Tuya Bridge] Loaded from cloudBridgeCredentials:', credentials);
            }

            console.log('[Tuya Bridge] Config loaded:', {
                url: CLOUD_BRIDGE_URL,
                hasCredentials: !!credentials.username,
                accessId: credentials.username ? credentials.username.substring(0, 20) + '...' : 'NOT SET',
            });
            resolve();
        });
    });
}


// Initialize config on module load
loadConfig();

// Listen for storage changes and reload config
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        if (changes.bridge_credentials || changes.cloudBridgeUrl || changes.bridge_url) {
            console.log('[Tuya Bridge] Storage changed, reloading config...');
            loadConfig().then(() => {
                console.log('[Tuya Bridge] Config reloaded:', {
                    url: CLOUD_BRIDGE_URL,
                    accessId: credentials.username ? credentials.username.substring(0, 20) + '...' : 'NOT SET'
                });
            });
        }
    }
});

// Listen for URL updates from options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'update_bridge_url') {
        CLOUD_BRIDGE_URL = message.url;
        console.log('[Tuya Bridge] Updated bridge URL:', CLOUD_BRIDGE_URL);
        sendResponse({ success: true });
    }
});

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let commandHandler: ((command: string, commandId: string) => Promise<any>) | null = null;

/**
 * Start polling for commands from bridge server
 */
export function startBridgePolling(handler?: (command: string, commandId: string) => Promise<any>) {
    if (isPolling) {
        console.log('[Tuya Bridge] Already polling');
        return;
    }

    if (handler) {
        commandHandler = handler;
    }

    isPolling = true;
    console.log('[Tuya Bridge] Started polling for Tuya AI commands');

    pollLoop();
}

/**
 * Stop polling
 */
export function stopBridgePolling() {
    isPolling = false;
    console.log('[Tuya Bridge] Stopped polling');
}

/**
 * Pause/Resume polling (doesn't stop, just skips iterations)
 */
export function pauseBridgePolling() {
    isPaused = true;
    console.log('[Tuya Bridge] Paused');
}

export function resumeBridgePolling() {
    isPaused = false;
    console.log('[Tuya Bridge] Resumed');
}

/**
 * Main polling loop
 */
async function pollLoop() {
    while (isPolling) {
        if (isPaused) {
            await sleep(POLL_INTERVAL);
            continue;
        }

        // Skip polling if no Access ID configured
        if (!credentials.username) {  // We'll use username field to store Access ID
            console.log('[Cloud Bridge] No Access ID configured - skipping poll');
            await sleep(POLL_INTERVAL);
            continue;
        }

        try {
            // Poll with Access ID as query parameter
            const response = await fetch(`${CLOUD_BRIDGE_URL}/api/poll?accessId=${encodeURIComponent(credentials.username)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 400) {
                    console.error('[Cloud Bridge] Invalid Access ID');
                }
                await sleep(POLL_INTERVAL);
                continue;
            }

            const data = await response.json();

            if (data.hasCommand) {
                console.log('[Cloud Bridge] Received command:', data.command);
                await executeCommand(data.commandId, data.command);
            }
        } catch (error) {
            // Network error or server not available - expected
            // Don't spam console
        }

        await sleep(POLL_INTERVAL);
    }
}

/**
 * Execute a command received from Tuya AI
 */
async function executeCommand(commandId: string, command: string) {
    console.log('[Tuya Bridge] Executing command:', command);

    try {
        let result: any;

        if (commandHandler) {
            // Use direct callback if available (preferred for background execution)
            console.log('[Tuya Bridge] Delegating execution to handler...');
            result = await commandHandler(command, commandId);
        } else {
            // Fallback to messaging (might fail if no receiver)
            console.log('[Tuya Bridge] No handler, trying sendMessage...');

            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];

            if (activeTab?.id) {
                try {
                    // @ts-ignore
                    await chrome.sidePanel.open({ tabId: activeTab.id });
                    await sleep(1000);
                } catch (e) { console.warn('Side panel open failed', e); }

                result = await chrome.runtime.sendMessage({
                    type: 'execute_tuya_task',
                    task: command,
                    taskId: `tuya_${commandId}`,
                    tabId: activeTab.id,
                });
            } else {
                throw new Error('No active tab to execute in');
            }
        }

        console.log('[Tuya Bridge] Task result:', result);

        // Check result structure
        const resultPayload = (result && result.result) ? result.result : result;
        const success = (result && result.success !== undefined) ? result.success : true; // default true if result returned

        if (success) {
            await sendResultToBridge(commandId, resultPayload || 'Task completed successfully');
        } else {
            throw new Error(result?.error || 'Unknown execution error');
        }

    } catch (error) {
        console.error('[Tuya Bridge] Error executing command:', error);
        await sendResultToBridge(commandId, `Error: ${(error as Error).message}`, 'failed');
    }
}

/**
 * Send execution result back to cloud bridge
 */
async function sendResultToBridge(commandId: string, result: string | object, status = 'completed') {
    try {
        const resultText = typeof result === 'string' ? result : JSON.stringify(result);

        // Pass Access ID if available (stored in credentials.username)
        const accessId = credentials.username;

        await fetch(`${CLOUD_BRIDGE_URL}/api/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commandId,
                accessId,
                result: resultText,
                status: status,
                completedAt: new Date().toISOString(),
            }),
        });

        console.log(`[Cloud Bridge] Result sent (${status})`);
    } catch (error) {
        console.error('[Cloud Bridge] Failed to send result:', error);
    }
}

/**
 * Test bridge connection
 */
export async function testBridgeConnection(): Promise<{ connected: boolean; message: string }> {
    try {
        const response = await fetch(`${CLOUD_BRIDGE_URL}/api/ping`, {
            method: 'GET',
        });

        if (response.ok) {
            return {
                connected: true,
                message: `Connected to cloud bridge at ${CLOUD_BRIDGE_URL}`,
            };
        } else {
            return {
                connected: false,
                message: `Cloud bridge responded with status: ${response.status}`,
            };
        }
    } catch (error) {
        return {
            connected: false,
            message: `Cannot connect to cloud bridge at ${CLOUD_BRIDGE_URL}. Check configuration.`,
        };
    }
}

/**
 * Get current polling status
 */
export function getBridgeStatus() {
    return {
        isPolling,
        isPaused,
        bridgeUrl: CLOUD_BRIDGE_URL,
        pollInterval: POLL_INTERVAL,
    };
}

// Auto-start polling when extension loads
// Can be disabled by calling stopBridgePolling()
console.log('[Tuya Bridge] Module loaded. Call startBridgePolling() to begin.');

// Expose to global scope for debugging
if (typeof globalThis !== 'undefined') {
    (globalThis as any).tuyaBridge = {
        start: startBridgePolling,
        stop: stopBridgePolling,
        pause: pauseBridgePolling,
        resume: resumeBridgePolling,
        test: testBridgeConnection,
        status: getBridgeStatus,
    };

    console.log('[Tuya Bridge] Debug functions available: globalThis.tuyaBridge');
}
