<?php
/**
 * Projects Showcase
 */
require_once __DIR__ . '/includes/header.php';
?>

<div class="container py-5 my-3">
    <div class="text-center mb-5 max-w-2xl mx-auto">
        <span class="text-info text-uppercase font-monospace fw-bold" style="color: var(--brand-secondary) !important; font-size: 13px;">Our Portfolio</span>
        <h1 class="display-5 fw-bold mt-2">Delivered Solutions</h1>
        <p class="text-muted small mx-auto" style="max-width: 580px;">A selection of corporate projects, portals, and branding assets successfully deployed by EJaytech Concepts.</p>
    </div>

    <div class="row g-4">
        <!-- Project 1 -->
        <div class="col-md-4">
            <div class="card h-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden hover-translate transition">
                <div class="bg-primary text-center py-5 text-white" style="background: linear-gradient(135deg, #0A192F 0%, #172F50 100%);">
                    <i class="bi bi-mortarboard display-4 text-info"></i>
                </div>
                <div class="card-body p-4">
                    <span class="badge bg-light text-primary border mb-2 font-monospace" style="font-size: 10px;">Portal Development</span>
                    <h4 class="fs-5 fw-bold text-dark">Apex International Academy Portal</h4>
                    <p class="text-muted small" style="line-height: 1.6;">
                        A fully-responsive student management portal designed for cPanel servers. Handles online registration, tuition receipt printouts and automatic email logging.
                    </p>
                </div>
            </div>
        </div>

        <!-- Project 2 -->
        <div class="col-md-4">
            <div class="card h-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden hover-translate transition">
                <div class="bg-secondary text-center py-5 text-white" style="background: linear-gradient(135deg, #102A43 0%, #243B53 100%);">
                    <i class="bi bi-cart4 display-4 text-warning"></i>
                </div>
                <div class="card-body p-4">
                    <span class="badge bg-light text-primary border mb-2 font-monospace" style="font-size: 10px;">E-Commerce Suite</span>
                    <h4 class="fs-5 fw-bold text-dark">Zulax Fashion E-Store</h4>
                    <p class="text-muted small" style="line-height: 1.6;">
                        Intuitive shopping cart application running layout grids, dynamic database inventory controls, and order dispatch notifications dispatched with secure SMTP layers.
                    </p>
                </div>
            </div>
        </div>

        <!-- Project 3 -->
        <div class="col-md-4">
            <div class="card h-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden hover-translate transition">
                <div class="bg-primary text-center py-5 text-white" style="background: linear-gradient(135deg, #071324 0%, #0c203b 100%);">
                    <i class="bi bi-megaphone display-4 text-info"></i>
                </div>
                <div class="card-body p-4">
                    <span class="badge bg-light text-primary border mb-2 font-monospace" style="font-size: 10px;">Branding Design</span>
                    <h4 class="fs-5 fw-bold text-dark">Capital Plaza Brand Architecture</h4>
                    <p class="text-muted small" style="line-height: 1.6;">
                        Created full corporate visual branding including brochures, stationery elements, cohesive palette guidelines and modern vector logos for physical layouts.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
