<?php
/**
 * Student Private Dashboard
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db_connect.php';

// Route Guard: verify student logged in session
if (!isset($_SESSION['student_logged_in'])) {
    header("Location: " . OFFICIAL_DOMAIN . "/student/login.php");
    exit;
}

$student_id = $_SESSION['student_id'];
$student_name = $_SESSION['student_name'];
$student_email = $_SESSION['student_email'];
$student_course = $_SESSION['student_course'];

// Dynamically refresh student profile states from MySQL
try {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
    $stmt->execute([$_SESSION['student_db_id']]);
    $student_profile = $stmt->fetch();
    if ($student_profile) {
        $student_status = $student_profile['application_status'];
        $_SESSION['student_status'] = $student_status;
    } else {
        $student_status = $_SESSION['student_status'];
    }
} catch (\Exception $e) {
    $student_status = $_SESSION['student_status'];
}

// Fetch in-app notifications
$notifications = [];
try {
    $stmt = $pdo->prepare("SELECT * FROM notifications WHERE (student_id = ? OR student_id = 'all') ORDER BY created_at DESC");
    $stmt->execute([$student_id]);
    $notifications = $stmt->fetchAll();
} catch (\Exception $e) {
    // Fail silently
}

// Fetch materials that match student course
$materials = [];
try {
    // Map student course names to typical seeded IDs
    $courseId = 'course-1';
    if (stripos($student_course, 'graphic') !== false) {
        $courseId = 'course-2';
    } elseif (stripos($student_course, 'ux') !== false || stripos($student_course, 'product') !== false) {
        $courseId = 'course-3';
    } elseif (stripos($student_course, 'digital') !== false || stripos($student_course, 'free') !== false) {
        $courseId = 'course-4';
    }

    $stmt = $pdo->prepare("SELECT * FROM learning_materials WHERE course_id = ? ORDER BY uploaded_at DESC");
    $stmt->execute([$courseId]);
    $materials = $stmt->fetchAll();
} catch (\Exception $e) {
    // Fail silently
}

// Fallback materials if database table is empty or driver error
if (empty($materials)) {
    if (stripos($student_course, 'web') !== false || stripos($student_course, 'frontend') !== false) {
        $materials = [
            ['title' => 'Introduction to HTML5 Semantic Tags', 'file_path' => '#', 'file_size' => '1.2 MB', 'uploaded_at' => '2026-06-15'],
            ['title' => 'Responsive Grid & Flexbox Sizing Guide', 'file_path' => '#', 'file_size' => '850 KB', 'uploaded_at' => '2026-06-16']
        ];
    } elseif (stripos($student_course, 'graphic') !== false) {
        $materials = [
            ['title' => 'Photoshop Layer Masking & Pen Tool Rules', 'file_path' => '#', 'file_size' => '2.4 MB', 'uploaded_at' => '2026-06-15'],
            ['title' => 'Corporate Branding Grid Guidelines (PDF)', 'file_path' => '#', 'file_size' => '1.8 MB', 'uploaded_at' => '2026-06-16']
        ];
    } else {
        $materials = [
            ['title' => 'General Syllabus Checklist & Freelance Setup', 'file_path' => '#', 'file_size' => '950 KB', 'uploaded_at' => '2026-06-15']
        ];
    }
}

// Process student configuration profile log updates
$profileSuccess = '';
$profileError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_profile') {
    $fullname = trim($_POST['fullname']);
    $phone = trim($_POST['phone']);
    $address = trim($_POST['address']);
    $bio = trim($_POST['bio']);

    if ($fullname && $phone && $address) {
        try {
            $stmt = $pdo->prepare("UPDATE students SET fullname = ?, phone = ?, address = ?, bio = ? WHERE id = ?");
            $stmt->execute([$fullname, $phone, $address, $bio, $_SESSION['student_db_id']]);
            $_SESSION['student_name'] = $fullname;
            $student_name = $fullname;
            $profileSuccess = 'Your student profile parameters have been updated compiled successfully!';
        } catch (\Exception $e) {
            $profileError = 'Profile update aborted: ' . $e->getMessage();
        }
    } else {
        $profileError = 'Fullname, phone number, and address correspond to mandatory items.';
    }
}

// Student Logout process
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: " . OFFICIAL_DOMAIN . "/student/login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard | <?php echo APP_NAME; ?></title>
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
        }
        .header-bar {
            background-color: var(--brand-primary);
            color: white;
            padding: 20px 0;
        }
        .dashboard-card {
            background: #FFFFFF;
            border-radius: 12px;
            border: 1px solid #E2E8F0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            margin-bottom: 25px;
        }
        .nav-pills .nav-link {
            color: var(--brand-primary);
            font-weight: 500;
            padding: 12px 20px;
            font-size: 14px;
        }
        .nav-pills .nav-link.active {
            background-color: var(--brand-primary);
            color: white;
        }
        .status-pill {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 6px 14px;
            border-radius: 50px;
        }
        .status-Pending { background-color: #FEF3C7; color: #D97706; }
        .status-Approved { background-color: #D1FAE5; color: #059669; }
        .status-Rejected { background-color: #FEE2E2; color: #DC2626; }
    </style>
</head>
<body>

    <!-- Upper Portal Navigation Header -->
    <header class="header-bar shadow">
        <div class="container d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
                <div class="bg-info text-primary fw-bold px-2.5 py-1.5 rounded-3 fs-6" style="background-color: var(--brand-secondary) !important; color: var(--brand-primary) !important; padding: 4px 10px; font-weight: bold; border-radius: 8px;">EJ</div>
                <span class="fs-5 fw-bold text-white mb-0">Student Hub</span>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="small d-none d-sm-inline opacity-75">ID: <strong><?php echo sanitize($student_id); ?></strong></span>
                <a href="?logout=1" class="btn btn-outline-light btn-sm rounded-pill px-3"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </div>
    </header>

    <div class="container py-5">
        <div class="row">
            
            <!-- Welcome Info banner -->
            <div class="col-12 mb-4">
                <div class="dashboard-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h1 class="h3 fw-bold mb-1">Welcome back, <?php echo sanitize($student_name); ?>!</h1>
                        <p class="text-muted small mb-0">Check syllabus updates, download certificates, and fetch learning materials.</p>
                    </div>
                    <div>
                        <span class="status-pill status-<?php echo $student_status; ?>">
                            <?php echo $student_status; ?> Enrollment
                        </span>
                    </div>
                </div>
            </div>

            <!-- Left Navigation menu sidebar -->
            <div class="col-lg-3 col-md-12 mb-4">
                <div class="dashboard-card p-3">
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button class="nav-link active text-start mb-2" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-selected="true"><i class="bi bi-person-fill me-2"></i> Profile & Status</button>
                        <button class="nav-link text-start mb-2" id="v-pills-classes-tab" data-bs-toggle="pill" data-bs-target="#v-pills-classes" type="button" role="tab" aria-selected="false"><i class="bi bi-journal-bookmark-fill me-2"></i> Learning Materials</button>
                        <button class="nav-link text-start mb-2" id="v-pills-certs-tab" data-bs-toggle="pill" data-bs-target="#v-pills-certs" type="button" role="tab" aria-selected="false"><i class="bi bi-award-fill me-2"></i> Certifications</button>
                    </div>
                </div>
            </div>

            <!-- Right Content Panels Grid -->
            <div class="col-lg-9 col-md-12">
                <div class="tab-content" id="v-pills-tabContent">
                    
                    <!-- Tab 1: Profile and Status Check -->
                    <div class="tab-pane fade show active" id="v-pills-profile" role="tabpanel">
                        
                        <!-- Notification banner list -->
                        <?php if (count($notifications) > 0): ?>
                            <div class="dashboard-card p-4">
                                <h4 class="h6 fw-bold mb-3 text-uppercase font-monospace tracking-wide text-secondary"><i class="bi bi-bell-fill text-warning me-1"></i> Admin Notifications</h4>
                                <div class="list-group list-group-flush">
                                    <?php foreach ($notifications as $n): ?>
                                        <div class="list-group-item px-0 py-3">
                                            <h6 class="fw-bold text-dark mb-1 d-flex justify-content-between align-items-center">
                                                <span><?php echo sanitize($n['title']); ?></span>
                                                <small class="text-muted fw-normal font-monospace" style="font-size: 10px;"><?php echo date('Y-m-d H:i', strtotime($n['created_at'])); ?></small>
                                            </h6>
                                            <p class="small text-muted mb-0"><?php echo sanitize($n['message']); ?></p>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endif; ?>

                        <!-- Enrollment parameters card -->
                        <div class="dashboard-card p-4">
                            <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Admission Parameters</h4>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <span class="small text-muted d-block font-monospace">Student ID</span>
                                    <strong class="text-info fs-6 font-monospace" style="color: var(--brand-secondary) !important;"><?php echo sanitize($student_id); ?></strong>
                                </div>
                                <div class="col-md-6">
                                    <span class="small text-muted d-block font-monospace">Authorized Email</span>
                                    <strong class="text-dark fs-6"><?php echo sanitize($student_email); ?></strong>
                                </div>
                                <div class="col-md-6">
                                    <span class="small text-muted d-block font-monospace">Admissions Syllabus</span>
                                    <strong class="text-dark fs-6"><?php echo sanitize($student_course); ?></strong>
                                </div>
                                <div class="col-md-6">
                                    <span class="small text-muted d-block font-monospace">Authorization Status</span>
                                    <strong class="text-dark fs-6"><?php echo sanitize($student_status); ?></strong>
                                </div>
                            </div>
                            
                            <?php if ($student_status === 'Pending'): ?>
                                <div class="alert alert-warning mt-4 mb-0 small">
                                    <i class="bi bi-info-circle-fill me-1"></i> Your enrollment is currently under review by the secretariat board. Learning materials and certification controls will be unlocked as soon as an Admissions Administrator changes your status to <strong>Approved</strong>. Keep checking this portal or monitor your registered email.
                                </div>
                            <?php elseif ($student_status === 'Rejected'): ?>
                                <div class="alert alert-danger mt-4 mb-0 small">
                                    <i class="bi bi-x-circle-fill me-1"></i> Your application has been declined. Please write to <strong>info@ejaytechconcepts.com</strong> with your Student ID for clarification.
                                </div>
                            <?php endif; ?>
                        </div>

                        <!-- Update biodata parameters -->
                        <div class="dashboard-card p-4">
                            <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Manage profile biodata</h4>
                            <?php if ($profileSuccess): ?>
                                <div class="alert alert-success small"><?php echo $profileSuccess; ?></div>
                            <?php elseif ($profileError): ?>
                                <div class="alert alert-danger small"><?php echo $profileError; ?></div>
                            <?php endif; ?>

                            <form action="" method="POST">
                                <input type="hidden" name="action" value="update_profile">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" name="fullname" required class="form-control" value="<?php echo isset($student_profile['fullname']) ? sanitize($student_profile['fullname']) : sanitize($student_name); ?>">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Phone Number</label>
                                        <input type="tel" name="phone" required class="form-control" value="<?php echo isset($student_profile['phone']) ? sanitize($student_profile['phone']) : ''; ?>">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Residential Address</label>
                                        <input type="text" name="address" required class="form-control" value="<?php echo isset($student_profile['address']) ? sanitize($student_profile['address']) : ''; ?>">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Personal Biography (Optional)</label>
                                        <textarea name="bio" rows="2" class="form-control" placeholder="Tell us about yourself..."><?php echo isset($student_profile['bio']) ? sanitize($student_profile['bio']) : ''; ?></textarea>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-sm mt-3 px-3 py-2 text-white bg-dark border-0">Save Changes</button>
                            </form>
                        </div>

                    </div>

                    <!-- Tab 2: Class Learning Materials -->
                    <div class="tab-pane fade" id="v-pills-classes" role="tabpanel">
                        <div class="dashboard-card p-4">
                            <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Syllabus Class Materials</h4>
                            <p class="text-muted small">Fetch study materials assigned specifically to the <strong><?php echo sanitize($student_course); ?></strong> curricula.</p>

                            <?php if ($student_status !== 'Approved'): ?>
                                <div class="alert alert-info py-4 text-center mt-3 mb-0">
                                    <i class="bi bi-lock-fill display-6 d-block mb-2 text-warning"></i>
                                    <h5>Syllabus Locked</h5>
                                    <p class="small text-muted mb-0">Study materials will be accessible as soon as your admission status is set to <strong>Approved</strong> by E-Learning Administrators.</p>
                                </div>
                            <?php else: ?>
                                <div class="row g-3 mt-2">
                                    <?php foreach ($materials as $index => $m): ?>
                                        <div class="col-12">
                                            <div class="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 class="fw-bold text-dark mb-1"><i class="bi bi-file-pdf-fill text-danger me-1"></i> <?php echo sanitize($m['title']); ?></h6>
                                                    <span class="text-muted font-monospace" style="font-size: 11px;">Track Material · size: <?php echo isset($m['file_size']) ? sanitize($m['file_size']) : '1.2 MB'; ?></span>
                                                </div>
                                                <a href="<?php echo sanitize($m['file_path']); ?>" class="btn btn-info btn-sm text-primary fw-bold" target="_blank">
                                                    <i class="bi bi-download"></i> Fetch Doc
                                                </a>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Tab 3: Certifications check controls -->
                    <div class="tab-pane fade" id="v-pills-certs" role="tabpanel">
                        <div class="dashboard-card p-4">
                            <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Academic Certifications</h4>
                            
                            <?php if ($student_status !== 'Approved'): ?>
                                <div class="alert alert-info py-4 text-center mb-0">
                                    <i class="bi bi-lock-fill display-6 d-block mb-3 text-warning"></i>
                                    <h5>Certificates Unreleased</h5>
                                    <p class="small text-muted mb-0">Certificates are issued only to active, approved candidates of EJaytech digital academy cohorts.</p>
                                </div>
                            <?php else: ?>
                                <div class="text-center p-5">
                                    <i class="bi bi-award display-2 text-warning animate-bounce"></i>
                                    <h4 class="fw-bold text-dark mt-3">Certification of Completion</h4>
                                    <p class="text-muted small mx-auto" style="max-width: 500px;">Congratulations! You have completed all syllabus benchmarks and project defenses with EJaytech digital academy.</p>
                                    
                                    <button onclick="triggerDownCert()" class="btn btn-brand-primary rounded-pill px-4 py-2 mt-2">
                                        <i class="bi bi-award-fill"></i> Download Professional Certificate
                                    </button>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

    <!-- Script triggers -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        function triggerDownCert() {
            var win = window.open('', '_blank');
            if(!win) {
                alert('Pop-up blocked. Please permit pop-ups on the dashboard.');
                return;
            }
            win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Certificate - <?php echo addslashes($student_name); ?></title>
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { margin: 0; padding: 40px; background: #F5F7FA; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; }
                        .cert-container { width: 842px; height: 595px; background: #FFFFFF; border: 24px solid #0A192F; box-shadow: 0 10px 30px rgba(0,0,0,0.15); padding: 40px; box-sizing: border-box; position: relative; display: flex; flex-direction: column; justify-content: space-between; }
                        .cert-decor { position: absolute; width: 100px; height: 100px; border-bottom: 3px solid #00A8FF; border-right: 3px solid #00A8FF; bottom: 20px; right: 20px; }
                        .cert-decor-top { position: absolute; width: 100px; height: 100px; border-top: 3px solid #00A8FF; border-left: 3px solid #00A8FF; top: 20px; left: 20px; }
                        .cert-header { text-align: center; margin-top: 20px; }
                        .cert-header h1 { font-family: 'Playfair Display', serif; color: #0A192F; margin: 0; font-size: 38px; text-transform: uppercase; letter-spacing: 2px; }
                        .cert-header p { font-size: 11px; text-transform: uppercase; tracking: 3px; color: #00A8FF; margin: 5px 0 0; font-weight: 700; }
                        .cert-body { text-align: center; margin: 30px 0; }
                        .cert-body p { font-size: 13px; color: #666; margin: 5px 0; }
                        .student-name { font-family: 'Playfair Display', serif; color: #0A192F; font-size: 32px; font-weight: 700; margin: 15px 0; border-bottom: 2px double #E2E8F0; display: inline-block; padding: 0 40px; font-style: italic; }
                        .course-name { color: #00A8FF; font-weight: 700; font-size: 18px; }
                        .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; padding: 0 30px; }
                        .signature-block { text-align: center; border-top: 1px solid #CBD5E1; width: 180px; padding-top: 5px; }
                        .signature-block span { font-size: 10px; color: #666; display: block; text-transform: uppercase; tracking: 1px; }
                        .signature-block strong { font-size: 11px; color: #0A192F; display: block; margin-top: 3px; }
                        .cert-seal { width: 70px; height: 70px; border-radius: 50%; border: 2px dashed #00A8FF; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #0A192F; text-transform: uppercase; line-height: 1.1; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="cert-container">
                        <div class="cert-decor-top"></div>
                        <div class="cert-decor"></div>
                        
                        <div class="cert-header">
                            <h1>Certificate of Completion</h1>
                            <p>EJaytech Concepts Digital Training Academy</p>
                        </div>
                        
                        <div class="cert-body">
                            <p>This is to proudly certify that</p>
                            <div class="student-name"><?php echo addslashes($student_name); ?></div>
                            <p>has successfully completed all intensive class modules, practical defenses, and coding benchmarks for</p>
                            <p class="course-name"><?php echo addslashes($student_course); ?></p>
                            <p>issued with excellent academic standards in the year 2026.</p>
                        </div>
                        
                        <div class="cert-footer">
                            <div class="signature-block">
                                <strong>Elijah Yahuza</strong>
                                <span>Director of Training</span>
                            </div>
                            <div class="cert-seal">
                                EJaytech<br>Academy<br>Abuja
                            </div>
                            <div class="signature-block">
                                <strong>Admissions Board</strong>
                                <span>Secratariats Office</span>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `);
            win.document.close();
        }
    </script>
</body>
</html>
