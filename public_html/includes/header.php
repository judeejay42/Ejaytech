<?php
/**
 * Shared website header. Included in all public pages.
 */
require_once __DIR__ . '/../config/config.php';

// Detect active page name to toggle link classes
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?> | <?php echo APP_TAGLINE; ?></title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.net" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <!-- Inline fallback to official CDN in case system fails -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!-- Custom Style -->
    <link rel="stylesheet" href="<?php echo OFFICIAL_DOMAIN; ?>/assets/css/style.css">
    <style>
        :root {
            --brand-primary: #0A192F;
            --brand-secondary: #00A8FF;
            --brand-accent: #F5F7FA;
            --brand-dark: #071120;
            --body-text: #4A5568;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #FFFFFF;
            color: var(--body-text);
            overflow-x: hidden;
        }

        /* Displays use Space Grotesk */
        h1, h2, h3, h4, h5, h6, .font-display {
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 600;
            color: var(--brand-primary);
        }

        /* Top Notification Bar */
        .info-topbar {
            background-color: var(--brand-primary);
            font-size: 12px;
            color: rgba(255,255,255,0.8);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 8px 0;
        }

        .info-topbar a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: color 0.15s;
        }

        .info-topbar a:hover {
            color: var(--brand-secondary);
        }

        /* Sticky Navigation Bar */
        .sticky-navbar {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid #E2E8F0;
            z-index: 1030;
        }

        .navbar-brand img, .brand-logo-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background-color: var(--brand-primary);
            color: var(--brand-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
            text-decoration: none;
        }

        .nav-link {
            font-weight: 500;
            color: #4A5568;
            font-size: 14px;
            padding: 10px 15px !important;
            transition: color 0.15s, border-bottom 0.15s;
        }

        .nav-link:hover, .nav-link.active {
            color: var(--brand-secondary) !important;
        }

        /* Buttons */
        .btn-brand-primary {
            background-color: var(--brand-primary);
            color: #FFFFFF;
            border: 1px solid var(--brand-primary);
            font-size: 13px;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.2s ease-in-out;
        }

        .btn-brand-primary:hover {
            background-color: var(--brand-secondary);
            border-color: var(--brand-secondary);
            color: var(--brand-primary);
        }

        .btn-brand-outline {
            background-color: var(--brand-accent);
            color: var(--brand-primary);
            border: 1px solid #CBD5E1;
            font-size: 13px;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.2s ease-in-out;
        }

        .btn-brand-outline:hover {
            background-color: #E2E8F0;
            color: var(--brand-primary);
        }

        /* Floating WhatsApp Chat button */
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #25D366;
            color: white;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transition: transform 0.2s ease-in-out;
            text-decoration: none;
        }

        .whatsapp-float:hover {
            transform: scale(1.1);
            color: white;
        }
    </style>
</head>
<body>

    <!-- Upper informational topbar -->
    <div class="info-topbar">
        <div class="container d-flex justify-content-between align-items-center">
            <div class="d-none d-sm-flex gap-4">
                <span><i class="bi bi-telephone text-info"></i> +234 813 540 2154</span>
                <span><i class="bi bi-envelope text-info"></i> info@ejaytech.com</span>
            </div>
            <div class="d-flex align-items-center gap-3 ms-auto ms-sm-0">
                <span class="badge bg-secondary-subtle text-primary font-monospace fw-bold text-uppercase" style="background-color: rgba(255,255,255,0.1) !important; color: var(--brand-secondary) !important;">
                    Innovating Ideas, Delivering Solutions
                </span>
            </div>
        </div>
    </div>

    <!-- Sticky Main Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light sticky-navbar sticky-top py-3">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2" href="<?php echo OFFICIAL_DOMAIN; ?>/index.php">
                <div class="brand-logo-icon">EJ</div>
                <div>
                    <span class="d-block fw-bold text-primary lh-1 fs-5">EJaytech Concepts</span>
                    <span class="d-block text-secondary text-uppercase fw-semibold tracking-wider font-display" style="font-size: 9px; letter-spacing: 1px; color: var(--brand-secondary) !important;">Digital Training Hub</span>
                </div>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ejaytechMainNavbar" aria-controls="ejaytechMainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="ejaytechMainNavbar">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'index.php' || $currentPage == '') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'about.php') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/about.php">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'services.php') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/services.php">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'projects.php') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/projects.php">Projects</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'courses.php') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/courses.php">Courses</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'blog.php') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/blog.php">Blog</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'contact.php') ? 'active fw-bold text-primary' : ''; ?>" href="<?php echo OFFICIAL_DOMAIN; ?>/contact.php">Contact Us</a>
                    </li>
                </ul>
                <div class="d-flex gap-2">
                    <?php if (isset($_SESSION['student_logged_in'])): ?>
                        <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/dashboard.php" class="btn btn-brand-primary btn-sm rounded-pill px-3">Student Hub</a>
                    <?php elseif (isset($_SESSION['admin_logged_in'])): ?>
                        <a href="<?php echo OFFICIAL_DOMAIN; ?>/admin/dashboard.php" class="btn btn-brand-primary btn-sm rounded-pill px-3">Admin Panel</a>
                    <?php else: ?>
                        <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/login.php" class="btn btn-brand-outline btn-sm rounded-3">Login</a>
                        <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/register.php" class="btn btn-brand-primary btn-sm rounded-3">Apply Now</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>
