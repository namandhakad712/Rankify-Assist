// LLM Optimizer Settings Page Logic
(function () {
    console.log('🚀 LLM Optimizer Settings Loaded');

    const form = {
        promptCaching: document.getElementById('promptCaching'),
        cerebrasEnabled: document.getElementById('cerebrasEnabled'),
        cerebrasPlannerEffort: document.getElementById('cerebrasPlannerEffort'),
        cerebrasNavigatorEffort: document.getElementById('cerebrasNavigatorEffort'),
        geminiEnabled: document.getElementById('geminiEnabled'),
        geminiPlannerBudget: document.getElementById('geminiPlannerBudget'),
        geminiNavigatorBudget: document.getElementById('geminiNavigatorBudget'),
        structuredOutputs: document.getElementById('structuredOutputs'),
        visionEnabled: document.getElementById('visionEnabled'),
        navigatorDetail: document.getElementById('navigatorDetail'),
        plannerDetail: document.getElementById('plannerDetail')
    };

    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');

    // Load settings
    function loadSettings() {
        chrome.storage.local.get(['llm_optimizer_config'], (result) => {
            if (result.llm_optimizer_config) {
                const config = result.llm_optimizer_config;

                // Prompt caching
                if (config.promptCaching) {
                    form.promptCaching.checked = config.promptCaching.enabled;
                }

                // Cerebras
                if (config.cerebrasReasoning) {
                    form.cerebrasEnabled.checked = config.cerebrasReasoning.enabled;
                    form.cerebrasPlannerEffort.value = config.cerebrasReasoning.planner;
                    form.cerebrasNavigatorEffort.value = config.cerebrasReasoning.navigator;
                }

                // Gemini
                if (config.geminiThinking) {
                    form.geminiEnabled.checked = config.geminiThinking.enabled;
                    form.geminiPlannerBudget.value = config.geminiThinking.planner;
                    form.geminiNavigatorBudget.value = config.geminiThinking.navigator;
                }

                // Structured outputs
                if (config.structuredOutputs) {
                    form.structuredOutputs.checked = config.structuredOutputs.enabled;
                }

                // Vision
                if (config.vision) {
                    form.visionEnabled.checked = config.vision.enabled;
                    form.navigatorDetail.value = config.vision.navigatorDetail;
                    form.plannerDetail.value = config.vision.plannerDetail;
                }
            }
        });
    }

    // Save settings
    function saveSettings() {
        const config = {
            enabled: true,

            promptCaching: {
                enabled: form.promptCaching.checked,
                staticFirst: true
            },

            cerebrasReasoning: {
                enabled: form.cerebrasEnabled.checked,
                planner: form.cerebrasPlannerEffort.value,
                navigator: form.cerebrasNavigatorEffort.value
            },

            geminiThinking: {
                enabled: form.geminiEnabled.checked,
                planner: parseInt(form.geminiPlannerBudget.value),
                navigator: parseInt(form.geminiNavigatorBudget.value)
            },

            structuredOutputs: {
                enabled: form.structuredOutputs.checked,
                enforceSchema: true
            },

            vision: {
                enabled: form.visionEnabled.checked,
                navigatorDetail: form.navigatorDetail.value,
                plannerDetail: form.plannerDetail.value
            }
        };

        chrome.storage.local.set({ llm_optimizer_config: config }, () => {
            showStatus('✅ Settings saved! Reload extension for changes to take effect.');
            console.log('🚀 Saved config:', config);
        });
    }

    // Show status
    function showStatus(message) {
        statusDiv.textContent = message;
        statusDiv.className = 'status success';

        setTimeout(() => {
            statusDiv.className = 'status';
        }, 5000);
    }

    // Event listeners
    saveBtn.addEventListener('click', saveSettings);

    // Load on page load
    loadSettings();
})();
