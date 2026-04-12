<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../middleware/auth.php";

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Chỉ cho phép admin và staff truy cập
$decoded = checkAuth(["ROLE_ADMIN", "ROLE_STAFF"]);

$db = new db();
$conn = $db->getConnection();

$room = new Room($conn);

$data = json_decode(file_get_contents("php://input"));
$room->RoomID = $data->RoomID;


if ($room->delete()) {
    echo json_encode(array('message', 'phong da duoc xoa'));
} else {
    echo json_encode(array('message', 'phong khong duoc xoa'));
}
