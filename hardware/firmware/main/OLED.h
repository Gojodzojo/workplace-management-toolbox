#include <stdio.h>
#include "driver/i2c.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include <string.h>

#define SDA_PIN 17
#define SCK_PIN 16
#define I2C_FREQ 100000

#define SSD1306_ASDRESS 0b0111100

//SSD1306 driver commands
#define SSD1306_COMMAND_MODE 0x00
#define SSD1306_DATA_MODE 0xC0

#define SSD1306_CHARGE_PUMP_COMMAND 0X8D
#define CHARGE_PUMP_EN 0x14
#define CHARGE_PUMP_DIS_EN 0x10

#define SSD1306_DISPLAY_ON 0xAF
#define SSD1306_DISPLAY_OFF 0xAE

#define SSD1306_LOWER_COLUMN_START_ADRESS 0x00
#define SSD1306_HIGER_COLUMN_START_ADRESS 0x10

#define SSD1306_PAGE_START_ADDRESS 0xB0
#define PAGE_0 0x0
#define PAGE_1 0x1
#define PAGE_2 0x2
#define PAGE_3 0x3
#define PAGE_4 0x4
#define PAGE_5 0x5
#define PAGE_6 0x6
#define PAGE_7 0x7

#define SMALL_DIGIT_LUT_OFFSET_SIZE 5
#define MODE_LUT_OFFSET_SIZE 8
#define MODE_LUT_LOW_HIGH_OFFSET 48

//position of playing track information on display
#define TRACK_INFORMATION_PAGE PAGE_4
#define TRACK_INFORMATION_COLUMN 80

#define MODE_INDICATOR_PAGE PAGE_2
#define MODE_INDICATOR_COLUMN 5

void OLED_init(void);
void OLED_write_to_page(uint8_t page,uint8_t* data,uint8_t data_len);
void OLED_clear(void);
void OLED_structure_builder(void);
void OLED_print_char(uint8_t down_page,uint8_t position,uint8_t character);
void OLED_print_num(uint8_t down_page,uint8_t position,uint8_t num);
void OLED_print_integer_number(uint8_t down_page,uint8_t starrt_position,uint32_t number_input);
