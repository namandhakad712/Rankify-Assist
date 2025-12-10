# 🚀 Complete Setup Guide

This guide will walk you through setting up Rankify Assist from scratch.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Tuya Platform Setup](#tuya-platform-setup)
3. [Chrome Extension Setup](#chrome-extension-setup)
4. [Hardware Setup (Optional)](#hardware-setup-optional)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- ✅ **Chrome Browser** (v88 or later)
- ✅ **Tuya Developer Account** - [Create here](https://auth.tuya.com)
- ✅ **LLM API Key** - From OpenAI, Anthropic, Cerebras, or other

### Optional (for full voice workflow)

- 🔲 **Tuya T5-E1 AI Core Board**
- 🔲 **Microphone & Speaker** (built into T5-E1)

---

## Tuya Platform Setup

### Step 1: Create Cloud Project

1. Log in to [Tuya IoT Platform](https://platform.tuya.com)
2. Navigate to **Cloud** → **Development**
3. Click **Create Cloud Project**
4. Fill in details:
   - **Project Name**: Rankify Assist
   - **Industry**: Education/Campus (or relevant)
   - **Data Center**: Select your region (e.g., India, US, EU)
5. Click **Create**

### Step 2: Get API Credentials

1. In your project, go to **Overview** tab
2. Note down:
   - **Access ID** (Client ID)
   - **Access Secret** (Client Secret)
3. Keep these **secure** - you'll need them for the extension

### Step 3: Create Product

1. Go to **Smart Home** → **Products**
2. Click **Create Product**
3. Select **Custom Solution**
4. Fill in:
   - **Product Name**: Rankify Assist
   - **Category**: AI Speaker (or Smart Home Hub)
5. Click **Create**
6. Note down the **PID** (Product ID)

### Step 4: Define Custom Data Points (DPs)

Navigate to your product → **Functions** → **Add Function**

Create these 6 Data Points:

| DP ID | Name | Type | Mode | Description |
|-------|------|------|------|-------------|
| 101 | intent_type | String | Report Only | AI-classified intent |
| 102 | action_plan | String | Report Only | Full JSON plan from AI |
| 103 | user_confirmation | Boolean | Send & Report | User's yes/no response |
| 104 | exec_command | String | Report Only | Final command for execution |
| 105 | exec_result | String | Send & Report | Result from Eko/IoT execution |
| 106 | tts_text | String | Report Only | Text for board to speak |

Click **Publish** after adding all DPs.

---

## Chrome Extension Setup

### Step 1: Download & Load Extension

```bash
# Clone the repo (if not already done)
git clone https://github.com/namandhakad712/rankify-assist.git
cd rankify-assist

# Navigate to extension
cd extension-ready
```

**Load in Chrome:**
1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `extension-ready` folder
5. Extension icon should appear in toolbar

### Step 2: Configure Tuya Settings

1. **Right-click** extension icon → Click **Options**
2. Fill in **Tuya Cloud Settings**:
   ```
   Region: IN (or your datacenter code: US, EU, CN)
   Access ID: [Your Access ID from Step 2]
   Access Secret: [Your Access Secret from Step 2]
   Device ID: [Leave empty for now - add after pairing device]
   ```
3. Click **Test Connection** (if available) to verify
4. Click **Save** (bottom of page)

### Step 3: Configure LLM Settings

In the same Options page:

1. **LLM Provider**: Select from dropdown
   - `openai` (OpenAI GPT models)
   - `anthropic` (Claude models)
   - `cerebras` (Cerebras Llama models)
   - `deepseek` (DeepSeek models)
   - Or use **Custom URL**

2. **Model Name**:
   - For OpenAI: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
   - For Anthropic: `claude-3-5-sonnet-20241022`, `claude-3-opus`
   - For Cerebras: `llama3.1-70b`, `llama3.1-8b`

3. **API Key**: Your LLM provider API key

4. **Custom Base URL** (optional):
   - Leave empty for standard providers
   - Or add custom endpoint URL

5. Click **Save**

### Step 4: Verify Extension

1. Open Chrome **Developer Tools** (F12)
2. Go to **Console** tab
3. Look for:
   ```
   Tuya integration initialized
   Polling DP 104 every 2 seconds...
   ```

If you see these, extension is running! ✅

---

## Hardware Setup (Optional)

### Step 1: Get T5-E1 Board

Purchase from [Tuya's official store](https://platform.tuya.com) or authorized distributors.

### Step 2: Flash Firmware

1. Navigate to `firmware/` directory
2. Update `include/tuya_config.h` with your PID, UUID, AuthKey
3. Build and flash using Tuya's build tools

**Detailed guide**: See [FIRMWARE_GUIDE.md](FIRMWARE_GUIDE.md)

### Step 3: Pair Device

1. Power on T5-E1
2. Open **Tuya Smart** or **SmartLife** app
3. Add device via pairing mode
4. Note down **Device ID**
5. Add Device ID to extension Options page

---

## Testing

### Test 1: Extension Polling (No Hardware)

1. Go to [Tuya Console](https://platform.tuya.com)
2. Navigate to **Products** → **Rankify Assist** → **Debug**
3. Find DP 104 (`exec_command`)
4. Manually update with test JSON:
   ```json
   {"intent":"browser","command":"open gmail.com"}
   ```
5. Click **Send**
6. Check Chrome - Gmail should open! ✅

### Test 2: Full Workflow (With Hardware)

1. Say to device: **"Check my Gmail"**
2. Device should:
   - Play TTS: "I plan to open Gmail. Proceed?"
   - Wait for "Yes" or "No"
   - If Yes → Browser opens Gmail
   - Speaks result: "You have X unread emails"

---

## Troubleshooting

### Extension Not Polling

**Problem**: Console shows no polling messages

**Solution**:
- Verify Tuya credentials are correct
- Check Device ID is set (or leave empty for testing)
- Reload extension: `chrome://extensions/` → Click reload icon

### Browser Not Opening

**Problem**: Extension polls DP but nothing happens

**Solution**:
- Check LLM API key is valid
- Verify Eko is initialized (check console for errors)
- Ensure DP 104 JSON has `"intent":"browser"`

### Device Not Responding

**Problem**: Device paired but doesn't respond to voice

**Solution**:
- Check device online status in Tuya app
- Verify firmware is flashed correctly
- Check microphone is working (test in app)

---

## Next Steps

- 📖 Read [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) to understand cloud logic
- 🎯 Check [PLATFORM_CONFIG.md](PLATFORM_CONFIG.md) for advanced Tuya setup
- 💬 Join [Discussions](https://github.com/namandhakad712/rankify-assist/discussions) for support

---

**Questions?** [Open an issue](https://github.com/namandhakad712/rankify-assist/issues)!
