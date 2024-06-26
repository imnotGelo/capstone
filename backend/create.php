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
$lrn = $data['lrn'];
$firstname = $data['firstname'];
$middlename = $data['middlename'];
$lastname = $data['lastname'];
$email = $data['email'];
$password = $data['password'];
$address = $data['address'];
$otp = generateOTP();

$check_lrn_query = mysqli_query($con, "SELECT * FROM createuser WHERE lrn = '$lrn' AND `status` = 1");
if(mysqli_num_rows($check_lrn_query) > 0) {
    http_response_code(406);
    $message['status'] = "Error";
    $message['error'] = "LRN is already registered.";
    echo json_encode($message);
    exit; // Exit the script
}

$check_email_query = mysqli_query($con, "SELECT * FROM createuser WHERE email = '$email' AND `status` = 1");
if(mysqli_num_rows($check_email_query) > 0) {
    http_response_code(409);
    $message['status'] = "Error";
    $message['error'] = "Email is already registered. Try a new email.";
    echo json_encode($message);
    exit; // Exit the script
}

$q = mysqli_query($con, "INSERT INTO `createuser` (`lrn`,`firstname`,`middlename`,`lastname`, `email`,`password`,`address`, `otp`)
 VALUES ('$lrn', '$firstname','$middlename', '$lastname', '$email', '$password', '$address','$otp')");

if ($q) {
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
        $mail->addAddress($email, $firstname . ' ' . $lastname);
        $mail->IsHTML(true); 
        $mail->Subject = 'Verify your Account';
        $mail->Body = "Hi $firstname $lastname,<br><br>"
                    . "Thank you for enrolling with us! Your account security is important to us. Please use the following One-Time Passcode <strong>(OTP)</strong> to complete the verification process:<br><br>"
                    . "OTP: <strong>$otp</strong><br><br>"
                    . "If you have any questions or need assistance, feel free to reach out.<br><br>";
        $mail->send();

        http_response_code(201);
        $message['status'] = "Success";
        $message['otp'] = $otp;
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