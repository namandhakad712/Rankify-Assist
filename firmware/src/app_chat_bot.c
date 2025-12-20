/**
 * @file app_chat_bot.c
 * @brief Rankify Assist Logic - AI Agent Integration & Safety Check
 */
#include "tuya_cloud_types.h"
#include "tuya_cloud_com_defs.h"
#include "tuya_iot.h"
#include "tuya_iot_dp.h"  // Required for tuya_iot_dp_obj_report
#include "cJSON.h"
#include "ai_audio.h"
#include "app_chat_bot.h"
#include "tal_api.h"
#include "netmgr.h"

// Reference to main client
extern tuya_iot_client_t ai_client;

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
    
    tuya_iot_client_t *client = tuya_iot_client_get();
    if (!client) {
        PR_ERR("IoT client not initialized");
        return;
    }
    
    // Create DP object (official API pattern)
    dp_obj_t dp_obj = {0};
    dp_obj.id = dp_id;
    dp_obj.type = PROP_STR;
    dp_obj.value.dp_str = (char*)value;
    
    PR_NOTICE("Reporting DP %d: %s", dp_id, value);
    
    // Use official DP reporting API
    tuya_iot_dp_obj_report(client, client->activate.devid, &dp_obj, 1, 0);
}

/* --- Parse AI Response and Handle Flow --- */
void process_ai_response(const char* json_str) {
    PR_NOTICE("AI Response: %s", json_str);
    
    cJSON *root = cJSON_Parse(json_str);
    if (!root) return;

    // Extract fields
    cJSON *intent_item = cJSON_GetObjectItem(root, "intent");
    // cJSON *plan_item = cJSON_GetObjectItem(root, "plan");
    cJSON *confirm_item = cJSON_GetObjectItem(root, "needs_confirmation");
    cJSON *tts_item = cJSON_GetObjectItem(root, "tts_confirm");
    cJSON *cmd_item = cJSON_GetObjectItem(root, "command");

    if (intent_item && intent_item->valuestring) {
        // Report intent to Cloud (DP 101)
        update_dp_string(DP_ID_INTENT_TYPE, intent_item->valuestring);
    }

    if (tts_item && tts_item->valuestring) {
        // Mock TTS for now (Platform specific)
        PR_NOTICE("TTS SPEAK: %s", tts_item->valuestring);
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

    cJSON_Delete(root);
}

/* --- Callback: User Spoke (ASR) --- */
static void __app_ai_audio_evt_cb(AI_AUDIO_EVENT_E event, uint8_t *data, uint32_t len, void *arg)
{
    switch (event) {
    case AI_AUDIO_EVT_HUMAN_ASR_TEXT: {
        if (len > 0 && data) {
            PR_NOTICE("ASR: %.*s", len, data);
            
            if (current_state == STATE_WAITING_USER_CONFIRM) {
                // Check for Yes/No (Simple strict check)
                if (strstr((char*)data, "yes") || strstr((char*)data, "Yes") || strstr((char*)data, "proceed")) {
                    PR_NOTICE("User Confirmed!");
                    PR_NOTICE("TTS: Executing...");
                    
                    // CRITICAL: Send Command to Extension (DP 104)
                    update_dp_string(DP_ID_EXEC_COMMAND, pending_command_json);
                    current_state = STATE_EXECUTING;
                } else {
                    PR_NOTICE("User Cancelled.");
                    PR_NOTICE("TTS: Cancelled.");
                    current_state = STATE_IDLE;
                }
            } else {
                PR_NOTICE("Processing new command...");
                current_state = STATE_WAITING_AI;
            }
        }
    } break;
    
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_DATA: {
        PR_NOTICE("AI Data: %.*s", len, data);
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
    if (OPRT_OK != ai_audio_init(&ai_cfg)) {
        PR_ERR("Audio Init Failed");
        return OPRT_COM_ERROR;
    }
    ai_audio_set_open(true); // Start listening
    
    PR_NOTICE("Rankify Assist Initialized.");
    return OPRT_OK;
}

uint8_t app_chat_bot_get_enable(void) {
    return 1;
}
