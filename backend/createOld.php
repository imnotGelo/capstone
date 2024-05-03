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

$current_year = date('Y');
$previous_year = $current_year - 1;
$backup_table_name = "student_backup_" . $previous_year;
$check_backup_query = mysqli_query($con, "SELECT * FROM $backup_table_name WHERE LRN = '$LRN'");
if (mysqli_num_rows($check_backup_query) == 0) {
    http_response_code(406); 
    $message['status'] = "Error";
    $message['error'] = "LRN does not exist in backup table.";
    echo json_encode($message);
    exit; // Exit the script
}

$check_query = mysqli_query($con, "SELECT * FROM studentpending WHERE LRN = '$LRN'");
if (mysqli_num_rows($check_query) > 0) {
    http_response_code(409);
    $message['status'] = "Error";
    $message['error'] = "LRN already exists in the database.";
} else {
    $stmt = $con->prepare("INSERT INTO `studentpending` (`LRN`, `firstname`, `middlename`, `lastname`, `email`, `address`, `grade_level`, `strand`, `report_card`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $null = NULL;
    $stmt->bind_param("ssssssssb", $LRN, $firstname, $middlename, $lastname, $email, $address, $grade_level, $strand, $null);

    // Read file contents into database as BLOB
    $report_card_content = file_get_contents($report_card_tmp_name);
    $stmt->send_long_data(8, $report_card_content); // Bind BLOB data

    if ($stmt->execute()) {
        http_response_code(201);
        $message['status'] = "Success";
    } else {
        http_response_code(422); // Unprocessable Entity status code
        $message['status'] = "Error";
        $message['error'] = mysqli_error($con);
    }
}

echo json_encode($message);
?>
