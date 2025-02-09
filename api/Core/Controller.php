<?php

namespace Core;

class Controller
{
    public Request $request;

    public function __construct()
    {
        $this->request = new Request();
    }
}
