// Model capability definitions with advanced features
const MODEL_CAPABILITIES = {
    // OpenAI Models
    'gpt-4o': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'gpt-4o-mini': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'gpt-4-turbo': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'gpt-4': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'gpt-3.5-turbo': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'o1': { vision: false, text: true, thinking: true, structuredOutput: false, functionCalling: false },
    'o1-mini': { vision: false, text: true, thinking: true, structuredOutput: false, functionCalling: false },
    'o1-preview': { vision: false, text: true, thinking: true, structuredOutput: false, functionCalling: false },

    // Anthropic Models
    'claude-3-5-sonnet': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'claude-3-5-haiku': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'claude-3-opus': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'claude-3-sonnet': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'claude-3-haiku': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },

    // Google Gemini 2.5 Series (Latest - Most Capable!)
    'gemini-2.5-pro': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, grounding: true, codeExecution: true },
    'gemini-2.5-flash': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, grounding: true, codeExecution: true },
    'gemini-2.5-flash-lite': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, grounding: true, codeExecution: true },
    'gemini-2.5-flash-preview': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, grounding: true, codeExecution: true },
    'gemini-2.5-flash-lite-preview': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, grounding: true, codeExecution: true },
    'gemini-2.5-flash-image': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: false, imageGeneration: true },
    'gemini-2.5-flash-native-audio': { vision: false, text: true, thinking: true, structuredOutput: false, functionCalling: true, audioGeneration: true },

    // Google Gemini 2.0 Series
    'gemini-2.0-flash': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, codeExecution: true },
    'gemini-2.0-flash-exp': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, codeExecution: true },
    'gemini-2.0-flash-001': { vision: true, text: true, thinking: true, structuredOutput: true, functionCalling: true, caching: true, codeExecution: true },
    'gemini-2.0-flash-lite': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },

    // Google Gemini 1.5 Series
    'gemini-1.5-pro': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true, caching: false },
    'gemini-1.5-pro-latest': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true, caching: false },
    'gemini-1.5-flash': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true, caching: false },
    'gemini-1.5-flash-latest': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true, caching: false },
    'gemini-1.5-flash-8b': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true, caching: false },
    'gemini-pro-vision': { vision: true, text: true, thinking: false, structuredOutput: false, functionCalling: true },
    'gemini-pro': { vision: false, text: true, thinking: false, structuredOutput: false, functionCalling: true },

    // Groq Vision Models (3 models with vision)
    'meta-llama/llama-guard-4-12b': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'meta-llama/llama-4-maverick-17b-128e-instruct': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'meta-llama/llama-4-scout-17b-16e-instruct': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-guard-4-12b': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-4-maverick-17b': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-4-scout-17b': { vision: true, text: true, thinking: false, structuredOutput: true, functionCalling: true },

    // Groq Reasoning Models (GPT-OSS series)
    'openai/gpt-oss-20b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true },
    'openai/gpt-oss-120b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true },
    'openai/gpt-oss-safeguard-20b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true },
    'gpt-oss-20b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true },
    'gpt-oss-120b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true },

    // Groq Compound Systems (with built-in tools)
    'groq/compound': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true, builtInSearch: true, builtInCodeExec: true },
    'groq/compound-mini': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true, builtInSearch: true, builtInCodeExec: true },

    // Groq Qwen with Reasoning
    'qwen/qwen3-32b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true },

    // Groq Text-Only Models
    'llama-3.2-90b-vision': { vision: false, text: true, thinking: false, structuredOutput: false, functionCalling: true },
    'llama-3.2-11b-vision': { vision: false, text: true, thinking: false, structuredOutput: false, functionCalling: true },
    'llama-3.3-70b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-3.3-70b-versatile': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-3.1-70b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-3.1-70b-versatile': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-3.1-8b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama-3.1-8b-instant': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama3.1-70b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'llama3.1-8b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'mixtral-8x7b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'mixtral-8x7b-32768': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true },
    'gemma2-9b': { vision: false, text: true, thinking: false, structuredOutput: false, functionCalling: true },
    'gemma2-9b-it': { vision: false, text: true, thinking: false, structuredOutput: false, functionCalling: true },
    'gemma-7b': { vision: false, text: true, thinking: false, structuredOutput: false, functionCalling: true },

    // Cerebras Models - ULTRA FAST! (2000+ tokens/sec)
    'llama3.1-8b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true, speed: 2200, streaming: true, provider: 'cerebras' },
    'llama-3.1-8b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true, speed: 2200, streaming: true, provider: 'cerebras' },
    'llama-3.3-70b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true, parallelToolCalling: true, speed: 2100, streaming: true, provider: 'cerebras' },
    'llama3.3-70b': { vision: false, text: true, thinking: false, structuredOutput: true, functionCalling: true, parallelToolCalling: true, speed: 2100, streaming: true, provider: 'cerebras' },

    // Cerebras Reasoning Models - FASTEST REASONING!
    'qwen-3-32b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true, speed: 2600, streaming: true, provider: 'cerebras' },
    'qwen3-32b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true, speed: 2600, streaming: true, provider: 'cerebras' },
    'gpt-oss-120b': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true, reasoningEffort: true, provider: 'cerebras' },
    'zai-glm-4.6': { vision: false, text: true, thinking: true, reasoning: true, structuredOutput: true, functionCalling: true, disableReasoning: true, provider: 'cerebras' }
};

// Function to get model capabilities
function getModelCapabilities(modelId) {
    // Check exact match first
    if (MODEL_CAPABILITIES[modelId]) {
        return MODEL_CAPABILITIES[modelId];
    }

    // Check partial match for versioned models
    for (const [key, caps] of Object.entries(MODEL_CAPABILITIES)) {
        if (modelId.includes(key)) {
            return caps;
        }
    }

    // Default: text-only
    return { vision: false, text: true };
}

// Function to create model option HTML with capability icons (using emoji)
function createModelOptionHTML(modelId, modelName = null) {
    const capabilities = getModelCapabilities(modelId);
    const displayName = modelName || modelId;

    let prefix = '';
    let badges = [];

    // Core capabilities
    if (capabilities.vision && capabilities.text) {
        prefix = '👁️📝 '; // Vision + Text
    } else if (capabilities.text) {
        prefix = '📝 '; // Text only
    }

    // Advanced features badges
    if (capabilities.thinking || capabilities.reasoning) {
        badges.push('🧠'); // Thinking/Reasoning
    }
    if (capabilities.caching) {
        badges.push('💾'); // Caching
    }
    if (capabilities.grounding) {
        badges.push('🌐'); // Grounding
    }
    if (capabilities.builtInSearch) {
        badges.push('🔍'); // Built-in Search
    }

    const badgeStr = badges.length > 0 ? ` ${badges.join(' ')}` : '';

    return `<option value="${modelId}" 
        data-vision="${capabilities.vision || false}" 
        data-text="${capabilities.text || false}"
        data-thinking="${capabilities.thinking || false}"
        data-reasoning="${capabilities.reasoning || false}"
        data-caching="${capabilities.caching || false}"
        data-grounding="${capabilities.grounding || false}"
        data-structured="${capabilities.structuredOutput || false}"
        data-function="${capabilities.functionCalling || false}">${prefix}${displayName}${badgeStr}</option>`;
}

// Function to update capability display panel with actual PNG icons
function updateCapabilityDisplay(modelId) {
    const capabilityDisplay = document.getElementById('capabilityDisplay');
    const textCapability = document.getElementById('textCapability');
    const visionCapability = document.getElementById('visionCapability');

    if (!modelId || modelId === '') {
        capabilityDisplay.classList.remove('active');
        return;
    }

    const capabilities = getModelCapabilities(modelId);

    // Show the display panel
    capabilityDisplay.classList.add('active');

    // Update text capability
    if (capabilities.text) {
        textCapability.classList.remove('disabled');
    } else {
        textCapability.classList.add('disabled');
    }

    // Update vision capability
    if (capabilities.vision) {
        visionCapability.classList.remove('disabled');
    } else {
        visionCapability.classList.add('disabled');
    }

    // Display advanced capabilities in console for now (UI update later)
    if (capabilities.thinking || capabilities.reasoning) {
        console.log(`✨ Model ${modelId} supports Thinking/Reasoning!`);
    }
    if (capabilities.caching) {
        console.log(`💾 Model ${modelId} supports Context Caching!`);
    }
    if (capabilities.grounding) {
        console.log(`🌐 Model ${modelId} supports Grounding (Search/Maps)!`);
    }
    if (capabilities.structuredOutput) {
        console.log(`📋 Model ${modelId} supports Structured Outputs!`);
    }
}

// Function to fetch models from provider APIs
async function fetchModelsForProvider(provider, apiKey, baseURL) {
    const wrapper = document.querySelector('.model-select-wrapper');
    const modelSelect = document.getElementById('llmModel');
    const currentValue = modelSelect.value;

    // Show loading state
    wrapper.classList.add('loading');
    modelSelect.innerHTML = '<option value="">Loading models...</option>';
    modelSelect.disabled = true;

    try {
        let models = [];


        switch (provider) {
            case 'openai':
                models = await fetchOpenAIModels(apiKey, baseURL);
                break;
            case 'anthropic':
                models = getAnthropicModels();
                break;
            case 'google':
                models = await fetchGoogleModels(apiKey, baseURL);
                break;
            case 'groq':
                models = await fetchGroqModels(apiKey, baseURL);
                break;
            case 'cerebras':
                models = await fetchCerebrasModels(apiKey, baseURL);
                break;
            case 'openrouter':
                models = await fetchOpenRouterModels(apiKey);
                break;
            case 'openai-compatible':
                models = await fetchOpenAIModels(apiKey, baseURL);
                break;
            default:
                models = [];
        }

        // Populate dropdown
        modelSelect.innerHTML = '<option value="">Select a model...</option>';
        models.forEach(model => {
            modelSelect.innerHTML += createModelOptionHTML(model.id, model.name);
        });

        // Restore previous selection if it exists
        if (currentValue && models.find(m => m.id === currentValue)) {
            modelSelect.value = currentValue;
            updateCapabilityDisplay(currentValue);
        }

    } catch (error) {
        console.error('Error fetching models:', error);
        modelSelect.innerHTML = '<option value="">Error loading models. Enter manually below.</option>';

        // Add manual input option
        setTimeout(() => {
            modelSelect.innerHTML = '<option value="">Enter model name manually</option>';
        }, 2000);
    } finally {
        wrapper.classList.remove('loading');
        modelSelect.disabled = false;
    }
}

// Fetch OpenAI models
async function fetchOpenAIModels(apiKey, baseURL) {
    if (!apiKey) return [];

    const response = await fetch(`${baseURL}/models`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch OpenAI models');

    const data = await response.json();
    return data.data
        .filter(m => m.id.includes('gpt') || m.id.includes('o1'))
        .map(m => ({ id: m.id, name: m.id }))
        .sort((a, b) => a.id.localeCompare(b.id));
}

// Get Anthropic models (static list as they don't have a models endpoint)
function getAnthropicModels() {
    return [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)' },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Latest)' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
    ];
}

// Fetch Google models
async function fetchGoogleModels(apiKey, baseURL) {
    if (!apiKey) return getDefaultGoogleModels();

    try {
        const response = await fetch(`${baseURL}/models?key=${apiKey}`);

        if (!response.ok) return getDefaultGoogleModels();

        const data = await response.json();
        return data.models
            .filter(m => m.name.includes('gemini'))
            .map(m => ({
                id: m.name.replace('models/', ''),
                name: m.displayName || m.name.replace('models/', '')
            }))
            .sort((a, b) => b.id.localeCompare(a.id));
    } catch {
        return getDefaultGoogleModels();
    }
}

function getDefaultGoogleModels() {
    return [
        // Gemini 2.5 Series - Latest and Most Capable!
        { id: 'gemini-2.5-pro', name: '✨ Gemini 2.5 Pro (Latest - Most Advanced)' },
        { id: 'gemini-2.5-flash', name: '⚡ Gemini 2.5 Flash (Best Price/Performance)' },
        { id: 'gemini-2.5-flash-lite', name: '🚀 Gemini 2.5 Flash-Lite (Ultra Fast)' },
        { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash Preview' },
        { id: 'gemini-2.5-flash-lite-preview-09-2025', name: 'Gemini 2.5 Flash-Lite Preview' },
        { id: 'gemini-2.5-flash-image', name: '🎨 Gemini 2.5 Flash Image (Image Generation)' },

        // Gemini 2.0 Series
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' },
        { id: 'gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (Stable)' },

        // Gemini 1.5 Series (Legacy)
        { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)' },
        { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)' },
        { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B' }
    ];
}

// Fetch Groq models
async function fetchGroqModels(apiKey, baseURL) {
    if (!apiKey) return getDefaultGroqModels();

    try {
        const response = await fetch(`${baseURL}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) return getDefaultGroqModels();

        const data = await response.json();
        return data.data
            .map(m => ({ id: m.id, name: m.id }))
            .sort((a, b) => a.id.localeCompare(b.id));
    } catch {
        return getDefaultGroqModels();
    }
}

function getDefaultGroqModels() {
    return [
        // Reasoning Models (GPT-OSS Series) - Advanced Reasoning Capabilities
        { id: 'openai/gpt-oss-120b', name: '🧠 GPT-OSS 120B (Reasoning - Most Capable)' },
        { id: 'openai/gpt-oss-20b', name: '🧠 GPT-OSS 20B (Reasoning - Fast)' },
        { id: 'qwen/qwen3-32b', name: '🧠 Qwen 3 32B (Reasoning)' },

        // Compound Systems - Built-in Search & Code Execution
        { id: 'groq/compound', name: '🔍 Groq Compound (Search + Code Exec)' },
        { id: 'groq/compound-mini', name: '🔍 Groq Compound Mini (Search + Code Exec)' },

        // Vision Models
        { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: '👁️ Llama 4 Scout 17B (Vision)' },
        { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', name: '👁️ Llama 4 Maverick 17B (Vision)' },
        { id: 'meta-llama/llama-guard-4-12b', name: '👁️ Llama Guard 4 12B (Vision + Safety)' },

        // Text-Only Models
        { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
        { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B Versatile' },
        { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
        { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
        { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
    ];
}

// Cerebras models - ULTRA FAST INFERENCE!
function getDefaultCerebrasModels() {
    return [
        // Reasoning Models - FASTEST REASONING in the world!
        { id: 'qwen-3-32b', name: '🧠 ⚡ Qwen 3 32B (2600 T/s - Reasoning)' },
        { id: 'gpt-oss-120b', name: '🧠 GPT-OSS 120B (Reasoning + effort control)' },
        { id: 'zai-glm-4.6', name: '🧠 Z.ai GLM 4.6 (Reasoning)' },

        // Ultra-Fast Text Models
        { id: 'llama-3.3-70b', name: '⚡ Llama 3.3 70B (2100 T/s - Parallel Tools)' },
        { id: 'llama3.1-8b', name: '⚡ Llama 3.1 8B (2200 T/s - FASTEST!)' }
    ];
}

// Fetch Cerebras models
async function fetchCerebrasModels(apiKey, baseURL) {
    if (!apiKey) return getDefaultCerebrasModels();

    try {
        const response = await fetch(`${baseURL}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) return getDefaultCerebrasModels();

        const data = await response.json();
        return data.data
            .map(m => ({ id: m.id, name: m.id }))
            .sort((a, b) => a.id.localeCompare(b.id));
    } catch {
        return getDefaultCerebrasModels();
    }
}

function getDefaultCerebrasModels() {
    return [
        { id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
        { id: 'llama3.1-70b', name: 'Llama 3.1 70B' },
        { id: 'llama3.1-8b', name: 'Llama 3.1 8B' }
    ];
}

// Fetch OpenRouter models
async function fetchOpenRouterModels(apiKey) {
    if (!apiKey) return getDefaultOpenRouterModels();

    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) return getDefaultOpenRouterModels();

        const data = await response.json();
        return data.data
            .map(m => ({ id: m.id, name: m.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 50); // Limit to top 50
    } catch {
        return getDefaultOpenRouterModels();
    }
}

function getDefaultOpenRouterModels() {
    return [
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
        { id: 'openai/gpt-4o', name: 'GPT-4o' },
        { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' }
    ];
}

// Load saved config
document.addEventListener('DOMContentLoaded', async () => {
    const config = await chrome.storage.sync.get([
        'tuyaRegion',
        'tuyaAccessId',
        'tuyaAccessSecret',
        'tuyaDeviceId',
        'llmConfig',
        'providerCredentials',
        'deviceIdByProvider'
    ]);

    // Load Tuya basic settings
    if (config.tuyaRegion) document.getElementById('tuyaRegion').value = config.tuyaRegion;
    if (config.tuyaAccessId) document.getElementById('tuyaAccessId').value = config.tuyaAccessId;
    if (config.tuyaAccessSecret) document.getElementById('tuyaAccessSecret').value = config.tuyaAccessSecret;

    // Initialize provider credentials storage
    let providerCredentials = config.providerCredentials || {};
    let deviceIdByProvider = config.deviceIdByProvider || {};

    // Load current provider's settings
    if (config.llmConfig) {
        const currentProvider = config.llmConfig.llm;
        if (currentProvider) {
            document.getElementById('llmProvider').value = currentProvider;

            // Load saved credentials for this provider
            if (providerCredentials[currentProvider]) {
                const providerConfig = providerCredentials[currentProvider];
                if (providerConfig.baseURL) document.getElementById('llmBaseUrl').value = providerConfig.baseURL;
                if (providerConfig.apiKey) document.getElementById('llmApiKey').value = providerConfig.apiKey;

                // Fetch models for this provider
                await fetchModelsForProvider(currentProvider, providerConfig.apiKey, providerConfig.baseURL);

                // Set saved model after fetching
                if (providerConfig.modelName) {
                    document.getElementById('llmModel').value = providerConfig.modelName;
                    updateCapabilityDisplay(providerConfig.modelName);
                }
            } else {
                // Fallback to old config
                if (config.llmConfig.options?.baseURL) document.getElementById('llmBaseUrl').value = config.llmConfig.options.baseURL;
                if (config.llmConfig.apiKey) document.getElementById('llmApiKey').value = config.llmConfig.apiKey;

                await fetchModelsForProvider(currentProvider, config.llmConfig.apiKey, config.llmConfig.options?.baseURL);

                if (config.llmConfig.modelName) {
                    document.getElementById('llmModel').value = config.llmConfig.modelName;
                    updateCapabilityDisplay(config.llmConfig.modelName);
                }
            }

            // Load device ID for this provider
            if (deviceIdByProvider[currentProvider]) {
                document.getElementById('tuyaDeviceId').value = deviceIdByProvider[currentProvider];
            } else if (config.tuyaDeviceId) {
                document.getElementById('tuyaDeviceId').value = config.tuyaDeviceId;
            }
        }
    }

    // Provider change handler
    document.getElementById('llmProvider').addEventListener('change', async (e) => {
        const newProvider = e.target.value;

        // Save current provider's data before switching
        const currentProvider = document.getElementById('llmProvider').dataset.currentProvider || newProvider;
        await saveCurrentProviderData(currentProvider);

        // Set default base URLs
        const baseURLMap = {
            openai: "https://api.openai.com/v1",
            anthropic: "https://api.anthropic.com/v1",
            google: "https://generativelanguage.googleapis.com/v1beta",
            groq: "https://api.groq.com/openai/v1",
            cerebras: "https://api.cerebras.ai/v1",
            openrouter: "https://openrouter.ai/api/v1",
            "openai-compatible": ""
        };

        // Load saved credentials for the new provider
        const storageData = await chrome.storage.sync.get(['providerCredentials', 'deviceIdByProvider']);
        const savedProviderCreds = storageData.providerCredentials || {};
        const savedDeviceIds = storageData.deviceIdByProvider || {};

        let apiKey = '';
        let baseURL = baseURLMap[newProvider] || "";

        if (savedProviderCreds[newProvider]) {
            // Load saved values
            baseURL = savedProviderCreds[newProvider].baseURL || baseURL;
            apiKey = savedProviderCreds[newProvider].apiKey || "";

            document.getElementById('llmBaseUrl').value = baseURL;
            document.getElementById('llmApiKey').value = apiKey;
        } else {
            // Set defaults for new provider
            document.getElementById('llmBaseUrl').value = baseURL;
            document.getElementById('llmApiKey').value = "";
        }

        // Fetch models for new provider
        await fetchModelsForProvider(newProvider, apiKey, baseURL);

        // Restore saved model if exists
        if (savedProviderCreds[newProvider]?.modelName) {
            document.getElementById('llmModel').value = savedProviderCreds[newProvider].modelName;
            updateCapabilityDisplay(savedProviderCreds[newProvider].modelName);
        } else {
            updateCapabilityDisplay(''); // Hide capability display if no model
        }

        // Load device ID for this provider
        if (savedDeviceIds[newProvider]) {
            document.getElementById('tuyaDeviceId').value = savedDeviceIds[newProvider];
        } else {
            document.getElementById('tuyaDeviceId').value = "";
        }

        // Update current provider tracker
        document.getElementById('llmProvider').dataset.currentProvider = newProvider;
    });

    // API Key change handler - refetch models when API key is updated
    let apiKeyTimeout;
    document.getElementById('llmApiKey').addEventListener('input', (e) => {
        clearTimeout(apiKeyTimeout);
        apiKeyTimeout = setTimeout(async () => {
            const provider = document.getElementById('llmProvider').value;
            const apiKey = e.target.value;
            const baseURL = document.getElementById('llmBaseUrl').value;

            if (apiKey && provider) {
                await fetchModelsForProvider(provider, apiKey, baseURL);
            }
        }, 1000); // Debounce for 1 second
    });

    // Model selection change handler - update capability display
    document.getElementById('llmModel').addEventListener('change', (e) => {
        updateCapabilityDisplay(e.target.value);
    });

    // Store initial provider
    if (config.llmConfig?.llm) {
        document.getElementById('llmProvider').dataset.currentProvider = config.llmConfig.llm;
    }
});

// Helper function to save current provider's data
async function saveCurrentProviderData(provider) {
    const storageData = await chrome.storage.sync.get(['providerCredentials', 'deviceIdByProvider']);
    const providerCredentials = storageData.providerCredentials || {};
    const deviceIdByProvider = storageData.deviceIdByProvider || {};

    // Save current values
    providerCredentials[provider] = {
        baseURL: document.getElementById('llmBaseUrl').value,
        modelName: document.getElementById('llmModel').value,
        apiKey: document.getElementById('llmApiKey').value
    };

    deviceIdByProvider[provider] = document.getElementById('tuyaDeviceId').value;

    await chrome.storage.sync.set({
        providerCredentials,
        deviceIdByProvider
    });
}

// Save config
document.getElementById('save').addEventListener('click', async () => {
    const status = document.getElementById('status');
    try {
        const currentProvider = document.getElementById('llmProvider').value;

        // Get existing storage
        const storageData = await chrome.storage.sync.get(['providerCredentials', 'deviceIdByProvider']);
        const providerCredentials = storageData.providerCredentials || {};
        const deviceIdByProvider = storageData.deviceIdByProvider || {};

        // Save credentials for current provider
        providerCredentials[currentProvider] = {
            baseURL: document.getElementById('llmBaseUrl').value,
            modelName: document.getElementById('llmModel').value,
            apiKey: document.getElementById('llmApiKey').value
        };

        // Save device ID for current provider
        deviceIdByProvider[currentProvider] = document.getElementById('tuyaDeviceId').value;

        // Save everything
        await chrome.storage.sync.set({
            tuyaRegion: document.getElementById('tuyaRegion').value,
            tuyaAccessId: document.getElementById('tuyaAccessId').value,
            tuyaAccessSecret: document.getElementById('tuyaAccessSecret').value,
            tuyaDeviceId: document.getElementById('tuyaDeviceId').value,
            providerCredentials,
            deviceIdByProvider,
            llmConfig: {
                llm: currentProvider,
                modelName: providerCredentials[currentProvider].modelName,
                apiKey: providerCredentials[currentProvider].apiKey,
                options: {
                    baseURL: providerCredentials[currentProvider].baseURL
                }
            }
        });

        status.textContent = `✓ Configuration saved for ${currentProvider}! Reloading extension...`;
        status.className = 'status success';

        setTimeout(() => {
            window.close(); // Close options page first to prevent context invalidation
            chrome.runtime.reload(); // Then reload extension
        }, 1000);
    } catch (error) {
        status.textContent = '✗ Error: ' + error.message;
        status.className = 'status error';
    }
});

// =====================================================
// ADVANCED CONFIGURATION SYSTEM
// =====================================================

// Get default advanced config for a provider
function getDefaultAdvancedConfig(provider) {
    const baseConfig = {
        thinking: {
            enabled: false,
            budget: -1, // Dynamic for Gemini
            includeThoughts: true,
            reasoningFormat: 'parsed', // GROQ
            reasoningEffort: 'medium' // GROQ
        },
        structuredOutput: {
            enabled: false,
            mode: 'json_object',
            schema: null
        },
        caching: {
            enabled: true, // Auto-enable for cost savings
            implicitCaching: true,
            explicitCaching: false,
            ttl: 3600,
            minTokens: 1024
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
            maxImages: 5,
            maxFileSize: 20971520
        },
        functionCalling: {
            mode: 'auto',
            parallelCalls: true,
            maxParallelCalls: 5
        }
    };

    // Provider-specific defaults
    if (provider === 'google') {
        baseConfig.thinking.enabled = true; // Auto-enable for 2.5 models
        baseConfig.caching.enabled = true; // Auto implicit caching
    } else if (provider === 'groq') {
        baseConfig.thinking.enabled = false; // User opt-in for reasoning models
    }

    return baseConfig;
}

// Load advanced config for current provider
async function loadAdvancedConfig(provider) {
    const data = await chrome.storage.sync.get(['advancedLLMConfig']);
    const advancedConfig = data.advancedLLMConfig || {};

    if (!advancedConfig[provider]) {
        advancedConfig[provider] = getDefaultAdvancedConfig(provider);
    }

    return advancedConfig[provider];
}

// Save advanced config for current provider
async function saveAdvancedConfig(provider, config) {
    const data = await chrome.storage.sync.get(['advancedLLMConfig']);
    const advancedConfig = data.advancedLLMConfig || {};

    advancedConfig[provider] = config;

    await chrome.storage.sync.set({ advancedLLMConfig: advancedConfig });
}

// Get model-specific recommendations
function getModelRecommendations(modelId, capabilities) {
    const recommendations = [];

    if (capabilities.thinking) {
        recommendations.push({
            feature: 'thinking',
            title: '🧠 Thinking Available',
            description: 'This model supports advanced reasoning. Enable thinking for complex tasks.',
            suggested: true
        });
    }

    if (capabilities.caching) {
        recommendations.push({
            feature: 'caching',
            title: '💾 Caching Available',
            description: 'Save 50-90% on costs with context caching for repeated content.',
            suggested: true
        });
    }

    if (capabilities.grounding) {
        recommendations.push({
            feature: 'grounding',
            title: '🌐 Grounding Available',
            description: 'Access real-time information via Google Search and Maps.',
            suggested: false
        });
    }

    if (capabilities.reasoning) {
        recommendations.push({
            feature: 'reasoning',
            title: '🧠 Explicit Reasoning',
            description: 'See step-by-step reasoning process. Great for debugging complex logic.',
            suggested: true
        });
    }

    if (capabilities.structuredOutput) {
        recommendations.push({
            feature: 'structured',
            title: '📋 Structured Outputs',
            description: 'Guarantee JSON Schema compliance. Perfect for automation.',
            suggested: false
        });
    }

    return recommendations;
}

console.log('✨ EKO Extension - Advanced Configuration System Loaded');
console.log('📊 Feature Coverage: Thinking, Caching, Grounding, Structured Outputs');
console.log('🎯 Ready for Phase 3 API Integration!');
