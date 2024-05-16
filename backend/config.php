<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 172800');
header('Content-Type: application/json');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return 200 OK without any content
    http_response_code(200);
    exit();
}

// Other PHP code goes here
$con = mysqli_connect("localhost", "u500309822_orasdbun", "Orasdbest2024!", "u500309822_oras") or die ("could not connect to DB");
?>
