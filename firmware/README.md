# Rankify Assist - AI Voice Assistant

🤖 **Fully functional AI voice assistant powered by Tuya AI Cloud**

## Overview

Rankify Assist is an AI-powered voice assistant running on the Tuya T5AI-Core development board. It features wake word detection, voice recognition, cloud-based AI processing, and text-to-speech responses.

## Features

✅ **Voice Activation**
- Wake words: "Ni Hao Tuya" / "Hi Tuya"
- Manual button trigger (GPIO P29)

✅ **AI Capabilities**
- Real-time speech recognition
- Cloud-based AI processing
- Multi-language support (20+ languages)
- Natural language responses
- Text-to-speech output

✅ **Connectivity**
- WiFi connection
- Secure MQTT communication
- Cloud AI session management

✅ **Hardware Integration**
- Audio capture (16kHz, 16-bit mono)
- Speaker output (MP3 playback)
- Button input
- LED indicator
- Network connectivity

## Hardware Requirements

- **Board:** Tuya T5AI-Core
- **Microphone:** On-board (16kHz)
- **Speaker:** Connected to audio output
- **Button:** User button on GPIO P29
- **LED:** User LED on GPIO P9
- **WiFi:** 2.4GHz network

## Quick Start

### 1. Build the Firmware

```bash
cd apps/rankify_assist
tos.py build
```

### 2. Flash to Device

```bash
tos.py flash
```

### 3. Configure Network

- Device creates WiFi AP on first boot
- Connect via SmartLife app
- Follow pairing instructions

### 4. Use Voice Commands

**Method 1: Wake Word**
1. Say "Ni Hao Tuya" or "Hi Tuya"
2. Wait for beep
3. Speak your question
4. Listen to AI response

**Method 2: Button**
1. Press User Button (P29)
2. Wait for beep
3. Speak your question
4. Listen to AI response

## Configuration

### Product Information

```c
// include/tuya_config.h
#define TUYA_PRODUCT_ID     "okqfzw6tkrabylcs"
#define TUYA_OPENSDK_UUID   "your-uuid-here"
#define TUYA_OPENSDK_AUTHKEY "your-authkey-here"
```

### Conversation Modes (DP9)

Configure in SmartLife app:

- **"weakup"** - Wake word mode (default)
- **"free"** - Free talk mode (continuous conversation)
- **"key"** - Button press mode
- **"hold"** - Hold to talk mode

### Volume Control (DP6)

Adjust via SmartLife app: 0-100

## Project Structure

```
rankify_assist/
├── src/
│   ├── tuya_main.c           # Main application entry
│   ├── app_chat_bot.c        # Voice interaction logic
│   └── reset_netcfg.c        # Network reset handling
├── include/
│   ├── tuya_config.h         # Product configuration
│   ├── app_chat_bot.h        # Voice interface
│   └── reset_netcfg.h        # Reset utilities
├── config/
│   └── TUYA_T5AI_CORE_RANKIFY.config  # Board configuration
├── CMakeLists.txt            # Build configuration
├── Kconfig                   # Feature configuration
├── README.md                 # This file
├── SETUP_GUIDE.md           # Detailed setup instructions
├── TROUBLESHOOTING.md       # Common issues and fixes
└── SUCCESS_SUMMARY.md       # Development journey
```

## Key Components

### Audio System
- **Microphone:** Continuous capture at 62KB/s
- **Speaker:** MP3 playback
- **Processing:** 16kHz, 16-bit, mono PCM
- **Wake word engine:** On-device ASR

### AI Integration
- **Client:** Tuya AI Client
- **Session:** Cloud-based session management
- **Protocol:** MQTT + HTTPS
- **Server:** Singapore region (m1-sg.iotbing.com)

### Network
- **WiFi:** WPA2 encrypted connection
- **MQTT:** TLS secured (port 8883)
- **Region:** Configurable (currently Singapore)

## Development

### Prerequisites

```bash
# Install TuyaOpen development environment
# See: https://tuyaopen.ai/docs/quick-start/enviroment-setup
```

### Building

```bash
# Configure board
tos.py config choice
# Select: TUYA_T5AI_CORE_RANKIFY

# Build
tos.py build

# Flash
tos.py flash

# Monitor logs
tos.py monitor
```

### Debugging

Enable debug output:
```c
// Set log level in tuya_main.c
tal_log_init(TAL_LOG_LEVEL_DEBUG, 1024, (TAL_LOG_OUTPUT_CB)tkl_log_output);
```

Monitor serial output at 115200 baud.

## API Reference

### Main Functions

```c
// Initialize voice assistant
OPERATE_RET app_chat_bot_init(void);

// Set AI audio volume (0-100)
OPERATE_RET ai_audio_set_volume(uint8_t volume);

// Manual wake trigger
OPERATE_RET ai_audio_set_wakeup(void);
```

### Event Callbacks

```c
// Audio state change callback
void audio_state_cb(AI_AUDIO_STATE_E state);

// Audio event callback
void audio_event_cb(AI_AUDIO_EVENT_E event, void *data, 
                   uint32_t len, void *user_data);
```

## Supported Languages

### Cloud AI (Post-Wake)
- English (US, UK, India, Australia)
- Hindi (India)
- Mandarin Chinese
- Cantonese
- Spanish, French, German, Italian
- Japanese, Korean
- Arabic, Portuguese, Russian
- And 10+ more languages

### Wake Words (On-Device)
- "Ni Hao Tuya" (你好涂鸦)
- "Hi Tuya" / "Hey Tuya" (English variant)
- "Ni Hao Xiao Zhi" (你好小智)
- Additional Chinese variants

**Note:** Wake word detection is hardware-limited to Chinese models. After activation, any supported language can be used.

## Performance

- **Boot Time:** ~7 seconds
- **WiFi Connect:** ~2 seconds
- **MQTT Connect:** ~30 seconds
- **AI Init:** ~1 second
- **Wake Detection:** ~200ms
- **Response Time:** 3-8 seconds (includes cloud processing)

## Troubleshooting

See `TROUBLESHOOTING.md` for detailed solutions.

### Common Issues

**1. "session id was null"**
- Ensure `tal_event_publish(EVENT_MQTT_CONNECTED, NULL)` is called in MQTT connect handler
- Check MQTT connection in logs
- Verify AI client initialization

**2. Wake word not detected**
- Check microphone connection
- Verify wake word pronunciation
- Review audio input logs

**3. No AI response**
- Confirm network connectivity
- Check AI session creation in logs
- Verify cloud region settings

**4. Button not working**
- Ensure `BUTTON_NAME` macro is used (not hardcoded string)
- Check GPIO P29 connection
- Verify button initialization logs

## License

Copyright (c) 2021-2025 Tuya Inc. All Rights Reserved.

## Contributing

This is a proprietary Tuya IoT application. For modifications:
1. Fork the project
2. Create feature branch
3. Test thoroughly
4. Submit changes

## Support

- **Documentation:** [TuyaOpen Docs](https://tuyaopen.ai/docs)
- **Forum:** [TuyaOS Community](https://www.tuyaos.com)
- **Discord:** [Tuya Discord](https://discord.com/invite/yPPShSTttG)

## Version History

### v2.0.1 (Current)
- ✅ Fixed AI session initialization
- ✅ Added button wake trigger
- ✅ Improved error handling
- ✅ Singapore region support
- ✅ Multi-language capability

### v1.0.0 (Initial)
- Basic voice recognition
- Wake word detection
- Cloud AI integration

## Credits

**Developed by:** Rankify Team  
**Platform:** Tuya IoT  
**Board:** T5AI-Core  
**Framework:** TuyaOpen v1.5.1

---

**Status:** ✅ Fully Operational  
**Last Updated:** 2025-12-22
