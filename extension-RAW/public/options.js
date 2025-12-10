// Load saved configuration
document.addEventListener('DOMContentLoaded', async () => {
  const config = await chrome.storage.sync.get([
    'tuyaRegion',
    'tuyaAccessId',
    'tuyaAccessSecret',
    'tuyaDeviceId',
    'llmConfig'
  ]);

  if (config.tuyaRegion) document.getElementById('tuyaRegion').value = config.tuyaRegion;
  if (config.tuyaAccessId) document.getElementById('tuyaAccessId').value = config.tuyaAccessId;
  if (config.tuyaAccessSecret) document.getElementById('tuyaAccessSecret').value = config.tuyaAccessSecret;
  if (config.tuyaDeviceId) document.getElementById('tuyaDeviceId').value = config.tuyaDeviceId;

  if (config.llmConfig) {
    if (config.llmConfig.llm) document.getElementById('llm').value = config.llmConfig.llm;
    if (config.llmConfig.modelName) document.getElementById('modelName').value = config.llmConfig.modelName;
    if (config.llmConfig.apiKey) document.getElementById('apiKey').value = config.llmConfig.apiKey;
  }
});

// Save configuration
document.getElementById('save').addEventListener('click', async () => {
  const status = document.getElementById('status');

  try {
    const config = {
      tuyaRegion: document.getElementById('tuyaRegion').value,
      tuyaAccessId: document.getElementById('tuyaAccessId').value,
      tuyaAccessSecret: document.getElementById('tuyaAccessSecret').value,
      tuyaDeviceId: document.getElementById('tuyaDeviceId').value,
      llmConfig: {
        llm: document.getElementById('llm').value,
        modelName: document.getElementById('modelName').value,
        apiKey: document.getElementById('apiKey').value
      }
    };

    await chrome.storage.sync.set(config);

    status.textContent = '✓ Configuration saved successfully!';
    status.className = 'status success';

    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);

  } catch (error) {
    status.textContent = '✗ Error saving configuration: ' + error.message;
    status.className = 'status error';
  }
});
