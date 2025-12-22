/**
 * @file reset_netcfg.h
 * @brief Network reset button handler header
 */

#ifndef __RESET_NETCFG_H__
#define __RESET_NETCFG_H__

#include "tuya_cloud_types.h"

/**
 * @brief Start the network configuration reset counter
 * 
 * Call this during initialization to start the 5-second window
 * for detecting 3 consecutive resets
 */
int reset_netconfig_start(void);

/**
 * @brief Check if device needs to reset to pairing mode
 * 
 * Call this after network intialization to check if user
 * pressed reset 3 times
 */
int reset_netconfig_check(void);

#endif
