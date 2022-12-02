#include <stdio.h>
#include "OLED.h"
#include "Station_wifi.h"
#include "nvs_flash.h"

void init_NVS(void)
{
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
}

void app_main(void)
{
    OLED_init();
    OLED_clear();
    OLED_structure_builder();
    OLED_print_integer_number(PAGE_5,4,7452);
    OLED_print_integer_number(PAGE_1,4,804);

    init_NVS();
    wifi_init_sta();

    while (1)
    {
        vTaskDelay(50 / portTICK_PERIOD_MS);
    }
    

}
