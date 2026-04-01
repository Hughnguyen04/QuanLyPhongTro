<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => false, "message" => "Chỉ cho phép POST"]);
    exit();
}
//    Nếu Database.php dùng class   
$db = new db();
$conn = $db->getConnection();

//    Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$room = new Room($conn);

// ✅ Lấy từ FormData
if (!isset($_POST['RoomID'])) {
    echo json_encode(["status" => false, "message" => "Thiếu RoomID"]);
    exit();
}
$room->RoomID = $_POST['RoomID'];


if ($room->delete()) {
    echo json_encode(["status" => true, "message" => "Phòng đã được xóa"]);
} else {
    echo json_encode(["status" => false, "message" => "Phòng không được xóa"]);
}