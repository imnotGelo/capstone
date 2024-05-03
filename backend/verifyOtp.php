<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$message = array();
$otp = $data['otp'];

$stmt = $con->prepare("SELECT * FROM `createuser` WHERE `otp`=?");
$stmt->bind_param("s", $otp);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $message['status'] = 'Success';
    $updateStmt = $con->prepare("UPDATE `createuser` SET `status` = 1 WHERE `otp` = ?");
    $updateStmt->bind_param("s", $otp);
    $updateStmt->execute();
    $updateStmt->close();
} else {
    // OTP is incorrect
    $message['status'] = 'Error';
    $message['error'] = 'Invalid OTP';
}

echo json_encode($message);
$stmt->close();
$con->close();
?>
