<?php
include "config.php";

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$message = array();
$student_name = $data['student_name']; 
$file_requested = $data['file_requested']; 
$school_year = isset($data['school_year']) ? $data['school_year'] : NULL;
$email = $data['email'];


$stmt = $con->prepare("INSERT INTO `file_request`(`student_name`, `school_year`, `file_requested`, `email`) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $student_name, $school_year, $file_requested, $email);

if ($stmt->execute()) {
    http_response_code(201);
    $message['status'] = "Success";
} else {
    http_response_code(422);
    $message['status'] = "Error";
}
$stmt->close();
echo json_encode($message);
?>