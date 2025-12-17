// Tuya Settings Page Logic
(function () {
    console.log('🏠 Tuya Settings Page Loaded');

    const form = document.getElementById('tuyaForm');
    const statusDiv = document.getElementById('status');
    const enabledToggle = document.getElementById('enabled');
    const clientIdInput = document.getElementById('clientId');
    const clientSecretInput = document.getElementById('clientSecret');
    const baseUrlSelect = document.getElementById('baseUrl');

    // Load saved settings
    function loadSettings() {
        chrome.storage.local.get(['tuya_config'], (result) => {
            if (result.tuya_config) {
                const config = result.tuya_config;
                enabledToggle.checked = config.enabled || false;
                clientIdInput.value = config.clientId || '';
                clientSecretInput.value = config.clientSecret || '';
                baseUrlSelect.value = config.baseUrl || 'https://openapi.tuyaus.com';
            }
        });
    }

    // Save settings
    function saveSettings(event) {
        event.preventDefault();

        const config = {
            enabled: enabledToggle.checked,
            clientId: clientIdInput.value.trim(),
            clientSecret: clientSecretInput.value.trim(),
            baseUrl: baseUrlSelect.value,
            devices: {} // Preserve or initialize devices
        };

        chrome.storage.local.set({ tuya_config: config }, () => {
            showStatus('✅ Settings saved successfully!', 'success');
            console.log('🏠 Tuya config saved:', config);
        });
    }

    // Show status message
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;

        setTimeout(() => {
            statusDiv.className = 'status';
        }, 3000);
    }

    // Event listeners
    form.addEventListener('submit', saveSettings);

    enabledToggle.addEventListener('change', () => {
        // Auto-save on toggle
        const formEvent = new Event('submit');
        form.dispatchEvent(formEvent);
    });

    // Load settings on page load
    loadSettings();
})();
