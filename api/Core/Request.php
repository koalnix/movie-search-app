<?php

namespace Core;

class Request
{
    public mixed $query = [];

    public function __construct()
    {
        $this->parse_query();
    }

    public function parse_query()
    {
        $this->query = $_GET;
    }
}
