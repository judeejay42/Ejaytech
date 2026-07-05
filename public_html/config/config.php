<?php
/**
 * EJaytech Concepts Platform Config
 * Year: 2026
 */

// Establish global session policies safely if not yet active
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    // Secure flag is recommended when hosting on SSL/HTTPS
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', 1);
    }
    session_start();
}

// System Core Specifications
define('APP_NAME', 'EJaytech Concepts');
define('APP_TAGLINE', 'Innovating Ideas, Delivering Solutions.');
define('OFFICIAL_DOMAIN', 'https://www.ejaytechconcepts.com');
define('OFFICIAL_EMAIL', 'info@ejaytechconcepts.com');
define('SUPPORT_WHATSAPP', '+2348135402154');

// MySQL Database Credentials (Adjust according to cPanel / VPS database target)
define('DB_HOST', 'localhost');
define('DB_NAME', 'ejaytech_db');
define('DB_USER', 'ejaytech_user');
define('DB_PASS', 'EJ_securepassword_2026');

// SMTP Settings (cPanel email dispatching with PHPMailer or Gmail SMTP Integration)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587); // 587 for TLS, 465 for SSL
define('SMTP_USER', 'your_gmail_username@gmail.com');
define('SMTP_PASS', 'your_gmail_app_password'); // Use app password if 2FA is active
define('SMTP_SECURE', 'tls'); // 'tls' or 'ssl'
define('SMTP_FROM_NAME', 'EJaytech Concepts Admissions Office');

// Security: Generate a CSRF token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Helper: Guard requests against CSRF
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Helper: Sanitize outputs against XSS vectors
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>
