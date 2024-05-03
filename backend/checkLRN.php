<?php
include "config.php";

// Get LRN from the POST request
$LRN = $_POST['LRN'];

// Get the current year
$current_year = date("Y");

// Construct the backup table name
$backup_table_name = "student_backup_" . $current_year;

// Check if LRN exists in the backup table
$check_query = mysqli_query($con, "SELECT * FROM $backup_table_name WHERE LRN = '$LRN'");

if (mysqli_num_rows($check_query) > 0) {
    $response['status'] = "Success";
} else {
    $response['status'] = "Error";
}

// Return JSON response
echo json_encode($response);
?>
