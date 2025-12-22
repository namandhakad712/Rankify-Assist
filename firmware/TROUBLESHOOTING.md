# Troubleshooting Guide - Rankify Assist

Common issues and their solutions.

## Table of Contents

1. [AI Session Issues](#ai-session-issues)
2. [Wake Word Problems](#wake-word-problems)
3. [Audio Issues](#audio-issues)
4. [Network Problems](#network-problems)
5. [Build & Flash Errors](#build--flash-errors)
6. [Button Not Working](#button-not-working)
7. [Performance Issues](#performance-issues)

---

## AI Session Issues

### ❌ "session id was null"

**Symptoms:**
```
tuya ai upload start...
[ty E][tuya_ai_event.c:40] event or session id was null
start event failed, rt:-2
upload start fail
```

**Root Cause:**  
AI client not initialized due to missing event publication.

**Fix:**

1. **Check `tuya_main.c` line 73-82:**

```c
case TUYA_EVENT_MQTT_CONNECTED:
    PR_INFO("Device MQTT Connected!");
    
    // THIS LINE IS CRITICAL!
    tal_event_publish(EVENT_MQTT_CONNECTED, NULL);
    
    ai_audio_player_play_alert(AI_AUDIO_ALERT_NETWORK_CONNECTED);
    break;
```

2. **Verify in logs:**

```
[ty I] Device MQTT Connected!
[ty D][ai_audio_agent.c:461] __ai_agent_init...  ← Should appear!
[ty N] ai client init success                     ← Should appear!
```

3. **If still missing:**
   - Rebuild: `tos.py build`
   - Reflash: `tos.py flash`
   - Reset device

---

### ❌ AI Client Not Initializing

**Symptoms:**
```
ai session wait for mqtt connected...
(nothing else happens)
```

**Diagnosis:**

**Check logs for:**
```
✅ Should see: __ai_agent_init...
✅ Should see: ai client state 0 -> 1
✅ Should see: ai client init success
```

**Fix:**

1. **Verify MQTT connected:**
```
[ty I] Device MQTT Connected!  ← Must appear before AI init
```

2. **Check event publishing:**
```c
// In TUYA_EVENT_MQTT_CONNECTED handler
tal_event_publish(EVENT_MQTT_CONNECTED, NULL);
```

3. **Rebuild from clean:**
```bash
tos.py clean
tos.py build
tos.py flash
```

---

### ❌ "connect to cloud failed, get config"

**Symptoms:**
```
[ty E] tcp transporter connect failed,ret:-0x710a
[ty E] http post err, rt:-7689
connect to cloud failed, get config and connect after X s
```

**Root Cause:**  
TLS/HTTPS connection failure to AI config server.

**Fix:**

1. **Check network connectivity:**
```bash
# From PC on same network
ping m1-sg.iotbing.com
curl -v https://m1-sg.iotbing.com
```

2. **Check firewall:**
   - Allow HTTPS (port 443) outbound
   - Allow TLS connections
   - Disable deep packet inspection temporarily

3. **Verify device time:**
```
Check log for timestamp sync:
[ty I] Sync timestamp:1766402354
```

4. **Wait for auto-retry:**
   - Device retries with backoff (10s, 19s, 38s...)
   - May succeed after few attempts
   - Let run for 10 minutes

5. **Check cloud region:**
   - Ensure AI Agent in same region as device
   - Singapore (SG) recommended
   - Verify in Tuya IoT Platform

---

## Wake Word Problems

### ❌ Wake Word Not Detected

**Symptoms:**
- Say "Ni Hao Tuya" → No response
- No beep sound
- Logs show no wake event

**Diagnosis:**

**Check audio input:**
```
Look for in logs:
[ONBOARD_MIC] data_size: 256000(Bytes), 62KB/s  ← Should be continuous
```

**Fix:**

1. **Verify microphone:**
   - Check connection
   - Verify hardware initialization:
     ```
     audio init complete, sample: 16000
     ```

2. **Check wake word engine:**
   ```
   WAKEUP_info:nihaotuya-xiaozhitongxue-heytuya-hituya...
   tkl_asr_init OK!
   ```

3. **Try pronunciation:**
   - "Nee how Too-yah" (slow and clear)
   - "Hey Too-yah"
   - Try multiple times at different volumes

4. **Use button instead:**
   - Press GPIO P29 button
   - Same functionality, no wake word needed

5. **Check logs for detection:**
   ```
   score:XXX thr:-8 keyword=X
   TUTUClear_WakeWord -> X
   🎤 Wakeup Detected
   ```

---

### ❌ Can't Use "Hi" or "Hello"

**Question:**  
Can I change wake word to "Hi" or "Hello"?

**Answer:**  
**NO.** Wake words are hardware-limited to pre-trained Chinese models:
- "Ni Hao Tuya" (你好涂鸦)
- "Hi Tuya" / "Hey Tuya" (variants)
- "Ni Hao Xiao Zhi" (你好小智)
- Additional Chinese options

**Why:**  
The wake word detection runs on DSP with pre-compiled models. Cannot be changed without Tuya firmware update.

**Workaround:**
- Use button trigger (GPIO P29)
- Or use "Hey Tuya" (closest English variant)
- After wake, speak ANY language!

---

## Audio Issues

### ❌ No Audio Capture

**Symptoms:**
```
[ONBOARD_MIC] data_size: 0(Bytes), 0KB/s  ← Should be 62KB/s!
```

**Fi:**

1. **Check audio initialization:**
```
audio init complete, sample: 16000  ← Must appear
__ai_audio_input_hardware_init success
```

2. **Verify codec config:**
```c
// In config/TUYA_T5AI_CORE_RANKIFY.config
CONFIG_AUDIO_CODEC_NAME=y
CONFIG_AUDIO_CODEC_NAME_STRING="onboard"
```

3. **Check CMakeLists.txt:**
```cmake
add_subdirectory(${COMPONENT_AI_AUDIO_DIR}/audio ${CMAKE_CURRENT_BINARY_DIR}/ai_audio_dir)
```

4. **Rebuild:**
```bash
tos.py clean
tos.py build
tos.py flash
```

---

### ❌ No Speaker Output

**Symptoms:**
- Wake beep not heard
- AI responses silent
- Logs show audio playback

**Fix:**

1. **Check speaker connection:**
   - Verify physical connection
   - Check volume level
   - Test with external speaker

2. **Verify player logs:**
```
ai audio player start
app player end
```

3. **Check volume setting:**
```c
ai_audio_set_volume(80); // Try 80%
```

4. **Verify DP6 in app:**
   - Open SmartLife app
   - Check volume slider
   - Adjust to max

---

### ❌ Audio Stuttering/Garbled

**Symptoms:**
- Choppy audio playback
- Garbled speech
- Incomplete responses

**Fix:**

1. **Check WiFi signal:**
   - Move closer to router
   - Verify signal strength in logs

2. **Increase buffer:**
```c
// In ai_audio_input.c
sg_audio_input.asr.buff_len = 25600; // Increase
```

3. **Check network bandwidth:**
   - Reduce other network usage
   - Test during low-traffic time

4. **Verify data rates:**
```
[WIFI_RX] Should be 20-100KB/s during response
```

---

## Network Problems

### ❌ WiFi Won't Connect

**Symptoms:**
```
wifi connnet FTTH
(stays connecting forever)
```

**Fix:**

1. **Check WiFi band:**
   - **MUST be 2.4GHz** (not 5GHz!)
   - Check router settings
   - Create separate 2.4GHz SSID if needed

2. **Verify password:**
   - Re-enter in SmartLife app
   - Check for special characters
   - Try simple password temporarily

3. **Check router:**
   - AP isolation: Disabled
   - WiFi encryption: WPA2
   - DHCP: Enabled
   - Client limit: Not reached

4. **Reset and retry:**
```bash
# Power cycle device 3 times
# Re-pair in SmartLife app
```

---

### ❌ MQTT Won't Connect

**Symptoms:**
```
[ty E] tcp transporter connect failed
MQTT connect fail:5
```

**Fix:**

1. **Check internet:**
   - Verify router has internet
   - Test with PC: `ping 8.8.8.8`

2. **Check firewall:**
   - Allow port 8883 outbound
   - Allow MQTT over TLS
   - Temporarily disable firewall to test

3. **Verify region:**
```
endpoint_mgr.region:SG  ← Check your region
```

4. **Check credentials:**
```c
// Verify in tuya_config.h
TUYA_PRODUCT_ID
TUYA_OPENSDK_UUID
TUYA_OPENSDK_AUTHKEY
```

---

## Build & Flash Errors

### ❌ Build Fails

**Symptoms:**
```
[ERROR]: Build failed
CMake Error...
```

**Fix:**

1. **Clean rebuild:**
```bash
tos.py clean
tos.py build
```

2. **Check environment:**
```bash
# Verify tos.py activated
python --version  # Should be 3.x
```

3. **Check path:**
```bash
cd apps/rankify_assist
pwd  # Should be in correct directory
```

4. **Update TuyaOpen:**
```bash
git pull origin master
tos.py build
```

---

### ❌ Flash Fails

**Symptoms:**
```
[ERROR]: Flash failed
Port error...
```

**Fix:**

1. **Check USB cable:**
   - Use DATA cable (not charge-only)
   - Try different cable
   - Try different USB port

2. **Install drivers:**
   - **Windows:** CH340 driver
   - **Linux:** Add user to dialout group:
     ```bash
     sudo usermod -a -G dialout $USER
     # Logout and login
     ```

3. **Close other apps:**
   - Close serial monitors
   - Close Arduino IDE
   - Close PuTTY/screen

4. **Try manual reset:**
   - Hold RESET button
   - Start flash
   - Release when prompted

5. **Check port:**
   - **Windows:** Device Manager → Ports
   - **Linux:** `ls /dev/ttyUSB*`

---

## Button Not Working

### ❌ "button no existence"

**Symptoms:**
```
[ty N][tdl_button_manage.c:363] button no existence
[ty E][tdl_button_manage.c:630] tdl create updata err
Failed to create button: -1
```

**Root Cause:**  
Button name mismatch between board hardware and app code.

**Fix:**

**Verify `app_chat_bot.c` uses macro:**

```c
// CORRECT:
rt = tdl_button_create(BUTTON_NAME, &button_cfg, &sg_button_hdl);

// WRONG:
rt = tdl_button_create("user_button", &button_cfg, &sg_button_hdl);
```

**Check definition:**

```c
// Should be defined:
#ifndef BUTTON_NAME
#define BUTTON_NAME "user_button"
#endif
```

**Verify board registered:**
```
Look for in logs:
[ty D][tdd_button_gpio.c:206] tdd_gpio_button_register succ
```

---

### ❌ Button Press Not Detected

**Symptoms:**
- Button press → No response
- No log messages
- No wake trigger

**Fix:**

1. **Check GPIO:**
   - Verify P29 connection
   - Check if button physically works
   - Test continuity

2. **Check logs:**
```
Should see on press:
Button event: 2
🔘 Button pressed - Manual wake trigger!
```

3. **Verify event registration:**
```c
tdl_button_event_register(sg_button_hdl, 
    TDL_BUTTON_PRESS_SINGLE_CLICK, 
    __app_button_function_cb);
```

4. **Check initialization:**
```
✅ Button initialized: button1 (GPIO P29)
```

---

## Performance Issues

### ❌ Slow Response Time

**Symptoms:**
- 10+ seconds from wake to response
- Laggy audio
- Delays in processing

**Fix:**

1. **Check network:**
   - WiFi signal strength
   - Internet speed
   - Ping to cloud server

2. **Verify logs:**
```
Look for delays between:
State: LISTEN → upload start → AI response
```

3. **Optimize:**
   - Reduce ASR timeout
   - Increase audio buffer
   - Use wired network if possible

---

### ❌ Memory Issues

**Symptoms:**
```
left heap: XXXX  ← Low value (<50000)
malloc failed
```

**Fix:**

1. **Check heap:**
```
Look for:
Device Free heap XXXXX
```

2. **Increase stack:**
```c
// In tuya_main.c
THREAD_CFG_T thrd_param = {
    8192,  // Increase from 4096
    4, 
    "tuya_app_main"
};
```

3. **Disable features:**
```c
// In Kconfig
CONFIG_ENABLE_DISPLAY=n  // If not using display
```

---

## Diagnostic Commands

### Check Logs

```bash
# Real-time monitoring
tos.py monitor

# Save to file
tos.py monitor > debug.log
```

### Test Network

```bash
# From PC
ping m1-sg.iotbing.com
curl -v https://m1-sg.iotbing.com
nslookup m1-sg.iotbing.com
```

### Check Cloud Status

1. Go to: https://iot.tuya.com
2. Products → Your Product → Devices
3. Check device status: Should be "Online"
4. Check last seen timestamp

### Verify AI Agent

1. https://iot.tuya.com/cloud/ai-agent
2. Find your agent
3. Check status: "Published"
4. Check deployment: "On-device Deployment"
5. Check product binding

---

## Getting Help

### Before Asking

1. **Check logs:**
   ```bash
   tos.py monitor > full_log.txt
   ```

2. **Try basic fixes:**
   - Rebuild from clean
   - Reset device
   - Re-pair network

3. **Gather info:**
   - Firmware version
   - Board type
   - Error messages
   - Steps to reproduce

### Where to Ask

- **Forum:** https://www.tuyaos.com
- **Discord:** https://discord.com/invite/yPPShSTttG
- **GitHub Issues:** https://github.com/tuya/TuyaOpen/issues

### What to Include

```
**Problem:**
[Brief description]

**Expected:**
[What should happen]

**Actual:**
[What actually happens]

**Logs:**
[Paste relevant logs]

**Environment:**
- Board: T5AI-Core
- Firmware: v2.0.1
- Region: Singapore
- Network: WiFi 2.4GHz

**Steps to Reproduce:**
1. ...
2. ...
```

---

## Success Checklist

Use this to verify everything is working:

### Hardware
- [ ] Board powers up
- [ ] LED indicator working
- [ ] Button responds
- [ ] Speaker produces sound
- [ ] Microphone captures audio

### Network
- [ ] WiFi connects
- [ ] MQTT connects
- [ ] Shows online in app
- [ ] Can control via app

### AI System
- [ ] AI client initializes
- [ ] Session created (no "session id null")
- [ ] Wake word detection works OR button works
- [ ] Audio upload successful
- [ ] Receives AI responses
- [ ] Speaker plays responses

### End-to-End
- [ ] Can ask questions via wake word
- [ ] Can ask questions via button
- [ ] Receives accurate responses
- [ ] Response time < 10 seconds
- [ ] Audio quality good

---

**If all checked: ✅ You're good to go!**

**If issues remain: Re-check** relevant sections above or seek support.

---

**Last Updated:** 2025-12-22  
**For:** Rankify Assist v2.0.1
