# 🔧 Extension Development Guide

Technical documentation for Rankify Assist Chrome extension.

---

## 📂 File Structure

```
extension-ready/
├── manifest.json           # Extension manifest (MV3)
├── options.html           # Configuration UI
├── options.js             # Settings management
└── js/
    ├── background.js      # Eko agent (precompiled)
    └── tuya_integration.js # DP polling & execution
```

---

## 🎯 Core Components

### 1. Tuya Integration (`tuya_integration.js`)

**Purpose**: Polls Tuya Cloud for execution commands, executes via Eko

**Key Functions**:

```javascript
// Initialize Tuya API client
async function initTuya()

// Start polling DP 104 every 2 seconds  
async function startPolling(config)

// Execute browser task via Eko
async function executeBrowserTask(command)

// Report result to DP 105
async function reportResult(deviceId, result)
```

**Flow**:
```
Poll DP 104 → Parse JSON → Check intent="browser" → Execute → Report to DP 105
```

### 2. Configuration UI (`options.html` + `options.js`)

**Stored in Chrome Storage** (`chrome.storage.sync`):

```javascript
{
  tuyaRegion: "IN",
  tuyaAccessId: "xxx",
  tuyaAccessSecret: "yyy",
  tuyaDeviceId: "zzz",
  llmConfig: {
    provider: "openai",
    model: "gpt-4o",
    apiKey: "sk-...",
    options: {
      baseURL: "https://api.openai.com/v1"
    }
  }
}
```

### 3. Background Service (`background.js`)

**Eko agent** - Precompiled browser automation engine

**Capabilities**:
- Navigate to URLs
- Click elements
- Fill forms
- Extract data
- Execute JS on pages

---

## 🔌 Tuya API Integration

### Authentication

**Request Signing** (HMAC-SHA256):

```javascript
const sign = crypto.createHmac('sha256', secret)
  .update(stringToSign)
  .digest('hex')
  .toUpperCase();
```

**Headers**:
```
client_id: {access_id}
sign: {signature}
t: {timestamp}
sign_method: HMAC-SHA256
```

### Get Device DP Status

**Endpoint**: `/v1.0/devices/{device_id}/status`

**Method**: GET

**Response**:
```json
{
  "result": [
    {"code": "104", "value": "{\"intent\":\"browser\",\"command\":\"...\"}"}
  ]
}
```

### Update Device DP

**Endpoint**: `/v1.0/devices/{device_id}/commands`

**Method**: POST

**Body**:
```json
{
  "commands": [
    {"code": "105", "value": "Execution result..."}
  ]
}
```

---

## 🧪 Testing

### Local Development

1. **Make changes** to `tuya_integration.js` or `options.js`
2. **Reload extension**: `chrome://extensions/` → Click reload
3. **Check console**: Dev Tools → Console tab
4. **Test manually**: Update DP 104 in Tuya Console

### Debug Mode

Enable in `tuya_integration.js`:

```javascript
const DEBUG = true; // Set to false for production
```

Logs all polling activity to console.

### Manual DP Testing

**In Tuya Console**:
1. Products → Rankify Assist → Debug
2. Find DP 104
3. Send test JSON:
   ```json
   {"intent":"browser","command":"open gmail.com"}
   ```
4. Watch extension execute!

---

## 🔐 Security Best Practices

### API Keys

- ❌ **Never hardcode** API keys
- ✅ **Store in** `chrome.storage.sync`
- ✅ **Encrypt sensitive data** if possible

### Request Signing

- ✅ Always sign Tuya API requests
- ✅ Use timestamp to prevent replay attacks
- ✅ Validate responses

### CSP Compliance

Manifest V3 enforces strict CSP:
- ❌ No inline scripts in HTML
- ✅ All JS in separate `.js` files
- ✅ Use `chrome.runtime` for messaging

---

## 🚀 Building & Deployment

### No Build Step Required!

Extension is **plain JavaScript** - edit and reload!

### Packaging for Chrome Web Store

```bash
cd extension-ready
zip -r rankify-assist.zip * -x "*.git*" -x "*node_modules*"
```

Upload `rankify-assist.zip` to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────┐
│       Chrome Extension              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Background Service          │ │
│  │   (background.js - Eko)       │ │
│  └───────────────────────────────┘ │
│            ▲         ▲              │
│            │         │              │
│  ┌─────────┴──┐ ┌───┴─────────┐   │
│  │ Tuya      │  │  Options     │   │
│  │ Integration│  │  UI          │   │
│  └────────────┘  └──────────────┘   │
└──────────┬──────────────────────────┘
           │
           ▼
    Tuya Cloud API
    (DP Polling & Updates)
```

---

## 🐛 Common Issues

### Extension not loading

- Check `manifest.json` syntax
- Verify all file paths are correct
- Check Console for errors

### Polling not working

- Verify Tuya credentials
- Check Device ID is correct
- Ensure device is online

### Eko not executing

- Check LLM API key
- Verify Eko is initialized (check console)
- Test with simple commands first

---

**Questions?** Open an [issue](https://github.com/namandhakad712/rankify-assist/issues)!
