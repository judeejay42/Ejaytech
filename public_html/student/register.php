<?php
/**
 * Student Registration Form Handler
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db_connect.php';
require_once __DIR__ . '/../includes/mail_sender.php';

$error = '';
$success = '';

// Process enrollment creation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF verification
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        $error = 'Cross-site request forgery prevention triggered. Please refresh and retry.';
    } else {
        $fullname = trim($_POST['fullname']);
        $email = strtolower(trim($_POST['email']));
        $phone = trim($_POST['phone']);
        $gender = trim($_POST['gender']);
        $dob = trim($_POST['dob']);
        $state = trim($_POST['state']);
        $address = trim($_POST['address']);
        $course = trim($_POST['course']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        // Core constraints
        if (empty($fullname) || empty($email) || empty($phone) || empty($gender) || empty($dob) || empty($state) || empty($address) || empty($course) || empty($password)) {
            $error = 'All fields are required. Please review the registration forms.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid active corporate or personal email address.';
        } elseif (strlen($password) < 6) {
            $error = 'Your security password must consist of at least 6 characters.';
        } elseif ($password !== $confirm_password) {
            $error = 'Confirm Password field does not match. Please verify.';
        } else {
            try {
                // Confirm duplicate email logs
                $stmt = $pdo->prepare("SELECT id FROM students WHERE email = ?");
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    $error = 'This email is already registered on EJaytech Concepts. Try logging in.';
                } else {
                    // Generate Unique Verifiable Student ID (EJ-2026-RANDOM)
                    $student_raw_id = 'EJ-2026-' . rand(1000, 9999);
                    
                    // Verify uniqueness of randomized Student ID
                    $stmt_uniqCheck = $pdo->prepare("SELECT id FROM students WHERE student_id = ?");
                    $stmt_uniqCheck->execute([$student_raw_id]);
                    while ($stmt_uniqCheck->fetch()) {
                        $student_raw_id = 'EJ-2026-' . rand(1000, 9999);
                    }

                    // Hash security password
                    $password_hashed = password_hash($password, PASSWORD_BCRYPT);

                    // Insert to DB
                    $insert_stmt = $pdo->prepare("INSERT INTO students (student_id, fullname, email, phone, gender, dob, state, address, course, password_hash, application_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')");
                    $insert_stmt->execute([
                        $student_raw_id,
                        $fullname,
                        $email,
                        $phone,
                        $gender,
                        $dob,
                        $state,
                        $address,
                        $course,
                        $password_hashed
                    ]);

                    // Seed dynamic announcement for the student
                    $notif_stmt = $pdo->prepare("INSERT INTO notifications (student_id, title, message) VALUES (?, ?, ?)");
                    $notif_stmt->execute([
                        $student_raw_id,
                        'Application Received!',
                        'Hello ' . $fullname . ', we have received your application for the ' . $course . ' track. Check back within 24 hours for admissions team updates.'
                    ]);

                    // Send PHPMailer confirmation email using our custom wrapper
                    $subject = "Enrollment Under Review - " . APP_NAME;
                    $bodyMsg = "
                        <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                            <h2 style='color: #0A192F;'>Welcome to EJaytech Concepts!</h2>
                            <p>Dear <strong>{$fullname}</strong>,</p>
                            <p>Thank you for submitting your application to our academy. We are excited about the possibility of having you in our 2026 cohort!</p>
                            
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                            
                            <p>Here are your enrollment registration parameters:</p>
                            <ul>
                                <li><strong>Temporary Student ID:</strong> <span style='font-family: monospace; font-weight: bold; font-size: 14px; color: #00A8FF;'>{$student_raw_id}</span></li>
                                <li><strong>Selected Track:</strong> {$course}</li>
                                <li><strong>Enrollment Status:</strong> Pending Secretariat Review</li>
                            </ul>
                            
                            <p><strong>Note:</strong> You can use either your <strong>Student ID</strong> or your registered <strong>Email</strong> to access the workspace dashboards. Please wait for an approval email within 24 hours.</p>
                            
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                            
                            <p style='font-size: 11px; color: #777;'>EJaytech Concepts Secretariat Office. Abuja, Nigeria.</p>
                        </div>
                    ";
                    
                    send_system_email($email, $subject, $bodyMsg);

                    // Successfully completed database writes, dispatch success alert session
                    $_SESSION['admission_success_id'] = $student_raw_id;
                    $_SESSION['admission_success_email'] = $email;

                    header("Location: " . OFFICIAL_DOMAIN . "/student/login.php?registered=1");
                    exit;
                }
            } catch (PDOException $e) {
                $error = 'Internal database error during student generation: ' . $e->getMessage();
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration | EJaytech Concepts</title>
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
            color: #4A5568;
            padding-top: 50px;
            padding-bottom: 50px;
        }
        .register-card {
            background: #FFFFFF;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.06);
            border: 1px solid #E2E8F0;
            overflow: hidden;
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
            margin: 0 auto 15px;
        }
        .form-label {
            font-weight: 600;
            color: var(--brand-primary);
            font-size: 13px;
        }
        .form-control, .form-select {
            padding: 11px 16px;
            font-size: 14px;
            border-radius: 8px;
            border-color: #CBD5E1;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--brand-secondary);
            box-shadow: 0 0 0 0.15rem rgba(0, 168, 255, 0.15);
        }
        .btn-register {
            background-color: var(--brand-primary);
            color: white;
            padding: 13px;
            font-weight: 600;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.2s;
            border: none;
        }
        .btn-register:hover {
            background-color: var(--brand-secondary);
            color: var(--brand-primary);
        }
    </style>
</head>
<body>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="register-card">
                
                <div class="form-header">
                    <a href="<?php echo OFFICIAL_DOMAIN; ?>/index.php" class="text-decoration-none">
                        <div class="brand-icon">EJ</div>
                    </a>
                    <h2 class="h4 fw-bold mb-1">Create Student Profile</h2>
                    <p class="small text-white-50 mb-0">EJaytech Concepts Digital Training Academy admissions</p>
                </div>

                <div class="p-4 p-md-5">
                    <?php if ($error): ?>
                        <div class="alert alert-danger mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $error; ?></div>
                    <?php endif; ?>

                    <form action="" method="POST" class="needs-validation">
                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">

                        <div class="row g-4">
                            <!-- Full name -->
                            <div class="col-md-6">
                                <label class="form-label">Full Name <span class="text-danger">*</span></label>
                                <input type="text" name="fullname" required class="form-control" placeholder="John Doe" value="<?php echo isset($_POST['fullname']) ? sanitize($_POST['fullname']) : ''; ?>">
                            </div>

                            <!-- Email -->
                            <div class="col-md-6">
                                <label class="form-label">Email Address <span class="text-danger">*</span></label>
                                <input type="email" name="email" required class="form-control" placeholder="johndoe@gmail.com" value="<?php echo isset($_POST['email']) ? sanitize($_POST['email']) : ''; ?>">
                            </div>

                            <!-- Phone -->
                            <div class="col-md-6">
                                <label class="form-label">Phone Number <span class="text-danger">*</span></label>
                                <input type="tel" name="phone" required class="form-control" placeholder="+234..." value="<?php echo isset($_POST['phone']) ? sanitize($_POST['phone']) : ''; ?>">
                            </div>

                            <!-- Gender -->
                            <div class="col-md-6">
                                <label class="form-label">Gender <span class="text-danger">*</span></label>
                                <select name="gender" required class="form-select">
                                    <option value="">Select Gender</option>
                                    <option value="Male" <?php echo (isset($_POST['gender']) && $_POST['gender'] === 'Male') ? 'selected' : ''; ?>>Male</option>
                                    <option value="Female" <?php echo (isset($_POST['gender']) && $_POST['gender'] === 'Female') ? 'selected' : ''; ?>>Female</option>
                                </select>
                            </div>

                            <!-- Date of Birth -->
                            <div class="col-md-6">
                                <label class="form-label">Date of Birth <span class="text-danger">*</span></label>
                                <input type="date" name="dob" required class="form-control" value="<?php echo isset($_POST['dob']) ? sanitize($_POST['dob']) : ''; ?>">
                            </div>

                            <!-- State of Residence -->
                            <div class="col-md-6">
                                <label class="form-label">State of Residence <span class="text-danger">*</span></label>
                                <input type="text" name="state" required class="form-control" placeholder="Abuja" value="<?php echo isset($_POST['state']) ? sanitize($_POST['state']) : ''; ?>">
                            </div>

                            <!-- Selected Course -->
                            <div class="col-12">
                                <label class="form-label">Select Core Training Course <span class="text-danger">*</span></label>
                                <select name="course" required class="form-select">
                                    <option value="">Select Target Curricula</option>
                                    <option value="Frontend Web Development" <?php echo (isset($_GET['course']) && $_GET['course'] == 'Frontend Web Development') || (isset($_POST['course']) && $_POST['course'] == 'Frontend Web Development') ? 'selected' : ''; ?>>Frontend Web Development</option>
                                    <option value="Graphic Design & Branding" <?php echo (isset($_GET['course']) && $_GET['course'] == 'Graphic Design & Branding') || (isset($_POST['course']) && $_POST['course'] == 'Graphic Design & Branding') ? 'selected' : ''; ?>>Graphic Design & Branding</option>
                                    <option value="UI/UX Product Design" <?php echo (isset($_GET['course']) && $_GET['course'] == 'UI/UX Product Design') || (isset($_POST['course']) && $_POST['course'] == 'UI/UX Product Design') ? 'selected' : ''; ?>>UI/UX Product Design</option>
                                    <option value="Digital Skills & Freelancing" <?php echo (isset($_GET['course']) && $_GET['course'] == 'Digital Skills & Freelancing') || (isset($_POST['course']) && $_POST['course'] == 'Digital Skills & Freelancing') ? 'selected' : ''; ?>>Digital Skills & Freelancing</option>
                                </select>
                            </div>

                            <!-- Address -->
                            <div class="col-12">
                                <label class="form-label">Residential Address <span class="text-danger">*</span></label>
                                <textarea name="address" rows="2" required class="form-control" placeholder="No. 12 Capital Plaza Complex..."><?php echo isset($_POST['address']) ? sanitize($_POST['address']) : ''; ?></textarea>
                            </div>

                            <!-- Password -->
                            <div class="col-md-6">
                                <label class="form-label">Password <span class="text-danger">*</span></label>
                                <input type="password" name="password" required class="form-control" placeholder="••••••••">
                            </div>

                            <!-- Confirm Password -->
                            <div class="col-md-6">
                                <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
                                <input type="password" name="confirm_password" required class="form-control" placeholder="••••••••">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-register w-100 mt-5">
                            Submit Application <i class="bi bi-check-circle ms-1"></i>
                        </button>
                    </form>

                    <div class="text-center mt-4">
                        <span class="small text-muted">Already registered a student profile? <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/login.php" class="text-decoration-none fw-bold text-info" style="color: var(--brand-secondary) !important;">Sign In Here</a></span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
