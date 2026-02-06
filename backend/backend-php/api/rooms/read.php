<?php
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/Database.php";
require_once "../../models/Room.php";

$db = new Database();
$conn = $db->getConnection();
$room = new Room($conn);

// GET /rooms?id=1
if (isset($_GET['id'])) {
    $stmt = $room->getById($_GET['id']);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode(["message" => "Không tìm thấy phòng"]);
    }
}
// GET /rooms
else {
    $stmt = $room->getAll();
    $rooms = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $rooms[] = $row;
    }

    echo json_encode($rooms);
}
