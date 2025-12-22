/**
 * @file tuya_main.c
 * @brief Main entry point for Rankify Assist
 * 
 * ARCHITECTURE (Based on official your_chat_bot):
 * - Main system initialization and lifecycle management
 * - Event handling for Tuya Cloud events  
 * - Network status management
 * - Integration of all application modules
 * 
 * @copyright Copyright (c) 2021-2025 Tuya Inc. All Rights Reserved.
 */

#include "tuya_cloud_types.h"
#include "cJSON.h"
#include "tal_api.h"
#include "tuya_config.h"
#include "tuya_iot.h"
#include "tuya_iot_dp.h"
#include "netmgr.h"
#include "tkl_output.h"
#include "tal_cli.h"
#include "tuya_authorize.h"
#include "netconn_wifi.h"

#include "board_com_api.h"
#include "app_chat_bot.h"
#include "ai_audio.h"
#include "reset_netcfg.h"

#ifndef PROJECT_VERSION
#define PROJECT_VERSION "1.0.0"
#endif

/* Tuya device handle */
tuya_iot_client_t ai_client;

/* Tuya license information */
tuya_iot_license_t license;

static uint8_t _need_reset = 0;

/**
 * @brief Upgrade notification callback
 */
void user_upgrade_notify_on(tuya_iot_client_t *client, cJSON *upgrade)
{
    PR_INFO("----- Upgrade information -----");
    PR_INFO("OTA Channel: %d", cJSON_GetObjectItem(upgrade, "type")->valueint);
    PR_INFO("Version: %s", cJSON_GetObjectItem(upgrade, "version")->valuestring);
    PR_INFO("Size: %s", cJSON_GetObjectItem(upgrade, "size")->valuestring);
    PR_INFO("MD5: %s", cJSON_GetObjectItem(upgrade, "md5")->valuestring);
    PR_INFO("URL: %s", cJSON_GetObjectItem(upgrade, "url")->valuestring);
}

/**
 * @brief Main event handler for Tuya Cloud events
 */
void user_event_handler_on(tuya_iot_client_t *client, tuya_event_msg_t *event)
{
    PR_DEBUG("Tuya Event ID:%d", event->id);

    switch (event->id) {
    case TUYA_EVENT_BIND_START:
        PR_INFO("Device Bind Start!");
        if (_need_reset == 1) {
            PR_INFO("Device Reset!");
            tal_system_reset();
        }
        ai_audio_player_play_alert(AI_AUDIO_ALERT_NETWORK_CFG);
        break;

    case TUYA_EVENT_MQTT_CONNECTED:
        PR_INFO("Device MQTT Connected!");
        
        // CRITICAL: Forward event to AI subsystem!
        // Without this, ai_audio_agent never initializes session!
        tal_event_publish(EVENT_MQTT_CONNECTED, NULL);
        
        // Only play alert on FIRST connection
        static uint8_t first = 1;
        if (first) {
            first = 0;
            ai_audio_player_play_alert(AI_AUDIO_ALERT_NETWORK_CONNECTED);
        }
        break;

    case TUYA_EVENT_MQTT_DISCONNECT:
        PR_INFO("Device MQTT DisConnected!");
        break;

    case TUYA_EVENT_UPGRADE_NOTIFY:
        user_upgrade_notify_on(client, event->value.asJSON);
        break;

    case TUYA_EVENT_TIMESTAMP_SYNC:
        PR_INFO("Sync timestamp:%d", event->value.asInteger);
        tal_time_set_posix(event->value.asInteger, 1);
        break;

    case TUYA_EVENT_RESET:
        PR_INFO("Device Reset:%d", event->value.asInteger);
        _need_reset = 1;
        break;

    default:
        break;
    }
}

/**
 * @brief Network check callback
 */
bool user_network_check(void)
{
    netmgr_status_e status = NETMGR_LINK_DOWN;
    netmgr_conn_get(NETCONN_AUTO, NETCONN_CMD_STATUS, &status);
    return status == NETMGR_LINK_DOWN ? false : true;
}

/**
 * @brief Main user application entry point
 */
void user_main(void)
{
    int ret = OPRT_OK;

    /* 1. Core Runtime Init */
    cJSON_InitHooks(&(cJSON_Hooks){.malloc_fn = tal_malloc, .free_fn = tal_free});
    tal_log_init(TAL_LOG_LEVEL_DEBUG, 1024, (TAL_LOG_OUTPUT_CB)tkl_log_output);

    PR_NOTICE("=== Rankify Assist ===");
    PR_NOTICE("App version:         %s", PROJECT_VERSION);
    PR_NOTICE("Compile time:        %s", __DATE__);
    PR_NOTICE("TuyaOpen version:    %s", OPEN_VERSION);
    PR_NOTICE("Platform:            %s", PLATFORM_BOARD);

    tal_kv_init(&(tal_kv_cfg_t){
        .seed = "vmlkasdh93dlvlcy",
        .key = "dflfuap134ddlduq",
    });
    tal_sw_timer_init();
    tal_workq_init();
    tal_time_service_init();
    tal_cli_init();
    tuya_authorize_init();

    /* 2. Reset Network Config */
    reset_netconfig_start();

    /* 3. License */
    if (OPRT_OK != tuya_authorize_read(&license)) {
        license.uuid = TUYA_OPENSDK_UUID;
        license.authkey = TUYA_OPENSDK_AUTHKEY;
        PR_WARN("Using embedded UUID/Authkey");
    }

    /* 4. Initialize Tuya IoT */
    ret = tuya_iot_init(&ai_client, &(const tuya_iot_config_t){
                                        .software_ver = PROJECT_VERSION,
                                        .productkey = TUYA_PRODUCT_ID,
                                        .uuid = license.uuid,
                                        .authkey = license.authkey,
                                        .event_handler = user_event_handler_on,
                                        .network_check = user_network_check,
                                    });
    assert(ret == OPRT_OK);

    /* 5. Network Manager Init */
    netmgr_init(NETCONN_WIFI);
    netmgr_conn_set(NETCONN_WIFI, NETCONN_CMD_NETCFG, &(netcfg_args_t){.type = NETCFG_TUYA_BLE | NETCFG_TUYA_WIFI_AP});

    PR_DEBUG("tuya_iot_init success");

    /* 6. Board Hardware Registration */
    ret = board_register_hardware();
    if (ret != OPRT_OK) {
        PR_ERR("board_register_hardware failed");
    }

    /* 7. Application Module Init */
    ret = app_chat_bot_init();
    if (ret != OPRT_OK) {
        PR_ERR("app_chat_bot_init failed");
    }

    /* 8. Start Tuya IoT Task */
    tuya_iot_start(&ai_client);

    /* 9. Disable WiFi low power mode */
    tkl_wifi_set_lp_mode(0, 0);

    /* 10. Check if reset is needed */
    reset_netconfig_check();

    PR_NOTICE("Entering main loop...");

    /* Main loop */
    for (;;) {
        tuya_iot_yield(&ai_client);
    }
}

#if OPERATING_SYSTEM == SYSTEM_LINUX
void main(int argc, char *argv[])
{
    user_main();
}
#else

/* Tuya thread handle */
static THREAD_HANDLE ty_app_thread = NULL;

/**
 * @brief Main application thread
 */
static void tuya_app_thread(void *arg)
{
    user_main();
    tal_thread_delete(ty_app_thread);
    ty_app_thread = NULL;
}

void tuya_app_main(void)
{
    THREAD_CFG_T thrd_param = {4096, 4, "tuya_app_main"};
    tal_thread_create_and_start(&ty_app_thread, NULL, NULL, tuya_app_thread, NULL, &thrd_param);
}
#endif
