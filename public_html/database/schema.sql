-- ======================================================
-- EJaytech Concepts Platform MySQL Schema
-- Deployable on cPanel, Hostinger, Shared Hosting, or VPS
-- ======================================================

CREATE DATABASE IF NOT EXISTS `ejaytech_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ejaytech_db`;

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS `courses` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `duration` VARCHAR(100) NOT NULL,
    `fee` VARCHAR(100) NOT NULL,
    `syllabus` TEXT NOT NULL, -- JSON or comma-separated string list
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. STUDENTS/APPLICANTS TABLE
CREATE TABLE IF NOT EXISTS `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` VARCHAR(50) NOT NULL UNIQUE, -- E.g., EJ-2026-6184
    `fullname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(100) NOT NULL,
    `gender` VARCHAR(50) NOT NULL,
    `dob` DATE NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `course` VARCHAR(255) NOT NULL, -- Match with course title
    `application_status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `password_hash` VARCHAR(255) NOT NULL,
    `bio` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. SECURE ADMINS TABLE
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. NOTIFICATIONS / ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` VARCHAR(50) NOT NULL, -- 'all' or individual EJ-2026-XXXX ID
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. LEARNING MATERIALS TABLE (PDF, Doc links etc.)
CREATE TABLE IF NOT EXISTS `learning_materials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `course_id` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_size` VARCHAR(100) NOT NULL DEFAULT '1.2 MB',
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. SYSTEM EMAIL TRANSMISSION LOGS
CREATE TABLE IF NOT EXISTS `email_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender` VARCHAR(255) NOT NULL DEFAULT 'info@ejaytechconcepts.com',
    `recipient` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `status` VARCHAR(100) NOT NULL DEFAULT 'Dispatched', -- Dispatched / Error
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. GUEST CONTACT INQUIRIES
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fullname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ======================================================
-- PRE-SEED DATA
-- ======================================================

-- Seed Admin Profile (Password is: admin12345)
-- Bcrypt Hash standard format: $2y$10$UoW083vL7uor7O7vJ2ySleY8AunGskhOn/p7M9T7eS98G0Esh9sZq
INSERT INTO `admins` (`username`, `email`, `password_hash`) 
VALUES ('EJaytech Admin', 'authorized_admin@ejaytech.com', '$2y$10$UoW083vL7uor7O7vJ2ySleY8AunGskhOn/p7M9T7eS98G0Esh9sZq')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Seed Global Training Courses portfolio
INSERT INTO `courses` (`id`, `title`, `description`, `duration`, `fee`, `syllabus`) VALUES
('course-1', 'Frontend Web Development', 'Master building high-performance modern web apps with HTML5, CSS3, JavaScript, and Bootstrap 5.', '12 Weeks', '₦120,000', 'HTML5 Semantics & Structure,CSS3 Layouts, Flexbox, Grid & Animations,Tailwind CSS & Utility Customization,Modern JavaScript & ES6+ Concepts,Responsive Page Execution with Bootstrap 5,Git, GitHub Actions & Live Deployments (Vercel/Netlify)'),
('course-2', 'Graphic Design & Branding', 'Cultivate your design eye and master advanced graphic composition with Canva and Photoshop suites.', '8 Weeks', '₦80,000', 'Essential Visual Design Principles & Rules,Canva Pro Sizing & Visual Flow,Adobe Photoshop Composition & Masking,Corporate Branding: Logo Creation, Typography Guidelines,Flyers, Social Media Banner and Print Ad Layouts,Building physical and digital portfolios'),
('course-3', 'UI/UX Product Design', 'Learn modern user research techniques, interactive wireframing, design libraries, and prototyping with Figma.', '10 Weeks', '₦100,000', 'User Research, Scenarios, and Personas,UX Mapping, Information Architecture & User Journeys,Wireframing (Low-fidelity sketches to structural boxes),Figma Components, Variants & Design Tokens,High-Fidelity Interactive Prototyping,Usability Testing, Iteration and Dev Handoffs'),
('course-4', 'Digital Skills & Freelancing', 'Monetize your design or tech skills on top global freelancing hubs and grow your personal digital brand.', '6 Weeks', '₦60,000', 'Self-Branding, CV Optimization & LinkedIn Presence,Freelance Hub Strategy (Upwork, Fiverr Setup),Proposal Writing & Winning Client Projects,Content Marketing & Social Media Calendars,Digital Funneling, Ads & Analytics Basics')
ON DUPLICATE KEY UPDATE `id`=`id`;
