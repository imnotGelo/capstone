<?php
include "config.php";

$LRN = $_POST['LRN'];
$firstname = $_POST['firstname'];
$middlename = $_POST['middlename'];
$lastname = $_POST['lastname'];
$email = $_POST['email'];
$address = $_POST['address'];
$grade_level = $_POST['grade_level'];
$strand = isset($_POST['strand']) ? $_POST['strand'] : NULL;

// Retrieve uploaded file details
$report_card_tmp_name = $_FILES['report_card']['tmp_name'];
$good_moral_tmp_name = $_FILES['good_moral']['tmp_name'];
$cert_trans_tmp_name = $_FILES['cert_trans']['tmp_name'];
$birth_cert_tmp_name = $_FILES['birth_cert']['tmp_name'];

// Check if LRN already exists in the database
$check_query = mysqli_query($con, "SELECT * FROM studentpending WHERE LRN = '$LRN'");
if (mysqli_num_rows($check_query) > 0) {
    http_response_code(409);
    $message['status'] = "Error";
    $message['error'] = "LRN already exists in the database.";
    echo json_encode($message);
    exit;
}

$current_year = date('Y');
$previous_year = $current_year - 1;
$backup_table_name = "student_backup_" . $previous_year;

// Check if backup table exists
$check_backup_table_query = mysqli_query($con, "SHOW TABLES LIKE '$backup_table_name'");
if(mysqli_num_rows($check_backup_table_query) > 0) {
    // Backup table exists, perform check
    $check_backup_query = mysqli_query($con, "SELECT * FROM $backup_table_name WHERE LRN = '$LRN'");
    if (mysqli_num_rows($check_backup_query) > 0) {
        http_response_code(406);
        $message['status'] = "Error";
        $message['error'] = "LRN already exists in the backup table for the current year.";
        echo json_encode($message);
        exit;
    }
}

$stmt = $con->prepare("INSERT INTO `studentpending` (`LRN`, `firstname`, `middlename`, `lastname`, `email`, `address`, `grade_level`, `strand`, `report_card`, `good_moral`, `cert_trans`, `birth_cert`) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("ssssssssssss", $LRN, $firstname, $middlename, $lastname, $email, $address, $grade_level, $strand, $report_card_content, $good_moral_content, $cert_trans_content, $birth_cert_content);

$report_card_content = file_get_contents($report_card_tmp_name);
$stmt->send_long_data(8, $report_card_content);

$good_moral_content = file_get_contents($good_moral_tmp_name);
$stmt->send_long_data(9, $good_moral_content);

$cert_trans_content = file_get_contents($cert_trans_tmp_name);
$stmt->send_long_data(10, $cert_trans_content);

$birth_cert_content = file_get_contents($birth_cert_tmp_name);
$stmt->send_long_data(11, $birth_cert_content);

if ($stmt->execute()) {
    http_response_code(201); 
    $message['status'] = "Success";
} else {
    http_response_code(422);
    $message['status'] = "Error";
    $message['error'] = $stmt->error;
}

echo json_encode($message);
?>
