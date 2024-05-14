<?php

include "config.php";

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'];

$sql = "SELECT * FROM createuser WHERE email = '$email'";
$result = $con->query($sql);

if ($result->num_rows > 0) {
        http_response_code(201);
        $message['status'] = "Success";
    } 
 else {
    http_response_code(422);
    $message['status'] = "Error";
    $message['error'] = "Email does not exist in the createuser table.";
}

echo json_encode($message);
?>