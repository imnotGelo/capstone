<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
include "config.php";

function generateOTP($length = 6) {
    $characters = '0123456789';
    $otp = '';
    for ($i = 0; $i < $length; $i++) {
        $otp .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $otp;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$email = $data['email'];
$otp = generateOTP();

$update_query = mysqli_query($con, "UPDATE `createuser` SET `otp` = '$otp' WHERE `email` = '$email'");

if ($update_query) {
    // Send email with new OTP
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'oras2k24@gmail.com';
        $mail->Password = 'gktksqklljhesmau';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $mail->setFrom('noreply@gmail.com'); 
        $mail->addAddress($email);
        $mail->IsHTML(true); 
        $mail->Subject = 'Requested new OTP';
        $mail->Body = '<html>
<head>
    <style>
        .container {
            background-color: #f0f8ff;
            padding: 20px;
            border-radius: 10px;
        }
        .logo {
            width: 100px;
            height: auto;
            display: block;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
    <img src="/assets/logo.png" alt="Your App Logo" class="logo">
    <p>Dear valued user,</p>
        <p>We\'ve received your request for a new <strong>OTP</strong>. Your security is our top priority, so here\'s your freshly generated One-Time Password to access your account:</p>
        <p><strong>OTP:</strong> ' . $otp . '</p>
        <p>If you have any questions or need assistance, feel free to reach out.</p>
    </div>
</body>
</html>';
        $mail->send();

        http_response_code(200);
        echo json_encode(["status" => "Success", "message" => "OTP resent successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "Error", "message" => "Failed to send email. Error: " . $mail->ErrorInfo]);
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "Error", "message" => "Failed to update OTP"]);
}
?>
