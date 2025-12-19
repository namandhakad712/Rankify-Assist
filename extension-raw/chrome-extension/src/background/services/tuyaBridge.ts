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
let CLOUD_BRIDGE_URL = 'https://tuya-cloud-bridge.vercel.app'; // Default, can be customized
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
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load configuration from storage
 */
async function loadConfig() {
    return new Promise<void>((resolve) => {
        chrome.storage.local.get(['bridge_url', 'bridge_credentials'], (result) => {
            if (result.bridge_url) {
                CLOUD_BRIDGE_URL = result.bridge_url;
            }
            if (result.bridge_credentials) {
                credentials = result.bridge_credentials;
            }
            console.log('[Cloud Bridge] Config loaded:', {
                url: CLOUD_BRIDGE_URL,
                hasCredentials: !!credentials.username,
            });
            resolve();
        });
    });
}

// Load config on module initialization
loadConfig();

/**
 * Start polling for commands from bridge server
 */
export function startBridgePolling() {
    if (isPolling) {
        console.log('[Tuya Bridge] Already polling');
        return;
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

        // Skip polling if no credentials
        if (!credentials.username || !credentials.password) {
            console.log('[Cloud Bridge] No credentials configured - skipping poll');
            await sleep(POLL_INTERVAL);
            continue;
        }

        try {
            // Create Basic Auth header
            const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;

            const response = await fetch(`${CLOUD_BRIDGE_URL}/api/poll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            });

            if (!response.ok) {
                // Unauthorized or server error
                if (response.status === 401) {
                    console.error('[Cloud Bridge] Authentication failed - check credentials');
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
        // Get the current active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tabs || tabs.length === 0) {
            throw new Error('No active tab found');
        }

        const activeTab = tabs[0];

        // Send command to the extension's message handler
        // This will trigger your existing Nanobrowser automation
        const result = await chrome.runtime.sendMessage({
            type: 'newTask',
            data: {
                task: command,
                tabId: activeTab.id,
            },
        });

        console.log('[Tuya Bridge] Task result:', result);

        // Send result back to cloud bridge
        await sendResultToBridge(commandId, result || 'Task completed successfully');

    } catch (error) {
        console.error('[Tuya Bridge] Error executing command:', error);

        // Send error back to cloud bridge
        await sendResultToBridge(commandId, `Error: ${(error as Error).message}`);
    }
}

/**
 * Send execution result back to cloud bridge
 */
async function sendResultToBridge(commandId: string, result: string | object) {
    try {
        const resultText = typeof result === 'string' ? result : JSON.stringify(result);
        const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;

        await fetch(`${CLOUD_BRIDGE_URL}/api/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({
                commandId,
                result: resultText,
                success: true,
                executionTime: 0, // TODO: Track actual execution time
            }),
        });

        console.log('[Cloud Bridge] Result sent');
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
