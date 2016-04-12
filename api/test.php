<?php
if (!class_exists("\\Phalcon\Version")) {
    die("Foodly requires the Phalcon extension to run.");
} elseif (\Phalcon\Version::getId() < 1030000) {
    die("Foodly requires at least Phalcon version 1.3.0 to run.");
} elseif (!file_exists(APPLICATION_PATH . 'config/config.php')) {
    die("Configuration file missing.");
} elseif (!file_exists(APPLICATION_PATH . '../vendor/autoload.php')) {
    die("Composer autoloader missing.");
}

?>