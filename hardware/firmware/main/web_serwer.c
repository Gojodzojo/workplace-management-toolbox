#include "web_serwer.h"

uint32_t user_data_id = Defoult_user_data_id;
uint8_t is_new_data_id = 0;

uint32_t user_data_pl = 1;
uint8_t is_new_data_pl = 0;

static const char *TAG = "WebSerwer";

esp_err_t Web_serwer_data_in_handler( httpd_req_t *req, uint8_t output_data)
{
    char* temp_send_arr = malloc(20); 
    char* req_buf;
    char* data_from_request;
    

    //recive querry 
    int req_len = httpd_req_get_url_query_len(req) + 1;
    req_buf = malloc(req_len);
    data_from_request = malloc(req_len);
    httpd_req_get_url_query_str(req, req_buf, req_len);

    memset(data_from_request,0,req_len);

    httpd_query_key_value(req_buf,REQUEST_KEY_VALUE_ID,data_from_request,req_len);

    if (data_from_request[0] != 0)
    {
        user_data_id = 0;
        for (uint8_t i = 0; i < 4; i++)
        {
            user_data_id += (data_from_request[i] - 0x30) * pow(10,(3 - i));
        }
        is_new_data_id = 0x1;
    }

    memset(data_from_request,0,req_len);

    httpd_query_key_value(req_buf,REQUEST_KEY_VALUE_PEADLOCK,data_from_request,req_len);

    if (data_from_request[0] != 0)
    {
        user_data_pl = (data_from_request[0] - 0x30);
        if (user_data_pl > 1) user_data_pl = 1;
        is_new_data_pl = 1;
    }

    httpd_resp_sendstr_chunk(req, 
                             "<html>"
                             "<body>"); 

    sprintf(temp_send_arr,"WS=%d", Work_station_num);

    httpd_resp_sendstr_chunk(req,temp_send_arr);

    httpd_resp_sendstr_chunk(req, 
                             "</body>"
                             "</html>");

    /* last chunk of response !revert to active stage disenabled for debugging only! */
    httpd_resp_send_chunk(req, NULL, 0);

    free(temp_send_arr);

    return ESP_OK;
}

static const httpd_uri_t Web_serwer_data_in = {
    .uri = "/",
    .method = HTTP_GET,
    .handler = Web_serwer_data_in_handler,
    .user_ctx = NULL};

esp_err_t http_404_error_handler(httpd_req_t *req, httpd_err_code_t err)
{
    httpd_resp_send_err(req, HTTPD_404_NOT_FOUND, "");
    return ESP_FAIL;
}

static httpd_handle_t start_webserver(void)
{
    httpd_handle_t server = NULL;
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    // Start the httpd server
    ESP_LOGI(TAG, "Starting server on port: '%d'", config.server_port);
    if (httpd_start(&server, &config) == ESP_OK)
    {
        // Set URI handlers
        ESP_LOGI(TAG, "Registering URI handlers");
        httpd_register_uri_handler(server, &Web_serwer_data_in);
        return server;
    }

    ESP_LOGI(TAG, "Error starting server!");
    return NULL;
}

static void stop_webserver(httpd_handle_t server)
{
    // Stop the httpd server
    httpd_stop(server);
}

static void disconnect_handler(void *arg, esp_event_base_t event_base,
                               int32_t event_id, void *event_data)
{
    httpd_handle_t *server = (httpd_handle_t *)arg;
    if (*server)
    {
        ESP_LOGI(TAG, "Stopping webserver");
        stop_webserver(*server);
        *server = NULL;
    }
}

static void connect_handler(void *arg, esp_event_base_t event_base,
                            int32_t event_id, void *event_data)
{
    httpd_handle_t *server = (httpd_handle_t *)arg;
    if (*server == NULL)
    {
        ESP_LOGI(TAG, "Starting webserver");
        *server = start_webserver();
    }
}

void web_serwer_init(void)
{
    static httpd_handle_t server = NULL;

    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &connect_handler, &server));
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, WIFI_EVENT_STA_DISCONNECTED, &disconnect_handler, &server));

    start_webserver(); 
}

uint32_t pass_user_id_info(void)
{
    return user_data_id;
}

uint8_t pass_new_data_user_id_info(void)
{
    return is_new_data_id;
}

void clear_new_data_user_id_info(void)
{
   is_new_data_id = false; 
}

uint8_t pass_user_pl_info(void)
{
    return user_data_pl;
}

uint8_t pass_new_data_user_pl_info(void)
{
    return is_new_data_pl;
}

void clear_new_data_user_pl_info(void)
{
   is_new_data_pl = false; 
}