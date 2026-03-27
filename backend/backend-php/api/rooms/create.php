<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// ===== CHECK JSON =====
if (!$data) {
    echo json_encode(["message" => "Khong nhan duoc JSON"]);
    exit;
}

// ===== CHECK BẮT BUỘC =====
if (empty($data->BuildingName) || empty($data->RoomName)) {
    echo json_encode(["message" => "Thieu du lieu bat buoc"]);
    exit;
}

$room->BuildingName = $data->BuildingName;
$room->BuildingAddress = $data->BuildingAddress;
$room->BuildingTotalFloors = $data->BuildingTotalFloors;
$room->RoomName = $data->RoomName;
$room->RoomFloor = $data->RoomFloor;
$room->Area = $data->Area;
$room->BasePrice = $data->BasePrice;
$room->Status = $data->Status;
$room->Note = $data->Note;


if ($room->create()) {
    echo json_encode(array('message', 'phong da duoc tao'));
} else {
    echo json_encode(array('message', 'phong khong duoc tao'));
}
