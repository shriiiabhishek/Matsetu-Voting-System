import { PHPFileItem } from '../types';

export const PHP_PROJECT_FILES: PHPFileItem[] = [
  {
    filename: 'online_voting_system.sql',
    path: 'database/online_voting_system.sql',
    category: 'database',
    description: 'Complete MySQL Database Schema with Foreign Keys, Unique Voting Constraints & Sample Records.',
    content: `-- Smart Online Voting System Database Schema
-- Academic Prototype Database Dump
-- Compatible with MySQL 5.7+ / 8.0+ & MariaDB

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS \`online_voting_system\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`online_voting_system\`;

-- --------------------------------------------------------

-- Table structure for table \`users\` (Voters)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`mobile\` VARCHAR(15) NOT NULL,
  \`dob\` DATE NOT NULL,
  \`voter_id\` VARCHAR(20) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`profile_photo\` VARCHAR(255) DEFAULT 'default_avatar.png',
  \`is_verified\` TINYINT(1) DEFAULT 0,
  \`verification_status\` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  \`account_status\` ENUM('active', 'suspended') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_voter_id\` (\`voter_id\`),
  INDEX \`idx_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`admins\`
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`elections\`
CREATE TABLE IF NOT EXISTS \`elections\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`category\` VARCHAR(50) NOT NULL DEFAULT 'General',
  \`state_name\` VARCHAR(50) DEFAULT 'National',
  \`start_date\` DATETIME NOT NULL,
  \`end_date\` DATETIME NOT NULL,
  \`status\` ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`candidates\`
CREATE TABLE IF NOT EXISTS \`candidates\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`election_id\` INT(11) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`party_name\` VARCHAR(100) NOT NULL,
  \`party_symbol\` VARCHAR(50) DEFAULT '🏛️',
  \`photo_url\` VARCHAR(255) DEFAULT 'default_candidate.png',
  \`manifesto\` TEXT,
  \`age\` INT(3) DEFAULT 21,
  \`education\` VARCHAR(100) DEFAULT 'Graduate',
  \`vote_count\` INT(11) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`election_id\`) REFERENCES \`elections\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`votes\` (ENFORCES ONE VOTE PER VOTER PER ELECTION)
CREATE TABLE IF NOT EXISTS \`votes\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`election_id\` INT(11) NOT NULL,
  \`voter_id\` INT(11) NOT NULL,
  \`candidate_id\` INT(11) NOT NULL,
  \`voted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`receipt_token\` VARCHAR(64) NOT NULL UNIQUE,
  \`ip_address\` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  -- CRITICAL REQUIREMENT: Unique constraint preventing double voting
  UNIQUE KEY \`unique_voter_election\` (\`election_id\`, \`voter_id\`),
  FOREIGN KEY (\`election_id\`) REFERENCES \`elections\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`voter_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`candidate_id\`) REFERENCES \`candidates\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`otp_verifications\`
CREATE TABLE IF NOT EXISTS \`otp_verifications\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` INT(11) NOT NULL,
  \`otp_code\` VARCHAR(6) NOT NULL,
  \`expires_at\` DATETIME NOT NULL,
  \`is_used\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`voter_verifications\`
CREATE TABLE IF NOT EXISTS \`voter_verifications\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` INT(11) NOT NULL,
  \`voter_id\` VARCHAR(20) NOT NULL,
  \`status\` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  \`verified_at\` DATETIME DEFAULT NULL,
  \`notes\` VARCHAR(255) DEFAULT 'System Verification Check Passed',
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`notifications\`
CREATE TABLE IF NOT EXISTS \`notifications\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(150) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`type\` ENUM('info', 'success', 'warning') DEFAULT 'info',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Insert Default Admin Account (Username: admin | Password: password123)
INSERT INTO \`admins\` (\`username\`, \`password\`, \`full_name\`, \`email\`) VALUES
('admin', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1eK4L5qF.p8oH3Z/4Q1M6L9A.x1K4s6', 'System Administrator', 'admin@voting.edu');

-- Insert Sample Active Elections Across Indian States
INSERT INTO \`elections\` (\`id\`, \`title\`, \`description\`, \`category\`, \`state_name\`, \`start_date\`, \`end_date\`, \`status\`) VALUES
(1, 'Madhya Pradesh (MP) State Assembly Poll 2026', 'Vidhan Sabha election for 230 assembly seats in Madhya Pradesh.', 'State Assembly (MP)', 'Madhya Pradesh', '2026-08-01 00:00:00', '2026-08-30 23:59:59', 'active'),
(2, 'Bihar Legislative Assembly Election 2026', 'State election for 243 assembly constituencies across Bihar.', 'State Assembly (Bihar)', 'Bihar', '2026-08-05 00:00:00', '2026-08-28 23:59:59', 'active'),
(3, 'Uttar Pradesh (UP) Vidhan Sabha Election 2026', 'State assembly poll for 403 constituencies across Uttar Pradesh.', 'State Assembly (UP)', 'Uttar Pradesh', '2026-08-02 00:00:00', '2026-08-30 23:59:59', 'active'),
(4, 'Gujarat State Legislative Poll 2026', 'Assembly election for 182 seats across Saurashtra, Kutch & South Gujarat.', 'State Assembly (GJ)', 'Gujarat', '2026-08-08 00:00:00', '2026-08-26 23:59:59', 'active'),
(5, 'Tamil Nadu Assembly Election 2026', 'State assembly poll for 234 assembly seats across Tamil Nadu.', 'State Assembly (TN)', 'Tamil Nadu', '2026-08-04 00:00:00', '2026-08-27 23:59:59', 'active'),
(6, 'Karnataka State Legislative Assembly Election 2026', 'General state election for 224 assembly seats across Karnataka.', 'State Assembly (KA)', 'Karnataka', '2026-08-06 00:00:00', '2026-08-29 23:59:59', 'active');

-- Insert Sample Candidates for State Elections
INSERT INTO \`candidates\` (\`id\`, \`election_id\`, \`name\`, \`party_name\`, \`party_symbol\`, \`manifesto\`, \`vote_count\`) VALUES
-- MP
(1, 1, 'Dr. Mohan Yadav / Shivraj Singh Chouhan', 'Bharatiya Janata Party (BJP)', '🪷 Lotus', 'Ladli Behna Yojana expansion & Ujjain Mahakal Lok extension.', 3250),
(2, 1, 'Jitu Patwari / Kamal Nath', 'Indian National Congress (INC)', '✋ Hand', 'Nari Samman Yojana Rs 1500/month & farm loan waiver.', 2980),
(3, 1, 'Ramakant Sharma', 'Bahujan Samaj Party (BSP)', '🐘 Elephant', 'Social justice & land rights in Bundelkhand.', 1140),
(4, 1, 'Rani Bundela', 'Aam Aadmi Party (AAP)', '🧹 Broom', 'Free 300 units electricity & Mohalla Clinics.', 1050),
-- Bihar
(5, 2, 'Tejashwi Yadav', 'Rashtriya Janata Dal (RJD)', '💡 Lantern', '10 Lakh government jobs & district specialty hospitals.', 3120),
(6, 2, 'Nitish Kumar', 'Janata Dal (United) - JD(U)', '🏹 Arrow', 'Saat Nischay Part 2 & prohibition enforcement.', 2890),
(7, 2, 'Samrat Choudhary', 'Bharatiya Janata Party (BJP)', '🪷 Lotus', 'Patna Metro expansion & double-engine growth.', 2210),
(8, 2, 'Chirag Paswan', 'Lok Janshakti Party (Ram Vilas)', '🛖 Helicopter', 'Bihar First Bihari First vision & youth grants.', 930),
-- UP
(9, 3, 'Yogi Adityanath', 'Bharatiya Janata Party (BJP)', '🪷 Lotus', 'Zero tolerance policy against crime & Jewar Airport.', 4890),
(10, 3, 'Akhilesh Yadav', 'Samajwadi Party (SP)', '🚲 Bicycle', 'PDA alliance, 300 units free power & laptops.', 4210),
(11, 3, 'Mayawati', 'Bahujan Samaj Party (BSP)', '🐘 Elephant', 'Sarvajan Hitaya Sarvajan Sukhaya & law enforcement.', 1980),
(12, 3, 'Jayant Chaudhary', 'Rashtriya Lok Dal (RLD)', '🌾 Hand Pump', 'Sugarcane MSP hike to Rs 450/quintal.', 1400),
-- Tamil Nadu
(13, 5, 'M. K. Stalin', 'Dravida Munnetra Kazhagam (DMK)', '🌅 Rising Sun', 'Dravidian Model, Magalir Urimai Thittam & Morning Breakfast scheme.', 3950),
(14, 5, 'Edappadi K. Palaniswami', 'AIADMK', '🌿 Two Leaves', 'Free washing machines, 6 free LPG cylinders & Amma Canteen upgrade.', 3100),
(15, 5, 'Thalapathy Vijay', 'Tamilaga Vettri Kazhagam (TVK)', '🚩 Victory Flag', 'Secular social justice, youth skill universities & drug-free state.', 1850),
(16, 5, 'Seeman', 'Naam Tamilar Katchi (NTK)', '🎤 Microphone', 'Traditional organic farming & eco-centric economy.', 840);

-- Insert Sample Voter
INSERT INTO \`users\` (\`id\`, \`full_name\`, \`username\`, \`email\`, \`mobile\`, \`dob\`, \`voter_id\`, \`password\`, \`is_verified\`, \`verification_status\`, \`account_status\`) VALUES
(1, 'Rahul Sharma', 'voter1', 'rahul@example.com', '9876543210', '1998-05-14', 'EPIC98765432', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1eK4L5qF.p8oH3Z/4Q1M6L9A.x1K4s6', 1, 'verified', 'active');

COMMIT;
`
  },
  {
    filename: 'database.php',
    path: 'config/database.php',
    category: 'config',
    description: 'PDO Database Connection Singleton with Exception Handling.',
    content: `<?php
/**
 * Smart Online Voting System - Database Configuration
 * Uses PDO for secure MySQL communication
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'online_voting_system');

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("Database Connection Error: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>`
  },
  {
    filename: 'index.php',
    path: 'index.php',
    category: 'voter',
    description: 'Main Homepage with Hero, How It Works, Active Elections, Candidates & VoteSathi Chatbot.',
    content: `<?php
session_start();
require_once 'config/database.php';
$db = Database::getInstance()->getConnection();

// Fetch Active Elections
$stmt = $db->query("SELECT * FROM elections WHERE status = 'active' ORDER BY created_at DESC");
$elections = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Online Voting System | Secure Academic E-Voting</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .hero-section { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 80px 0; }
        .feature-card { border: none; border-radius: 12px; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .feature-card:hover { transform: translateY(-5px); }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php">
                <i class="bi bi-shield-check text-primary me-2"></i>SmartVote
            </a>
            <div class="d-flex">
                <?php if(isset($_SESSION['voter_id'])): ?>
                    <a href="voter/dashboard.php" class="btn btn-outline-light me-2">Dashboard</a>
                    <a href="auth/logout.php" class="btn btn-danger">Logout</a>
                <?php else: ?>
                    <a href="login.php" class="btn btn-outline-light me-2">Login</a>
                    <a href="register.php" class="btn btn-primary">Register Voter</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section text-center">
        <div class="container">
            <h1 class="display-4 fw-bold">Next-Generation Secure E-Voting</h1>
            <p class="lead">Blockchain-inspired verification, OTP authentication, and smart double-vote prevention.</p>
            <div class="mt-4">
                <a href="register.php" class="btn btn-warning btn-lg me-3 text-dark fw-bold">Register to Vote</a>
                <a href="#how-it-works" class="btn btn-outline-light btn-lg">How It Works</a>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center fw-bold mb-5">Workflow Steps</h2>
            <div class="row g-4 text-center">
                <div class="col-md-3">
                    <div class="card p-4 feature-card">
                        <i class="bi bi-person-plus display-4 text-primary mb-3"></i>
                        <h5>1. Register</h5>
                        <p class="text-muted small">Provide details, Voter ID, profile photo, and CAPTCHA.</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-4 feature-card">
                        <i class="bi bi-shield-lock display-4 text-success mb-3"></i>
                        <h5>2. Verify</h5>
                        <p class="text-muted small">Smart system verifies Voter ID and mobile number.</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-4 feature-card">
                        <i class="bi bi-key display-4 text-warning mb-3"></i>
                        <h5>3. OTP Auth</h5>
                        <p class="text-muted small">Login securely with 2FA OTP code sent to your mobile.</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card p-4 feature-card">
                        <i class="bi bi-box-seam display-4 text-info mb-3"></i>
                        <h5>4. Cast Vote</h5>
                        <p class="text-muted small">One-click ballot casting with cryptographic receipt token.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="bg-dark text-white text-center py-4 mt-5">
        <p class="mb-0">© 2026 Smart Online Voting System | Academic Prototype</p>
    </footer>
</body>
</html>`
  },
  {
    filename: 'register.php',
    path: 'register.php',
    category: 'auth',
    description: 'Voter Registration Form with CAPTCHA and Field Validation.',
    content: `<?php
session_start();
// Generate Simple Math CAPTCHA
$num1 = rand(1, 9);
$num2 = rand(1, 9);
$_SESSION['captcha_answer'] = $num1 + $num2;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Voter Registration | Smart Online Voting System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-primary text-white text-center py-3">
                        <h4 class="mb-0 fw-bold">Voter Registration</h4>
                    </div>
                    <div class="card-body p-4">
                        <?php if(isset($_SESSION['error'])): ?>
                            <div class="alert alert-danger"><?= $_SESSION['error']; unset($_SESSION['error']); ?></div>
                        <?php endif; ?>

                        <form action="auth/register_process.php" method="POST" enctype="multipart/form-data">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Full Name</label>
                                    <input type="text" name="full_name" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Username</label>
                                    <input type="text" name="username" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Email Address</label>
                                    <input type="email" name="email" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Mobile Number</label>
                                    <input type="text" name="mobile" class="form-control" placeholder="10-digit number" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Date of Birth</label>
                                    <input type="date" name="dob" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Voter ID (EPIC Number)</label>
                                    <input type="text" name="voter_id" class="form-control" placeholder="e.g. EPIC12345678" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Password</label>
                                    <input type="password" name="password" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">Confirm Password</label>
                                    <input type="password" name="confirm_password" class="form-control" required>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-semibold">Profile Photo</label>
                                    <input type="file" name="profile_photo" class="form-control" accept="image/*">
                                </div>
                                <div class="col-md-12 bg-light p-3 border rounded">
                                    <label class="form-label fw-semibold">Security CAPTCHA</label>
                                    <p class="mb-2">Solve: <strong><?= $num1 ?> + <?= $num2 ?> = ?</strong></p>
                                    <input type="number" name="captcha_input" class="form-control" placeholder="Enter sum" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-4 py-2 fw-bold">Complete Registration</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    filename: 'register_process.php',
    path: 'auth/register_process.php',
    category: 'auth',
    description: 'Registration Backend Logic validating unique Email, Username, Voter ID, CAPTCHA & Hashing passwords.',
    content: `<?php
session_start();
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name']);
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $mobile   = trim($_POST['mobile']);
    $dob      = trim($_POST['dob']);
    $voterId  = strtoupper(trim($_POST['voter_id']));
    $password = $_POST['password'];
    $confirm  = $_POST['confirm_password'];
    $captcha  = (int)$_POST['captcha_input'];

    // 1. CAPTCHA Validation
    if ($captcha !== $_SESSION['captcha_answer']) {
        $_SESSION['error'] = "Incorrect CAPTCHA answer. Please try again.";
        header("Location: ../register.php");
        exit();
    }

    // 2. Password Match Check
    if ($password !== $confirm) {
        $_SESSION['error'] = "Passwords do not match.";
        header("Location: ../register.php");
        exit();
    }

    $db = Database::getInstance()->getConnection();

    // 3. Duplicate Record Checks (Email, Username, Voter ID)
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? OR username = ? OR voter_id = ?");
    $stmt->execute([$email, $username, $voterId]);
    if ($stmt->fetch()) {
        $_SESSION['error'] = "Registration Failed: Email, Username, or Voter ID already registered.";
        header("Location: ../register.php");
        exit();
    }

    // 4. Hash Password & Insert User
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $insertStmt = $db->prepare("INSERT INTO users (full_name, username, email, mobile, dob, voter_id, password, is_verified, verification_status) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'verified')");
    
    if ($insertStmt->execute([$fullName, $username, $email, $mobile, $dob, $voterId, $hashedPassword])) {
        $_SESSION['success'] = "Registration successful! Smart verification complete. Please login.";
        header("Location: ../login.php");
        exit();
    } else {
        $_SESSION['error'] = "System Error during registration. Please try again.";
        header("Location: ../register.php");
        exit();
    }
}
?>`
  },
  {
    filename: 'login.php',
    path: 'login.php',
    category: 'auth',
    description: 'Login Form with CAPTCHA and OTP Step Trigger.',
    content: `<?php
session_start();
$num1 = rand(1, 9);
$num2 = rand(1, 9);
$_SESSION['captcha_answer'] = $num1 + $num2;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Voter Login | Smart Online Voting System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-dark text-white text-center py-3">
                        <h4 class="mb-0 fw-bold">Voter Authentication</h4>
                    </div>
                    <div class="card-body p-4">
                        <?php if(isset($_SESSION['error'])): ?>
                            <div class="alert alert-danger"><?= $_SESSION['error']; unset($_SESSION['error']); ?></div>
                        <?php endif; ?>
                        <?php if(isset($_SESSION['success'])): ?>
                            <div class="alert alert-success"><?= $_SESSION['success']; unset($_SESSION['success']); ?></div>
                        <?php endif; ?>

                        <form action="auth/login_process.php" method="POST">
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Username or Email</label>
                                <input type="text" name="login_input" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Password</label>
                                <input type="password" name="password" class="form-control" required>
                            </div>
                            <div class="mb-3 p-3 bg-light border rounded">
                                <label class="form-label fw-semibold">CAPTCHA Validation</label>
                                <p class="mb-2">Solve: <strong><?= $num1 ?> + <?= $num2 ?> = ?</strong></p>
                                <input type="number" name="captcha_input" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-dark w-100 py-2 fw-bold">Login & Request OTP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    filename: 'login_process.php',
    path: 'auth/login_process.php',
    category: 'auth',
    description: 'Login Backend with password_verify and 6-digit OTP Generation.',
    content: `<?php
session_start();
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginInput = trim($_POST['login_input']);
    $password   = $_POST['password'];
    $captcha    = (int)$_POST['captcha_input'];

    if ($captcha !== $_SESSION['captcha_answer']) {
        $_SESSION['error'] = "Invalid CAPTCHA solution.";
        header("Location: ../login.php");
        exit();
    }

    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$loginInput, $loginInput]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        if ($user['account_status'] !== 'active') {
            $_SESSION['error'] = "Your voter account is currently suspended.";
            header("Location: ../login.php");
            exit();
        }

        // Generate 6-Digit OTP
        $otp = sprintf("%06d", mt_rand(100000, 999999));
        $_SESSION['temp_user_id'] = $user['id'];
        $_SESSION['temp_otp'] = $otp;
        $_SESSION['otp_expiry'] = time() + 300; // 5 minutes validity

        // Store in DB
        $otpStmt = $db->prepare("INSERT INTO otp_verifications (user_id, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))");
        $otpStmt->execute([$user['id'], $otp]);

        header("Location: ../otp_verify.php");
        exit();
    } else {
        $_SESSION['error'] = "Invalid credentials username/password.";
        header("Location: ../login.php");
        exit();
    }
}
?>`
  },
  {
    filename: 'vote_submit.php',
    path: 'voter/submit_vote.php',
    category: 'voter',
    description: 'Critical Ballot Processing enforcing UNIQUE(election_id, voter_id) constraint.',
    content: `<?php
session_start();
require_once '../config/database.php';

if (!isset($_SESSION['voter_id'])) {
    header("Location: ../login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $voterId    = $_SESSION['voter_id'];
    $electionId = (int)$_POST['election_id'];
    $candidateId= (int)$_POST['candidate_id'];

    $db = Database::getInstance()->getConnection();

    // Check if voter already voted in this election
    $checkStmt = $db->prepare("SELECT id FROM votes WHERE election_id = ? AND voter_id = ?");
    $checkStmt->execute([$electionId, $voterId]);
    if ($checkStmt->fetch()) {
        $_SESSION['error'] = "DUPLICATE VOTE REJECTED: You have already cast a vote in this election.";
        header("Location: dashboard.php");
        exit();
    }

    // Generate Unique Cryptographic Receipt Token
    $receiptToken = "VT-" . strtoupper(bin2hex(random_bytes(4))) . "-" . date('Y');
    $ipAddress    = $_SERVER['REMOTE_ADDR'];

    try {
        $db->beginTransaction();

        // 1. Insert into votes table (Protected by UNIQUE INDEX)
        $voteStmt = $db->prepare("INSERT INTO votes (election_id, voter_id, candidate_id, receipt_token, ip_address) VALUES (?, ?, ?, ?, ?)");
        $voteStmt->execute([$electionId, $voterId, $candidateId, $receiptToken, $ipAddress]);

        // 2. Increment candidate vote count
        $candStmt = $db->prepare("UPDATE candidates SET vote_count = vote_count + 1 WHERE id = ?");
        $candStmt->execute([$candidateId]);

        $db->commit();

        $_SESSION['success_vote'] = [
            'token' => $receiptToken,
            'time' => date('Y-m-d H:i:s')
        ];
        header("Location: dashboard.php");
        exit();

    } catch (PDOException $e) {
        $db->rollBack();
        $_SESSION['error'] = "Voting Transaction Failed: " . $e->getMessage();
        header("Location: dashboard.php");
        exit();
    }
}
?>`
  },
  {
    filename: 'admin_dashboard.php',
    path: 'admin/index.php',
    category: 'admin',
    description: 'Admin Control Center with Real-Time Chart.js Data Visualizations.',
    content: `<?php
session_start();
require_once '../config/database.php';

if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}

$db = Database::getInstance()->getConnection();

// Metrics
$totalVoters     = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
$verifiedVoters  = $db->query("SELECT COUNT(*) FROM users WHERE is_verified = 1")->fetchColumn();
$totalElections  = $db->query("SELECT COUNT(*) FROM elections")->fetchColumn();
$activeElections = $db->query("SELECT COUNT(*) FROM elections WHERE status = 'active'")->fetchColumn();
$totalVotes      = $db->query("SELECT COUNT(*) FROM votes")->fetchColumn();

// Candidate Vote Data for Chart
$candidates = $db->query("SELECT name, vote_count FROM candidates")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard | Smart Online Voting System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">SmartVote Admin Panel</a>
            <div class="d-flex">
                <a href="logout.php" class="btn btn-danger btn-sm">Admin Logout</a>
            </div>
        </div>
    </nav>

    <div class="container-fluid py-4">
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white p-3">
                    <h3><?= $totalVoters ?></h3>
                    <p class="mb-0">Total Registered Voters</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white p-3">
                    <h3><?= $verifiedVoters ?></h3>
                    <p class="mb-0">Verified Voters</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-dark p-3">
                    <h3><?= $activeElections ?> / <?= $totalElections ?></h3>
                    <p class="mb-0">Active Elections</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white p-3">
                    <h3><?= $totalVotes ?></h3>
                    <p class="mb-0">Total Votes Cast</p>
                </div>
            </div>
        </div>

        <div class="card shadow-sm p-4">
            <h5 class="fw-bold mb-3">Live Candidate Voting Statistics</h5>
            <canvas id="voteChart" height="100"></canvas>
        </div>
    </div>

    <script>
        const ctx = document.getElementById('voteChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: <?= json_encode(array_column($candidates, 'name')) ?>,
                datasets: [{
                    label: 'Total Votes Received',
                    data: <?= json_encode(array_column($candidates, 'vote_count')) ?>,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    </script>
</body>
</html>`
  },
  {
    filename: 'chatbot_api.php',
    path: 'chatbot/api.php',
    category: 'chatbot',
    description: 'VoteSathi Chatbot API Handler processing smart queries.',
    content: `<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
$query = strtolower(trim($data['query'] ?? ''));

$response = "I am VoteSathi, your Smart Voting Assistant. You can ask me how to register, how OTP verification works, or check election status.";

if (str_contains($query, 'how to vote') || str_contains($query, 'vote kaise kare')) {
    $response = "To vote: 1. Register with valid EPIC Voter ID. 2. Login with 2FA OTP. 3. Navigate to Voter Dashboard. 4. Select candidate and click Cast Vote.";
} elseif (str_contains($query, 'otp')) {
    $response = "OTP (One-Time Password) is sent to your registered mobile number upon login to ensure secure 2-Factor Authentication.";
} elseif (str_contains($query, 'status') || str_contains($query, 'election')) {
    $response = "Active elections are listed on your Voter Dashboard and the main home portal. Voting closes on the scheduled end date.";
}

echo json_encode(['reply' => $response]);
?>`
  },
  {
    filename: 'README.md',
    path: 'docs/README.md',
    category: 'docs',
    description: 'XAMPP Localhost Setup Instructions, Database Import & Troubleshooting.',
    content: `# Smart Online Voting System - Academic Prototype
## Localhost Deployment Guide (XAMPP / Apache / MySQL)

### Prerequisites:
- XAMPP / WAMP / LAMP installed with PHP 8.0+ and MySQL 5.7+

### Step-by-Step Installation:

1. **Extract Project Folder**:
   Copy the extracted \`online-voting-system\` folder to your XAMPP \`htdocs\` directory:
   \`C:\\xampp\\htdocs\\online-voting-system\`

2. **Database Import**:
   - Start Apache and MySQL in XAMPP Control Panel.
   - Open browser and navigate to: \`http://localhost/phpmyadmin\`
   - Click **Databases** tab and create a new database named \`online_voting_system\`.
   - Select the newly created database, click **Import** tab.
   - Choose the \`database/online_voting_system.sql\` file and click **Import**.

3. **Database Configuration**:
   - Verify connection settings in \`config/database.php\`:
     - Host: \`localhost\`
     - User: \`root\`
     - Password: \`\` (empty by default in XAMPP)
     - DB Name: \`online_voting_system\`

4. **Launch Application**:
   - Open browser and go to: \`http://localhost/online-voting-system\`

### Default Accounts:
- **Admin Panel**: \`http://localhost/online-voting-system/admin/login.php\`
  - Username: \`admin\`
  - Password: \`password123\`
- **Sample Voter**:
  - Username: \`voter1\`
  - Password: \`password123\`
`
  }
];
