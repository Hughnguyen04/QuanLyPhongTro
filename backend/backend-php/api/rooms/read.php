<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../middleware/auth.php";

// Chỉ cho phép admin và staff truy cập
$decoded = checkAuth(["ROLE_ADMIN", "ROLE_STAFF"]);


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


//    Nếu Database.php dùng class   
$db = new db();
$conn = $db->getConnection();

//    Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$room = new Room($conn);
$read = $room->read();

$room_array = [];
$room_array['data'] = [];

while ($row = $read->fetch(PDO::FETCH_ASSOC)) {

    $row_item = array(
        'RoomID'   => $row['RoomID'],
        'BuildingName'   => $row['BuildingName'],
        'BuildingAddress'   => $row['BuildingAddress'],
        'BuildingTotalFloors'   => $row['BuildingTotalFloors'],
        'RoomName'  => $row['RoomName'],
        'RoomFloor' => $row['RoomFloor'],
        'Area' => $row['Area'],
        'BasePrice'  => $row['BasePrice'],
        'Status' => $row['Status'],
        'Note' => $row['Note'],
        'Image' => $row['Image']
    );

    $room_array['data'][] = $row_item;
}

echo json_encode($room_array);
