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
#include "tkl_gpio.h"

// --- Button Configuration ---
#define KEY_PIN                 TUYA_GPIO_NUM_29  // Confirmed: User Button P29
#define BUTTON_SCAN_INTERVAL_MS 100

static THREAD_HANDLE key_thread_handle = NULL;

tuya_iot_client_t ai_client;
tuya_iot_license_t license;

// Extern logging function from TKL
extern void tkl_log_output(const char *str);

#define PROJECT_VERSION "1.0.0"

// --- Callbacks (Must be defined before usage) ---

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
        break;
    default:
        break;
    }
}

// Network Check Callback (CRITICAL - Required by Tuya SDK)
bool user_network_check(void)
{
    netmgr_status_e status = NETMGR_LINK_DOWN;
    netmgr_conn_get(NETCONN_AUTO, NETCONN_CMD_STATUS, &status);
    return status == NETMGR_LINK_DOWN ? false : true;
}

// OTA Callback
void user_ota_event_handler(tuya_ota_msg_t *msg, tuya_ota_event_t *event)
{
    PR_NOTICE("OTA Event: %d", event->id);
}

// --- Custom Button Logic (Polling) ---
void key_scan_task(void *arg) {
    PR_NOTICE("Button Service Started on P29 (User Key)");
    
    while(1) {
        TUYA_GPIO_LEVEL_E level;
        tkl_gpio_read(KEY_PIN, &level);
        
        // Active LOW (Pressed)
        if (level == TUYA_GPIO_LEVEL_LOW) { 
            // Minimal Debounce
            tal_system_sleep(50);
            tkl_gpio_read(KEY_PIN, &level);
            
            if (level == TUYA_GPIO_LEVEL_LOW) {
                 PR_NOTICE(">>> BUTTON P29 PRESSED: NUKING DATA & RESETTING! <<<");
                 
                 // 1. Stop Audio
                 ai_audio_set_open(false);
                 
                 // 2. NUKE Network Config Manifest (Fixes Blank SSID issue)
                 tal_kv_del("netinfo");
                 
                 // 3. Wipe Tuya IoT Data
                 tuya_iot_reset(&ai_client);
                 
                 // 4. Wait for flash write
                 tal_system_sleep(3000);
                 
                 // 5. Force Reboot
                 PR_NOTICE("!!! REBOOTING SYSTEM TO PAIRING MODE !!!");
                 tal_system_reset();
                 
                 while(1) tal_system_sleep(1000);
            }
        }
        tal_system_sleep(BUTTON_SCAN_INTERVAL_MS);
    }
}

void app_button_init(void) {
    TUYA_GPIO_BASE_CFG_T cfg = {
        .mode = TUYA_GPIO_PULLUP,
        .direct = TUYA_GPIO_INPUT,
        .level = TUYA_GPIO_LEVEL_HIGH
    };
    tkl_gpio_init(KEY_PIN, &cfg);
    
    // Create Thread
    THREAD_CFG_T thrd_param = {2048, 4, "key_scan"};
    tal_thread_create_and_start(&key_thread_handle, NULL, NULL, key_scan_task, NULL, &thrd_param);
}

// --- Main Entry Point ---

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
        .network_check = user_network_check,  // CRITICAL: Required for network connectivity
        .ota_handler = user_ota_event_handler
    });
    
    if (ret != OPRT_OK) {
        PR_ERR("IoT Init Failed: %d", ret);
        return;
    }

    // 5. Network Init (Wi-Fi)
    netmgr_init(NETCONN_WIFI);
    
    // FORCE PAIRING MODE ON BOOT if not connected
    PR_NOTICE("Configuring Network: AP + BLE Mode Enabled");
    netmgr_conn_set(NETCONN_WIFI, NETCONN_CMD_NETCFG, &(netcfg_args_t){.type = NETCFG_TUYA_BLE | NETCFG_TUYA_WIFI_AP});

    // 6. Board & App Init
    board_register_hardware();
    PR_NOTICE("Core Services Started. Initializing Chat Bot (Audio)...");
    
    // Init Button Control
    app_button_init();
    
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

/* Tuya thread handle */
static THREAD_HANDLE ty_app_thread = NULL;

/**
 * @brief  task thread
 *
 * @param[in] arg:Parameters when creating a task
 * @return none
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
