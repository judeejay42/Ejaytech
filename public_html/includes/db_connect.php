<?php
/**
 * Database connection provider using PDO.
 * Included inside config and authentication routes.
 */

require_once __DIR__ . '/../config/config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // Elegant fallback if database driver or host fails on shared server
    // Print descriptive layout for development, but secure in production logs
    die("Database Connection Failure: Pleased verify your DB_HOST, DB_USER, DB_PASS inside config/config.php. Error context: " . $e->getMessage());
}
?>
