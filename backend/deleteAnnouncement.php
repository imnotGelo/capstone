<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $postCode = $data['post_code'];

    $stmt = $con->prepare("DELETE FROM `announcements` WHERE `post_code` = ?");
    $stmt->bind_param("i", $postCode);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(array("message" => "Announcement deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("error" => "Failed to delete announcement"));
    }

    $stmt->close();
    $con->close();
    exit();
} else {
    http_response_code(405); 
    echo json_encode(array("error" => "Invalid request method"));
    exit();
}
?>
