/**
 * @file tuya_main.c
 * @brief Nano-Voice Controller Main Entry
 */

#include "tuya_cloud_types.h"
#include "tal_api.h"
#include "tuya_config.h"
#include "tuya_iot.h"
#include "netmgr.h"
#include "tuya_authorize.h"
#include "board_com_api.h"
#include "app_chat_bot.h"
#include "ai_audio.h"
#include "netcfg.h"
#include "netconn_wifi.h"
#include "cJSON.h"

tuya_iot_client_t ai_client;
tuya_iot_license_t license;

// Extern logging function from TKL
extern void tkl_log_output(const char *str);

#define PROJECT_VERSION "1.0.0"

void user_log_output_cb(const char *str)
{
    tal_uart_write(TUYA_UART_NUM_0, (const uint8_t *)str, strlen(str));
}

void user_event_handler_on(tuya_iot_client_t *client, tuya_event_msg_t *event)
{
    switch (event->id) {
    case TUYA_EVENT_MQTT_CONNECTED:
        PR_INFO("Device MQTT Connected!");
        PR_NOTICE("Playing Alert: NETWORK_CONNECTED");
        // ai_audio_player_play_alert(AI_AUDIO_ALERT_NETWORK_CONNECTED);
        break;
    default:
        break;
    }
}

// OTA Callback
// OTA Callback
void user_ota_event_handler(tuya_ota_msg_t *msg, tuya_ota_event_t *event)
{
    PR_NOTICE("OTA Event: %d", event->id);
}

void user_main(void)
{
    int ret = OPRT_OK;

    // 1. Init System & Logs
    cJSON_InitHooks(&(cJSON_Hooks){.malloc_fn = tal_malloc, .free_fn = tal_free});
    // Use TKL logger (proven to work)
    tal_log_init(TAL_LOG_LEVEL_TRACE, 4096, (TAL_LOG_OUTPUT_CB)tkl_log_output);
    PR_NOTICE("--- Rankify Assist: CORE SERVICES STARTING ---");

    // 2. Init Core Services
    tal_kv_init(&(tal_kv_cfg_t){ .seed = "vmlkasdh93dlvlcy", .key = "dflfuap134ddlduq" });
    
    tal_sw_timer_init();
    tal_workq_init();
    tal_time_service_init();
    tuya_authorize_init();

    // 3. Load License (UUID/AuthKey)
    // Force hardcoded credentials for ensuring valid pairing
    license.uuid = TUYA_OPENSDK_UUID;
    license.authkey = TUYA_OPENSDK_AUTHKEY;
    
    PR_NOTICE("License Loaded. PID: %s", TUYA_PRODUCT_ID);
    PR_NOTICE("License Loaded. UUID: %s", license.uuid);




    // 4. Init Tuya IoT Client
    ret = tuya_iot_init(&ai_client, &(const tuya_iot_config_t){
        .software_ver = PROJECT_VERSION,
        .productkey = TUYA_PRODUCT_ID,
        .uuid = license.uuid,
        .authkey = license.authkey,
        .event_handler = user_event_handler_on,
        .ota_handler = user_ota_event_handler
    });
    
    if (ret != OPRT_OK) {
        PR_ERR("IoT Init Failed: %d", ret);
        return;
    }

    // 5. Network Init (Wi-Fi)
    netmgr_init(NETCONN_WIFI);
    netmgr_conn_set(NETCONN_WIFI, NETCONN_CMD_NETCFG, &(netcfg_args_t){.type = NETCFG_TUYA_BLE | NETCFG_TUYA_WIFI_AP});

    // 6. Board & App Init
    board_register_hardware();
    PR_NOTICE("Core Services Started. Initializing Chat Bot (Audio)...");
    app_chat_bot_init();

    // 7. Start IoT Task
    tuya_iot_start(&ai_client);

    PR_NOTICE("Entering Main Loop...");

    for (;;) {
        tuya_iot_yield(&ai_client);
    }
}

#if OPERATING_SYSTEM == SYSTEM_LINUX
void main(int argc, char *argv[]) { user_main(); }
#else
/*
static void tuya_app_thread(void *arg) {
    user_main();
    tal_thread_delete(NULL);
}
*/
void tuya_app_main(void) {
    // Directly call user_main to prevent ap_main from returning
    user_main();
}
#endif
