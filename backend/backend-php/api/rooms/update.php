<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";


if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Chỉ cho phép PUT"]);
    exit();
}
// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$room = new Room($conn);

$data = json_decode(file_get_contents("php://input"));
// if (!$data) {
//     echo json_encode(["message" => "No input"]);
//     exit;
// }

$room->RoomID = $data->RoomID;
$room->BuildingName = $data->BuildingName;
$room->BuildingAddress = $data->BuildingAddress;
$room->BuildingTotalFloors = $data->BuildingTotalFloors;
$room->BuildingName = $data->BuildingName;
$room->RoomName = $data->RoomName;
$room->RoomFloor = $data->RoomFloor;
$room->Area = $data->Area;
$room->BasePrice = $data->BasePrice;
$room->Status = $data->Status;
$room->Note = $data->Note;

if ($room->update()) {
    echo json_encode(array('message', 'phong da duoc cap nhat'));
} else {
    echo json_encode(array('message', 'phong khong duoc cap nhat'));
}
