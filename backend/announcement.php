<?php
include "config.php";
$data = array();
$q = mysqli_query($con, "SELECT * FROM `announcements` WHERE `recipient` = 'students'");
if ($q) {
    while($row = mysqli_fetch_assoc($q)){
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    http_response_code(500); 
    echo json_encode(array("error" => "Database query error"));
}
?>
