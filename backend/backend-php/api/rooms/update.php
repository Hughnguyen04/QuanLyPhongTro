<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";

// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$room = new Room($conn);

$data = json_decode(file_get_contents("php://input"));
$room->RoomID = $data->RoomID;
$room->RoomName = $data->RoomName;
$room->BasePrice = $data->BasePrice;
$room->Status = $data->Status;
$room->CurrentElectric = $data->CurrentElectric;
$room->CurrentWater = $data->CurrentWater;

if ($room->update()) {
    echo json_encode(array('message', 'phong da duoc cap nhat'));
} else {
    echo json_encode(array('message', 'phong khong duoc cap nhat'));
}
