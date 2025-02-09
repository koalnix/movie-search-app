<?php

use Core\RouteMethod;

use Controller\MovieController;

$app->router->add_route(RouteMethod::GET, "/api/movie/browse", [MovieController::class, 'browse_movies']);
$app->router->add_route(RouteMethod::GET, "/api/movie", [MovieController::class, 'get_movie']);
