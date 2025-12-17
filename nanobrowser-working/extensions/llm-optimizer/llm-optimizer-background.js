// LLM Optimizer - Background Script Extension
console.log('🚀 [LLM-OPTIMIZER] Background extension loaded');

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_llm_optimizer') {
        openOptimizerSettings();
    }
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'OPEN_LLM_OPTIMIZER') {
        openOptimizerSettings();
        sendResponse({ success: true });
    }
});

function openOptimizerSettings() {
    const settingsUrl = chrome.runtime.getURL('extensions/llm-optimizer/llm-optimizer-settings.html');
    chrome.tabs.create({ url: settingsUrl });
}

// Add context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'llm-optimizer-settings',
        title: '🚀 LLM Optimizer Settings',
        contexts: ['action']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'llm-optimizer-settings') {
        openOptimizerSettings();
    }
});
