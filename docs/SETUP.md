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

### Step 2: Obtain API Credentials

1. Navigate to the project **Overview** tab
2. Locate and record the following credentials:
   - **Access ID** (Client ID)
   - **Access Secret** (Client Secret)
3. Store credentials securely - these will be required for Chrome extension configuration

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

### Step 2: Configure Tuya Cloud Settings

1. Right-click the extension icon in Chrome toolbar
2. Select **Options** from context menu
3. Configure **Tuya Cloud Settings**:
   ```
   Region: Select datacenter region (IN, US, EU, CN)
   Access ID: Enter Access ID obtained from Tuya Console
   Access Secret: Enter Access Secret from Tuya Console
   Device ID: Leave empty until device pairing is complete
   ```
4. Verify connectivity using **Test Connection** button (if available)
5. Click **Save** to persist configuration

### Step 3: Configure LLM Integration

Navigate to the same Options page and complete the following:

1. **LLM Provider**: Select from available providers:
   - `openai` - OpenAI GPT models
   - `anthropic` - Anthropic Claude models
   - `cerebras` - Cerebras Llama models
   - `deepseek` - DeepSeek models
   - Or specify custom endpoint URL

2. **Model Selection**:
   - OpenAI: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
   - Anthropic: `claude-3-5-sonnet-20241022`, `claude-3-opus`
   - Cerebras: `llama3.1-70b`, `llama3.1-8b`

3. **API Key**: Enter provider-specific API key

4. **Custom Base URL** (Optional):
   - Default: Leave empty for standard provider endpoints
   - Custom: Enter alternative API endpoint if required

5. Click **Save** to persist LLM configuration

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

### Test 1: Extension Polling (Without Physical Hardware)

1. Access [Tuya IoT Platform Console](https://platform.tuya.com)
2. Navigate to **Products** → Select your product → **Debug** tab
3. Locate Data Point 104 (`exec_command`)
4. Submit test payload via manual DP update:
   ```json
   {"intent":"browser","command":"open gmail.com"}
   ```
5. Click **Send** to publish DP update
6. Verify browser automation: Gmail should load automatically in Chrome

**Expected Result:** Extension polls DP 104, detects browser intent, executes command via Eko agent

### Test 2: Complete Workflow (With Physical Hardware)

1. Issue voice command to T5-E1 device: **"Check my Gmail"**
2. Expected device behavior sequence:
   - **TTS Output**: "I plan to open Gmail. Proceed?"
   - **Await Confirmation**: Device listens for verbal "Yes" or "No"
   - **On Affirmative**: Browser automation executes (opens Gmail)
   - **Result Feedback**: Device speaks execution result (e.g., "You have 3 unread emails")

**Workflow Phases Validated:**
- Phase 1: Voice input capture and STT conversion
- Phase 2: AI intent classification (browser task)
- Phase 3: Safety confirmation protocol
- Phase 4: Browser automation execution
- Phase 5: TTS result feedback

---

## Troubleshooting

### Extension Polling Failure

**Symptom**: Console displays no polling activity messages

**Resolution Steps**:
- Verify Tuya API credentials accuracy in Options
- Confirm Device ID configuration (may remain empty for testing)
- Reload extension via `chrome://extensions/` → Reload button
- Inspect browser console for error messages

### Browser Automation Non-Execution

**Symptom**: Extension polls DP successfully but browser actions do not occur

**Resolution Steps**:
- Validate LLM API key authenticity
- Verify Eko agent initialization status in console logs
- Confirm DP 104 payload contains `"intent":"browser"` field
- Test with simplified commands initially

### Device Non-Responsive

**Symptom**: Paired device fails to respond to voice input

**Resolution Steps**:
- Verify device online status in Tuya Smart/SmartLife application
- Confirm firmware flash completion and accuracy
- Test microphone functionality via application
- Check device power and network connectivity

---

## Next Steps

- 📖 Read [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) to understand cloud logic
- 🎯 Check [PLATFORM_CONFIG.md](PLATFORM_CONFIG.md) for advanced Tuya setup
- 💬 Join [Discussions](https://github.com/namandhakad712/rankify-assist/discussions) for support

---

**Questions?** [Open an issue](https://github.com/namandhakad712/rankify-assist/issues)!
