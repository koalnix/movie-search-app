<?php

namespace Helper;

class ApiHelper
{
    // Sends an HTTP request to a specified endpoint with a given method, body, and headers
    public static function send(string $endpoint, string $method = "GET", mixed $body = null, $headers = [])
    {
        $headerData = "";

        // Convert header array to a string format for HTTP request
        foreach ($headers as $key => $header) {
            $headerData .= "$key: $header\r\n";
        }

        // Set up the options for the HTTP request (method, headers, and body)
        $options = [
            'http' => [
                'header' => $headerData, // Set headers
                'method' => $method,     // Set HTTP method (GET, POST, etc.)
                'content' => $method == 'POST' ? http_build_query($body) : null, // Add body if POST
            ],
        ];

        // Create a stream context with the options
        $context = stream_context_create($options);

        // Send the request and get the response
        $result = file_get_contents($endpoint, false, $context);

        // Decode the JSON response and return it
        return json_decode($result);
    }
}
