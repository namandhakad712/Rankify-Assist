# 💻 T5-AI Firmware Guide

Guide for programming the Tuya T5-AI AI Core board.

---

## 📋 Overview

This guide provides instructions for building and flashing firmware to the Tuya T5-E1 AI Core board. The firmware implementation follows the patterns documented in `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`.

---

## 📋 Prerequisites

- Tuya T5-E1 AI Core Board
- USB-C cable
- TuyaOpen SDK
- Build tools (gcc, make)

---

## 🔧 Setup

### 1. Install TuyaOpen SDK

```bash
git clone https://github.com/tuya/tuya-open-sdk-for-device.git
cd tuya-open-sdk-for-device
```

### 2. Configure Product

Edit `firmware/include/tuya_config.h`:

```c
#define TUYA_PRODUCT_ID "your-product-id-here"
#define TUYA_OPENSDK_UUID "your-uuid-here"
#define TUYA_OPENSDK_AUTHKEY "your-authkey-here"
```

Obtain Product ID, UUID, and AuthKey from [Tuya IoT Platform Console](https://platform.tuya.com):
- Navigate to **Products** → Select your product → **Device Management**
- Locate credentials in product Overview section

---

## 🏗️ Building

```bash
cd firmware
make clean
make
```

Output: `output/rankify_assist.bin`

---

## 📤 Flashing

1. Connect T5-E1 via USB-C
2. Put board in download mode (hold BOOT button + press RESET)
3. Flash:
   ```bash
   tuya_flash.sh output/rankify_assist.bin
   ```

---

## 🔌 Pairing Device

1. Power on T5-E1
2. Open **Tuya Smart** or **SmartLife** app
3. Add Device → Scan QR code
4. Or: Manual pairing mode
5. Note **Device ID** from app

---

## 🧪 Testing

### Voice Input Verification

1. Issue test voice command: "Hello"
2. Confirm device captures and processes audio
3. Verify Speech-to-Text (STT) conversion functionality

### Data Point Update Verification

1. Manually update DP 106 (`tts_text`) via Tuya Console Debug interface
2. Confirm device executes Text-to-Speech (TTS) output

### Complete Workflow Verification

1. Issue voice command: "Check my Gmail" (or equivalent browser task)
2. Expected device behavior sequence:
   - Transmit voice data to cloud
   - Receive workflow response
   - Execute TTS confirmation prompt
   - Await user confirmation ("Yes"/"No")
   - Update DP 104 upon affirmative response

---

## 📖 Further Reading

- **Implementation Guide**: `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`
- **TuyaOpen Docs**: [developer.tuya.com](https://developer.tuya.com)
- **SDK Reference**: [GitHub](https://github.com/tuya/tuya-open-sdk-for-device)

---

**For detailed implementation patterns, refer to `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`.**
