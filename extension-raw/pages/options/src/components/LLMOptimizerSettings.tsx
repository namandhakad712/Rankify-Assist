import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

export const LLMOptimizerSettings = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [config, setConfig] = useState({
        promptCaching: { enabled: true },
        cerebrasReasoning: { enabled: true, planner: 'medium', navigator: 'low' },
        geminiThinking: { enabled: true, planner: -1, navigator: 0 },
        structuredOutputs: { enabled: true },
        vision: { enabled: true, navigatorDetail: 'low', plannerDetail: 'high' }
    });

    useEffect(() => {
        chrome.storage.local.get(['llm_optimizer_config'], (result) => {
            if (result.llm_optimizer_config) {
                setConfig(result.llm_optimizer_config);
            }
        });
    }, []);

    const saveSettings = () => {
        chrome.storage.local.set({ llm_optimizer_config: config }, () => {
            alert('✅ LLM Optimizer settings saved!');
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-primary mb-2 font-display">
                    🚀 LLM Optimizer
                </h2>
                <p className="text-secondary text-lg">
                    Optimize AI performance for speed and cost (up to 50% savings)
                </p>
            </div>

            {/* Prompt Caching */}
            <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="font-medium text-primary flex items-center space-x-2 text-lg">
                            <span>Prompt Caching</span>
                            <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-medium">Cost Saver</span>
                        </label>
                        <p className="text-sm text-secondary mt-1">
                            Save 50% on API costs with smart caching
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.promptCaching.enabled}
                        onChange={(e) => setConfig({ ...config, promptCaching: { ...config.promptCaching, enabled: e.target.checked } })}
                        className="w-5 h-5 accent-current text-primary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cerebras Reasoning */}
                <div className="glass-card p-5">
                    <h3 className="font-medium text-primary mb-4 flex items-center text-lg">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-fill)] mr-2"></span>
                        Cerebras Reasoning
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-secondary">Enable</label>
                            <input
                                type="checkbox"
                                checked={config.cerebrasReasoning.enabled}
                                onChange={(e) => setConfig({ ...config, cerebrasReasoning: { ...config.cerebrasReasoning, enabled: e.target.checked } })}
                                className="w-5 h-5 accent-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted uppercase tracking-wider font-semibold">Planner Effort</label>
                            <select
                                value={config.cerebrasReasoning.planner}
                                onChange={(e) => setConfig({ ...config, cerebrasReasoning: { ...config.cerebrasReasoning, planner: e.target.value } })}
                                className="glass-input w-full text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted uppercase tracking-wider font-semibold">Navigator Effort</label>
                            <select
                                value={config.cerebrasReasoning.navigator}
                                onChange={(e) => setConfig({ ...config, cerebrasReasoning: { ...config.cerebrasReasoning, navigator: e.target.value } })}
                                className="glass-input w-full text-sm"
                            >
                                <option value="low">Low (Fast)</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Gemini Thinking */}
                <div className="glass-card p-5">
                    <h3 className="font-medium text-primary mb-4 flex items-center text-lg">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-fill)] mr-2"></span>
                        Gemini Thinking
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-secondary">Enable</label>
                            <input
                                type="checkbox"
                                checked={config.geminiThinking.enabled}
                                onChange={(e) => setConfig({ ...config, geminiThinking: { ...config.geminiThinking, enabled: e.target.checked } })}
                                className="w-5 h-5 accent-current text-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted uppercase tracking-wider font-semibold">Planner Budget</label>
                            <select
                                value={config.geminiThinking.planner}
                                onChange={(e) => setConfig({ ...config, geminiThinking: { ...config.geminiThinking, planner: parseInt(e.target.value) } })}
                                className="glass-input w-full text-sm"
                            >
                                <option value="-1">Dynamic (Recommended)</option>
                                <option value="0">Off</option>
                                <option value="1024">Low (1024)</option>
                                <option value="8192">Medium (8192)</option>
                                <option value="24576">High (24576)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted uppercase tracking-wider font-semibold">Navigator Budget</label>
                            <select
                                value={config.geminiThinking.navigator}
                                onChange={(e) => setConfig({ ...config, geminiThinking: { ...config.geminiThinking, navigator: parseInt(e.target.value) } })}
                                className="glass-input w-full text-sm"
                            >
                                <option value="0">Off (Fast)</option>
                                <option value="-1">Dynamic</option>
                                <option value="512">Low (512)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced */}
            <div className="glass-card p-5">
                <h3 className="font-medium text-primary mb-4 text-lg">
                    Advanced Features
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-color pb-3">
                        <div>
                            <label className="text-secondary block font-medium">Structured Outputs</label>
                            <p className="text-xs text-muted">Force valid JSON responses</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.structuredOutputs.enabled}
                            onChange={(e) => setConfig({ ...config, structuredOutputs: { ...config.structuredOutputs, enabled: e.target.checked } })}
                            className="w-5 h-5 accent-indigo-500"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <label className="text-secondary block font-medium">Vision Optimization</label>
                            <p className="text-xs text-muted">Resize images for token savings</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.vision.enabled}
                            onChange={(e) => setConfig({ ...config, vision: { ...config.vision, enabled: e.target.checked } })}
                            className="w-5 h-5 accent-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <Button onClick={saveSettings} className="w-full btn-primary py-3 text-lg font-medium shadow-none">
                Save Configuration
            </Button>
        </div>
    );
};
