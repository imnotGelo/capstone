<?php

include "config.php";

// Assuming the request method is POST with JSON data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if LRN is provided in the request data
if (isset($data['LRN'])) {
    $LRN = $data['LRN'];

    // Check if LRN exists in studentpending table
    $queryPending = "SELECT * FROM `studentpending` WHERE LRN = '$LRN'";
    $resultPending = mysqli_query($con, $queryPending);

    if ($resultPending) {
        if (mysqli_num_rows($resultPending) > 0) {
            // LRN found in studentpending
            $response['status'] = "Success";
            $response['message'] = "We have already received your application; please wait for the result, which you will receive in your email.";
            http_response_code(200);
        } else {
            // LRN not found in studentpending, check students table
            $queryStudents = "SELECT * FROM `students` WHERE LRN = '$LRN'";
            $resultStudents = mysqli_query($con, $queryStudents);

            if ($resultStudents && mysqli_num_rows($resultStudents) > 0) {
                // LRN found in students table
                $response['status'] = "Success";
                $response['message'] = "Congratulations on successfully enrolling! You can now access your account and commence your educational journey.";
                http_response_code(200);
            } else {
                // LRN not found in students table
                $response['status'] = "Error";
                $response['message'] = "After reviewing your submission, the attachment is inappropriate, ensure that the image is clear. Please submit again.";
                http_response_code(203); // Use appropriate HTTP status code for resource not found
            }
        }
    } else {
        // Error executing query
        $response['status'] = "Error";
        $response['message'] = "Failed to execute query: " . mysqli_error($con);
        http_response_code(500);
    }
} else {
    // LRN not provided in request
    $response['status'] = "Error";
    $response['message'] = "LRN not provided in request";
    http_response_code(400);
}

// Send JSON response
echo json_encode($response);
?>
