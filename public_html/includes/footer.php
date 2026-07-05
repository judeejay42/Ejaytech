<?php
/**
 * Shared website footer. Included in all public pages.
 */
require_once __DIR__ . '/../config/config.php';

// Processing Newsletter inside footer securely
$subscriberMessage = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'newsletter_subscribe') {
    $subEmail = filter_var($_POST['newsletter_email'], FILTER_VALIDATE_EMAIL);
    if ($subEmail && isset($pdo)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE id=id");
            $stmt->execute([$subEmail]);
            $subscriberMessage = "success";
        } catch (\Exception $e) {
            $subscriberMessage = "error";
        }
    } else {
        $subscriberMessage = "invalid";
    }
}
?>

    <!-- Main Footer component -->
    <footer class="bg-dark text-gray-400 py-5 mt-5 border-top border-secondary-subtle" style="background-color: var(--brand-primary) !important; color: rgba(255,255,255,0.7) !important;">
        <div class="container py-4">
            <div class="row g-5">
                
                <!-- Brand Description -->
                <div class="col-lg-4 col-md-12">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <div class="brand-logo-icon bg-white text-primary" style="background-color: rgba(255,255,255,0.1) !important; color: var(--brand-secondary) !important; width: 34px; height: 34px; font-size: 14px;">EJ</div>
                        <span class="fw-bold text-white fs-6">EJaytech Concepts</span>
                    </div>
                    <p class="small leading-relaxed" style="color: rgba(255,255,255,0.6);">
                        Innovating Ideas, Delivering Solutions. We are Abuja’s premier fast-scaling information technology agency delivering top-tier web solutions and software training courses.
                    </p>
                    <div class="mt-4">
                        <h6 class="text-white text-uppercase" style="font-size: 11px; letter-spacing: 1px;">Newsletter subscription</h6>
                        <form action="" method="POST" class="mt-2">
                            <input type="hidden" name="action" value="newsletter_subscribe">
                            <div class="input-group">
                                <input type="email" name="newsletter_email" required class="form-control form-control-sm bg-transparent border-secondary text-white placeholder-secondary" placeholder="Enter your email" style="border-color: rgba(255,255,255,0.2) !important;">
                                <button class="btn btn-info btn-sm text-primary fw-bold" type="submit" style="background-color: var(--brand-secondary); border-color: var(--brand-secondary);">Subscribe</button>
                            </div>
                        </form>
                        <?php if ($subscriberMessage === "success"): ?>
                            <div class="alert alert-success alert-dismissible fade show mt-2 small p-1 py-1" role="alert" style="font-size: 11.5px;">✓ Subscribed successfully!</div>
                        <?php elseif ($subscriberMessage === "invalid"): ?>
                            <div class="alert alert-warning alert-dismissible fade show mt-2 small p-1 py-1" role="alert" style="font-size: 11.5px;">❌ Invalid email address.</div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Quick Navigation -->
                <div class="col-lg-2 col-md-4">
                    <h6 class="text-white text-uppercase mb-3" style="font-size: 11px; letter-spacing: 1px;">Quick Links</h6>
                    <ul class="list-unstyled d-flex flex-col gap-2 fs-7" style="font-size: 13.5px; line-height: 2;">
                        <li><a href="<?php echo OFFICIAL_DOMAIN; ?>/index.php" class="text-decoration-none text-white-50 hover-text-white" style="color: rgba(255,255,255,0.655);">Home Landing</a></li>
                        <li><a href="<?php echo OFFICIAL_DOMAIN; ?>/about.php" class="text-decoration-none text-white-50 hover-text-white" style="color: rgba(255,255,255,0.655);">About Company</a></li>
                        <li><a href="<?php echo OFFICIAL_DOMAIN; ?>/services.php" class="text-decoration-none text-white-50 hover-text-white" style="color: rgba(255,255,255,0.655);">Services Suite</a></li>
                        <li><a href="<?php echo OFFICIAL_DOMAIN; ?>/projects.php" class="text-decoration-none text-white-50 hover-text-white" style="color: rgba(255,255,255,0.655);">Recent Works</a></li>
                        <li><a href="<?php echo OFFICIAL_DOMAIN; ?>/courses.php" class="text-decoration-none text-white-50 hover-text-white" style="color: rgba(255,255,255,0.655);">Training Courses</a></li>
                    </ul>
                </div>

                <!-- Services Grid -->
                <div class="col-lg-3 col-md-4">
                    <h6 class="text-white text-uppercase mb-3" style="font-size: 11px; letter-spacing: 1px;">Services Suite</h6>
                    <ul class="list-unstyled d-flex flex-col gap-2 fs-7" style="font-size: 13px; line-height: 2; color: rgba(255,255,255,0.6);">
                        <li><i class="bi bi-chevron-right text-info"></i> School & Portal Web Systems</li>
                        <li><i class="bi bi-chevron-right text-info"></i> Corporate & Agency Branding</li>
                        <li><i class="bi bi-chevron-right text-info"></i> Custom UI/UX Product Design</li>
                        <li><i class="bi bi-chevron-right text-info"></i> Digital Freelance Consulting</li>
                    </ul>
                </div>

                <!-- Office address -->
                <div class="col-lg-3 col-md-4">
                    <h6 class="text-white text-uppercase mb-3" style="font-size: 11px; letter-spacing: 1px;">Secretariat Office</h6>
                    <p class="small mb-2" style="color: rgba(255,255,255,0.6);">
                        No. 12 Capital Plaza, Suite 4B, Garki, Abuja, Nigeria.
                    </p>
                    <p class="small fw-semibold text-info mb-1" style="color: var(--brand-secondary) !important;">
                        Admissions hotlines:<br>
                        +234 813 540 2154
                    </p>
                </div>

            </div>

            <hr class="my-4 border-secondary-subtle" style="border-color: rgba(255,255,255,0.08) !important;">

            <!-- Legal copyrights -->
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center small" style="color: rgba(255,255,255,0.4);">
                <p class="mb-0">Copyright &copy; 2026 EJaytech Concepts. All Rights Reserved.</p>
                <div class="d-flex gap-3 mt-2 mt-sm-0">
                    <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/login.php" class="text-decoration-none text-white-50" style="font-size: 12px;">Student Hub</a>
                    <a href="<?php echo OFFICIAL_DOMAIN; ?>/admin/login.php" class="text-decoration-none text-white-50" style="font-size: 12px;">Admin Terminal</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- WhatsApp sticky button -->
    <a href="https://wa.me/2348135402154?text=Hello%20EJaytech%20Concepts!" target="_blank" class="whatsapp-float">
        <i class="bi bi-whatsapp"></i>
    </a>

    <!-- Bootstrap 5 JavaScript Bundle CND -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <!-- Fallback if net fails -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo OFFICIAL_DOMAIN; ?>/assets/js/main.js"></script>
</body>
</html>
