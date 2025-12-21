# 💻 T5-AI Firmware Guide

Guide for programming the Tuya T5-AI AI Core board with Tuya AI Workflow architecture.

---

## 📋 Overview

This firmware provides **Voice I/O Interface** for the Rankify Assist system. The Tuya AI Workflow (cloud) handles all intelligence, planning, and execution via MCP servers.

**Firmware Role:** Simple and reliable voice interface only.

---

## 📋 Prerequisites

- Tuya T5-E1 AI Core Board
- USB-C cable
- TuyaOpen SDK installed
- Build tools (Python, gcc-arm-none-eabi)

---

## 🔧 Setup

### 1. Install TuyaOpen SDK

```bash
# Clone TuyaOpen SDK
git clone https://github.com/tuya/tuyaopen.git c:\TUYA\TuyaOpen
cd c:\TUYA\TuyaOpen
```

### 2. Configure Product Credentials

Edit `c:\TUYA\TuyaOpen\apps\rankify_assist\include\tuya_config.h`:

```c
#define TUYA_PRODUCT_ID "okqfzw6tkrabylcs"
#define TUYA_OPENSDK_UUID "your-uuid-here"
#define TUYA_OPENSDK_AUTHKEY "your-authkey-here"
```

Obtain UUID and AuthKey from [Tuya IoT Platform Console](https://platform.tuya.com):
- Navigate to **Products** → **rankify_assist** → **Device Management**
- Generate authorization credentials

---

## 🏗️ Building

```bash
cd c:\TUYA\TuyaOpen\apps\rankify_assist
python ..\..\tos.py build
```

Output: `c:\TUYA\TuyaOpen\apps\rankify_assist\dist\rankify_assist_1.0.0\rankify_assist_QIO_1.0.0.bin`

---

## 📤 Flashing

### Method 1: Using tos.py (Recommended)

```bash
cd c:\TUYA\TuyaOpen\apps\rankify_assist
python ..\..\tos.py flash
```

### Method 2: Manual Flash

1. Connect T5-E1 via USB-C
2. Power on the board (ensure power switch is ON)
3. Use tyutool_cli.py:
   ```bash
   cd c:\TUYA\TuyaOpen\tools\tyutool
   python tyutool_cli.py write -d T5AI -f path\to\rankify_assist_QIO_1.0.0.bin
   ```

---

## 🔌 Pairing Device

### Normal Pairing (First Time)

1. Power on T5-E1
2. Device automatically enters **AP + BLE Pairing Mode**
3. Open **SmartLife** app
4. Tap **Add Device** → **Auto Scan**
5. Follow on-screen pairing instructions
6. Note **Device ID** from app for MCP server configuration

### Factory Reset (Re-pairing)

**Press the User Button (P29)** on the board:
- Single press triggers factory reset
- Device wipes all config and reboots
- Automatically enters pairing mode
- See [Hardware Controls](#-hardware-controls) for details

---

## 🔧 Hardware Controls

### User Button (P29)

**Location:** User button marked on T5AI-Core board (not the RESET button)

**Action:** Single Press (Short Click)

**Behavior:**
1. Stops AI Audio
2. Deletes network configuration
3. Wipes Tuya Cloud binding
4. Reboots device

**Result:** Device enters clean pairing mode (AP + BLE)

**Use Cases:**
- Switch to different WiFi network
- Re-pair with different Tuya account
- Device stuck or unresponsive

**Serial Log Output:**
```
>>> BUTTON P29 PRESSED: NUKING DATA & RESETTING! <<<
!!! REBOOTING SYSTEM TO PAIRING MODE !!!
```

---

## 🧪 Testing

### Voice Input Verification

1. Say wake word: **"Hey Tuya"** (or configured wake word)
2. Observe serial logs:
   ```
   🎤 Wakeup Detected
   ```
3. Issue test command: **"What time is it?"**
4. Confirm STT works:
   ```
   📝 User Said: What time is it?
   ```

### TTS Output Verification

1. Wait for cloud response
2. Device should speak the answer
3. Serial logs show:
   ```
   🔊 AI Response (TTS): It's 3:30 PM
   ✅ AI Response Complete
   ```

### Complete Workflow (Browser Task)

1. Say: **"Check my Gmail"**
2. Expected flow:
   ```
   📝 User Said: Check my Gmail
   🔊 AI Response (TTS): I plan to open Gmail. Proceed?
   ```
3. Say: **"Yes"**
4. Cloud executes via MCP Browser Server
5. Device speaks result:
   ```
   🔊 AI Response (TTS): You have 5 unread emails
   ```

### IoT Control Test

1. Say: **"Turn on the lights"**
2. Expected flow:
   ```
   📝 User Said: Turn on the lights
   🔊 AI Response (TTS): Light is on
   ```

### Serial Monitoring

```bash
# Monitor device logs in real-time
cd c:\TUYA\TuyaOpen\apps\rankify_assist
python ..\..\tos.py monitor
```

---

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Device    │ ← This Firmware (Voice I/O)
│  (T5-E1)    │
└──────┬──────┘
       │ WiFi
       ↓
┌─────────────┐
│  Tuya AI    │ ← Intent, Planning, Safety
│  Workflow   │
│   (Cloud)   │
└──────┬──────┘
       │ MCP Protocol
       ├────────────────┬────────────────┐
       ↓                ↓                ↓
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Browser MCP │  │ Device MCP  │  │  Chat LLM   │
│  (Vercel)   │  │(Tuya API)   │  │   (Cloud)   │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Firmware:** Voice → Cloud → Voice
**Cloud:** Everything else (intelligence, execution, coordination)

---

## 📖 Further Reading

- **Implementation Guide**: `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`
- **Architecture Diagram**: `PROJECT_ARCHITECTURE_DIAGRAM.mmd`
- **TuyaOpen Docs**: [tuyaopen.ai](https://tuyaopen.ai)
- **SDK GitHub**: [github.com/tuya/tuyaopen](https://github.com/tuya/tuyaopen)

---

## 🐛 Troubleshooting

### Device won't pair
- Press P29 button for factory reset
- Ensure WiFi is 2.4GHz (not 5GHz)
- Check SmartLife app permissions

### No voice response
- Check serial logs for STT output
- Verify internet connection
- Ensure Tuya AI Workflow is configured

### Build errors
- Verify TuyaOpen SDK path
- Check Python version (3.x required)
- Run `tos.py build` from correct directory

---

**For detailed implementation patterns and cloud integration, refer to `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`.**
