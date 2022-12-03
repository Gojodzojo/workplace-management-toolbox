#include "OLED.h"

i2c_port_t I2C_port = I2C_NUM_0;

static const char *TAG = "OLED";

uint8_t char_tab[2][16] = {
    {0x00,0x08,0xf8,0x08,0xf8,0x08,0x10,0xE0,0xf8,0x30,0x30,0xf8,0xf8,0x80,0x80,0x00},
    {0x00,0x10,0x1f,0x10,0x1f,0x10,0x08,0x07,0x1f,0x00,0x00,0x1f,0x1f,0x10,0x10,0x0f}
};

uint8_t char_encoding[2][4] = {
    {'I','D','W','P'},
    {3,7,11,15}
};

uint8_t num_tab[2][40] = {
    {0x08,0x08,0xf8,0x08,0x38,0x48,0x88,0x18,0x10,0x88,0x88,0x70,0xC0,0x40,0xf8,0x40,0x08,0x88,0x88,0x70,
     0xf8,0x08,0x08,0xf8,0x00,0x78,0xC0,0x00,0x70,0x88,0x88,0x70,0x10,0x08,0x08,0xF0,0xf0,0x08,0x08,0xf0},
    {0x08,0x10,0x1f,0x00,0x08,0x10,0x10,0x0F,0x08,0x11,0x11,0x0E,0x1f,0x00,0x01,0x00,0x0F,0x18,0x10,0x10,
     0x1f,0x11,0x11,0x18,0x18,0x10,0x13,0x1e,0x0E,0x11,0x11,0x0E,0x0E,0x11,0x11,0x0E,0x0f,0x10,0x10,0x0f}
};

uint8_t num_encoding[2][10] = {
    {1,2,3,4,5,6,7,8,9,0},
    {3,7,11,15,19,23,27,31,35,39}
};

uint8_t num_encoding_ascii[2][10] = {
    {'1','2','3','4','5','6','7','8','9','0'},
    {3,7,11,15,19,23,27,31,35,39}
};

uint8_t peadlock_tab[2][20] = {
    {0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC,0xFC},
    {0x00,0x0F,0x3F,0x30,0x30,0x30,0x30,0x3F,0x0F,0x00,0x00,0x0F,0x3F,0x30,0x30,0x30,0x30,0x38,0x08,0x00}
};

void I2C_init(uint32_t FREQ)
{
    gpio_reset_pin(SDA_PIN);
    gpio_reset_pin(SCK_PIN);

    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = SDA_PIN,
        .scl_io_num = SCK_PIN,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = FREQ,
    };

    i2c_param_config(I2C_port, &conf);
    i2c_driver_install(I2C_port, conf.mode, 0, 0, 0);
}

void I2C_send_1byte_command(uint8_t command)
{
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, SSD1306_ASDRESS << 1, true);
    i2c_master_write_byte(cmd, SSD1306_COMMAND_MODE, true);
    i2c_master_write_byte(cmd, command, true);
    i2c_master_stop(cmd);
    i2c_master_cmd_begin(I2C_port, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
}

void I2C_send_1byte_data(uint8_t data)
{
    i2c_cmd_handle_t data_handler = i2c_cmd_link_create();
    i2c_master_start(data_handler);
    i2c_master_write_byte(data_handler, SSD1306_ASDRESS << 1, true);
    i2c_master_write_byte(data_handler, SSD1306_DATA_MODE, true);
    i2c_master_write_byte(data_handler, data, true);
    i2c_master_stop(data_handler);
    i2c_master_cmd_begin(I2C_port, data_handler, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(data_handler);
}

void OLED_init(void)
{  
    I2C_init(I2C_FREQ);
    
    I2C_send_1byte_command(SSD1306_CHARGE_PUMP_COMMAND);
    I2C_send_1byte_command(CHARGE_PUMP_EN);
    I2C_send_1byte_command(SSD1306_DISPLAY_ON);

    I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS);
    I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS);
}

void OLED_write_to_page(uint8_t page,uint8_t* data,uint8_t data_len)
{
    I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | page);
    for (uint8_t i = 0; i < data_len; i++)
    {
        I2C_send_1byte_data(data[i]);
    }
}

void OLED_clear(void)
{
    uint8_t *fill;
    fill = malloc(128);
    memset(fill,0,128);

    for (uint8_t i = 0; i < 8; i++)
    {
        OLED_write_to_page(i,fill,128);
    }

    free(fill);    
}

void OLED_structure_builder(void)
{
    uint8_t *frame;
    frame = malloc(128);
    memset(frame,0b11100100,128);
    OLED_write_to_page(PAGE_7,frame,128);
    memset(frame,0b00100111,128);
    OLED_write_to_page(PAGE_0,frame,128);
    memset(frame,0b11010000,128);
    OLED_write_to_page(PAGE_3,frame,128);
    memset(frame,0b00001011,128);
    OLED_write_to_page(PAGE_4,frame,128);

    OLED_print_char(PAGE_1 ,0, 'I');
    OLED_print_char(PAGE_1 ,1, 'D');

    OLED_print_char(PAGE_5 ,0, 'W');
    OLED_print_char(PAGE_5 ,1, 'P');
}

void OLED_print_char(uint8_t down_page,uint8_t position,uint8_t character)
{
    if (position > 19) position = 19;
    position = 14 + (19 - position) * 5;              //(127 - position) - 5;  //invert display back and offset character

    uint8_t char_offset = 0;

    for (size_t i = 0; i < 4; i++)
    {
        if (char_encoding[0][i] == character)
        {
            char_offset = char_encoding[1][i];
        }   
    }

    if (char_offset != 0)
    {
        
        I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (position & 0xf));
        I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (position >> 4));
        I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | down_page);

        //I2C_send_1byte_data(0xff);
        
        for (uint8_t i = 0; i < 4; i++)
        {
            I2C_send_1byte_data(char_tab[0][char_offset - i]);
        }

        
        I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (position & 0xf));
        I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (position >> 4));
        I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | (down_page + 1));
        
        for (uint8_t i = 0; i < 4; i++)
        {
            I2C_send_1byte_data(char_tab[1][char_offset - i]);
        }
    }

}

void OLED_print_num(uint8_t down_page,uint8_t position,uint8_t num)
{
    if (position > 19) position = 19;
    position = 14 + (19 - position) * 5;              //(127 - position) - 5;  //invert display back and offset character

    uint8_t num_offset = 0;

    for (size_t i = 0; i < 10; i++)
    {
        if (num_encoding[0][i] == num)
        {
            num_offset = num_encoding[1][i];
        }   
    }

    if (num_offset != 0)
    {
        
        I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (position & 0xf));
        I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (position >> 4));
        I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | down_page);

        //I2C_send_1byte_data(0xff);
        
        for (uint8_t i = 0; i < 4; i++)
        {
            I2C_send_1byte_data(num_tab[0][num_offset - i]);
        }

        
        I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (position & 0xf));
        I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (position >> 4));
        I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | (down_page + 1));
        
        for (uint8_t i = 0; i < 4; i++)
        {
            I2C_send_1byte_data(num_tab[1][num_offset - i]);
        }
    }

}

void OLED_print_num_ascii(uint8_t down_page,uint8_t position,uint8_t num)
{
    if (position > 19) position = 19;
    position = 14 + (19 - position) * 5;              //(127 - position) - 5;  //invert display back and offset character

    uint8_t num_offset = 0;

    for (size_t i = 0; i < 10; i++)
    {
        if (num_encoding_ascii[0][i] == num)
        {
            num_offset = num_encoding_ascii[1][i];
        }   
    }

    if (num_offset != 0)
    {
        
        I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (position & 0xf));
        I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (position >> 4));
        I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | down_page);

        //I2C_send_1byte_data(0xff);
        
        for (uint8_t i = 0; i < 4; i++)
        {
            I2C_send_1byte_data(num_tab[0][num_offset - i]);
        }

        
        I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (position & 0xf));
        I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (position >> 4));
        I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | (down_page + 1));
        
        for (uint8_t i = 0; i < 4; i++)
        {
            I2C_send_1byte_data(num_tab[1][num_offset - i]);
        }
    }

}

void OLED_print_PEADLOCK(uint8_t peadlock_info)
{
    I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (PEADLOCK_POSITION & 0xf));
    I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (PEADLOCK_POSITION >> 4));
    I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | PEADLOCK_PAGE);

    for (uint8_t i = 0; i < 10; i++)
    {
        I2C_send_1byte_data(peadlock_tab[0][peadlock_info - i]);
    }

    I2C_send_1byte_command(SSD1306_LOWER_COLUMN_START_ADRESS | (PEADLOCK_POSITION & 0xf));
    I2C_send_1byte_command(SSD1306_HIGER_COLUMN_START_ADRESS | (PEADLOCK_POSITION >> 4));
    I2C_send_1byte_command(SSD1306_PAGE_START_ADDRESS | (PEADLOCK_PAGE + 1));
    
    for (uint8_t i = 0; i < 10; i++)
    {
        I2C_send_1byte_data(peadlock_tab[1][peadlock_info - i]);
    }

}

void OLED_print_integer_number(uint8_t down_page,uint8_t starrt_position,uint32_t number_input)
{
    uint8_t num_1000 = number_input / 1000;
    uint8_t num_100 = (number_input - (num_1000 * 1000)) / 100;
    uint8_t num_10 = (number_input - ((num_1000 * 1000) + (num_100 * 100))) / 10;
    uint8_t num_1 = number_input - ((num_1000 * 1000) + (num_100 * 100) + (num_10 * 10));

    ESP_LOGI(TAG,"Numbers %d %d %d %d \n",num_1000, num_100, num_10, num_1);

    OLED_print_num(down_page,starrt_position,num_1000);
    OLED_print_num(down_page,starrt_position + 1,num_100);
    OLED_print_num(down_page,starrt_position + 2,num_10);
    OLED_print_num(down_page,starrt_position + 3,num_1);
}

void OLED_print_from_string_num(uint8_t down_page, uint8_t starrt_position, uint8_t str[4])
{
    OLED_print_num(down_page,starrt_position,str[0]);
    OLED_print_num(down_page,starrt_position + 1,str[1]);
    OLED_print_num(down_page,starrt_position + 2,str[2]);
    OLED_print_num(down_page,starrt_position + 3,str[3]);
}
