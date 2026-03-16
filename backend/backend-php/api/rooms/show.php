<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";

// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$room = new Room($conn);
$room->RoomID = isset($_GET['id']) ? $_GET['id'] : die();
$room->show();

$row_item = array(
    'ID_phong'   => $room->RoomID,
    'Ten_Phong'  => $room->RoomName,
    'Gia_Phong'  => $room->BasePrice,
    'Trang_Thai' => $room->Status,
    'So_Dien'    => $room->CurrentElectric,
    'So_Nuoc'    => $room->CurrentWater
);
print_r(json_encode($row_item));
