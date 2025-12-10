# 💻 T5-E1 Firmware Guide

Guide for programming the Tuya T5-E1 AI Core board.

---

## ⚠️ Hardware Status

**Current Status**: Board in transit, arriving soon

**Firmware Status**: Implementation guide ready in `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`

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
#define TUYA_PRODUCT_ID "okqfzw6tkrabylcs"
#define TUYA_OPENSDK_UUID "your-uuid-here"
#define TUYA_OPENSDK_AUTHKEY "your-authkey-here"
```

Get UUID & AuthKey from [Tuya Console](https://platform.tuya.com) → Products → Rankify Assist

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

### Voice Input Test

1. Say: "Hello"
2. Check device response
3. Verify STT works

### DP Update Test

1. Update DP 106 (tts_text) in Tuya Console
2. Device should speak the text

### Full Workflow Test

1. Say: "Check my Gmail"
2. Device should:
   - Send to cloud
   - Receive workflow output
   - Play TTS confirmation
   - Wait for "Yes"
   - Update DP 104 on confirmation

---

## 📖 Further Reading

- **Implementation Guide**: `firmware/FIRMWARE_IMPLEMENTATION_GUIDE.md`
- **TuyaOpen Docs**: [developer.tuya.com](https://developer.tuya.com)
- **SDK Reference**: [GitHub](https://github.com/tuya/tuya-open-sdk-for-device)

---

**Hardware arriving soon! Stay tuned for updates.** 🚀
