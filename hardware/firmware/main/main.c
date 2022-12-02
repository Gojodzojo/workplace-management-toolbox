#include <stdio.h>
#include "OLED.h"

void app_main(void)
{
    OLED_init();
    OLED_clear();
    OLED_structure_builder();
    OLED_print_integer_number(PAGE_5,4,7452);
    OLED_print_integer_number(PAGE_1,4,804);
}
