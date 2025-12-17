/**
 * LLM OPTIMIZER - UPDATE-PROOF MODULE
 * 
 * Intercepts and optimizes LLM API calls from Nanobrowser
 * WITHOUT modifying source code.
 * 
 * Features:
 * - Prompt caching optimization (static-first order)
 * - Reasoning parameters (Cerebras, Gemini)
 * - Structured outputs (JSON schema)
 * - Vision optimization (detail parameter)
 */

(function () {
    console.log('🚀 [LLM-OPTIMIZER] Loading...');

    // Configuration
    const OPTIMIZER_CONFIG = {
        enabled: true,

        // Prompt caching optimization
        promptCaching: {
            enabled: true,
            staticFirst: true  // Reorder: system → tools → context → user
        },

        // Reasoning (Cerebras)
        cerebrasReasoning: {
            enabled: true,
            planner: 'medium',   // low | medium | high
            navigator: 'low'     // Fast responses
        },

        // Thinking (Gemini)
        geminiThinking: {
            enabled: true,
            planner: -1,         // Dynamic
            navigator: 0         // Disabled (fast)
        },

        // Structured outputs
        structuredOutputs: {
            enabled: true,
            enforceSchema: true
        },

        // Vision optimization
        vision: {
            enabled: true,
            navigatorDetail: 'low',   // Fast, simple UIs
            plannerDetail: 'high'     // Complex analysis
        }
    };

    // Load user config from storage
    chrome.storage.local.get(['llm_optimizer_config'], (result) => {
        if (result.llm_optimizer_config) {
            Object.assign(OPTIMIZER_CONFIG, result.llm_optimizer_config);
            console.log('🚀 [LLM-OPTIMIZER] Config loaded:', OPTIMIZER_CONFIG);
        }
    });

    /**
     * Optimize messages array for prompt caching
     * Reorder: static content first, dynamic last
     */
    function optimizeMessageOrder(messages) {
        if (!OPTIMIZER_CONFIG.promptCaching.enabled) return messages;

        const systemMessages = [];
        const toolMessages = [];
        const contextMessages = [];
        const conversationMessages = [];

        messages.forEach(msg => {
            const content = typeof msg.content === 'string' ? msg.content : '';

            if (msg.role === 'system') {
                // Separate system prompts by type
                if (content.includes('tool') || content.includes('function')) {
                    toolMessages.push(msg);
                } else if (content.includes('DOM') || content.includes('SCREEN')) {
                    contextMessages.push(msg);
                } else {
                    systemMessages.push(msg);
                }
            } else {
                conversationMessages.push(msg);
            }
        });

        // Optimal order for caching: system → tools → context → conversation
        const optimized = [
            ...systemMessages,
            ...toolMessages,
            ...contextMessages,
            ...conversationMessages
        ];

        console.log('🚀 [LLM-OPTIMIZER] Reordered messages for caching');
        return optimized;
    }

    /**
     * Add reasoning parameters based on model
     */
    function addReasoningParams(config, agentType) {
        if (!config.model) return config;

        // Cerebras models (reasoning_effort)
        if (config.model.includes('cerebras') ||
            config.model.includes('gpt-oss') ||
            config.model.includes('llama-3.3-70b')) {

            if (OPTIMIZER_CONFIG.cerebrasReasoning.enabled) {
                const effort = agentType === 'planner'
                    ? OPTIMIZER_CONFIG.cerebrasReasoning.planner
                    : OPTIMIZER_CONFIG.cerebrasReasoning.navigator;

                config.reasoning_effort = effort;
                console.log(`🚀 [LLM-OPTIMIZER] Added reasoning_effort: ${effort}`);
            }
        }

        // Gemini models (thinkingBudget)
        if (config.model.includes('gemini-2.5') ||
            config.model.includes('gemini-2.0')) {

            if (OPTIMIZER_CONFIG.geminiThinking.enabled) {
                const budget = agentType === 'planner'
                    ? OPTIMIZER_CONFIG.geminiThinking.planner
                    : OPTIMIZER_CONFIG.geminiThinking.navigator;

                if (!config.thinking_config) {
                    config.thinking_config = {};
                }
                config.thinking_config.thinking_budget = budget;
                console.log(`🚀 [LLM-OPTIMIZER] Added thinkingBudget: ${budget}`);
            }
        }

        return config;
    }

    /**
     * Optimize images with detail parameter
     */
    function optimizeImages(messages, agentType) {
        if (!OPTIMIZER_CONFIG.vision.enabled) return messages;

        const detail = agentType === 'planner'
            ? OPTIMIZER_CONFIG.vision.plannerDetail
            : OPTIMIZER_CONFIG.vision.navigatorDetail;

        messages.forEach(msg => {
            if (Array.isArray(msg.content)) {
                msg.content.forEach(part => {
                    if (part.type === 'image_url' && part.image_url) {
                        if (!part.image_url.detail) {
                            part.image_url.detail = detail;
                            console.log(`🚀 [LLM-OPTIMIZER] Set image detail: ${detail}`);
                        }
                    }
                });
            }
        });

        return messages;
    }

    /**
     * Main optimization function
     * Called before every LLM API request
     */
    window.optimizeLLMRequest = function (requestConfig, agentType = 'navigator') {
        if (!OPTIMIZER_CONFIG.enabled) return requestConfig;

        console.log('🚀 [LLM-OPTIMIZER] Optimizing request...');

        // 1. Optimize message order (prompt caching)
        if (requestConfig.messages) {
            requestConfig.messages = optimizeMessageOrder(requestConfig.messages);
            requestConfig.messages = optimizeImages(requestConfig.messages, agentType);
        }

        // 2. Add reasoning parameters
        requestConfig = addReasoningParams(requestConfig, agentType);

        // 3. Structured outputs (navigator only)
        if (agentType === 'navigator' && OPTIMIZER_CONFIG.structuredOutputs.enabled) {
            // Check if model supports structured outputs
            if (requestConfig.model &&
                (requestConfig.model.includes('llama') ||
                    requestConfig.model.includes('groq'))) {

                if (!requestConfig.response_format) {
                    requestConfig.response_format = {
                        type: "json_schema",
                        json_schema: {
                            name: "navigation_action",
                            strict: true,
                            schema: {
                                type: "object",
                                properties: {
                                    thought: { type: "string", description: "Brief reasoning" },
                                    action: {
                                        type: "string",
                                        enum: ["click", "input", "scroll", "navigate", "extract"]
                                    },
                                    element_index: { type: "number" },
                                    value: { type: "string" }
                                },
                                required: ["action"]
                            }
                        }
                    };
                    console.log('🚀 [LLM-OPTIMIZER] Added structured output schema');
                }
            }
        }

        return requestConfig;
    };

    // Expose config update function
    window.updateLLMOptimizerConfig = function (newConfig) {
        Object.assign(OPTIMIZER_CONFIG, newConfig);
        chrome.storage.local.set({ llm_optimizer_config: OPTIMIZER_CONFIG });
        console.log('🚀 [LLM-OPTIMIZER] Config updated:', OPTIMIZER_CONFIG);
    };

    // Expose current config
    window.getLLMOptimizerConfig = function () {
        return OPTIMIZER_CONFIG;
    };

    console.log('🚀 [LLM-OPTIMIZER] Ready!');
})();
