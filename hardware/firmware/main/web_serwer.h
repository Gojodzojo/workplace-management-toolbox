#ifndef _WEB_SERWER_H_
#define _WEB_SERWER_H_

#include <esp_wifi.h>
#include <esp_event.h>
#include <esp_log.h>
#include <esp_system.h>
#include <nvs_flash.h>
#include <sys/param.h>
#include "nvs_flash.h"
#include "esp_netif.h"
#include "config.h"
#include <stdlib.h>
#include <esp_http_server.h>
#include <math.h>

#define REQUEST_KEY_VALUE_ID "data"
#define REQUEST_KEY_VALUE_PEADLOCK "peadlock"

/*
    Inicialisation of web server module
    [in] - is_config_mode - true for config mode / false for normal operations
*/
void web_serwer_init(void);
uint32_t pass_user_id_info(void);
uint8_t pass_new_data_user_id_info(void);
void clear_new_data_user_id_info(void);

uint8_t pass_user_pl_info(void);
uint8_t pass_new_data_user_pl_info(void);
void clear_new_data_user_pl_info(void);

#endif