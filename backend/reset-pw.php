<?php

include "config.php";

$data = json_decode(file_get_contents('php://input'), true);
$message = array();

$password = $data['password'];

$q = "UPDATE createuser SET password = '$password'";

if ($con->query($q) === TRUE) {
    http_response_code(201);
    $message['status'] = "Success";
} else {
    http_response_code(422);
    $message['status'] = "Error";
    $message['error'] = "Error updating password: " . $con->error;
}

// Send JSON response
header('Content-Type: application/json');
echo json_encode($message);
?>
