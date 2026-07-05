<?php
/**
 * Blog News layout
 */
require_once __DIR__ . '/includes/header.php';
?>

<div class="container py-5 my-3">
    <div class="text-center mb-5 max-w-2xl mx-auto">
        <span class="text-info text-uppercase font-monospace fw-bold" style="color: var(--brand-secondary) !important; font-size: 13px;">News & Insights</span>
        <h1 class="display-5 fw-bold mt-2">Latest Articles</h1>
        <p class="text-muted small mx-auto" style="max-width: 580px;">Read articles written by EJaytech’s instructors on modern coding, visual identity and remote freelancing.</p>
    </div>

    <div class="row g-4">
        <!-- Post 1 -->
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border border-light rounded-4 shadow-sm overflow-hidden d-flex flex-column justify-content-between">
                <div>
                    <div class="bg-primary-subtle p-5 text-center text-primary" style="background-color: rgba(10, 25, 47, 0.05) !important;">
                        <i class="bi bi-rocket-takeoff-fill display-5"></i>
                    </div>
                    <div class="p-4">
                        <span class="text-secondary font-monospace" style="font-size: 11px;">June 15, 2026 · 5 MIN READ</span>
                        <h4 class="fs-5 fw-bold text-dark mt-2">Why PHP 8 + Bootstrap 5 remain Shared Hosting Kings</h4>
                        <p class="text-muted small mt-2 leading-relaxed">
                            Despite the hypes around JavaScript frameworks, PHP continues to power over 78% of the web. Learn why deploying PHP projects on cPanel remains the most affordable strategy for African agencies.
                        </p>
                    </div>
                </div>
                <div class="px-4 pb-4">
                    <a href="#" class="text-decoration-none text-info fw-bold small">Read Full Guide →</a>
                </div>
            </div>
        </div>

        <!-- Post 2 -->
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border border-light rounded-4 shadow-sm overflow-hidden d-flex flex-column justify-content-between">
                <div>
                    <div class="bg-info-subtle p-5 text-center text-info" style="background-color: rgba(0, 168, 255, 0.05) !important;">
                        <i class="bi bi-columns-gap display-5"></i>
                    </div>
                    <div class="p-4">
                        <span class="text-secondary font-monospace" style="font-size: 11px;">May 28, 2026 · 6 MIN READ</span>
                        <h4 class="fs-5 fw-bold text-dark mt-2">Figma Component Variants for Modern Product Designers</h4>
                        <p class="text-muted small mt-2 leading-relaxed">
                            Variants allow designers to bundle interactive micro-states of element tokens like buttons or headers. Master variants constraints to prepare your design assets for developer hand-offs.
                        </p>
                    </div>
                </div>
                <div class="px-4 pb-4">
                    <a href="#" class="text-decoration-none text-info fw-bold small">Read Full Guide →</a>
                </div>
            </div>
        </div>

        <!-- Post 3 -->
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 border border-light rounded-4 shadow-sm overflow-hidden d-flex flex-column justify-content-between">
                <div>
                    <div class="bg-primary-subtle p-5 text-center text-primary" style="background-color: rgba(10, 25, 47, 0.05) !important;">
                        <i class="bi bi-chat-heart-fill display-5"></i>
                    </div>
                    <div class="p-4">
                        <span class="text-secondary font-monospace" style="font-size: 11px;">April 19, 2026 · 4 MIN READ</span>
                        <h4 class="fs-5 fw-bold text-dark mt-2">Writing Upwork Proposals That Gain Instant Responses</h4>
                        <p class="text-muted small mt-2 leading-relaxed">
                            Stop sending automated templates! Learn EJaytech's custom 3-step proposal writing technique that has secured thousands of dollars in client contracts for our freelance student cohort.
                        </p>
                    </div>
                </div>
                <div class="px-4 pb-4">
                    <a href="#" class="text-decoration-none text-info fw-bold small">Read Full Guide →</a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
