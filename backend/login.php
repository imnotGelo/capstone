<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$message = array();

$LRN = $data['LRN'];
$password = $data['password'];

$stmt = $con->prepare("SELECT * FROM `createuser` WHERE `LRN` = ? AND `password` = ? AND `status` = 1");
$stmt->bind_param("ss", $LRN, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $userData = array(
        'LRN' => $row['LRN'],
        'firstname' => $row['firstname'],
        'middlename' => $row['middlename'],
        'lastname' => $row['lastname'],
        'email' => $row['email'],
        'address' => $row['address'],
        'contact_numb' => $row['contact_numb'],
        'guardian_name' => $row['guardian_name'],
        'guardian_number' => $row['guardian_number'],
        'guardian_address' => $row['guardian_address'],
        'birth_date' => $row['birth_date']
    );

    $stmt = $con->prepare("SELECT * FROM students WHERE LRN = ?");
    $stmt->bind_param("s", $LRN);
    $stmt->execute();
    $result = $stmt->get_result();

    $isStudent = $result->num_rows == 1;

    if ($isStudent) {
        $row = $result->fetch_assoc();
        $studentData = array(
            'strand' => $row['strand'],
            'grade_level' => $row['grade_level'],
            'section_id' => $row['section_id'],
            'report_card' => $row['report_card']
        );
        $userData['studentData'] = $studentData;
    
        // Fetch section details using section_id
        $section_id = $row['section_id'];
        $stmt = $con->prepare("SELECT * FROM sections WHERE section_id = ?");
        $stmt->bind_param("s", $section_id);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows == 1) {
            $sectionData = $result->fetch_assoc();
            $userData['sectionData'] = $sectionData;
        }

        // Fetch grading details using section_id or LRN
        $stmt = $con->prepare("SELECT * FROM grades WHERE section_id = ? AND LRN = ?");
        $stmt->bind_param("ss", $section_id, $LRN);
        $stmt->execute();
        $result = $stmt->get_result();

        $grades = array();
        while ($row = $result->fetch_assoc()) {
            $grades[] = $row;
        }
        $userData['grades'] = $grades;
    }

    http_response_code(200);
    $message['status'] = "Success";
    $message['user'] = $userData;
    $message['isStudent'] = $isStudent;
    $message['section'] = $sectionData ?? null;
} else {
    http_response_code(401);
    $message['status'] = "Error";
    $message['error'] = "Invalid credentials";
}

$stmt->close();
echo json_encode($message);
?>