<?php

namespace Core;

class Route
{
    public RouteMethod $method; // HTTP method (GET, POST, etc.)
    public string $endpoint; // The URL endpoint for the route
    public string $controllerMethod; // The controller method to call when the route is matched

    // Constructor to initialize the route with method, endpoint, and controller method
    public function __construct(RouteMethod $method, string $endpoint, string $controllerMethod)
    {
        $this->method = $method;
        $this->endpoint = $endpoint;
        $this->controllerMethod = $controllerMethod;
    }

    // Validates if the current request matches the route (both method and endpoint)
    public function validate(): bool
    {
        // Normalize URL and check if it matches the route's endpoint
        $normalizedUrl = explode("?", strtolower(trim($_SERVER['REQUEST_URI'])), 2)[0];
        return ($normalizedUrl == $this->endpoint && $this->method->getType() == $_SERVER['REQUEST_METHOD']);
    }

    // Executes the controller method associated with the route
    public function execute(): void
    {
        // Split controller and method name (controller::method)
        $parsedController = explode("::", $this->controllerMethod);

        // Instantiate the controller class
        $controllerClass = new $parsedController[0]();

        // Call the controller method
        call_user_func([$controllerClass, $parsedController[1]]);
    }
}
