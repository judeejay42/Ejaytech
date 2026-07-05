<?php
/**
 * Academy Training Courses Portfolios
 */
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/db_connect.php';

// Try fetching courses from MySQL DB
$coursesList = [];
$dbActive = false;
try {
    if (isset($pdo)) {
        $stmt = $pdo->query("SELECT * FROM courses ORDER BY id ASC");
        $coursesList = $stmt->fetchAll();
        if (count($coursesList) > 0) {
            $dbActive = true;
        }
    }
} catch (\Exception $e) {
    // Database table or driver not initialized yet
    $dbActive = false;
}

// Fallback high-fidelity hardcoded data in case DB is not pre-seeded on destination shared server
if (!$dbActive) {
    $coursesList = [
        [
            'id' => 'course-1',
            'title' => 'Frontend Web Development',
            'description' => 'Master building high-performance modern web apps with HTML5, CSS3, JavaScript, and Bootstrap 5.',
            'duration' => '12 Weeks',
            'fee' => '₦120,000',
            'syllabus' => 'HTML5 Semantics & Structure,CSS3 Layouts, Flexbox, Grid & Animations,Tailwind CSS & Utility Customization,Modern JavaScript & ES6+ Concepts,Responsive Page Execution with Bootstrap 5,Git, GitHub Actions & Live Deployments (Vercel/Netlify)'
        ],
        [
            'id' => 'course-2',
            'title' => 'Graphic Design & Branding',
            'description' => 'Cultivate your design eye and master advanced graphic composition with Canva and Photoshop suites.',
            'duration' => '8 Weeks',
            'fee' => '₦80,000',
            'syllabus' => 'Essential Visual Design Principles,Canva Pro Sizing & Visual Flow,Adobe Photoshop Composition,Corporate Branding Guidelines,Flyers, Social Media Banner and Print Ad Layouts,Building physical portfolio'
        ],
        [
            'id' => 'course-3',
            'title' => 'UI/UX Product Design',
            'description' => 'Learn modern user research techniques, interactive wireframing, design libraries, and prototyping with Figma.',
            'duration' => '10 Weeks',
            'fee' => '₦100,000',
            'syllabus' => 'User Research and Personas,UX Mapping & User Journeys,Wireframing Sketches to Boxes,Figma Components and Design Tokens,High-Fidelity Interactive Prototyping,Usability Testing and Handoffs'
        ],
        [
            'id' => 'course-4',
            'title' => 'Digital Skills & Freelancing',
            'description' => 'Monetize your design or tech skills on top global freelancing hubs and grow your personal digital brand.',
            'duration' => '6 Weeks',
            'fee' => '₦60,000',
            'syllabus' => 'Personal Branding & LinkedIn Setup,Upwork and Fiverr Setup & Tactics,Proposal Writing & Portfolio Curation,Social Media Engagement Cycles,Digital Funnels & Ads Basics'
        ]
    ];
}
?>

<div class="container py-5 my-3">
    <div class="text-center mb-5 max-w-2xl mx-auto">
        <span class="text-info text-uppercase font-monospace fw-bold" style="color: var(--brand-secondary) !important; font-size: 13px;">EJaytech digital academy</span>
        <h1 class="display-5 fw-bold mt-2">Become a Professional</h1>
        <p class="text-muted small mx-auto" style="max-width: 580px;">We train you raw and equip you with practical design-by-doing skills required to win high-paying roles.</p>
    </div>

    <div class="row g-4">
        <?php foreach ($coursesList as $c): ?>
            <div class="col-lg-6 col-md-12">
                <div class="card h-100 p-4 border border-light shadow-sm rounded-4 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h3 class="fs-4 fw-bold text-dark mb-0"><?php echo sanitize($c['title']); ?></h3>
                            <span class="badge bg-primary text-info rounded font-monospace" style="background-color: var(--brand-primary) !important; color: var(--brand-secondary) !important;"><?php echo sanitize($c['duration']); ?></span>
                        </div>
                        <p class="text-muted small-text mb-4" style="font-size: 14.5px; line-height: 1.6;"><?php echo sanitize($c['description']); ?></p>
                        
                        <div class="mb-4">
                            <h5 class="fs-6 fw-bold border-bottom pb-2">Syllabus Breakdown</h5>
                            <div class="d-flex flex-wrap gap-2 pt-1">
                                <?php 
                                $syllabusTerms = is_string($c['syllabus']) ? explode(',', $c['syllabus']) : [];
                                foreach ($syllabusTerms as $term): 
                                    if(trim($term) !== ''):
                                ?>
                                    <span class="badge bg-secondary-subtle text-dark border p-2" style="font-size: 11.5px; font-weight: 500;">✓ <?php echo sanitize(trim($term)); ?></span>
                                <?php 
                                    endif;
                                endforeach; 
                                ?>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                        <div>
                            <span class="text-secondary small fst-italic d-block font-monospace">Tuition Fee</span>
                            <span class="text-primary fw-bold" style="font-size: 18px; color: var(--brand-primary) !important;"><?php echo sanitize($c['fee']); ?></span>
                        </div>
                        <a href="<?php echo OFFICIAL_DOMAIN; ?>/student/register.php?course=<?php echo urlencode($c['title']); ?>" class="btn btn-brand-primary rounded-pill px-4">
                            Apply Online
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
