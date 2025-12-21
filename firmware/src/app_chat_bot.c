/**
 * @file app_chat_bot.c
 * @brief Rankify Assist - Simplified Voice I/O for Tuya AI Workflow Architecture
 * 
 * ARCHITECTURE ALIGNMENT:
 * - Firmware: Voice I/O only (STT input, TTS output)
 * - Tuya AI Workflow (Cloud): Handles all intent, planning, execution via MCP
 * - No DP management needed - Cloud handles everything
 */
#include "tuya_cloud_types.h"
#include "tuya_cloud_com_defs.h"
#include "tuya_iot.h"
#include "ai_audio.h"
#include "app_chat_bot.h"
#include "tal_api.h"

// Reference to main client
extern tuya_iot_client_t ai_client;

// Simple state tracking
typedef enum {
    STATE_IDLE,
    STATE_LISTENING,
    STATE_PROCESSING
} bot_state_t;

static bot_state_t current_state = STATE_IDLE;

/**
 * @brief ASR/Audio Event Callback
 * 
 * This firmware only handles:
 * - Wakeup detection
 * - Voice input (STT)
 * - Voice output (TTS from cloud)
 * 
 * The Tuya AI Workflow (cloud) handles:
 * - Intent recognition
 * - Planning
 * - Safety confirmation
 * - Execution via MCP servers
 */
static void __app_ai_audio_evt_cb(AI_AUDIO_EVENT_E event, uint8_t *data, uint32_t len, void *arg)
{
    switch (event) {
    case AI_AUDIO_EVT_ASR_WAKEUP:
        PR_NOTICE("🎤 Wakeup Detected");
        current_state = STATE_LISTENING;
        break;
        
    case AI_AUDIO_EVT_HUMAN_ASR_TEXT:
        if (len > 0 && data) {
            PR_NOTICE("📝 User Said: %.*s", len, data);
            current_state = STATE_PROCESSING;
            
            // Voice goes to cloud → Tuya AI Workflow handles everything
            // No DP updates needed - cloud manages execution via MCP
        }
        break;
    
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_DATA:
        // Cloud sends TTS response (already processed by Tuya AI Workflow)
        if (len > 0 && data) {
            PR_NOTICE("🔊 AI Response (TTS): %.*s", len, data);
        }
        current_state = STATE_IDLE;
        break;
        
    case AI_AUDIO_EVT_AI_REPLIES_FINISH:
        PR_NOTICE("✅ AI Response Complete");
        current_state = STATE_IDLE;
        break;
        
    default:
        break;
    }
}

/**
 * @brief Initialize Chat Bot (Voice Interface Only)
 */
OPERATE_RET app_chat_bot_init(void)
{
    AI_AUDIO_CONFIG_T ai_cfg = {0};
    
    // Free-talk mode with wake word
    ai_cfg.work_mode = AI_AUDIO_WORK_ASR_WAKEUP_FREE_TALK; 
    ai_cfg.evt_inform_cb = __app_ai_audio_evt_cb;
    
    // Init Audio Engine
    if (OPRT_OK != ai_audio_init(&ai_cfg)) {
        PR_ERR("❌ Audio Init Failed");
        return OPRT_COM_ERROR;
    }
    
    // Start listening
    ai_audio_set_open(true);
    
    PR_NOTICE("✅ Rankify Assist Voice Interface Ready");
    PR_NOTICE("   Architecture: Tuya AI Workflow + MCP Servers");
    PR_NOTICE("   Firmware Role: Voice I/O Only");
    
    // Startup greeting - say "Hi" to user
    // Small delay to ensure audio is fully initialized
    tal_system_sleep(1000);
    
    // Play startup greeting
    // Note: If TTS API is available, use it. Otherwise this is a placeholder.
    // The actual TTS will come from cloud, but we log it here.
    PR_NOTICE("🔊 Startup Greeting: Hi! I'm ready.");
    
    // If platform supports local TTS trigger via AL_audio APIs:
    // ai_audio_tts_play("Hi! I'm ready.");
    
    return OPRT_OK;
}

/**
 * @brief Get bot enable status
 */
uint8_t app_chat_bot_get_enable(void) {
    return 1;
}
