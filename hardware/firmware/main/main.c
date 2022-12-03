#include <stdio.h>
#include "OLED.h"
#include "Station_wifi.h"
#include "nvs_flash.h"
#include "web_serwer.h"
#include "driver/gpio.h"
#include "get_req.h"
#include <stdbool.h>

#define SWITCH_PIN 32
#define DEBOUNCE_DELAY 25

static const char *TAG = "MAIN";

void init_NVS(void)
{
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
}

void USER_SWITCH_init(void)
{
    gpio_reset_pin(SWITCH_PIN);
    gpio_set_direction(SWITCH_PIN,GPIO_MODE_INPUT);
    gpio_set_pull_mode(SWITCH_PIN,GPIO_PULLUP_ONLY);
}

void app_main(void)
{
    OLED_init();
    OLED_clear();
    OLED_structure_builder();
    USER_SWITCH_init();
    OLED_print_integer_number(PAGE_5,4,Work_station_num);
    OLED_print_integer_number(PAGE_1,4,Defoult_user_data_id);
    OLED_print_PEADLOCK(PEDLOCK_CLOSE);

    gpio_reset_pin(2);
    gpio_set_direction(2,GPIO_MODE_OUTPUT);
    

    init_NVS();
    wifi_init_sta();
    web_serwer_init();

    Request_startup_routine();

    bool is_press_permited = true;
    uint16_t button_index = 0;

    while (1)
    {
        vTaskDelay(25 / portTICK_PERIOD_MS);
        if (pass_new_data_user_id_info() == 0x01)
        {
            OLED_print_integer_number(PAGE_1,4,pass_user_id_info());
            clear_new_data_user_id_info();
        }

        if (pass_new_data_user_pl_info() == 0x01)
        {
            if (pass_user_pl_info() == 1) OLED_print_PEADLOCK(PEDLOCK_CLOSE);
            if (pass_user_pl_info() == 0) OLED_print_PEADLOCK(PEDLOCK_OPEN);
            clear_new_data_user_pl_info();
        }

        if (gpio_get_level(SWITCH_PIN) == 0 && is_press_permited == true)
        {
            vTaskDelay(DEBOUNCE_DELAY / portTICK_PERIOD_MS);
            if (gpio_get_level(SWITCH_PIN) == 0)
            {
                gpio_set_level(2,1);
                is_press_permited = false;
                button_index = 0;
                httpd_send_button_data();
                gpio_set_level(2,0);
            } 
        }
        
        if(is_press_permited == false) button_index ++;
        if (button_index > 100)
        {
            is_press_permited = true;
        }
        
    
    }
    

}
