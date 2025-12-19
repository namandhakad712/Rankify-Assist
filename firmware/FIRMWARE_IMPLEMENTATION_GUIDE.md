# Firmware Implementation Guide
## AI Agent API Integration for T5-E1

> **Note:** Full firmware code requires T5-AI hardware to test. This guide provides the implementation pattern for when your board arrives.

---

## Overview

The firmware needs to:
1. Capture voice → Send to Tuya Cloud STT
2. Get text result
3. **Call Tuya AI Agent API** with text
4. Parse AI's JSON response
5. Update DPs 102, 106 based on response
6. Handle safety confirmation flow (DP 103, 104)

---

## Required APIs

### 1. AI Agent Chat API

**Endpoint:** `POST /v2.0/cloud/ai-agent/chat`

**Headers:**
```c
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "agent_id": "aipt_f6hcebhd23nk",
  "user_input": "Check my Gmail",
  "session_id": "{device_id}",
  "stream": false
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "response": "{\"intent\":\"browser\",\"plan\":\"Open Gmail\",\"command\":\"open gmail.com\",\"needs_confirmation\":true,\"tts_confirm\":\"I plan to open Gmail. Proceed?\"}"
  }
}
```

---

## Implementation Pattern

### Add to `firmware/src/app_chat_bot.c`:

```c
#include "cJSON.h"
#include "tuya_cloud_com_defs.h"

// State machine for safety check
typedef enum {
    STATE_IDLE,
    STATE_LISTENING,
    STATE_WAITING_AI_RESPONSE,
    STATE_ASKING_CONFIRMATION,
    STATE_WAITING_USER_CONFIRM,
    STATE_EXECUTING,
    STATE_SPEAKING_RESULT
} bot_state_t;

static bot_state_t current_state = STATE_IDLE;
static char ai_response_buffer[1024];
static char confirmation_text[256];

/**
 * Call AI Agent API after getting voice text from STT
 */
OPERATE_RET call_ai_agent(const char* user_text) {
    OPERATE_RET ret = OPRT_OK;
    
    // Build API request
    char request_body[512];
    snprintf(request_body, sizeof(request_body),
        "{\"agent_id\":\"aipt_f6hcebhd23nk\","
        "\"user_input\":\"%s\","
        "\"session_id\":\"%s\","
        "\"stream\":false}",
        user_text,
        get_device_id()
    );
    
    // Make HTTP POST to /v2.0/cloud/ai-agent/chat
    http_response_t response;
    ret = tuya_cloud_api_post("/v2.0/cloud/ai-agent/chat", request_body, &response);
    
    if (ret == OPRT_OK) {
        // Parse response
        cJSON* root = cJSON_Parse(response.body);
        cJSON* result = cJSON_GetObjectItem(root, "result");
        cJSON* ai_response = cJSON_GetObjectItem(result, "response");
        
        if (ai_response) {
            strncpy(ai_response_buffer, ai_response->valuestring, sizeof(ai_response_buffer));
            process_ai_response();
        }
        
        cJSON_Delete(root);
    }
    
    return ret;
}

/**
 * Process AI's JSON response and update DPs
 */
void process_ai_response() {
    cJSON* root = cJSON_Parse(ai_response_buffer);
    
    const char* intent = cJSON_GetObjectItem(root, "intent")->valuestring;
    const char* plan = cJSON_GetObjectItem(root, "plan")->valuestring;
    bool needs_confirm = cJSON_GetObjectItem(root, "needs_confirmation")->valueint;
    const char* tts_text = cJSON_GetObjectItem(root, "tts_confirm")->valuestring;
    
    // Update DP 101 (intent_type)
    tuya_iot_dp_string_update(101, intent);
    
    // Update DP 102 (action_plan) - full JSON
    tuya_iot_dp_string_update(102, ai_response_buffer);
    
    if (needs_confirm) {
        // Update DP 106 (tts_text)
        tuya_iot_dp_string_update(106, tts_text);
        
        // Play TTS confirmation question
        ai_audio_tts_play(tts_text);
        
        current_state = STATE_ASKING_CONFIRMATION;
    } else {
        // Chat response - play directly
        ai_audio_tts_play(tts_text);
        current_state = STATE_SPEAKING_RESULT;
    }
    
    cJSON_Delete(root);
}

/**
 * Handle user's voice confirmation (Yes/No)
 * Called after TTS plays confirmation question
 */
void handle_confirmation_response(const char* user_text) {
    // Simple yes/no detection
    bool confirmed = (
        strstr(user_text, "yes") != NULL ||
        strstr(user_text, "go") != NULL ||
        strstr(user_text, "proceed") != NULL ||
        strstr(user_text, "okay") != NULL
    );
    
    // Update DP 103 (user_confirmation)
    tuya_iot_dp_bool_update(103, confirmed);
    
    if (confirmed) {
        // Parse DP 102 to get command
        cJSON* root = cJSON_Parse(ai_response_buffer);
        const char* command = cJSON_GetObjectItem(root, "command")->valuestring;
        
        // Create execution command JSON for DP 104
        char exec_cmd[512];
        snprintf(exec_cmd, sizeof(exec_cmd),
            "{\"intent\":\"%s\",\"command\":\"%s\"}",
            cJSON_GetObjectItem(root, "intent")->valuestring,
            command
        );
        
        // Update DP 104 (exec_command)
        tuya_iot_dp_string_update(104, exec_cmd);
        
        cJSON_Delete(root);
        
        current_state = STATE_EXECUTING;
        
        // For IoT commands, execute here
        // For browser commands, extension will poll DP 104
        
    } else {
        ai_audio_tts_play("Cancelled. What would you like me to do instead?");
        current_state = STATE_IDLE;
    }
}

/**
 * DP callback - handle DP 105 (exec_result) updates from extension
 */
void dp_105_callback(const char* result_text) {
    // Extension reported result, speak it to user
    ai_audio_tts_play(result_text);
    current_state = STATE_IDLE;
}
```

---

## Integration into Main Loop

### Update `firmware/src/tuya_main.c`:

```c
// In ASR complete callback
void on_asr_complete(const char* recognized_text) {
    PR_NOTICE("ASR Result: %s", recognized_text);
    
    if (current_state == STATE_LISTENING) {
        // User's initial command
        current_state = STATE_WAITING_AI_RESPONSE;
        call_ai_agent(recognized_text);
        
    } else if (current_state == STATE_WAITING_USER_CONFIRM) {
        // User's Yes/No response
        handle_confirmation_response(recognized_text);
    }
}

// In DP callback handler
void dev_dp_cb(tuya_iot_client_t *client, tuya_dp_cmd_t *dp_cmd) {
    if (dp_cmd->dp_id == 105) {
        // DP 105: exec_result from extension
        dp_105_callback(dp_cmd->value.dp_str);
    }
}
```

---

## When Board Arrives - Build & Flash

```powershell
# 1. Copy firmware to build location
xcopy /E /I /Y c:\TUYA\RankifyAssist\firmware c:\TUYA\TuyaOpen\apps\tuya.ai\rankify_assist

# 2. Update tuya_config.h with UUID/AuthKey

# 3. Build
cd c:\TUYA\TuyaOpen
python build_app.py apps/tuya.ai/rankify_assist rankify_assist:1.0.0

# 4. Flash using Tuya Wind IDE
# Output: output/rankify_assist_1.0.0/rankify_assist_QIO.bin
```

---

## Testing Flow

**Once board is flashed and paired:**

1. Say: "Check my Gmail"
2. Board → STT → "Check my Gmail"
3. Firmware calls AI Agent API
4. AI responds with JSON:
   ```json
   {
     "intent": "browser",
     "plan": "Open Gmail",
     "command": "open gmail.com and count unread",
     "needs_confirmation": true,
     "tts_confirm": "I plan to open Gmail. Proceed?"
   }
   ```
5. Firmware updates DP 102, 106
6. Board plays: "I plan to open Gmail. Proceed?"
7. You say: "Yes"
8. Firmware updates DP 103 = true
9. Firmware updates DP 104 with command
10. Extension polls DP 104 → Opens Gmail
11. Extension reports to DP 105
12. Firmware receives DP 105 → Speaks result

---

## Summary

**✅ Extension: Ready** - Polls DP 104, executes browser tasks, reports to DP 105

**⏳ Firmware: Needs implementation** - This guide provides the pattern. When board arrives, implement API calls and state machine.

**📋 Platform: Complete** - All DPs defined, AI Agent deployed
