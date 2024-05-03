<?php
include "config.php";
$q = mysqli_query($con, "SELECT * FROM `schedule_list`");

$scheduleData = array();
if ($q) {
    while($row = mysqli_fetch_assoc($q)) {
        $scheduleData[] = $row;
    }
} else {
    echo "Error: " . mysqli_error($con);
}

mysqli_close($con);

header('Content-Type: application/json');
echo json_encode($scheduleData);
?>
