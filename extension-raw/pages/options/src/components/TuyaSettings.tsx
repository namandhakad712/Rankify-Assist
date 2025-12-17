import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

export const TuyaSettings = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [config, setConfig] = useState({
        enabled: false,
        clientId: '',
        clientSecret: '',
        baseUrl: 'https://openapi.tuyaus.com'
    });

    useEffect(() => {
        chrome.storage.local.get(['tuya_config'], (result) => {
            if (result.tuya_config) {
                setConfig(result.tuya_config);
            }
        });
    }, []);

    const saveSettings = () => {
        chrome.storage.local.set({ tuya_config: config }, () => {
            alert('✅ Tuya settings saved!');
        });
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
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
