// Tuya Integration - Background Script Extension
// This file adds Tuya-specific functionality to Nanobrowser's background service worker

console.log('🏠 [TUYA] Background extension loaded');

// Listen for keyboard shortcut to open Tuya settings
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_tuya_settings') {
        openTuyaSettings();
    }
});

// Listen for context menu or other triggers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'OPEN_TUYA_SETTINGS') {
        openTuyaSettings();
        sendResponse({ success: true });
    }
});

function openTuyaSettings() {
    const settingsUrl = chrome.runtime.getURL('extensions/tuya-integration/tuya-settings.html');
    chrome.tabs.create({ url: settingsUrl });
}

// Add context menu item (right-click on extension icon)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'tuya-settings',
        title: '🏠 Tuya Smart Home Settings',
        contexts: ['action']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'tuya-settings') {
        openTuyaSettings();
    }
});
