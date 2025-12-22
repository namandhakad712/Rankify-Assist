# Rankify Assist - Complete Setup Guide

This guide walks you through setting up Rankify Assist from scratch.

## Prerequisites

### Hardware
- ✅ Tuya T5AI-Core development board
- ✅ USB cable (for flashing and power)
- ✅ Speaker (connected to audio output)
- ✅ WiFi network (2.4GHz)

### Software
- ✅ TuyaOpen development environment
- ✅ Python 3.x
- ✅ Serial terminal (optional, for debugging)
- ✅ SmartLife app (iOS/Android)

### Tuya Cloud Account
- ✅ Tuya IoT Platform account
- ✅ Product created with AI capability
- ✅ UUID and AuthKey obtained

---

## Step 1: Environment Setup

### Install TuyaOpen Tools

```bash
# Clone TuyaOpen repository
git clone https://github.com/tuya/TuyaOpen.git
cd TuyaOpen

# Activate tos.py
# Follow: https://tuyaopen.ai/docs/quick-start/enviroment-setup
```

### Install Dependencies

**Ubuntu/Linux:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
pip3 install typer rich
```

**Windows:**
```powershell
# Python 3.x should be installed
pip install typer rich
```

---

## Step 2: Get Device Credentials

### 1. Create Tuya IoT Account

1. Go to https://iot.tuya.com
2. Create account / Sign in
3. Create new project

### 2. Create Product

1. Navigate to "Products" → "Create Product"
2. Select category: **Smart Speaker / AI Assistant**
3. Product Name: **"Rankify Assist"** (or your choice)
4. Communication: **WiFi**
5. Enable: **AI Voice Assistant**
6. Click **Create**

### 3. Get Authorization

1. Go to product page
2. Navigate to **"Devices"** tab
3. Click **"Obtain Licenses"**
4. Copy **UUID** and **AuthKey**

### 4. Configure AI Agent (IMPORTANT!)

1. Go to https://iot.tuya.com/cloud/ai-agent
2. Click **"Create AI Agent"** (or use existing)
3. **Name:** "Rankify Brain" (or your choice)
4. **Deployment:** Select **"On-device Deployment"** ONLY
   - ❌ Remove "Dialog Mini Program" if present
5. **Link Product:** Select your product ID
6. **Language:** Choose primary language (English/Hindi/etc)
7. **Voice:** Select preferred voice variant
8. Click **"Publish"**

---

## Step 3: Configure Firmware

### 1. Edit Configuration File

```bash
cd apps/rankify_assist
nano include/tuya_config.h
```

### 2. Update Credentials

```c
// Replace with your values
#define TUYA_PRODUCT_ID     "okqfzw6tkrabylcs"  // Your Product ID
#define TUYA_OPENSDK_UUID   "your-uuid-here"     // From Step 2.3
#define TUYA_OPENSDK_AUTHKEY "your-authkey-here" // From Step 2.3

#define PROJECT_NAME "Rankify Assist"
#define PROJECT_VERSION "2.0.1"
```

### 3. Save and Close

```bash
# Ctrl+O to save, Ctrl+X to exit
```

---

## Step 4: Build Firmware

### 1. Configure Board

```bash
cd apps/rankify_assist
tos.py config choice
```

**Select:** `TUYA_T5AI_CORE_RANKIFY`

### 2. Build

```bash
tos.py build
```

**Expected output:**
```
[INFO]: Build complete
[INFO]: Binary: .build/bin/rankify_assist_QIO_2.0.1.bin
```

### 3. Verify Build

```bash
ls -lh .build/bin/
```

Should show `rankify_assist_QIO_2.0.1.bin` (~2-3 MB)

---

## Step 5: Flash to Device

### 1. Connect Hardware

1. Connect T5AI-Core to PC via USB
2. Note COM port (Windows: Device Manager / Linux: `ls /dev/ttyUSB*`)

### 2. Flash Firmware

```bash
tos.py flash
```

**Follow prompts:**
1. Select correct serial port
2. Press RESET button on board (if requested)
3. Wait for flash completion

**Expected output:**
```
[INFO]: Flash write success.
```

### 3. Verify Boot

```bash
tos.py monitor
```

**Look for:**
```
=== Rankify Assist ===
App version: 2.0.1
Platform: TUYA_T5AI_CORE
```

---

## Step 6: Network Configuration

### Method 1: SmartLife App (Recommended)

1. **Install App**
   - iOS: App Store → "SmartLife"
   - Android: Play Store → "SmartLife"

2. **Create Account** (if needed)
   - Open app → Sign up
   - Verify email

3. **Add Device**
   - Tap "+" → "Add Device"
   - Select category: "Smart Speaker" or "Others"
   - Put device in pairing mode (auto on first boot)

4. **Connect to WiFi**
   - Select your 2.4GHz WiFi network
   - Enter password
   - Wait for pairing

5. **Complete Setup**
   - Name your device
   - Assign to room (optional)
   - **Done!**

### Method 2: Reset Network (if needed)

**Reset device:**
1. Power cycle 3 times rapidly (5 sec on, 5 sec off, repeat)
2. Device enters pairing mode
3. LED flashes rapidly
4. Follow Method 1 steps

---

## Step 7: Verify Operation

### 1. Check Logs

```bash
tos.py monitor
```

**Look for:**
```
✅ Device MQTT Connected!
✅ __ai_agent_init...
✅ ai client init success
✅ Rankify Assist Voice Interface Ready
```

### 2. Test Wake Word

1. Say: **"Ni Hao Tuya"** or **"Hi Tuya"**
2. Wait for beep (wake alert)
3. Say: **"What time is it?"**
4. Listen for AI response

### 3. Test Button

1. Press User Button (GPIO P29)
2. Wait for beep
3. Speak any question
4. Listen for response

### 4. Check SmartLife App

1. Open SmartLife app
2. Find "Rankify Assist" device
3. Status should be **"Online"**
4. Try adjusting volume (DP6)
5. Try changing mode (DP9)

---

## Step 8: Configuration Options

### Volume Control

**Via App:**
1. Open device in SmartLife
2. Find volume slider
3. Adjust 0-100

**Via Code:**
```c
ai_audio_set_volume(80); // 80%
```

### Conversation Mode (DP9)

**Via App:**
1. Find "Conversational Mode" setting
2. Choose:
   - **"weakup"** - Wake word mode
   - **"free"** - Free talk (continuous)
   - **"key"** - Button only
   - **"hold"** - Hold to talk

### Language Configuration

**In Tuya IoT Platform:**
1. Go to AI Agent settings
2. Change primary language
3. Select voice variant
4. Republish agent

**Device will use new settings on next session**

---

## Advanced Configuration

### Custom Wake Words

**Limited to pre-trained models:**
- Cannot add custom English wake words
- Available: Chinese variants only
- Alternative: Use button mode

### Multi-Language Support

**Cloud AI supports:**
- English (multiple accents)
- Hindi
- 18+ other languages

**Configure in AI Agent settings**

### Network Region

**Change data center:**
1. Reset device
2. Re-pair in different region
3. Update AI Agent to match region

---

## Troubleshooting Setup

### Build Fails

**Issue:** `tos.py build` errors

**Fix:**
```bash
# Clean build
tos.py clean
tos.py build
```

### Flash Fails

**Issue:** Cannot flash firmware

**Fix:**
1. Check USB cable (use data cable, not charge-only)
2. Install USB drivers (CH340/CP2102)
3. Close other serial monitors
4. Try different COM port
5. Press RESET during flash if prompted

### Device Not Pairing

**Issue:** SmartLife app can't find device

**Fix:**
1. Ensure 2.4GHz WiFi (not 5GHz)
2. Reset device (3 rapid power cycles)
3. Check device LED is flashing
4. Move closer to WiFi router
5. Disable AP isolation on router

### No AI Response

**Issue:** Wake word detected but no response

**Fix:**
1. Check logs: `tos.py monitor`
2. Look for "session id was null" error
3. Verify AI Agent configuration:
   - Deployment: "On-device" only
   - Product linked correctly
   - Agent published
4. Check network firewall settings
5. Verify HTTPS access to cloud

### Wake Word Not Working

**Issue:** Device doesn't respond to "Ni Hao Tuya"

**Fix:**
1. Use button instead (GPIO P29)
2. Check microphone connection
3. Verify audio logs show capture
4. Try different pronunciation
5. Use "Hey Tuya" variant

---

## Performance Tuning

### Optimize Response Time

```c
// Reduce audio buffer (faster but less stable)
sg_audio_input.asr.buff_len = 12800; // Default: 19200
```

### Adjust Volume

```c
// Set default volume
#define DEFAULT_VOLUME 80 // 0-100
```

### Configure Timeout

```c
// ASR timeout (free talk mode)
#define ASR_TIMEOUT_MS 30000 // 30 seconds
```

---

## Next Steps

### 1. Test All Features
- ✅ Wake word detection
- ✅ Button trigger
- ✅ Voice recognition
- ✅ AI responses
- ✅ Multiple languages

### 2. Customize
- Set preferred language
- Choose voice variant
- Adjust conversation mode
- Configure prompts

### 3. Integrate
- Connect to Rankify ecosystem
- Add device control
- Implement automations
- Build custom features

### 4. Monitor
- Check logs regularly
- Monitor session health
- Track performance
- Update as needed

---

## Support Resources

### Documentation
- **TuyaOpen Docs:** https://tuyaopen.ai/docs
- **API Reference:** https://tuyaopen.ai/docs/api
- **AI Components:** https://tuyaopen.ai/docs/applications/tuya.ai

### Community
- **Forum:** https://www.tuyaos.com
- **Discord:** https://discord.com/invite/yPPShSTttG
- **GitHub:** https://github.com/tuya/TuyaOpen

### Issues
- **Bug Reports:** GitHub Issues
- **Feature Requests:** Community Forum
- **Questions:** Discord Channel

---

## Checklist

### Pre-Build
- [ ] TuyaOpen environment installed
- [ ] Tuya IoT account created
- [ ] Product created with AI capability
- [ ] UUID and AuthKey obtained
- [ ] AI Agent configured and published
- [ ] tuya_config.h updated

### Build & Flash
- [ ] Board configuration selected
- [ ] Firmware built successfully
- [ ] Device flashed (no errors)
- [ ] Boot logs verified

### Network Setup
- [ ] SmartLife app installed
- [ ] Device paired successfully
- [ ] WiFi connected
- [ ] MQTT connected
- [ ] Device shows online

### Verification
- [ ] AI client initialized in logs
- [ ] Wake word detection works
- [ ] Button trigger works
- [ ] Voice recognition active
- [ ] AI responses playing
- [ ] End-to-end flow working

### Configuration
- [ ] Volume adjusted
- [ ] Conversation mode set
- [ ] Language configured
- [ ] Voice variant selected

---

## Congratulations! 🎉

**Your Rankify Assist is now fully operational!**

Start talking to your AI assistant and enjoy the magic! ✨

For troubleshooting, see `TROUBLESHOOTING.md`  
For project details, see `README.md`  
For success story, see `SUCCESS_SUMMARY.md`

**Happy Voice Assisting!** 🤖🎤
