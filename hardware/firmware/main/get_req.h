#ifndef _GET_REQ_H_
#define _GET_REQ_H_

#include <string.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "driver/gpio.h"
#include "esp_tls.h"
#include "esp_http_client.h"
#include "config.h"


#define MAX_HTTP_RECV_BUFFER 128
#define MAX_HTTP_OUTPUT_BUFFER 512

void http_rest_with_url(char* buf, char* host_ip, char* host_path);
void httpd_send_button_data(void);

#endif