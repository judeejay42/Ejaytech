<?php
/**
 * Student Login Portal Process
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db_connect.php';

$error = '';
$registered_success = '';

// Check if redirected from dynamic registrations
if (isset($_GET['registered']) && isset($_SESSION['admission_success_id'])) {
    $registered_success = "Registration complete! Your auto-generated Student ID is: <strong>" . sanitize($_SESSION['admission_success_id']) . "</strong>. An email was dispatched with login guides.";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $identifier = trim($_POST['identifier']); // ID or Email
    $password = $_POST['password'];

    if (empty($identifier) || empty($password)) {
        $error = 'Both login credentials are required.';
    } else {
        try {
            // Find student by ID or Email
            $stmt = $pdo->prepare("SELECT * FROM students WHERE (student_id = ? OR email = ?)");
            $stmt->execute([$identifier, $identifier]);
            $student = $stmt->fetch();

            if ($student && password_verify($password, $student['password_hash'])) {
                // Secure Session Initiation
                $_SESSION['student_logged_in'] = true;
                $_SESSION['student_db_id'] = $student['id'];
                $_SESSION['student_id'] = $student['student_id'];
                $_SESSION['student_name'] = $student['fullname'];
                $_SESSION['student_email'] = $student['email'];
                $_SESSION['student_course'] = $student['course'];
                $_SESSION['student_status'] = $student['application_status'];

                header("Location: " . OFFICIAL_DOMAIN . "/student/dashboard.php");
                exit;
            } else {
                $error = 'Invalid Student ID/Email or Password. Please try again.';
            }
        } catch (PDOException $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Login | EJaytech Concepts</title>
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        :root {
            --brand-primary: #0A192F;
            --brand-secondary: #00A8FF;
            --brand-accent: #F5F7FA;
        }
        body {
            background-color: var(--brand-accent);
            font-family: 'Inter', sans-serif;
            padding-top: 80px;
        }
        .login-card {
            background: #FFFFFF;
            border-radius: 16px;
            box-shadow: 0 10px 45px rgba(0,0,0,0.06);
            border: 1px solid #E2E8F0;
            overflow: hidden;
            max-width: 450px;
            margin: 0 auto;
        }
        .form-header {
            background-color: var(--brand-primary);
            color: #FFFFFF;
            padding: 30px;
            text-align: center;
        }
        .brand-icon {
            width: 50px;
            height: 50px;
            background-color: rgba(255,255,255,0.1);
            color: var(--brand-secondary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
            margin: 0 auto 12px;
        }
        .form-label {
            font-weight: 600;
            color: var(--brand-primary);
            font-size: 13px;
        }
        .form-control {
            padding: 11px 16px;
            font-size: 14px;
            border-radius: 8px;
        }
        .btn-login {
            background-color: var(--brand-primary);
            color: white;
            padding: 12px;
            font-weight: 600;
            border-radius: 8px;
            font-size: 15px;
            border: none;
            transition: all 0.2s;
        }
        .btn-login:hover {
            background-color: var(--brand-secondary);
            color: var(--brand-primary);
        }
    </style>
</head>
<body>

<div class="container">
    <div class="login-card">
        
        <div class="form-header">
            <a href="<?php echo OFFICIAL_DOMAIN; ?>/index.php" class="text-decoration-none">
                <div class="brand-icon">EJ</div>
            </a>
            <h2 class="h5 fw-bold mb-1">Student Workspace</h2>
            <p class="small text-white-50 mb-0">Input credentials to access your dashboard</p>
        </div>

        <div class="p-4 p-md-5">
            <?php if ($registered_success): ?>
                <div class="alert alert-success small mb-4"><?php echo $registered_success; ?></div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="alert alert-danger mb-4Small small text-danger" style="font-size: 13px;"><i class="bi bi-x-circle-fill me-1"></i> <?php echo $error; ?></div>
            <?php endif; ?>

            <form action="" method="POST">
                
                <div class="mb-3">
                    <label class="form-label">Student ID OR Registered Email</label>
                    <input type="text" name="identifier" required class="form-control" placeholder="EJ-2026-6184 or email@domain.com" value="<?php echo isset($_POST['identifier']) ? sanitize($_POST['identifier']) : ''; ?>">
                </div>

                <div class="mb-4">
                    <label class="form-label">Secure Workspace Password</label>
                    <input type="password" name="password" required class="form-control" placeholder="••••••••">
                </div>

                <button type="submit" class="btn btn-login w-100">
                    Access Portal <i class="bi bi-arrow-right-short fs-5 ms-1"></i>
                </button>
            </form>

            <div class="text-center mt-4">
                <span class="small text-muted">Don't have a workspace yet? <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/register.php" class="text-decoration-none fw-bold text-info" style="color: var(--brand-secondary) !important;">Enroll Online</a></span>
                <span class="d-block small text-muted mt-2"><a href="<?php echo OFFICIAL_DOMAIN; ?>/index.php" class="text-decoration-none small text-muted"><i class="bi bi-house"></i> Return to Homepage</a></span>
            </div>

        </div>

    </div>
</div>

</body>
</html>
