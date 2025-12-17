import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

export const TuyaSettings = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [config, setConfig] = useState({
        enabled: false,
        clientId: '',
        clientSecret: '',
        baseUrl: 'https://openapi.tuyaus.com'
    });

    const [status, setStatus] = useState('');

    useEffect(() => {
        chrome.storage.local.get(['tuya_config'], (result) => {
            if (result.tuya_config) {
                setConfig(result.tuya_config);
            }
        });
    }, []);

    const saveSettings = () => {
        chrome.storage.local.set({ tuya_config: config }, () => {
            setStatus('✅ Settings saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    🏠 Tuya Smart Home Integration
                </h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Control Tuya IoT devices using full OpenAPI v1.0
                </p>
            </div>

            {/* Enable Toggle */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                    <label className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Enable Integration
                    </label>
                    <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                        className="w-5 h-5"
                    />
                </div>
            </div>

            {/* Client ID */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Client ID
                </label>
                <input
                    type="text"
                    value={config.clientId}
                    onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                    placeholder="Enter Tuya Client ID"
                    className={`w-full p-2 rounded ${isDarkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
                />
            </div>

            {/* Client Secret */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Client Secret
                </label>
                <input
                    type="password"
                    value={config.clientSecret}
                    onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                    placeholder="Enter Tuya Client Secret"
                    className={`w-full p-2 rounded ${isDarkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
                />
            </div>

            {/* Region */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    API Region
                </label>
                <select
                    value={config.baseUrl}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    className={`w-full p-2 rounded ${isDarkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
                >
                    <option value="https://openapi.tuyaus.com">United States</option>
                    <option value="https://openapi.tuyacn.com">China</option>
                    <option value="https://openapi.tuyaeu.com">Europe</option>
                    <option value="https://openapi.tuyain.com">India</option>
                </select>
            </div>

            {/* Help Box */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    How to get credentials:
                </h4>
                <ol className={`list-decimal list-inside space-y-1 text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    <li>Go to <a href="https://iot.tuya.com/" target="_blank" className="underline">Tuya IoT Platform</a></li>
                    <li>Create a Cloud Project (or use existing)</li>
                    <li>Copy your Client ID and Client Secret</li>
                    <li>Link your devices to this project</li>
                </ol>
            </div>

            {status && (
                <div className="p-3 bg-green-500/20 text-green-300 rounded">
                    {status}
                </div>
            )}

            <Button onClick={saveSettings} className="w-full">
                Save Configuration
            </Button>
        </div>
    );
};
