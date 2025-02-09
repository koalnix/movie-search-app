<?php

namespace Core;

class Router
{
    public array $routes = []; // Stores all registered routes

    // Adds a new route to the list with the specified method, endpoint, and controller method
    public function add_route(RouteMethod $method, string $endpoint, mixed $controllerMethod)
    {
        $this->routes[] = new Route($method, $endpoint, join("::", $controllerMethod));
    }

    // Executes the matching route if found, else returns 404
    public function execute(): void
    {
        foreach ($this->routes as $route) {
            // If a valid route is found, execute it
            if ($route->validate()) {
                $route->execute();
                return;
            }
        }

        // If no matching route is found, return 404
        http_response_code(404);
    }
}

// Enum to define supported HTTP methods for routing
enum RouteMethod implements \JsonSerializable
{
    case POST;
    case GET;
    case PUT;
    case DELETE;

    // Returns the string representation of the HTTP method
    public function getType(): string
    {
        return match ($this) {
            RouteMethod::POST => 'POST',
            RouteMethod::GET => 'GET',
            RouteMethod::PUT => 'PUT',
            RouteMethod::DELETE => 'DELETE',
        };
    }

    // Implements jsonSerialize for the enum to return the method type
    public function jsonSerialize(): string
    {
        return $this->getType();
    }
}
