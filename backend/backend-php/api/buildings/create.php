<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Building.php";

// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$building = new Building($conn);

$data = json_decode(file_get_contents("php://input"));
$building->BuildingName = $data->BuildingName;
$building->Address = $data->Address;
$building->Floors = $data->Floors;
$building->Note = $data->Note;

if ($building->create()) {
    echo json_encode(array('message', 'phong da duoc tao'));
} else {
    echo json_encode(array('message', 'phong khong duoc tao'));
}
