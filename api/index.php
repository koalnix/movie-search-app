<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once "./autoload.php";

use Core\App;

$app = new App();

include_once "./routes.php";

$app->run();