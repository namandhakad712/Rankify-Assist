/**
 * EKO Extension - Advanced LLM Configuration Module
 * Implements thinking, reasoning, caching, grounding, and structured outputs
 * for Gem ini and GROQ models
 */

// =====================================================
// GEMINI ADVANCED CONFIGURATION
// =====================================================

/**
 * Enhance Gemini API request with advanced features
 * @param {Object} config - Base API configuration
 * @param {Object} advancedConfig - Advanced feature configuration
 * @param {Object} modelCapabilities - Model capability information
 * @param {string} modelId - Model ID for version detection
 * @returns {Object} Enhanced configuration
 */
function enhanceGeminiConfig(config, advancedConfig, modelCapabilities, modelId) {
    const enhanced = { ...config };

    // Initialize generationConfig if not exists
    enhanced.generationConfig = enhanced.generationConfig || {};

    // 1. THINKING/REASONING SUPPORT
    if (advancedConfig.thinking?.enabled && modelCapabilities.thinking) {
        console.log(`🧠 Enabling thinking for ${modelId}`);
        enhanced.generationConfig.thinkingConfig = {
            thinkingBudget: advancedConfig.thinking.budget || -1, // -1 = dynamic
            includeThoughts: advancedConfig.thinking.includeThoughts !== false
        };
    }

    // 2. CONTEXT CACHING
    if (advancedConfig.caching?.enabled && modelCapabilities.caching) {
        // Implicit caching is automatic for 2.5 models
        console.log(`💾 Context caching enabled for ${modelId} (implicit for 2.5 models)`);

        // If explicit caching with cachedContent ID provided
        if (advancedConfig.caching.cachedContentId) {
            enhanced.cachedContent = advancedConfig.caching.cachedContentId;
            console.log(`💾 Using explicit cached content: ${advancedConfig.caching.cachedContentId}`);
        }
    }

    // 3. GROUNDING (Search/Maps)
    if (advancedConfig.grounding?.enabled && modelCapabilities.grounding) {
        enhanced.tools = enhanced.tools || [];

        const isGemini2 = modelId.includes('gemini-2');
        const supportsDynamicRetrieval = modelId.includes('gemini-1.5-flash') && !modelId.includes('-8b');

        if (advancedConfig.grounding.googleSearch) {
            console.log(`🌐 Enabling Google Search grounding for ${modelId}`);
            if (isGemini2) {
                enhanced.tools.push({ googleSearch: {} });
            } else if (supportsDynamicRetrieval && advancedConfig.grounding.dynamicRetrieval) {
                enhanced.tools.push({
                    googleSearchRetrieval: {
                        dynamicRetrievalConfig: {
                            mode: 'MODE_DYNAMIC',
                            dynamicThreshold: 0.3
                        }
                    }
                });
            } else {
                enhanced.tools.push({ googleSearchRetrieval: {} });
            }
        }

        if (advancedConfig.grounding.googleMaps && isGemini2) {
            console.log(`🗺️ Enabling Google Maps grounding for ${modelId}`);
            enhanced.tools.push({ googleMaps: {} });
        }
    }

    // 4. CODE EXECUTION
    if (advancedConfig.codeExecution?.enabled && modelCapabilities.codeExecution) {
        const isGemini2 = modelId.includes('gemini-2');
        if (isGemini2) {
            enhanced.tools = enhanced.tools || [];
            enhanced.tools.push({ codeExecution: {} });
            console.log(`⚡ Enabling code execution for ${modelId}`);
        }
    }

    // 5. STRUCTURED OUTPUTS (JSON Schema)
    if (advancedConfig.structuredOutput?.enabled && modelCapabilities.structuredOutput) {
        if (advancedConfig.structuredOutput.schema) {
            enhanced.generationConfig.responseMimeType = 'application/json';
            enhanced.generationConfig.responseSchema = advancedConfig.structuredOutput.schema;
            console.log(`📋 Enabling structured output with JSON Schema`);
        }
    }

    return enhanced;
}

// =====================================================
// GROQ ADVANCED CONFIGURATION
// =====================================================

/**
 * Enhance GROQ API request with advanced features
 * @param {Object} requestBody - Base API request body
 * @param {Object} advancedConfig - Advanced feature configuration
 * @param {Object} modelCapabilities - Model capability information
 * @param {string} modelId - Model ID
 * @returns {Object} Enhanced request body
 */
function enhanceGroqConfig(requestBody, advancedConfig, modelCapabilities, modelId) {
    const enhanced = { ...requestBody };

    // 1. REASONING SUPPORT (GPT-OSS models)
    if (advancedConfig.thinking?.enabled && modelCapabilities.reasoning) {
        console.log(`🧠 Enabling reasoning for ${modelId}`);

        // reasoning_format: "parsed" | "raw" | "hidden"
        enhanced.reasoning_format = advancedConfig.thinking.reasoningFormat || 'parsed';

        // reasoning_effort: "low" | "medium" | "high" (for GPT-OSS)
        // or "none" | "default" (for Qwen)
        if (modelId.includes('gpt-oss')) {
            enhanced.reasoning_effort = advancedConfig.thinking.reasoningEffort || 'medium';
        } else if (modelId.includes('qwen')) {
            enhanced.reasoning_effort = advancedConfig.thinking.reasoningEffort || 'default';
        }

        // include_reasoning: alternative to reasoning_format
        if (advancedConfig.thinking.includeThoughts !== false) {
            enhanced.include_reasoning = true;
        }
    }

    // 2. STRUCTURED OUTPUTS (JSON Schema)
    if (advancedConfig.structuredOutput?.enabled && modelCapabilities.structuredOutput) {
        if (advancedConfig.structuredOutput.schema) {
            console.log(`📋 Enabling structured output with JSON Schema for ${modelId}`);
            enhanced.response_format = {
                type: 'json_schema',
                json_schema: {
                    name: 'response',
                    strict: true,
                    schema: advancedConfig.structuredOutput.schema
                }
            };
        } else {
            // Fallback to basic JSON mode
            enhanced.response_format = { type: 'json_object' };
        }
    }

    // 3. VISION SETTINGS
    if (modelCapabilities.vision && advancedConfig.vision?.enabled) {
        // Vision limits are handled by the model itself
        console.log(`👁️ Vision enabled for ${modelId} (max ${advancedConfig.vision.maxImages || 5} images)`);
    }

    // 4. FUNCTION CALLING MODE
    if (modelCapabilities.functionCalling && enhanced.tools && enhanced.tools.length > 0) {
        // GROQ uses OpenAI-compatible tool_choice
        if (advancedConfig.functionCalling?.mode) {
            switch (advancedConfig.functionCalling.mode) {
                case 'auto':
                    enhanced.tool_choice = 'auto';
                    break;
                case 'none':
                    enhanced.tool_choice = 'none';
                    break;
                case 'any':
                    enhanced.tool_choice = 'required';
                    break;
            }
        }
    }

    return enhanced;
}

// =====================================================
// CEREBRAS ADVANCED CONFIGURATION
// =====================================================

/**
 * Enhance Cerebras API request with advanced features
 * @param {Object} requestBody - Base API request body
 * @param {Object} advancedConfig - Advanced feature configuration  
 * @param {Object} modelCapabilities - Model capability information
 * @param {string} modelId - Model ID
 * @returns {Object} Enhanced request body
 */
function enhanceCerebrasConfig(requestBody, advancedConfig, modelCapabilities, modelId) {
    const enhanced = { ...requestBody };

    // 1. REASONING SUPPORT
    if (advancedConfig.thinking?.enabled && modelCapabilities.reasoning) {
        console.log(`🧠 Enabling reasoning for Cerebras ${modelId}`);

        // GPT-OSS models: reasoning_effort control
        if (modelId.includes('gpt-oss')) {
            enhanced.reasoning_effort = advancedConfig.thinking.reasoningEffort || 'medium';
            console.log(`⚙️ Reasoning effort: ${enhanced.reasoning_effort}`);
        }

        // Z.ai GLM: disable_reasoning toggle
        if (modelId.includes('glm')) {
            enhanced.disable_reasoning = false; // Enable reasoning
            console.log(`🧠 Reasoning enabled for ${modelId}`);
        }

        // Qwen: Can use /no_think suffix for disabling
        if (modelId.includes('qwen') && !advancedConfig.thinking.enabled) {
            console.log(`💡 Hint: Append /no_think to prompt to disable reasoning for ${modelId}`);
        }
    }

    // 2. STRUCTURED OUTPUTS (JSON Schema)
    if (advancedConfig.structuredOutput?.enabled && modelCapabilities.structuredOutput) {
        if (advancedConfig.structuredOutput.schema) {
            console.log(`📋 Enabling structured output for ${modelId}`);
            enhanced.response_format = {
                type: 'json_schema',
                json_schema: {
                    name: 'response',
                    strict: true, // Cerebras requires strict: true
                    schema: advancedConfig.structuredOutput.schema
                }
            };
        }
    }

    // 3. TOOL CALLING
    if (modelCapabilities.functionCalling && enhanced.tools && enhanced.tools.length > 0) {
        // Cerebras supports parallel_tool_calls
        if (modelCapabilities.parallelToolCalling) {
            enhanced.parallel_tool_calls = advancedConfig.functionCalling?.parallelCalls !== false;
            console.log(`🔧 Parallel tool calling: ${enhanced.parallel_tool_calls}`);
        }
    }

    // 4. STREAMING (already supported by default)
    if (modelCapabilities.streaming) {
        console.log(`⚡ Streaming supported at ${modelCapabilities.speed || '2000+'} tokens/sec!`);
    }

    return enhanced;
}

// =====================================================
// GENERAL HELPERS
// =====================================================

/**
 * Get advanced configuration from storage for current provider
 * @param {string} provider - Provider name (google, groq, etc.)
 * @returns {Promise<Object>} Advanced configuration
 */
async function getAdvancedConfig(provider) {
    try {
        const data = await chrome.storage.sync.get(['advancedLLMConfig']);
        const advancedConfig = data.advancedLLMConfig || {};

        if (!advancedConfig[provider]) {
            // Return default config
            return getDefaultAdvancedConfig(provider);
        }

        return advancedConfig[provider];
    } catch (error) {
        console.error('Error loading advanced config:', error);
        return getDefaultAdvancedConfig(provider);
    }
}

/**
 * Get default advanced configuration for a provider
 * @param {string} provider - Provider name
 * @returns {Object} Default configuration
 */
function getDefaultAdvancedConfig(provider) {
    const baseConfig = {
        thinking: {
            enabled: false,
            budget: -1,
            includeThoughts: true,
            reasoningFormat: 'parsed',
            reasoningEffort: 'medium'
        },
        structuredOutput: {
            enabled: false,
            mode: 'json_object',
            schema: null
        },
        caching: {
            enabled: true,
            implicitCaching: true,
            cachedContentId: null
        },
        grounding: {
            enabled: false,
            googleSearch: false,
            googleMaps: false,
            dynamicRetrieval: false
        },
        codeExecution: {
            enabled: false
        },
        vision: {
            enabled: true,
            maxImages: 5
        },
        functionCalling: {
            mode: 'auto',
            parallelCalls: true
        }
    };

    // Provider-specific overrides
    if (provider === 'google') {
        baseConfig.thinking.enabled = true; // Auto-enable for 2.5
        baseConfig.caching.enabled = true;
    }

    return baseConfig;
}

/**
 * Log usage metadata including thinking/reasoning tokens
 * @param {Object} usageMetadata - Usage metadata from API response
 * @param {string} provider - Provider name
 */
function logUsageMetadata(usageMetadata, provider) {
    if (!usageMetadata) return;

    console.group('📊 Token Usage');
    console.log(`Provider: ${provider}`);

    if (usageMetadata.inputTokens) {
        console.log(`Input: ${usageMetadata.inputTokens.toLocaleString()} tokens`);
    }

    if (usageMetadata.outputTokens) {
        console.log(`Output: ${usageMetadata.outputTokens.toLocaleString()} tokens`);
    }

    // Gemini thinking tokens
    if (usageMetadata.reasoningTokens || usageMetadata.thoughtsTokenCount) {
        const thinkingTokens = usageMetadata.reasoningTokens || usageMetadata.thoughtsTokenCount;
        console.log(`🧠 Thinking: ${thinkingTokens.toLocaleString()} tokens`);
    }

    // Gemini cached tokens  
    if (usageMetadata.cachedInputTokens || usageMetadata.cachedContentTokenCount) {
        const cachedTokens = usageMetadata.cachedInputTokens || usageMetadata.cachedContentTokenCount;
        console.log(`💾 Cached: ${cachedTokens.toLocaleString()} tokens (saved cost!)`);

        // Calculate savings percentage
        const total = usageMetadata.inputTokens || usageMetadata.promptTokenCount || 0;
        if (total > 0) {
            const savingsPercent = ((cachedTokens / total) * 100).toFixed(1);
            console.log(`💰 Cost savings: ${savingsPercent}%`);
        }
    }

    if (usageMetadata.totalTokens) {
        console.log(`Total: ${usageMetadata.totalTokens.toLocaleString()} tokens`);
    }

    console.groupEnd();
}

// Export for use in sidebar and background scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enhanceGeminiConfig,
        enhanceGroqConfig,
        enhanceCerebrasConfig,
        getAdvancedConfig,
        getDefaultAdvancedConfig,
        logUsageMetadata
    };
}

console.log('✨ Advanced LLM Configuration Module Loaded');
console.log('🎯 Features: Thinking, Reasoning, Caching, Grounding, Structured Outputs');
console.log('⚡ Providers: Gemini, GROQ, Cerebras');
