<?php
/**
 * Contact Us Form Page
 */
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/db_connect.php';
require_once __DIR__ . '/includes/mail_sender.php';

$successMsg = "";
$errorMsg = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = isset($_POST['fullname']) ? trim($_POST['fullname']) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if ($fullname && $email && $subject && $message) {
        try {
            // Write to database
            if (isset($pdo)) {
                $stmt = $pdo->prepare("INSERT INTO contact_inquiries (fullname, email, subject, message) VALUES (?, ?, ?, ?)");
                $stmt->execute([$fullname, $email, $subject, $message]);
            }

            // Dispatch alert email using PHPMailer SMTP
            $body = "
                <h3>New Secretariat Inquiry Form Submission</h3>
                <p><strong>From:</strong> {$fullname} ({$email})</p>
                <p><strong>Subject:</strong> {$subject}</p>
                <p><strong>Message:</strong></p>
                <p>" . nl2br(sanitize($message)) . "</p>
            ";
            send_system_email(SUPPORT_WHATSAPP . '@mail.com', "Admissions Desk: " . $subject, $body);

            $successMsg = "Thank you! Your message has been logged inside our portal and a representative will contact you via email shortly.";
        } catch (\Exception $e) {
            $errorMsg = "Something went wrong: " . $e->getMessage();
        }
    } else {
        $errorMsg = "Please fill in all fields with valid values.";
    }
}
?>

<div class="container py-5 my-3">
    <div class="text-center mb-5 max-w-2xl mx-auto">
        <span class="text-info text-uppercase font-monospace fw-bold" style="color: var(--brand-secondary) !important; font-size: 13px;">Get In Touch</span>
        <h1 class="display-5 fw-bold mt-2">Contact Secretariat</h1>
        <p class="text-muted small mx-auto" style="max-width: 580px;">Have questions about pricing, duration, or corporate licensing plans? Message us directly.</p>
    </div>

    <div class="row g-5">
        <div class="col-lg-6">
            <div class="bg-light p-4 rounded-4 border border-light shadow-sm h-100">
                <h4 class="fw-bold mb-4 font-display">Office Information</h4>
                
                <div class="d-flex align-items-start gap-3 mb-4">
                    <i class="bi bi-geo-alt-fill text-info fs-3"></i>
                    <div>
                        <h5 class="fs-6 fw-bold mb-1">Corporate Office</h5>
                        <p class="text-muted small mb-0">No. 12 Capital Plaza, Suite 4B, Garki, Abuja, Nigeria.</p>
                    </div>
                </div>

                <div class="d-flex align-items-start gap-3 mb-4">
                    <i class="bi bi-telephone-fill text-info fs-3"></i>
                    <div>
                        <h5 class="fs-6 fw-bold mb-1">Call & WhatsApp Support</h5>
                        <p class="text-muted small mb-0">+234 (0) 813 540 2154</p>
                    </div>
                </div>

                <div class="d-flex align-items-start gap-3 mb-4">
                    <i class="bi bi-envelope-at-fill text-info fs-3"></i>
                    <div>
                        <h5 class="fs-6 fw-bold mb-1">Email Coordinates</h5>
                        <p class="text-muted small mb-0">info@ejaytechconcepts.com</p>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-top border-light-subtle">
                    <span class="text-muted font-monospace fst-italic" style="font-size: 12px;">Office Support Hours</span>
                    <p class="small text-dark mb-0 font-display fw-semibold">Monday - Friday: 9:00 AM - 5:00 PM (GMT +1)</p>
                </div>
            </div>
        </div>

        <div class="col-lg-6">
            <div class="card p-4 border border-light-subtle rounded-4 shadow-sm">
                <h4 class="fw-bold mb-3 font-display">Send a Message</h4>
                
                <?php if ($successMsg): ?>
                    <div class="alert alert-success"><?php echo $successMsg; ?></div>
                <?php elseif ($errorMsg): ?>
                    <div class="alert alert-danger"><?php echo $errorMsg; ?></div>
                <?php endif; ?>

                <form action="" method="POST" class="needs-validation">
                    <div class="mb-3">
                        <label class="form-label text-dark fw-semibold small">Full Name</label>
                        <input type="text" name="fullname" required class="form-control" placeholder="John Doe">
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-dark fw-semibold small">Email Address</label>
                        <input type="email" name="email" required class="form-control" placeholder="johndoe@gmail.com">
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-dark fw-semibold small">Subject</label>
                        <input type="text" name="subject" required class="form-control" placeholder="Inquiry about courses">
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-dark fw-semibold small">Message Body</label>
                        <textarea name="message" rows="4" required class="form-control" placeholder="Write your message here..."></textarea>
                    </div>

                    <button type="submit" class="btn btn-brand-primary w-100 rounded-3">
                        Send Message <i class="bi bi-send ms-1"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
