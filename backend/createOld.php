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

// Check if backup table exists
$check_backup_table_query = mysqli_query($con, "SHOW TABLES LIKE '$backup_table_name'");
if(mysqli_num_rows($check_backup_table_query) == 0) {
    http_response_code(404);
    $message['status'] = "Error";
    $message['error'] = "Backup table does not exist.";
    echo json_encode($message);
    exit; // Exit the script
}

// Check if LRN exists in the backup table
$check_backup_query = mysqli_query($con, "SELECT * FROM $backup_table_name WHERE LRN = '$LRN'");
if (mysqli_num_rows($check_backup_query) == 0) {
    http_response_code(406); 
    $message['status'] = "Error";
    $message['error'] = "LRN does not exist in backup table.";
    echo json_encode($message);
    exit; // Exit the script
}
// Get the expected grade level from backup table
$backup_grade_level_query = mysqli_query($con, "SELECT grade_level FROM $backup_table_name WHERE LRN = '$LRN'");
$backup_grade_level_row = mysqli_fetch_assoc($backup_grade_level_query);
$expected_grade_level = $backup_grade_level_row['grade_level'] + 1;

// Check if the selected grade level is correct
if ($grade_level != $expected_grade_level) {
    http_response_code(400);
    $message['status'] = "Error";
    $message['error'] = "Invalid grade level.";
    $message['expected_grade_level'] = $expected_grade_level;
    echo json_encode($message);
    exit; // Exit the script
}

// Check if LRN already exists in the database
$check_query = mysqli_query($con, "SELECT * FROM studentpending WHERE LRN = '$LRN'");
if (mysqli_num_rows($check_query) > 0) {
    http_response_code(409);
    $message['status'] = "Error";
    $message['error'] = "LRN already exists in the database.";
} else {
    $stmt = $con->prepare("INSERT INTO `studentpending` (`LRN`, `firstname`, `middlename`, `lastname`, `email`, `address`, `grade_level`, `strand`, `report_card`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
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
