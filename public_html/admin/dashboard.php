<?php
/**
 * Corporate Administration Core Portal Dashboard
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db_connect.php';
require_once __DIR__ . '/../includes/mail_sender.php';

// Route Guard: verfiy administrator authorization
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: " . OFFICIAL_DOMAIN . "/admin/login.php");
    exit;
}

$admin_username = $_SESSION['admin_username'];
$admin_email = $_SESSION['admin_email'];

$success_action_msg = "";
$error_action_msg = "";

// ------------------------------------------------------
// FORM & STATUS EVENT HANDLING
// ------------------------------------------------------

// 1. Approve Applicant Flow
if (isset($_GET['approve_id'])) {
    $approve_id = (int)$_GET['approve_id'];
    try {
        $stmt_stu = $pdo->prepare("SELECT * FROM students WHERE id = ?");
        $stmt_stu->execute([$approve_id]);
        $stu_record = $stmt_stu->fetch();

        if ($stu_record) {
            // Update status to Approved
            $up_stmt = $pdo->prepare("UPDATE students SET application_status = 'Approved' WHERE id = ?");
            $up_stmt->execute([$approve_id]);

            // Add notification alert
            $notif_stmt = $pdo->prepare("INSERT INTO notifications (student_id, title, message) VALUES (?, ?, ?)");
            $notif_stmt->execute([
                $stu_record['student_id'],
                'Welcome, Enrollment Approved!',
                'Your EJaytech Digital Academy application has been approved by our administrators! Learning materials and certificate controls are unlocked.'
            ]);

            // Disptach cPanel/Gmail SMTP PHPMailer invitation
            $subject = "Application Approved - " . APP_NAME;
            $bodyMsg = "
                <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <h2 style='color: #059669;'>Congratulations! Your Application was Approved</h2>
                    <p>Dear <strong>{$stu_record['fullname']}</strong>,</p>
                    <p>We are thrilled to inform you that your registration to EJaytech digital academy has been officially <strong>Approved</strong>!</p>
                    
                    <hr style='border: none; border-top: 1px solid #ddd; margin: 25px 0;'>
                    
                    <p>Log in with your credentials to explore custom course files, study benchmarks, and view progress trackers:</p>
                    <ul>
                        <li><strong>Your Confirmed Student ID:</strong> <span style='font-family: monospace; font-weight: bold; color: #00A8FF; font-size: 15px;'>{$stu_record['student_id']}</span></li>
                        <li><strong>Track Name:</strong> {$stu_record['course']}</li>
                    </ul>
                    <p><a href='" . OFFICIAL_DOMAIN . "/student/login.php' style='display: inline-block; padding: 12px 24px; background-color: #0A192F; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;'>Launch Student Workspace</a></p>
                    
                    <hr style='border: none; border-top: 1px solid #ddd; margin: 25px 0;'>
                    <p style='font-size: 11px; color: #777;'>EJaytech Concepts Secretariat Office. Abuja, Nigeria.</p>
                </div>
            ";
            send_system_email($stu_record['email'], $subject, $bodyMsg);

            $success_action_msg = "Applicant APPROVED successfully! Live SMTP confirmation email has been logged and dispatched.";
        }
    } catch (\Exception $e) {
        $error_action_msg = "Approval failed: " . $e->getMessage();
    }
}

// 2. Reject Applicant Flow
if (isset($_GET['reject_id'])) {
    $reject_id = (int)$_GET['reject_id'];
    try {
        $stmt_stu = $pdo->prepare("SELECT * FROM students WHERE id = ?");
        $stmt_stu->execute([$reject_id]);
        $stu_record = $stmt_stu->fetch();

        if ($stu_record) {
            // Update status to Rejected
            $up_stmt = $pdo->prepare("UPDATE students SET application_status = 'Rejected' WHERE id = ?");
            $up_stmt->execute([$reject_id]);

            // Add notification alert
            $notif_stmt = $pdo->prepare("INSERT INTO notifications (student_id, title, message) VALUES (?, ?, ?)");
            $notif_stmt->execute([
                $stu_record['student_id'],
                'Application update',
                'Your application has been reviewed and declined. Please contact support if you need further assistance.'
            ]);

            // Disptach regret email over SMTP
            $subject = "Application Status Update - " . APP_NAME;
            $bodyMsg = "
                <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <h2 style='color: #DC2626;'>Application Update</h2>
                    <p>Dear <strong>{$stu_record['fullname']}</strong>,</p>
                    <p>Thank you for your interest in EJaytech Concepts Digital Training. After reviewing your registration, we regret to inform you that your application has been declined for this cohort.</p>
                    <p>Our training tracks maintain tight capacity controls. We encourage you to improve your applications profile and apply in our upcoming cohorts.</p>
                    <hr style='border: none; border-top: 1px solid #ddd; margin: 25px 0;'>
                    <p style='font-size: 11px; color: #777;'>EJaytech Concepts Secretariat Office. Abuja, Nigeria.</p>
                </div>
            ";
            send_system_email($stu_record['email'], $subject, $bodyMsg);

            $success_action_msg = "Applicant REJECTED. Reject confirmation email has been logged is SMTP records.";
        }
    } catch (\Exception $e) {
        $error_action_msg = "Rejection failed: " . $e->getMessage();
    }
}

// 3. Add Course Flow
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_course') {
    $id = 'course-' . rand(10, 99);
    $title = trim($_POST['title']);
    $desc = trim($_POST['desc']);
    $dur = trim($_POST['duration']);
    $fee = trim($_POST['fee']);
    $syll = trim($_POST['syllabus']); // comma separated

    if ($title && $desc && $dur && $fee) {
        try {
            $stmt = $pdo->prepare("INSERT INTO courses (id, title, description, duration, fee, syllabus) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $title, $desc, $dur, $fee, $syll]);
            $success_action_msg = "New training course curriculum added successfully into MySQL archives!";
        } catch (\Exception $e) {
            $error_action_msg = "Failed to store course: " . $e->getMessage();
        }
    }
}

// 4. Upload Learning Materials Flow
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_material') {
    $course_id = trim($_POST['course_id']);
    $title = trim($_POST['title']);
    $file_path = trim($_POST['file_path']); // typically shared Google doc link or physical uploaded file pointer

    if ($course_id && $title && $file_path) {
        try {
            $stmt = $pdo->prepare("INSERT INTO learning_materials (course_id, title, file_path, file_size) VALUES (?, ?, ?, ?)");
            $stmt->execute([$course_id, $title, $file_path, rand(500, 3000) . ' KB']);
            $success_action_msg = "Study lecture material linked successfully! Unlocked on course dashboard.";
        } catch (\Exception $e) {
            $error_action_msg = "Material configuration failed: " . $e->getMessage();
        }
    }
}

// 5. Send Broadcast Notifications Announcement Flow
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'broadcast') {
    $title = trim($_POST['title']);
    $msg = trim($_POST['message']);

    if ($title && $msg) {
        try {
            $stmt = $pdo->prepare("INSERT INTO notifications (student_id, title, message) VALUES ('all', ?, ?)");
            $stmt->execute([$title, $msg]);
            $success_action_msg = "Global broadcast announcement posted live to all students workspaces!";
        } catch (\Exception $e) {
            $error_action_msg = "Broadcast failed: " . $e->getMessage();
        }
    }
}


// ------------------------------------------------------
// DATA COLLECTION QUERIES (METRICS)
// ------------------------------------------------------
$total_students = 0;
$pending_apps = 0;
$approved_apps = 0;
$rejected_apps = 0;
$total_courses = 0;

$students_list = [];
$courses_list = [];
$email_logs = [];
$newsletter_subscribers = [];
$contact_inquiries = [];

try {
    if (isset($pdo)) {
        // Query metric aggregates
        $total_students = (int)$pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
        $pending_apps = (int)$pdo->query("SELECT COUNT(*) FROM students WHERE application_status = 'Pending'")->fetchColumn();
        $approved_apps = (int)$pdo->query("SELECT COUNT(*) FROM students WHERE application_status = 'Approved'")->fetchColumn();
        $rejected_apps = (int)$pdo->query("SELECT COUNT(*) FROM students WHERE application_status = 'Rejected'")->fetchColumn();
        $total_courses = (int)$pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();

        // Query collections listings
        $students_list = $pdo->query("SELECT * FROM students ORDER BY id DESC")->fetchAll();
        $courses_list = $pdo->query("SELECT * FROM courses ORDER BY id ASC")->fetchAll();
        $email_logs = $pdo->query("SELECT * FROM email_logs ORDER BY id DESC LIMIT 50")->fetchAll();
        $newsletter_subscribers = $pdo->query("SELECT * FROM newsletter_subscribers ORDER BY id DESC")->fetchAll();
        $contact_inquiries = $pdo->query("SELECT * FROM contact_inquiries ORDER BY id DESC")->fetchAll();
    }
} catch (\Exception $e) {
    // Graceful error layout if PDO connection has placeholders
}

// Admin Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: " . OFFICIAL_DOMAIN . "/admin/login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admissions Console | <?php echo APP_NAME; ?></title>
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
            color: #334155;
        }
        .admin-sidebar {
            background-color: var(--brand-primary);
            color: #FFFFFF;
            min-height: 100vh;
        }
        .metric-card {
            background: #FFFFFF;
            border-radius: 12px;
            border: 1px solid #E2E8F0;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.01);
        }
        .metric-card h3 {
            font-size: 28px;
            font-weight: 700;
        }
        .table-card {
            background: #FFFFFF;
            border-radius: 12px;
            border: 1px solid #E2E8F0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.01);
            overflow: hidden;
            margin-bottom: 30px;
        }
        .badge-status {
            font-size: 10px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 50px;
            text-transform: uppercase;
        }
        .badge-Pending { background-color: #FEF3C7; color: #D97706; }
        .badge-Approved { background-color: #D1FAE5; color: #059669; }
        .badge-Rejected { background-color: #FEE2E2; color: #DC2626; }
    </style>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        
        <!-- SIDEBAR CONTAINER COLUMN -->
        <div class="col-lg-2 col-md-3 admin-sidebar p-4 flex-column d-flex justify-content-between">
            <div>
                <div class="d-flex align-items-center gap-2 mb-5">
                    <div class="brand-logo bg-light text-primary fw-bold px-3 py-2 rounded-3 fs-5" style="background-color: var(--brand-secondary) !important; color: var(--brand-primary) !important; font-weight: bold;">EJ</div>
                    <span class="fs-6 fw-bold text-white mb-0">Admissions Desk</span>
                </div>

                <div class="nav flex-column nav-pills" id="admin-pills-tab" role="tablist" aria-orientation="vertical">
                    <button class="nav-link text-white text-start active mb-2 border-0" id="pill-metric-tab" data-bs-toggle="pill" data-bs-target="#pill-metric" type="button" role="tab"><i class="bi bi-speedometer2 me-2 text-info"></i> Metrics & Apps</button>
                    <button class="nav-link text-white text-start mb-2 border-0" id="pill-course-tab" data-bs-toggle="pill" data-bs-target="#pill-course" type="button" role="tab"><i class="bi bi-journal-check me-2 text-info"></i> Course Manager</button>
                    <button class="nav-link text-white text-start mb-2 border-0" id="pill-material-tab" data-bs-toggle="pill" data-bs-target="#pill-material" type="button" role="tab"><i class="bi bi-cloud-arrow-up me-2 text-info"></i> Materials link</button>
                    <button class="nav-link text-white text-start mb-2 border-0" id="pill-broadcast-tab" data-bs-toggle="pill" data-bs-target="#pill-broadcast" type="button" role="tab"><i class="bi bi-broadcast me-2 text-info"></i> Broadcasts</button>
                    <button class="nav-link text-white text-start mb-2 border-0" id="pill-logs-tab" data-bs-toggle="pill" data-bs-target="#pill-logs" type="button" role="tab"><i class="bi bi-cpu me-2 text-info"></i> Email Log Records</button>
                </div>
            </div>

            <div class="pt-5 border-top border-secondary-subtle">
                <span class="small d-block text-white-50 font-monospace mb-2" style="font-size: 11px;">Admin: <?php echo sanitize($admin_username); ?></span>
                <a href="?logout=1" class="btn btn-danger btn-sm w-100 rounded-3"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </div>

        <!-- MAIN DATA CENTER PAYLOAD -->
        <div class="col-lg-10 col-md-9 p-4 p-md-5">
            
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h2 fw-bold mb-1">Control Operations Console</h1>
                    <p class="text-muted small mb-0">Review Registrations, Send notifications, Dispatch SMTP PHPMailers, and configure digital syllabus curriculas.</p>
                </div>
                <div class="badge bg-danger-subtle text-danger p-2 font-monospace uppercase border">SYS LIVE SECURED</div>
            </div>

            <!-- SUCCESS AND ERROR BANNER DISPATCHERS -->
            <?php if ($success_action_msg): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i> <?php echo $success_action_msg; ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php elseif ($error_action_msg): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $error_action_msg; ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>


            <div class="tab-content" id="admin-pills-tabContent">
                
                <!-- METRICS & APPLICANTS PANEL -->
                <div class="tab-pane fade show active" id="pill-metric" role="tabpanel">
                    
                    <!-- Metrics counters grid -->
                    <div class="row g-4 mb-5">
                        <div class="col-md-3">
                            <div class="metric-card">
                                <span class="text-secondary small font-monospace tracking-wide text-uppercase d-block mb-1">TOTAL ENROLLMENTS</span>
                                <h3 class="text-dark mb-0"><?php echo $total_students; ?></h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="metric-card bg-warning-subtle border-warning-subtle" style="background-color: #FEF3C7 !important; border-color: #FDE68A !important;">
                                <span class="text-warning-emphasis small font-monospace tracking-wide text-uppercase d-block mb-1">PENDING REVIEW</span>
                                <h3 class="text-warning-emphasis mb-0"><?php echo $pending_apps; ?></h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="metric-card bg-success-subtle border-success-subtle" style="background-color: #D1FAE5 !important; border-color: #A7F3D0 !important;">
                                <span class="text-success-emphasis small font-monospace tracking-wide text-uppercase d-block mb-1">APPROVED</span>
                                <h3 class="text-success-emphasis mb-0"><?php echo $approved_apps; ?></h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="metric-card bg-danger-subtle border-danger-subtle" style="background-color: #FEE2E2 !important; border-color: #FCA5A5 !important;">
                                <span class="text-danger-emphasis small font-monospace tracking-wide text-uppercase d-block mb-1">REJECTED</span>
                                <h3 class="text-danger-emphasis mb-0"><?php echo $rejected_apps; ?></h3>
                            </div>
                        </div>
                    </div>

                    <!-- Applicants management table -->
                    <div class="table-card p-4">
                        <h3 class="h5 fw-bold border-bottom pb-2 mb-3">Admissions Registrations Dossier</h3>
                        <div class="table-responsive">
                            <table class="table align-middle table-hover">
                                <thead class="table-light">
                                    <tr style="font-size: 13px;">
                                        <th>Student ID</th>
                                        <th>Full Name</th>
                                        <th>Contact Details</th>
                                        <th>Target Course Track</th>
                                        <th>Applicant Status</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody style="font-size: 13.5px;">
                                    <?php if (count($students_list) == 0): ?>
                                        <tr>
                                            <td colspan="6" class="text-center text-muted py-4">No student registrations logged on MySQL database folder. Play online registration from the frontpage.</td>
                                        </tr>
                                    <?php else: ?>
                                        <?php foreach ($students_list as $stu): ?>
                                            <tr>
                                                <td class="font-monospace fw-bold text-info"><?php echo sanitize($stu['student_id']); ?></td>
                                                <td>
                                                    <span class="d-block fw-semibold text-dark"><?php echo sanitize($stu['fullname']); ?></span>
                                                    <span class="text-muted d-block" style="font-size: 11px;">DOB: <?php echo sanitize($stu['dob']); ?> · Gender: <?php echo sanitize($stu['gender']); ?></span>
                                                </td>
                                                <td>
                                                    <span class="d-block"><i class="bi bi-envelope-fill text-muted me-1"></i> <?php echo sanitize($stu['email']); ?></span>
                                                    <span class="text-muted d-block" style="font-size: 11.5px;"><i class="bi bi-telephone-fill text-muted me-1"></i> <?php echo sanitize($stu['phone']); ?></span>
                                                </td>
                                                <td class="fw-medium text-dark"><?php echo sanitize($stu['course']); ?></td>
                                                <td>
                                                    <span class="badge-status badge-<?php echo $stu['application_status']; ?>">
                                                        <?php echo $stu['application_status']; ?>
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <?php if ($stu['application_status'] === 'Pending'): ?>
                                                        <a href="?approve_id=<?php echo $stu['id']; ?>" class="btn btn-success btn-sm me-1" title="Approve candidate"><i class="bi bi-check-circle"></i> Approve</a>
                                                        <a href="?reject_id=<?php echo $stu['id']; ?>" class="btn btn-outline-danger btn-sm" title="Decline candidate" onclick="return confirm('Confirm rejection details?');"><i class="bi bi-x-circle"></i> Reject</a>
                                                    <?php else: ?>
                                                        <span class="text-muted small italic">Processed</span>
                                                    <?php endif; ?>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <!-- Guests Inquiries section -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-7">
                            <div class="table-card p-4">
                                <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Guests Contacts Secretariat Inquiries</h4>
                                <div class="table-responsive max-h-[300px]" style="overflow-y: auto;">
                                    <table class="table table-sm align-middle small">
                                        <thead>
                                            <tr>
                                                <th>Sender</th>
                                                <th>Topic</th>
                                                <th>Query</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php if (count($contact_inquiries) == 0): ?>
                                                <tr><td colspan="3" class="text-muted text-center py-3">No contact desk inquiries submitted yet.</td></tr>
                                            <?php else: ?>
                                                <?php foreach ($contact_inquiries as $inq): ?>
                                                    <tr>
                                                        <td><strong><?php echo sanitize($inq['fullname']); ?></strong><br><span class="text-muted"><?php echo sanitize($inq['email']); ?></span></td>
                                                        <td><span class="text-primary"><?php echo sanitize($inq['subject']); ?></span></td>
                                                        <td style="max-width: 250px;"><p class="mb-0 text-muted" style="font-size: 11px;"><?php echo sanitize($inq['message']); ?></p></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                            <?php endif; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Newsletter users list -->
                        <div class="col-md-5">
                            <div class="table-card p-4">
                                <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Newsletter Subscriptions (<?php echo count($newsletter_subscribers); ?>)</h4>
                                <div class="list-group list-group-flush max-h-[300px]" style="overflow-y: auto;">
                                    <?php if (count($newsletter_subscribers) == 0): ?>
                                        <div class="text-muted text-center py-3">No newsletter subscriptions logs.</div>
                                    <?php else: ?>
                                        <?php foreach ($newsletter_subscribers as $ns): ?>
                                            <div class="list-group-item d-flex justify-content-between p-2 small">
                                                <span><i class="bi bi-envelope"></i> <?php echo sanitize($ns['email']); ?></span>
                                                <small class="text-muted font-monospace fst-normal" style="font-size: 10px;"><?php echo date('Y-m-d', strtotime($ns['subscribed_at'])); ?></small>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <!-- COURSE MANAGER TAB -->
                <div class="tab-pane fade" id="pill-course" role="tabpanel">
                    <div class="row g-4">
                        <div class="col-md-7">
                            <div class="table-card p-4">
                                <h3 class="h5 fw-bold border-bottom pb-2 mb-3">Existing Curricula (<?php echo count($courses_list); ?>)</h3>
                                <div class="list-group list-group-flush">
                                    <?php foreach ($courses_list as $c): ?>
                                        <div class="list-group-item px-0 py-3">
                                            <div class="d-flex justify-content-between">
                                                <h5 class="fs-6 fw-bold text-dark mb-1"><?php echo sanitize($c['title']); ?></h5>
                                                <span class="text-primary font-monospace fw-bold" style="font-size: 12.5px;"><?php echo sanitize($c['fee']); ?></span>
                                            </div>
                                            <p class="small text-muted mb-1"><?php echo sanitize($c['description']); ?></p>
                                            <span class="badge bg-secondary-subtle text-dark border font-monospace" style="font-size: 10px;">ID: <?php echo sanitize($c['id']); ?> · Duration: <?php echo sanitize($c['duration']); ?></span>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>

                        <!-- Add Course configuration form -->
                        <div class="col-md-5">
                            <div class="table-card p-4">
                                <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Add Training Program</h4>
                                <form action="" method="POST">
                                    <input type="hidden" name="action" value="add_course">
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Course Title</label>
                                        <input type="text" name="title" required class="form-control" placeholder="Advanced Cyber Security">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Duration Length</label>
                                        <input type="text" name="duration" required class="form-control" placeholder="10 Weeks">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Tuition cost</label>
                                        <input type="text" name="fee" required class="form-control" placeholder="₦150,000">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Syllabus Highlights (Comma separated)</label>
                                        <input type="text" name="syllabus" required class="form-control" placeholder="Tag semantics, Layout Grids, Responsive Bootstrap">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Summary description</label>
                                        <textarea name="desc" rows="3" required class="form-control" placeholder="Write core benefits..."></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100 btn-sm text-white bg-dark border-0 py-2.5">Store Course</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- MATERIALS LINK TAB -->
                <div class="tab-pane fade" id="pill-material" role="tabpanel">
                    <div class="row g-4">
                        <div class="col-md-6 mx-auto">
                            <div class="table-card p-4">
                                <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Publish Learning Document</h4>
                                <p class="small text-muted">Upload pointers to training documents (e.g., Google Document URLs or local downloads) mapped to special courses.</p>
                                
                                <form action="" method="POST">
                                    <input type="hidden" name="action" value="add_material">
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Select Target Course Track</label>
                                        <select name="course_id" required class="form-select">
                                            <option value="">Choose syllabus course</option>
                                            <?php foreach ($courses_list as $c): ?>
                                                <option value="<?php echo $c['id']; ?>"><?php echo sanitize($c['title']); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Lecture Title</label>
                                        <input type="text" name="title" required class="form-control" placeholder="Modular Node Express connection patterns">
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Resource URL / Pointer URL Link</label>
                                        <input type="url" name="file_path" required class="form-control" placeholder="https://docs.google.com/document/d/..." value="https://docs.google.com/document/d/1html5_semantics_ejaytech/view">
                                    </div>

                                    <button type="submit" class="btn btn-primary btn-sm w-100 bg-dark text-white border-0 py-2.5">Link Doc Pointer</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- BROADCASTS TAB -->
                <div class="tab-pane fade" id="pill-broadcast" role="tabpanel">
                    <div class="row g-4">
                        <div class="col-md-6 mx-auto">
                            <div class="table-card p-4">
                                <h4 class="h6 fw-bold border-bottom pb-2 mb-3">Post Announcement Broadcast</h4>
                                <form action="" method="POST">
                                    <input type="hidden" name="action" value="broadcast">
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Broadcast Subject</label>
                                        <input type="text" name="title" required class="form-control" placeholder="Syllabus update instructions">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Detailed Message Alert</label>
                                        <textarea name="message" rows="4" required class="form-control" placeholder="All students please check..."></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-sm w-100 bg-dark text-white border-0 py-2.5">Post Announcement</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- EMAIL LOGS ARCHIVES TAB -->
                <div class="tab-pane fade" id="pill-logs" role="tabpanel">
                    <div class="table-card p-4">
                        <h3 class="h5 fw-bold border-bottom pb-2 mb-3">Email Transmission Logs Diagnostics</h3>
                        <p class="small text-muted">Audited logs of PHPMailer operations, email confirmations and dynamic admissions alerts logged during registration registrations.</p>
                        <div class="table-responsive max-h-[500px]" style="overflow-y: auto;">
                            <table class="table table-striped table-sm align-middle">
                                <thead style="font-size: 12.5px;">
                                    <tr>
                                        <th>Date</th>
                                        <th>Recipient Target</th>
                                        <th>Subject Banner</th>
                                        <th>Gateway Result</th>
                                    </tr>
                                </thead>
                                <tbody style="font-size: 12px;">
                                    <?php if (count($email_logs) == 0): ?>
                                        <tr><td colspan="4" class="text-center text-muted py-3">No emails logged on database archive yet. Process a registration to trigger SMTP PHPMailer alert routines.</td></tr>
                                    <?php else: ?>
                                        <?php foreach ($email_logs as $el): ?>
                                            <tr>
                                                <td class="font-monospace text-muted"><?php echo sanitize($el['timestamp']); ?></td>
                                                <td><strong><?php echo sanitize($el['recipient']); ?></strong></td>
                                                <td><span class="text-dark small"><?php echo sanitize($el['subject']); ?></span></td>
                                                <td>
                                                    <span class="badge <?php echo (stripos($el['status'], 'dispatched') !== false || stripos($el['status'], 'logged') !== false) ? 'bg-success-subtle text-success border-success-subtle' : 'bg-danger-subtle text-danger border-danger-subtle'; ?> small p-1">
                                                        <?php echo sanitize($el['status']); ?>
                                                    </span>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
