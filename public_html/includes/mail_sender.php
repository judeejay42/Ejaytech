<?php
/**
 * PHPMailer & Gmail SMTP Dispatcher wrapper
 * Fallbacks gracefully to logging emails to DB if PHPMailer is not yet configured.
 */

// Incorporate DB and config properties
require_once __DIR__ . '/db_connect.php';

// Try loading PHPMailer namespace.
// On shared cPanel hosts, vendors place PHPMailer in vendor/ or include/PHPMailer.
// If composer/PHPMailer is absent, this script logs transmissions to db as audit records.
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function send_system_email($recipient, $subject, $messageBody) {
    global $pdo;

    $mailSent = false;
    $logStatus = 'Logged to DB';

    // Verify if PHPMailer source exists on host
    $composerAutoload = __DIR__ . '/vendor/autoload.php';
    $customPHPMailerPaths = [
        __DIR__ . '/PHPMailer/src/Exception.php',
        __DIR__ . '/PHPMailer/src/PHPMailer.php',
        __DIR__ . '/PHPMailer/src/SMTP.php'
    ];

    $hasPHPMailer = false;
    if (file_exists($composerAutoload)) {
        require_once $composerAutoload;
        $hasPHPMailer = true;
    } else {
        $foundAll = true;
        foreach ($customPHPMailerPaths as $p) {
            if (!file_exists($p)) {
                $foundAll = false;
                break;
            }
        }
        if ($foundAll) {
            require_once $customPHPMailerPaths[0];
            require_once $customPHPMailerPaths[1];
            require_once $customPHPMailerPaths[2];
            $hasPHPMailer = true;
        }
    }

    if ($hasPHPMailer) {
        $mail = new PHPMailer(true);
        try {
            // Server Configurations
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            if (SMTP_SECURE === 'ssl') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }
            $mail->Port       = SMTP_PORT;

            // Recipients
            $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
            $mail->addAddress($recipient);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $messageBody;
            $mail->AltBody = strip_tags($messageBody);

            $mail->send();
            $mailSent = true;
            $logStatus = 'Dispatched (PHPMailer)';
        } catch (Exception $e) {
            $logStatus = 'SMTP Error: ' . $mail->ErrorInfo;
        }
    } else {
        // Safe deployment fallback: php mail() command
        // Note: some shared hosts require SPF/DKIM to avoid spam folder
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: <' . OFFICIAL_EMAIL . '>' . "\r\n";
        
        try {
            @mail($recipient, $subject, $messageBody, $headers);
            $mailSent = true;
            $logStatus = 'Dispatched (PHP mail)';
        } catch (\Exception $ex) {
            $logStatus = 'Local mail() failed: ' . $ex->getMessage();
        }
    }

    // Always log the email attempt to the database for administrative transparency metrics!
    try {
        $stmt = $pdo->prepare("INSERT INTO email_logs (sender, recipient, subject, body, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([OFFICIAL_EMAIL, $recipient, $subject, $messageBody, $logStatus]);
    } catch (\Exception $e) {
        // Fail silently so database errors don't interrupt applicant redirection
    }

    return $mailSent;
}
?>
