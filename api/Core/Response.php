<?php

namespace Core;

class Response
{

    public static function status(int $status)
    {
        http_response_code($status);
    }

    public static function json(mixed $data)
    {
        header('Content-Type:application/json');
        echo json_encode($data);
        die();
    }
}
