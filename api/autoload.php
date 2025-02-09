<?php

function autoloader($class)
{
    // Convert class name to file path
    $class = str_replace("\\", DIRECTORY_SEPARATOR, $class);  // Replace namespace separators with directories
    $file = __DIR__ .DIRECTORY_SEPARATOR. $class . '.php';  // Define the path where the classes are stored

    if (file_exists($file)) {
        require_once $file;
    }
}

// Register the autoloader function
spl_autoload_register('autoloader');
