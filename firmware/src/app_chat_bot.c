/**
 * @file app_chat_bot.c
 * @brief Rankify Assist Logic - AI Agent Integration & Safety Check
 */
#include "tuya_cloud_types.h"
#include "tuya_cloud_com_defs.h"
#include "tuya_iot_dp_api.h"
#include "cJSON.h"
#include "ai_audio.h"
#include "app_chat_bot.h"
#include "tal_api.h"
#include "netmgr.h"

// DP IDs matching Platform Config
#define DP_ID_INTENT_TYPE      101
#define DP_ID_ACTION_PLAN      102
#define DP_ID_USER_CONFIRM     103
#define DP_ID_EXEC_COMMAND     104
#define DP_ID_EXEC_RESULT      105
#define DP_ID_TTS_TEXT         106

// Internal State Machine
typedef enum {
    STATE_IDLE,
    STATE_LISTENING,
    STATE_WAITING_AI,
    STATE_ASKING_CONFIRM,
    STATE_WAITING_USER_CONFIRM,
    STATE_EXECUTING
} rankify_state_t;

static rankify_state_t current_state = STATE_IDLE;
static char pending_command_json[512] = {0};

/* --- Helper: Update DP String --- */
void update_dp_string(int dp_id, const char* value) {
    if (value == NULL) return;
    
    ty_cJSON *root = ty_cJSON_CreateObject();
    ty_cJSON_AddStringToObject(root, "104", value); // NOTE: Key is ignored by some APIs but struct needed
    
    // Create DP object
    TY_OBJ_DP_S dp_data;
    dp_data.dpid = dp_id;
    dp_data.type = PROP_STR;
    dp_data.value.dp_str = (char*)value;
    dp_data.time_stamp = 0;

    // Send to Cloud
    // Note: Simplification using direct report API if available, 
    // or standard dev_report_dp_json_async
    dev_report_dp_json_async(NULL, root); 
    ty_cJSON_Delete(root);
}

/* --- Parse AI Response and Handle Flow --- */
void process_ai_response(const char* json_str) {
    PR_NOTICE("AI Response: %s", json_str);
    
    ty_cJSON *root = ty_cJSON_Parse(json_str);
    if (!root) return;

    // Extract fields
    ty_cJSON *intent_item = ty_cJSON_GetObjectItem(root, "intent");
    ty_cJSON *plan_item = ty_cJSON_GetObjectItem(root, "plan");
    ty_cJSON *confirm_item = ty_cJSON_GetObjectItem(root, "needs_confirmation");
    ty_cJSON *tts_item = ty_cJSON_GetObjectItem(root, "tts_confirm");
    ty_cJSON *cmd_item = ty_cJSON_GetObjectItem(root, "command");

    if (intent_item && intent_item->valuestring) {
        // Report intent to Cloud (DP 101)
        // update_dp_string(DP_ID_INTENT_TYPE, intent_item->valuestring);
    }

    if (tts_item && tts_item->valuestring) {
        // Speak the confirmation question
        ai_audio_tts_play(tts_item->valuestring);
    }
    
    bool needs_confirm = false;
    if (confirm_item) {
        needs_confirm = (confirm_item->type == cJSON_True);
    }

    if (needs_confirm) {
        current_state = STATE_WAITING_USER_CONFIRM;
        
        // Save command for later execution
        if (cmd_item && cmd_item->valuestring) {
            snprintf(pending_command_json, sizeof(pending_command_json), 
                "{\"intent\":\"%s\",\"command\":\"%s\"}", 
                intent_item ? intent_item->valuestring : "unknown",
                cmd_item->valuestring);
        }
    } else {
        // Execute immediately (e.g. Chat)
        current_state = STATE_IDLE;
    }

    ty_cJSON_Delete(root);
}

/* --- Callback: User Spoke (ASR) --- */
static void __app_ai_audio_evt_cb(AI_AUDIO_EVENT_E event, uint8_t *data, uint32_t len, void *arg)
{
    switch (event) {
    case AI_AUDIO_EVT_HUMAN_ASR_TEXT: {
        if (len > 0 && data) {
            PR_NOTICE("ASR: %.*s", len, data);
            
            if (current_state == STATE_WAITING_USER_CONFIRM) {
                // Check for Yes/No
                if (strcasestr((char*)data, "yes") || strcasestr((char*)data, "proceed") || strcasestr((char*)data, "okay")) {
                    PR_NOTICE("User Confirmed!");
                    ai_audio_tts_play("Executing.");
                    
                    // CRITICAL: Send Command to Extension (DP 104)
                    update_dp_string(DP_ID_EXEC_COMMAND, pending_command_json);
                    current_state = STATE_EXECUTING;
                } else {
                    PR_NOTICE("User Cancelled.");
                    ai_audio_tts_play("Cancelled.");
                    current_state = STATE_IDLE;
                }
            } else {
                // New Command -> Send to AI Agent
                // Note: The Tuya SDK automatically sends audio to cloud if connected to AI agent.
                // We just monitor the state here.
                current_state = STATE_WAITING_AI;
            }
        }
    } break;
    
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_DATA: {
        // AI Agent response (JSON) comes here as text
        PR_NOTICE("AI Data: %.*s", len, data);
        // We accumulate this and parse it in full buffer usually, 
        // simplified here to pass to processor
        process_ai_response((char*)data);
    } break;

    case AI_AUDIO_EVT_ASR_WAKEUP:
        PR_NOTICE("Wakeup!");
        current_state = STATE_LISTENING;
        break;
        
    default:
        break;
    }
}

/* --- Initialization --- */
OPERATE_RET app_chat_bot_init(void)
{
    AI_AUDIO_CONFIG_T ai_cfg = {0};
    ai_cfg.work_mode = AI_AUDIO_WORK_ASR_WAKEUP_FREE_TALK; 
    ai_cfg.evt_inform_cb = __app_ai_audio_evt_cb;
    
    // Init Audio
    TUYA_CALL_ERR_RETURN(ai_audio_init(&ai_cfg));
    ai_audio_set_open(true); // Start listening
    
    PR_NOTICE("Rankify Assist Initialized.");
    return OPRT_OK;
}

uint8_t app_chat_bot_get_enable(void) {
    return 1;
}
