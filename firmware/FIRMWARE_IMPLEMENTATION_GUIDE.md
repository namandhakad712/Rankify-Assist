# Firmware Implementation Guide - Tuya AI Workflow Architecture

## Overview

**Rankify Assist** uses the **Tuya AI Workflow** architecture where the cloud handles all intelligence, planning, and execution coordination.

### Architecture Components

```
┌─────────────┐
│   Device    │ ← Voice I/O Only
│  (Firmware) │
└──────┬──────┘
       │ STT/TTS
       ↓
┌─────────────┐
│  Tuya AI    │ ← Intent, Planning, Confirmation
│  Workflow   │
│   (Cloud)   │
└──────┬──────┘
       │ MCP Protocol
       ↓
┌─────────────┐
│ MCP Servers │ ← Task Execution
│ (Browser/   │
│  Devices)   │
└─────────────┘
```

---

## Firmware Responsibilities

The **firmware does NOT handle**:
- ❌ Intent classification
- ❌ Action planning
- ❌ Safety confirmations
- ❌ Command execution
- ❌ DP management (101-106)

The **firmware ONLY handles**:
- ✅ Voice input (microphone → STT)
- ✅ Voice output (TTS → speaker)
- ✅ Basic device status reporting
- ✅ Hardware controls (reset button)

---

## Implementation

### Voice I/O Flow

**file:** `firmware/src/app_chat_bot.c`

```c
/**
 * User speaks → STT → Tuya AI Workflow (cloud)
 * Cloud processes → MCP execution → TTS response → Device speaks
 */
static void __app_ai_audio_evt_cb(AI_AUDIO_EVENT_E event, ...) {
    switch (event) {
    case AI_AUDIO_EVT_ASR_WAKEUP:
        // Wake word detected
        PR_NOTICE("Listening...");
        break;
        
    case AI_AUDIO_EVT_HUMAN_ASR_TEXT:
        // Voice → cloud (automatic)
        // Cloud AI Workflow handles everything from here
        break;
    
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_DATA:
        // Cloud → TTS response (automatic playback)
        break;
    }
}
```

---

## Hardware Controls

### User Button (P29) Functionality

The hardware button connected to GPIO P29 is configured for **EMERGENCY RESET & RE-PAIRING**.

- **Action:** Single Press (Short Click)
- **Behavior:**
  1. **Stops AI Audio** immediately.
  2. **Deletes Network Configuration** (`netinfo`) from persistent storage.
  3. **Wipes Tuya IoT Data** (Unbinds device).
  4. **Forces System Reboot**.
- **Result:** Device reboots into a clean state and automatically enters **Pairing Mode (AP + BLE)** because no network info exists.

> **Use this if:**
> - The device is stuck connecting to an old WiFi.
> - You need to re-pair with a new account.
> - The device is unresponsive.

**Implementation:** `firmware/src/tuya_main.c`

```c
// Button polling detects P29 press
if (level == TUYA_GPIO_LEVEL_LOW) {
    // Nuke config and reset
    tal_kv_del("netinfo");
    tuya_iot_reset(&ai_client);
    tal_system_reset();
}
```

---

## Cloud AI Workflow Integration

The **Tuya AI Workflow** (cloud-side) handles:

### 1. Speech-to-Text (Automatic)
Device audio → Cloud STT service

### 2. Intent Recognition
```yaml
Intent Types:
  0: browser    # Web automation tasks
  1: iot        # Smart device control
  2: chat       # General conversation
```

### 3. Planning & Execution

**For Browser Tasks (Intent: 0):**
```
Cloud AI Workflow 
  → Browser Planner LLM
  → Safety Confirmation (if needed)
  → MCP Browser Server (via Vercel)
  → Chrome Extension polls Vercel
  → Executes browser automation
  → Reports result back to cloud
  → Cloud sends TTS response to device
```

**For IoT Tasks (Intent: 1):**
```
Cloud AI Workflow
  → MCP Device Server  
  → Tuya OpenAPI
  → Control smart devices
  → Cloud sends TTS response
```

**For Chat (Intent: 2):**
```
Cloud AI Workflow
  → Chat LLM
  → Cloud sends TTS response directly
```

---

## Testing Flow

### Example: "Check my Gmail"

1. **User:** "Check my Gmail" (speaks to device)
2. **Firmware:** Captures audio → Sends to cloud (automatic)
3. **Cloud AI Workflow:**
   - STT: "Check my Gmail"
   - Intent: 0 (browser)
   - Browser Planner: "Open Gmail and count unread emails"
   - Safety Check: "I plan to open Gmail. Proceed?"
4. **Firmware:** Plays TTS: "I plan to open Gmail. Proceed?"
5. **User:** "Yes"
6. **Cloud AI Workflow:**
   - Confirms intent
   - Calls MCP Browser Server via Vercel API
7. **Chrome Extension:**
   - Polls Vercel every 3s
   - Receives command
   - Opens Gmail, counts emails
   - Reports result to Vercel
8. **Cloud AI Workflow:** Receives result
9. **Firmware:** Plays TTS: "You have 5 unread emails"

---

## Platform DPs (Reference Only)

These DPs exist on the platform but **are NOT managed by firmware**:

| DP ID | Name | Purpose | Managed By |
|-------|------|---------|------------|
| 1 | switch_charge | Charging control | Platform |
| 2 | status | Device status | Firmware (basic) |
| 6 | volume_set | Volume control | Firmware |
| 9 | conversational_mode | Talk mode | Platform |
| 101-106 | AI DPs | Intent/Execution | **Cloud AI Workflow** |

> **Note:** DPs 101-106 were designed for a different architecture. In the current Tuya AI Workflow architecture, these are handled entirely by the cloud and MCP servers.

---

## Summary

**✅ Firmware: Simple Voice I/O**
- Captures voice → Sends to cloud
- Receives TTS → Plays to user

**✅ Cloud: All Intelligence**
- Tuya AI Workflow handles intent, planning, safety
- Executes via MCP servers (browser/devices)

**✅ MCP Servers: Task Execution**
- Browser MCP → Chrome Extension → Vercel/Supabase
- Device MCP → Tuya OpenAPI → Smart Devices

**Architecture Benefit:** Clean separation of concerns. Firmware stays simple and reliable while cloud provides unlimited extensibility.
