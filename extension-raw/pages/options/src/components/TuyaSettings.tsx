import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

export const TuyaSettings = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [config, setConfig] = useState({
        enabled: false,
        clientId: '',
        clientSecret: '',
        baseUrl: 'https://openapi.tuyaus.com'
    });

    const [bridgeStatus, setBridgeStatus] = useState({
        connected: false,
        message: 'Not checked',
        isPolling: false,
        isPaused: false,
        bridgeUrl: 'http://localhost:3000',
    });

    const [testing, setTesting] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    useEffect(() => {
        chrome.storage.local.get(['tuya_config'], (result) => {
            if (result.tuya_config) {
                setConfig(result.tuya_config);
            }
        });

        // Check bridge status on load
        checkBridgeConnection();

        // Auto-refresh status every 5 seconds
        const interval = setInterval(refreshBridgeStatus, 5000);

        return () => clearInterval(interval);
    }, []);

    const saveSettings = () => {
        chrome.storage.local.set({ tuya_config: config }, () => {
            alert('✅ Tuya settings saved!');
        });
    };

    const checkBridgeConnection = async () => {
        setTesting(true);
        try {
            // Send message to background script to test connection
            const response = await chrome.runtime.sendMessage({
                type: 'test_bridge_connection'
            });

            if (response) {
                setBridgeStatus(prev => ({
                    ...prev,
                    connected: response.connected,
                    message: response.message,
                }));
                setLastChecked(new Date());
            }
        } catch (error) {
            setBridgeStatus(prev => ({
                ...prev,
                connected: false,
                message: `Error: ${(error as Error).message}`,
            }));
        } finally {
            setTesting(false);
        }
    };

    const refreshBridgeStatus = async () => {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'get_bridge_status'
            });

            if (response) {
                setBridgeStatus(prev => ({
                    ...prev,
                    ...response,
                }));
            }
        } catch (error) {
            // Silently fail - extension might be reloading
        }
    };

    const controlBridgePolling = async (action: 'start' | 'stop' | 'pause' | 'resume') => {
        await chrome.runtime.sendMessage({
            type: `bridge_${action}_polling`
        });

        // Refresh status after a short delay
        setTimeout(refreshBridgeStatus, 200);
    };

    return (
        <div className="space-y-6">
            {/* Tuya AI Bridge Section */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-medium text-lg text-primary flex items-center gap-2">
                            🌉 Tuya AI Bridge
                        </h3>
                        <p className="text-sm text-secondary mt-1">
                            Connect to Tuya AI Workflow for voice-controlled browser automation
                        </p>
                    </div>
                </div>

                {/* Connection Status Card */}
                <div className={`p-4 rounded-lg mb-4 ${bridgeStatus.connected ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`text-2xl ${bridgeStatus.connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {bridgeStatus.connected ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                            <div className="font-medium text-primary">
                                {bridgeStatus.connected ? 'Connected' : 'Disconnected'}
                            </div>
                            <div className="text-sm text-secondary">
                                {bridgeStatus.message}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-secondary">Bridge URL:</span>
                            <div className="font-mono text-xs text-primary">{bridgeStatus.bridgeUrl}</div>
                        </div>
                        <div>
                            <span className="text-secondary">Polling:</span>
                            <div className={`font-medium ${bridgeStatus.isPolling ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                {bridgeStatus.isPolling ? (bridgeStatus.isPaused ? '⏸ Paused' : '▶ Active') : '⏹ Stopped'}
                            </div>
                        </div>
                        {lastChecked && (
                            <div className="col-span-2">
                                <span className="text-secondary">Last checked:</span>
                                <div className="text-xs text-primary">{lastChecked.toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={checkBridgeConnection}
                        disabled={testing}
                        className="btn-secondary"
                    >
                        {testing ? '🔄 Testing...' : '🔄 Test Connection'}
                    </Button>

                    {!bridgeStatus.isPolling ? (
                        <Button
                            onClick={() => controlBridgePolling('start')}
                            className="btn-primary"
                        >
                            ▶ Start Polling
                        </Button>
                    ) : (
                        <Button
                            onClick={() => controlBridgePolling('stop')}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            ⏹ Stop Polling
                        </Button>
                    )}

                    {bridgeStatus.isPolling && !bridgeStatus.isPaused && (
                        <Button
                            onClick={() => controlBridgePolling('pause')}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            ⏸ Pause
                        </Button>
                    )}

                    {bridgeStatus.isPolling && bridgeStatus.isPaused && (
                        <Button
                            onClick={() => controlBridgePolling('resume')}
                            className="btn-primary"
                        >
                            ▶ Resume
                        </Button>
                    )}
                </div>

                {/* Setup Instructions (shown when disconnected) */}
                {!bridgeStatus.connected && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="font-medium text-primary mb-2">📋 Setup Instructions:</div>
                        <ol className="text-sm text-secondary space-y-1 list-decimal list-inside">
                            <li>Install bridge server: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">cd bridge-server && npm install</code></li>
                            <li>Start server: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">node server.js</code></li>
                            <li>Click "Test Connection" above</li>
                            <li>If connected, click "Start Polling"</li>
                        </ol>
                        <p className="text-xs text-secondary mt-2">
                            💡 Bridge server is optional - extension works normally without it.
                        </p>
                    </div>
                )}

                {/* Success Message (shown when connected and polling) */}
                {bridgeStatus.connected && bridgeStatus.isPolling && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <span className="text-xl">✅</span>
                            <div>
                                <div className="font-medium">Ready for Tuya AI Commands!</div>
                                <div className="text-sm">Your extension is now listening for commands from Tuya AI Workflow.</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Original Tuya API Settings Section */}
            <div className="glass-card p-6">
                <h3 className="font-medium text-lg text-primary mb-4">🏠 Туya IoT Cloud API</h3>

                {/* Enable Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <label className="font-medium text-lg text-primary">
                            Enable Integration
                        </label>
                        <p className="text-sm text-secondary">Master switch for Tuya features</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                        className="w-5 h-5 accent-current text-primary"
                    />
                </div>

                <div className="grid gap-6">
                    {/* Client ID */}
                    <div>
                        <label className="block mb-2 font-medium text-secondary">
                            Client ID
                        </label>
                        <input
                            type="text"
                            value={config.clientId}
                            onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                            placeholder="Enter your Tuya Client ID"
                            className="glass-input w-full"
                        />
                    </div>

                    {/* Client Secret */}
                    <div>
                        <label className="block mb-2 font-medium text-secondary">
                            Client Secret
                        </label>
                        <input
                            type="password"
                            value={config.clientSecret}
                            onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                            placeholder="Enter your Tuya Client Secret"
                            className="glass-input w-full"
                        />
                    </div>

                    {/* Region */}
                    <div>
                        <label className="block mb-2 font-medium text-secondary">
                            API Region
                        </label>
                        <select
                            value={config.baseUrl}
                            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                            className="glass-input w-full"
                        >
                            <option value="https://openapi.tuyaus.com">United States</option>
                            <option value="https://openapi.tuyacn.com">China</option>
                            <option value="https://openapi.tuyaeu.com">Europe</option>
                            <option value="https://openapi.tuyain.com">India</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Help */}
            <div className="glass-card p-4 border-l-4 border-[var(--accent-fill)] bg-[var(--nav-hover)]">
                <p className="text-sm text-secondary flex items-center">
                    <span className="mr-2 text-xl">💡</span>
                    Get your credentials from{' '}
                    <a
                        href="https://iot.tuya.com/"
                        target="_blank"
                        className="ml-1 text-primary hover:underline font-bold"
                    >
                        Tuya IoT Platform
                    </a>
                </p>
            </div>

            <Button onClick={saveSettings} className="w-full btn-primary py-3 text-lg font-medium shadow-none">
                Save Configuration
            </Button>
        </div>
    );
};
