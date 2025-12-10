/**
 * @file app_chat_bot.c
 * @brief Nano-Voice Controller Logic
 */
#include "netmgr.h"
#include "tkl_wifi.h"
#include "tkl_gpio.h"
#include "tkl_memory.h"
#include "tal_api.h"
#include "tuya_ringbuf.h"
#include "ai_audio.h"
#include "app_chat_bot.h"
#include "media_src_zh.h"

// Basic AI Audio Config
#define AI_AUDIO_TEXT_BUFF_LEN (1024)

/* Simple Wakeup Mode: Say wake word, then talk freely */
static void __app_ai_audio_evt_inform_cb(AI_AUDIO_EVENT_E event, uint8_t *data, uint32_t len, void *arg)
{
    switch (event) {
    case AI_AUDIO_EVT_HUMAN_ASR_TEXT: {
        if (len > 0 && data) {
            PR_NOTICE("USER: %.*s", (int)len, data);
        }
    } break;
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_START: {
        PR_NOTICE("AI: Response Start");
    } break;
    case AI_AUDIO_EVT_AI_REPLIES_TEXT_DATA: {
        PR_NOTICE("AI: %.*s", len, data);
    } break;
    case AI_AUDIO_EVT_ASR_WAKEUP: {
        ai_audio_player_stop();
        ai_audio_player_play_alert(AI_AUDIO_ALERT_WAKEUP);
        PR_NOTICE("Wakeup Detected!");
    } break;
    default:
        break;
    }
}

static void __app_ai_audio_state_inform_cb(AI_AUDIO_STATE_E state)
{
    PR_DEBUG("Audio State: %d", state);
    switch (state) {
        case AI_AUDIO_STATE_LISTEN:
            PR_NOTICE("State: LISTENING");
            break;
        case AI_AUDIO_STATE_AI_SPEAK:
            PR_NOTICE("State: SPEAKING");
            break;
        default:
            break;
    }
}

OPERATE_RET app_chat_bot_init(void)
{
    AI_AUDIO_CONFIG_T ai_audio_cfg;

    // Use Wakeup Free Talk Mode (Standard Smart Speaker behavior)
    ai_audio_cfg.work_mode = AI_AUDIO_WORK_ASR_WAKEUP_FREE_TALK;
    ai_audio_cfg.evt_inform_cb = __app_ai_audio_evt_inform_cb;
    ai_audio_cfg.state_inform_cb = __app_ai_audio_state_inform_cb;

    TUYA_CALL_ERR_RETURN(ai_audio_init(&ai_audio_cfg));
    ai_audio_set_open(true);

    return OPRT_OK;
}

OPERATE_RET ai_audio_player_play_alert(AI_AUDIO_ALERT_TYPE_E type)
{
    OPERATE_RET rt = OPRT_OK;
    char alert_id[64] = {0};
    snprintf(alert_id, sizeof(alert_id), "alert_%d", type);
    rt = ai_audio_player_start(alert_id);

    // Using built-in media sources (assuming media_src_zh.h is available in SDK include path)
    // In a real localized app, we'd swap these for EN or custom sounds.
    switch (type) {
    case AI_AUDIO_ALERT_NETWORK_CONNECTED:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_network_conn_success_zh, sizeof(media_src_network_conn_success_zh), 1);
        break;
    case AI_AUDIO_ALERT_WAKEUP:
        rt = ai_audio_player_data_write(alert_id, (uint8_t *)media_src_ai_zh, sizeof(media_src_ai_zh), 1);
        break;
    default:
        break;
    }
    return rt;
}

uint8_t app_chat_bot_get_enable(void) {
    return 1;
}
