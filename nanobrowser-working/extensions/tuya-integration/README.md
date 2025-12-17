# 🏠 Tuya Smart Home Integration

This extension enables Nanobrowser AI agents to control your Tuya smart home devices.

## 🔧 Setup

### 1. Get Tuya API Credentials

1. Go to [Tuya IoT Platform](https://iot.tuya.com/)
2. Create a project (or use existing)
3. Get your `Client ID` and `Client Secret`
4. Link your devices to this project

### 2. Configure Extension

1. Open Nanobrowser sidebar
2. Go to Settings
3. Add a new section for "Tuya Integration" (or configure via Chrome storage):

```javascript
// Open Chrome DevTools Console and run:
chrome.storage.local.set({
    tuya_config: {
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        baseUrl: 'https://openapi.tuyaus.com',  // or your region
        devices: {
            'device_id_1': { name: 'Living Room Light', type: 'light' },
            'device_id_2': { name: 'Bedroom Fan', type: 'switch' }
        }
    }
});
```

### 3. Test Integration

Ask the Nanobrowser agent:

```
"Turn on the living room light"
"Set bedroom fan to 75% speed"
"Check status of all devices"
```

## 🔌 Available Commands

The AI agent can use these Tuya commands:

- **Control Device:** Turn on/off, adjust brightness, etc.
- **Get Status:** Check if device is online and current state
- **List Devices:** See all available devices

## 🛠️ For Developers

### Extending Functionality

1. Edit `tuya-controller.js`
2. Add your custom device control logic
3. Update the API calls to match your Tuya setup

### Message Format

```javascript
// Control a device
chrome.runtime.sendMessage({
    action: 'TUYA_CONTROL',
    deviceId: 'abc123',
    command: 'turn_on',
    params: { brightness: 80 }
});

// Get device status
chrome.runtime.sendMessage({
    action: 'TUYA_STATUS',
    deviceId: 'abc123'
});

// List all devices
chrome.runtime.sendMessage({
    action: 'TUYA_LIST'
});
```

## 🔒 Security Notes

- **API keys are stored locally** in Chrome storage (not synced)
- **No data leaves your browser** except official Tuya CloudAPI calls
- **Review the code** in `tuya-controller.js` for transparency

## 📝 TODO

- [ ] Add Tuya API authentication flow
- [ ] Implement device discovery
- [ ] Add scene/automation support
- [ ] Create UI panel for device management
- [ ] Add error recovery and retry logic

---

**Version:** 1.0.0  
**Compatible with:** Nanobrowser (all versions)  
**Update-proof:** ✅ Yes - survives Nanobrowser updates
