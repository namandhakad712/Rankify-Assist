/**
 * @file app_chat_bot.c
 * @brief Audio I/O module for Rankify Assist
 * 
 * RESPONSIBILITIES:
 * - Initialize ai_audio component
 * - Handle ASR events (wake word, speech recognition)
 * - Handle AI response events
 * - Play audio alerts
 * - Manage audio state
 */

#include "tuya_cloud_types.h"
#include "tuya_iot.h"
#include "ai_audio.h"
#include "ai_audio_player.h"
#include "app_chat_bot.h"
#include "tal_api.h"
#include "media_src_en.h"

#if defined(ENABLE_BUTTON) && (ENABLE_BUTTON == 1)
#include "tdl_button_manage.h"

// Define button name if not already defined by build system
#ifndef BUTTON_NAME
#define BUTTON_NAME "user_button"
#endif

#endif

/* External reference to main client */
extern tuya_iot_client_t ai_client;

#if defined(ENABLE_BUTTON) && (ENABLE_BUTTON == 1)
static TDL_BUTTON_HANDLE sg_button_hdl = NULL;
#endif

/**
 * @brief Audio event callback
 */
static void __app_ai_audio_evt_cb(AI_AUDIO_EVENT_E event, uint8_t *data, uint32_t len, void *arg)
{
    switch (event) {
    case AI_AUDIO_EVT_ASR_WAKEUP:
        PR_NOTICE("🎤 Wakeup Detected");
        ai_audio_player_stop();
        ai_audio_player_play_alert(AI_AUDIO_ALERT_WAKEUP);
        break;
        
    case AI_AUDIO_EVT_HUMAN_ASR_TEXT:
        if (len > 0 && data) {
            PR_NOTICE("📝 User Said: %.*s", len, data);
        }
        break;
    
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_DATA:
        if (len > 0 && data) {
            PR_DEBUG("🤖 AI Response: %.*s", len, data);
        }
        break;
    
    default:
        break;
    }
}

/**
 * @brief Audio state callback
 */
static void __app_ai_audio_state_inform_cb(AI_AUDIO_STATE_E state)
{
    PR_DEBUG("ai audio state: %d", state);
    
    switch (state) {
    case AI_AUDIO_STATE_STANDBY:
        PR_NOTICE("State: STANDBY (Ready)");
        break;
    case AI_AUDIO_STATE_LISTEN:
        PR_NOTICE("State: LISTEN (Capturing)");
        break;
    case AI_AUDIO_STATE_UPLOAD:
        PR_NOTICE("State: UPLOAD (Sending to Cloud)");
        break;
    case AI_AUDIO_STATE_AI_SPEAK:
        PR_NOTICE("State: AI_SPEAK (Playing)");
        break;
    default:
        break;
    }
}

#if defined(ENABLE_BUTTON) && (ENABLE_BUTTON == 1)
/**
 * @brief Button event callback
 */
static void __app_button_function_cb(char *name, TDL_BUTTON_TOUCH_EVENT_E event, void *arg)
{
    PR_DEBUG("Button event: %d", event);
    
    switch (event) {
    case TDL_BUTTON_PRESS_SINGLE_CLICK:
        PR_NOTICE("🔘 Button pressed - Manual wake trigger!");
        
        // CRITICAL: Trigger wakeup FIRST, then the audio system handles the alert
        // The wakeup function will internally stop playback and play the alert
        ai_audio_set_wakeup();
        
        PR_NOTICE("   Waiting for your command...");
        break;
        
    default:
        break;
    }
}

/**
 * @brief Initialize button
 */
static OPERATE_RET __app_open_button(void)
{
    OPERATE_RET rt = OPRT_OK;
    
    TDL_BUTTON_CFG_T button_cfg = {
        .long_start_valid_time = 3000,
        .long_keep_timer = 1000,
        .button_debounce_time = 50,
        .button_repeat_valid_count = 2,
        .button_repeat_valid_time = 500
    };
    
    // Use BUTTON_NAME macro to match board-level registration
    rt = tdl_button_create(BUTTON_NAME, &button_cfg, &sg_button_hdl);
    if (rt != OPRT_OK) {
        PR_ERR("Failed to create button: %d", rt);
        return rt;
    }
    
    // Register button events
    tdl_button_event_register(sg_button_hdl, TDL_BUTTON_PRESS_SINGLE_CLICK, __app_button_function_cb);
    
    PR_NOTICE("✅ Button initialized: %s (GPIO P29)", BUTTON_NAME);
    PR_NOTICE("   Single click = Manual wake trigger");
    
    return rt;
}
#endif // ENABLE_BUTTON

/**
 * @brief Initialize audio module
 */
OPERATE_RET app_chat_bot_init(void)
{
    OPERATE_RET rt = OPRT_OK;
    AI_AUDIO_CONFIG_T ai_cfg = {0};
    
    /* Configure audio mode */
    ai_cfg.work_mode = AI_AUDIO_WORK_ASR_WAKEUP_FREE_TALK;
    ai_cfg.evt_inform_cb = __app_ai_audio_evt_cb;
    ai_cfg.state_inform_cb = __app_ai_audio_state_inform_cb;
    
    /* Initialize audio engine */
    rt = ai_audio_init(&ai_cfg);
    if (rt != OPRT_OK) {
        PR_ERR("❌ ai_audio_init failed: %d", rt);
        return rt;
    }
    
    PR_NOTICE("✅ AI audio engine initialized");
    
#if defined(ENABLE_BUTTON) && (ENABLE_BUTTON == 1)
    /* Initialize button */
    rt = __app_open_button();
    if (rt != OPRT_OK) {
        PR_WARN("⚠️  button init failed: %d (continuing anyway)", rt);
        // Don't return error - button is optional
    }
#endif
    
    /* CRITICAL: Enable audio module (disabled by default per docs) */
    PR_NOTICE("🎤 Enabling audio module...");
    rt = ai_audio_set_open(true);
    if (rt != OPRT_OK) {
        PR_ERR("❌ ai_audio_set_open failed: %d", rt);
        return rt;
    }
    
    /* Set default microphone volume to 80% (recommended working value) */
    PR_NOTICE("🔊 Setting microphone volume to 80%%...");
    rt = ai_audio_set_volume(80);
    if (rt != OPRT_OK) {
        PR_WARN("⚠️  ai_audio_set_volume failed: %d (continuing anyway)", rt);
    }
    
    /* Give microphone time to initialize and start capturing */
    tal_system_sleep(500);
    
    PR_NOTICE("✅ Rankify Assist Voice Interface Ready");
    PR_NOTICE("   Wake word: 'Hi Tuya' or 'Ni Hao Tuya'");
    PR_NOTICE("   OR press User Button (P29) for manual wake");
    PR_NOTICE("   Microphone volume: 80%%");
    
    return OPRT_OK;
}

/**
 * @brief Get audio enable status
 */
uint8_t app_chat_bot_get_enable(void)
{
    return 1;
}

/**
 * @brief Play audio alert
 */
OPERATE_RET ai_audio_player_play_alert(AI_AUDIO_ALERT_TYPE_E type)
{
    OPERATE_RET rt = OPRT_OK;
    char alert_id[64] = {0};
    
    snprintf(alert_id, sizeof(alert_id), "alert_%d", type);
    
    rt = ai_audio_player_start(alert_id);
    if (rt != OPRT_OK) {
        PR_ERR("ai_audio_player_start failed: %d", rt);
        return rt;
    }
    
    switch (type) {
    case AI_AUDIO_ALERT_POWER_ON:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_prologue_en, 
                                        sizeof(media_src_prologue_en), 1);
        break;
        
    case AI_AUDIO_ALERT_NOT_ACTIVE:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_network_conn_en,
                                        sizeof(media_src_network_conn_en), 1);
        break;
        
    case AI_AUDIO_ALERT_NETWORK_CFG:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_network_config_en,
                                        sizeof(media_src_network_config_en), 1);
        break;
        
    case AI_AUDIO_ALERT_NETWORK_CONNECTED:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_network_conn_success_en,
                                        sizeof(media_src_network_conn_success_en), 1);
        break;
        
    case AI_AUDIO_ALERT_NETWORK_FAIL:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_network_conn_failed_en,
                                        sizeof(media_src_network_conn_failed_en), 1);
        break;
        
    case AI_AUDIO_ALERT_NETWORK_DISCONNECT:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_network_reconfigure_en,
                                        sizeof(media_src_network_reconfigure_en), 1);
        break;
        
    case AI_AUDIO_ALERT_BATTERY_LOW:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_low_battery_en, 
                                        sizeof(media_src_low_battery_en), 1);
        break;
        
    case AI_AUDIO_ALERT_PLEASE_AGAIN:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_please_again_en,
                                        sizeof(media_src_please_again_en), 1);
        break;
        
    case AI_AUDIO_ALERT_WAKEUP:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_ai_en, 
                                        sizeof(media_src_ai_en), 1);
        break;
        
    case AI_AUDIO_ALERT_LONG_KEY_TALK:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_long_press_en,
                                        sizeof(media_src_long_press_en), 1);
        break;
        
    case AI_AUDIO_ALERT_KEY_TALK:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_press_talk_en, 
                                        sizeof(media_src_press_talk_en), 1);
        break;
        
    case AI_AUDIO_ALERT_WAKEUP_TALK:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_wakeup_chat_en, 
                                        sizeof(media_src_wakeup_chat_en), 1);
        break;
        
    case AI_AUDIO_ALERT_FREE_TALK:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_free_chat_en, 
                                        sizeof(media_src_free_chat_en), 1);
        break;
        
    default:
        PR_WARN("Unknown alert type: %d", type);
        break;
    }
    
    if (rt != OPRT_OK) {
        PR_ERR("ai_audio_player_data_write failed: %d", rt);
    }
    
    return rt;
}
