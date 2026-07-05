<?php
/**
 * Services detailed layout
 */
require_once __DIR__ . '/includes/header.php';
?>

<div class="container py-5 my-3">
    <div class="text-center mb-5 max-w-2xl mx-auto">
        <span class="text-info text-uppercase font-monospace fw-bold" style="color: var(--brand-secondary) !important; font-size: 13px;">Our Capabilities</span>
        <h1 class="display-5 fw-bold mt-2">What We Deliver</h1>
        <p class="text-muted small mx-auto" style="max-width: 580px;">We specialize in full-cycle software construction, high-impact branding identity, and professional student mentoring.</p>
    </div>

    <!-- Web Design & Development Row -->
    <div class="row align-items-center g-5 py-4 border-bottom border-light">
        <div class="col-md-6">
            <h2 class="fw-bold mb-3">Custom Web Application Suite</h2>
            <p class="text-muted" style="line-height: 1.8;">
                We plan, develop, and host responsive full-stack websites including dynamic database backends, client profiles, student registrations systems, secure session storage, and customized CRM modules. Optimized for quick load times on shared hosting (cPanel/Hostinger) or dedicated cloud instances.
            </p>
            <ul class="list-unstyled text-muted small" style="line-height: 2;">
                <li><i class="bi bi-patch-check-fill text-info me-2"></i> Custom HTML5, CSS3, JavaScript configurations with Bootstrap 5 templates.</li>
                <li><i class="bi bi-patch-check-fill text-info me-2"></i> Robust PHP 8 backends using secure SQL PDO database connectors.</li>
                <li><i class="bi bi-patch-check-fill text-info me-2"></i> Mail integrations via PHPMailer and Gmail SMTP dispatchers.</li>
            </ul>
        </div>
        <div class="col-md-6">
            <div class="p-4 bg-light rounded-4 border border-light">
                <h5 class="fw-bold mb-3 font-display text-primary">Web Features Implemented</h5>
                <div class="row g-2">
                    <div class="col-6"><span class="badge bg-white text-dark p-2 border shadow-sm w-100 text-start">✓ Secure DB Operations</span></div>
                    <div class="col-6"><span class="badge bg-white text-dark p-2 border shadow-sm w-100 text-start">✓ Password Encryption</span></div>
                    <div class="col-6"><span class="badge bg-white text-dark p-2 border shadow-sm w-100 text-start">✓ Cross-Site Guards</span></div>
                    <div class="col-6"><span class="badge bg-white text-dark p-2 border shadow-sm w-100 text-start">✓ Bootstrap Resizing</span></div>
                </div>
            </div>
        </div>
    </div>

    <!-- UI/UX and Creative Branding Segment -->
    <div class="row align-items-center g-5 py-5">
        <div class="col-md-6 order-md-2">
            <h2 class="fw-bold mb-3">Identity Design & Creative Branding</h2>
            <p class="text-muted" style="line-height: 1.8;">
                Your company brand is your visual handprint on the market. Our design team creates professional corporate identities, modern vector logos, business flysheets, social media campaigns, print advertisements, and digital assets using Adobe Photoshop and professional Figma workspaces.
            </p>
            <ul class="list-unstyled text-muted small" style="line-height: 2;">
                <li><i class="bi bi-patch-check-fill text-info me-2"></i> Layout wireframing (low-fidelity sketches to interactive high-fidelity specs).</li>
                <li><i class="bi bi-patch-check-fill text-info me-2"></i> Cohesive branding packages: Color palette selection & typographic rules.</li>
                <li><i class="bi bi-patch-check-fill text-info me-2"></i> Interactive design files provided with dev-friendly assets handoff.</li>
            </ul>
        </div>
        <div class="col-md-6 order-md-1">
            <div class="p-4 bg-light rounded-4 border border-light text-center">
                <i class="bi bi-palette-fill display-3 text-info"></i>
                <h5 class="fw-bold mt-3 font-display">Creative & UI/UX Division</h5>
                <p class="text-muted small">Figma prototypes constructed prior to server orchestration.</p>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
