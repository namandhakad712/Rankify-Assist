// Load saved config
document.addEventListener('DOMContentLoaded', async () => {
    const config = await chrome.storage.sync.get([
        'tuyaRegion', 'tuyaAccessId', 'tuyaAccessSecret', 'tuyaDeviceId', 'llmConfig'
    ]);

    if (config.tuyaRegion) document.getElementById('tuyaRegion').value = config.tuyaRegion;
    if (config.tuyaAccessId) document.getElementById('tuyaAccessId').value = config.tuyaAccessId;
    if (config.tuyaAccessSecret) document.getElementById('tuyaAccessSecret').value = config.tuyaAccessSecret;
    if (config.tuyaDeviceId) document.getElementById('tuyaDeviceId').value = config.tuyaDeviceId;

    if (config.llmConfig) {
        if (config.llmConfig.llm) document.getElementById('llmProvider').value = config.llmConfig.llm;
        if (config.llmConfig.options?.baseURL) document.getElementById('llmBaseUrl').value = config.llmConfig.options.baseURL;
        if (config.llmConfig.modelName) document.getElementById('llmModel').value = config.llmConfig.modelName;
        if (config.llmConfig.apiKey) document.getElementById('llmApiKey').value = config.llmConfig.apiKey;
    }

    // Auto-fill baseURL when provider changes
    document.getElementById('llmProvider').addEventListener('change', (e) => {
        const baseURLMap = {
            openai: "https://api.openai.com/v1",
            anthropic: "https://api.anthropic.com/v1",
            google: "https://generativelanguage.googleapis.com/v1beta",
            cerebras: "https://api.cerebras.ai/v1",
            openrouter: "https://openrouter.ai/api/v1",
            "openai-compatible": ""
        };
        const baseUrl = baseURLMap[e.target.value] || "";
        if (baseUrl) document.getElementById('llmBaseUrl').value = baseUrl;
    });
});

// Save config
document.getElementById('save').addEventListener('click', async () => {
    const status = document.getElementById('status');
    try {
        await chrome.storage.sync.set({
            tuyaRegion: document.getElementById('tuyaRegion').value,
            tuyaAccessId: document.getElementById('tuyaAccessId').value,
            tuyaAccessSecret: document.getElementById('tuyaAccessSecret').value,
            tuyaDeviceId: document.getElementById('tuyaDeviceId').value,
            llmConfig: {
                llm: document.getElementById('llmProvider').value,
                modelName: document.getElementById('llmModel').value,
                apiKey: document.getElementById('llmApiKey').value,
                options: {
                    baseURL: document.getElementById('llmBaseUrl').value
                }
            }
        });
        status.textContent = '✓ Configuration saved! Extension will restart.';
        status.className = 'status success';
        setTimeout(() => chrome.runtime.reload(), 1500);
    } catch (error) {
        status.textContent = '✗ Error: ' + error.message;
        status.className = 'status error';
    }
});
