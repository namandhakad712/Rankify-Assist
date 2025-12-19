/**
 * @file tuya_config.h
 * @brief IoT specific configuration file
 */

#ifndef TUYA_CONFIG_H_
#define TUYA_CONFIG_H_

#include "tuya_cloud_types.h"

/**
 * @brief configure the product information
 *
 * TUYA_PRODUCT_ID: PID, create on the Tuya IoT platform
 */

#ifndef TUYA_PRODUCT_ID
#define TUYA_PRODUCT_ID "product-idxxxxxxxxx"
#endif

// User should replace these with their own license keys or use Auth Token Management
#define TUYA_OPENSDK_UUID    "uuidxxxxxxxxxxxxxxxx"             
#define TUYA_OPENSDK_AUTHKEY "keyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 

#endif
