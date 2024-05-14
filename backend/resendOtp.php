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
$message = array();
$email = $data['email'];
$otp = generateOTP();

$update_query = mysqli_query($con, "UPDATE `createuser` SET `otp` = '$otp' WHERE `email` = '$email'");

if ($update_query) {
    // Send email with OTP
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
        $mail->Subject = 'Resend OTP';
        $mail->Body = "Your new OTP is: <strong>$otp</strong>";
        $mail->send();

        http_response_code(200);
        $message['status'] = "Success";
    } catch (Exception $e) {
        http_response_code(500);
        $message['status'] = "Error";
        $message['error'] = 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
    }
} else {
    http_response_code(422);
    $message['status'] = "Error";
    $message['error'] = mysqli_error($con);
}

echo json_encode($message);
?>
