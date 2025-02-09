<?php

namespace Core;

class App
{
    public Router $router;

    // Constructor initializes the router
    public function __construct()
    {
        $this->router = new Router();
    }

    // Runs the router to handle the request
    public function run(): void
    {
        $this->router->execute();
    }
}
