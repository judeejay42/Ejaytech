<?php
/**
 * Administrator Portal Login System
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db_connect.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    if (empty($username) || empty($password)) {
        $error = 'Both login fields correspond to required parameters.';
    } else {
        try {
            // Find administrator credentials
            $stmt = $pdo->prepare("SELECT * FROM admins WHERE (username = ? OR email = ?)");
            $stmt->execute([$username, $username]);
            $admin_record = $stmt->fetch();

            if ($admin_record && password_verify($password, $admin_record['password_hash'])) {
                // Administrative Session storage
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $admin_record['id'];
                $_SESSION['admin_username'] = $admin_record['username'];
                $_SESSION['admin_email'] = $admin_record['email'];

                header("Location: " . OFFICIAL_DOMAIN . "/admin/dashboard.php");
                exit;
            } else {
                $error = 'Invalid administrative credentials.';
            }
        } catch (PDOException $e) {
            $error = 'Database connection failure: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admissions Control Center | EJaytech Concepts</title>
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        :root {
            --brand-primary: #0A192F;
            --brand-secondary: #00A8FF;
            --brand-accent: #071120;
        }
        body {
            background-color: var(--brand-accent);
            font-family: 'Inter', sans-serif;
            padding-top: 100px;
        }
        .admin-login-card {
            background: #0C1A30;
            border-radius: 16px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.05);
            overflow: hidden;
            max-width: 420px;
            margin: 0 auto;
        }
        .form-header {
            background-color: var(--brand-primary);
            color: #FFFFFF;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .brand-icon {
            width: 50px;
            height: 50px;
            background-color: var(--brand-secondary);
            color: var(--brand-primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
            margin: 0 auto 12px;
        }
        .form-label {
            font-weight: 500;
            color: #A3B3C2;
            font-size: 13px;
        }
        .form-control {
            background-color: #071120;
            border-color: rgba(255,255,255,0.1);
            color: #FFFFFF;
            padding: 12px 16px;
            font-size: 14px;
            border-radius: 8px;
        }
        .form-control:focus {
            background-color: #071120;
            border-color: var(--brand-secondary);
            color: #FFFFFF;
            box-shadow: 0 0 0 0.15rem rgba(0, 168, 255, 0.2);
        }
        .btn-admin {
            background-color: var(--brand-secondary);
            color: var(--brand-primary);
            padding: 12px;
            font-weight: 600;
            border-radius: 8px;
            font-size: 15px;
            border: none;
            transition: all 0.2s;
        }
        .btn-admin:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="admin-login-card">
        
        <div class="form-header">
            <div class="brand-icon"><i class="bi bi-shield-lock-fill"></i></div>
            <h2 class="h5 fw-bold mb-1 text-white">Admissions Terminal</h2>
            <p class="small text-white-50 mb-0">Authorized personnel authentication dashboard</p>
        </div>

        <div class="p-4 p-md-5">
            <?php if ($error): ?>
                <div class="alert alert-danger px-3 py-2 small" style="background-color: rgba(220,53,69,0.1); color: #E53E3E; border: 1px solid rgba(220,53,69,0.2);"><?php echo $error; ?></div>
            <?php endif; ?>

            <form action="" method="POST">
                
                <div class="mb-3">
                    <label class="form-label">Authorized Username / Email</label>
                    <input type="text" name="username" required class="form-control" placeholder="username">
                </div>

                <div class="mb-4">
                    <label class="form-label">Secure Admin Access Token</label>
                    <input type="password" name="password" required class="form-control" placeholder="••••••••">
                </div>

                <button type="submit" class="btn btn-admin w-100">
                    Decrypt & Authenticate <i class="bi bi-cpu fs-6 ms-1"></i>
                </button>
            </form>

            <div class="text-center mt-4">
                <a href="<?php echo OFFICIAL_DOMAIN; ?>/index.php" class="text-decoration-none small text-white-50"><i class="bi bi-house"></i> Retract to homepage</a>
            </div>

        </div>

    </div>
</div>

</body>
</html>
