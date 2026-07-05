<?php
/**
 * EJaytech Concepts Landing Index
 * Year: 2026
 */
require_once __DIR__ . '/includes/header.php';
?>

<!-- 1. HERO BANNER SECTION -->
<section class="py-5 bg-light-subtle position-relative overflow-hidden" style="background: linear-gradient(135deg, #0A192F 0%, #172F50 105%); min-height: 85vh; display: flex; align-items: center;">
    <!-- Abstract Ambient Visual Dots -->
    <div class="position-absolute opacity-10" style="top: -50px; right: -50px; width: 300px; height: 300px; background: var(--brand-secondary); filter: blur(80px); border-radius: 50%;"></div>
    <div class="position-absolute opacity-10" style="bottom: -50px; left: -50px; width: 300px; height: 300px; background: #00A8FF; filter: blur(80px); border-radius: 50%;"></div>

    <div class="container text-white py-5">
        <div class="row align-items-center g-5">
            <div class="col-lg-6">
                <span class="badge mb-3 px-3 py-2 text-uppercase font-monospace fw-bold" style="background-color: rgba(0, 168, 255, 0.15) !important; color: #00A8FF !important; border: 1px solid rgba(0,168,255,0.25);">
                    In Abuja & Online Globally
                </span>
                <h1 class="display-3 fw-bold text-white tracking-tight lh-sm mb-4">
                    Innovating Ideas, Delivering <span style="color: var(--brand-secondary);">Solutions</span>
                </h1>
                <p class="lead text-white-50 mb-5 fs-6" style="line-height: 1.8;">
                    Welcome to EJaytech Concepts, Nigeria's premier training and custom development agency. We build professional web applications, brand identities, and empower Africans with practical skills to match next-generation technological needs.
                </p>
                <div class="d-flex flex-wrap gap-3">
                    <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/register.php" class="btn btn-info btn-lg text-primary fw-bold px-4 py-3 rounded-3 shadow" style="background-color: var(--brand-secondary); border-color: var(--brand-secondary);">
                        Apply for Training <i class="bi bi-arrow-right ms-2"></i>
                    </a>
                    <a href="<?php echo OFFICIAL_DOMAIN; ?>/courses.php" class="btn btn-outline-light btn-lg px-4 py-3 rounded-3">
                        Browse Courses
                    </a>
                </div>
            </div>
            <div class="col-lg-6 text-center d-none d-lg-block">
                <!-- Illustrated Mock Card representing the portal -->
                <div class="bg-dark-subtle p-4 rounded-4 shadow-lg border border-secondary" style="background-color: rgba(255,255,255,0.02) !important; border-color: rgba(255,255,255,0.08) !important; backdrop-filter: blur(12px);">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-b border-light pb-2" style="border-bottom: 1px solid rgba(255,255,255,0.05) !important;">
                        <span class="text-white-50 small font-monospace"><i class="bi bi-shield-check text-info"></i> SECURED E-LEARNING SYSTEM</span>
                        <div class="d-flex gap-1.5">
                            <span class="d-inline-block rounded-circle bg-danger" style="width: 8px; height: 8px;"></span>
                            <span class="d-inline-block rounded-circle bg-warning" style="width: 8px; height: 8px;"></span>
                            <span class="d-inline-block rounded-circle bg-success" style="width: 8px; height: 8px;"></span>
                        </div>
                    </div>
                    
                    <div class="text-start py-2">
                        <div class="p-3 mb-3 bg-white/5 rounded-3 align-items-center d-flex justify-content-between" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05);">
                            <div>
                                <h6 class="text-white mb-1" style="font-size: 14px;">Master Frontend Web Dev</h6>
                                <span class="text-white-50 font-monospace" style="font-size: 11px;">100% Bootstrap 5 & PHP 8 Syllabus</span>
                            </div>
                            <span class="badge bg-info text-primary fw-bold">Live Now</span>
                        </div>

                        <div class="p-3 mb-3 bg-white/5 rounded-3 align-items-center d-flex justify-content-between" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05);">
                            <div>
                                <h6 class="text-white mb-1" style="font-size: 14px;">Graphic Design & Branding</h6>
                                <span class="text-white-50 font-monospace" style="font-size: 11px;">Photoshop, Canva & Logos Mastery</span>
                            </div>
                            <span class="badge bg-secondary-subtle text-white">Enrollable</span>
                        </div>

                        <div class="p-3 bg-white/5 rounded-3 align-items-center d-flex justify-content-between" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05);">
                            <div>
                                <h6 class="text-white mb-1" style="font-size: 14px;">UI/UX Product Design</h6>
                                <span class="text-white-50 font-monospace" style="font-size: 11px;">Interactive Figma components</span>
                            </div>
                            <span class="badge bg-info text-primary fw-bold">Trending</span>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 text-center align-items-center">
                        <span class="text-white-50 d-block mb-1" style="font-size: 11px;">EJaytech Student ID Allocation System</span>
                        <div class="text-info fw-bold font-monospace" style="letter-spacing: 2px;">EJ-2026-XXXX</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- 2. STATISTICS METRICS -->
<section class="py-4 shadow-sm" style="background-color: var(--brand-accent);">
    <div class="container">
        <div class="row g-4 text-center">
            <div class="col-md-3 col-sm-6">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light">
                    <h2 class="display-5 fw-bold text-primary mb-1 mt-1">45+</h2>
                    <span class="text-muted small uppercase font-monospace fst-normal">Websites Delivered</span>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light">
                    <h2 class="display-5 fw-bold text-primary mb-1 mt-1">350+</h2>
                    <span class="text-muted small uppercase font-monospace fst-normal">Students Certified</span>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light">
                    <h2 class="display-5 fw-bold text-primary mb-1 mt-1">100%</h2>
                    <span class="text-muted small uppercase font-monospace fst-normal">Practical Centered</span>
                </div>
            </div>
            <div class="col-md-3 col-sm-6">
                <div class="p-3 bg-white rounded-3 shadow-sm border border-light">
                    <h2 class="display-5 fw-bold text-primary mb-1 mt-1">4.9★</h2>
                    <span class="text-muted small uppercase font-monospace fst-normal">Client Satisfaction</span>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- 3. SERVICES HIGHLIGHTS -->
<section class="py-5 my-3">
    <div class="container">
        <div class="text-center mb-5 max-w-2xl mx-auto">
            <span class="text-info text-uppercase font-monospace fw-bold" style="color: var(--brand-secondary) !important; font-size: 13px;">Our Core Expertise</span>
            <h2 class="display-6 fw-bold mt-2">Services We Offer</h2>
            <p class="text-muted small" style="max-width: 600px; margin: 8px auto 0;">Explore our diverse professional technology offerings tailored to optimize operations and scale brands.</p>
        </div>

        <div class="row g-4">
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 p-4 border border-light-subtle rounded-4 shadow-sm hover-translate transition">
                    <div class="bg-primary-subtle text-primary p-3 rounded-3 mb-4 d-inline-block" style="background-color: rgba(10, 25, 47, 0.05) !important;">
                        <i class="bi bi-display fs-3 text-primary" style="color: var(--brand-primary) !important;"></i>
                    </div>
                    <h4 class="fs-5 fw-bold">Custom Web Portals</h4>
                    <p class="text-muted small" style="line-height: 1.7;">
                        Modern database-driven web systems designed for businesses, schools, and dynamic organizations. Optimized with secure credentials.
                    </p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 p-4 border border-light-subtle rounded-4 shadow-sm hover-translate transition">
                    <div class="bg-info-subtle text-info p-3 rounded-3 mb-4 d-inline-block" style="background-color: rgba(0, 168, 255, 0.05) !important;">
                        <i class="bi bi-bookmark-fill fs-3 text-info" style="color: var(--brand-secondary) !important;"></i>
                    </div>
                    <h4 class="fs-5 fw-bold">Identity & Graphic Branding</h4>
                    <p class="text-muted small" style="line-height: 1.7;">
                        Premium modern flyers, high-visibility corporate logos, full branding guidelines, and eye-catching print layouts that stand out.
                    </p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 p-4 border border-light-subtle rounded-4 shadow-sm hover-translate transition">
                    <div class="bg-primary-subtle text-primary p-3 rounded-3 mb-4 d-inline-block" style="background-color: rgba(10, 25, 47, 0.05) !important;">
                        <i class="bi bi-palette fs-3 text-primary" style="color: var(--brand-primary) !important;"></i>
                    </div>
                    <h4 class="fs-5 fw-bold">UI/UX Figma Design</h4>
                    <p class="text-muted small" style="line-height: 1.7;">
                        Interactive digital mockups, system wireframes and usability mappings. Handcrafted component design tokens inside Figma prior to coding.
                    </p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 p-4 border border-light-subtle rounded-4 shadow-sm hover-translate transition">
                    <div class="bg-info-subtle text-info p-3 rounded-3 mb-4 d-inline-block" style="background-color: rgba(0, 168, 255, 0.05) !important;">
                        <i class="bi bi-briefcase fs-3 text-info" style="color: var(--brand-secondary) !important;"></i>
                    </div>
                    <h4 class="fs-5 fw-bold">Consultancy & Training</h4>
                    <p class="text-muted small" style="line-height: 1.7;">
                        Dynamic e-learning blueprints, technical masterclasses, live mentor programs, and corporate staff tech literacy alignment frameworks.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- 4. CALL TO ACTION TO SIGN UP -->
<section class="py-5 bg-primary text-white text-center rounded-4 mx-3 my-5 shadow" style="background-color: var(--brand-primary) !important;">
    <div class="container py-4">
        <h2 class="display-6 fw-bold text-white mb-2">Ready to Upgrade Your Digital Skills?</h2>
        <p class="text-white-50 mb-4 fs-6 mx-auto" style="max-width: 650px;">
            Join our 2026 cohort. Register online inside the student hub today. Each candidate is assigned a unique Student ID and logs into a personalized workspace containing rich learning materials.
        </p>
        <div class="d-flex justify-content-center gap-3">
            <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/register.php" class="btn btn-info btn-lg text-primary fw-bold rounded-pill px-4" style="background-color: var(--brand-secondary); border-color: var(--brand-secondary);">
                Register Now
            </a>
            <a href="<?php echo OFFICIAL_DOMAIN; ?>/courses.php" class="btn btn-outline-light btn-lg rounded-pill px-4">
                View Academy Syllabus
            </a>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
