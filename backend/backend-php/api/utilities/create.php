<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Utilities.php";
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../middleware/auth.php";

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Chỉ cho phép admin và staff truy cập
$decoded = checkAuth(["ROLE_ADMIN", "ROLE_STAFF"]);

// if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép POST"]);
//     exit();
// }
$db = new db();
$conn = $db->getConnection();

$Utilities = new Utilities($conn);

$data = json_decode(file_get_contents("php://input"));

$Utilities->RoomID = $data->RoomID;
$Utilities->Month = $data->Month;
$Utilities->Year = $data->Year;

$Utilities->ElectricOld = $data->ElectricOld;
$Utilities->ElectricNew = $data->ElectricNew;
$Utilities->WaterOld = $data->WaterOld;
$Utilities->WaterNew = $data->WaterNew;

$Utilities->ElectricPrice = $data->ElectricPrice;
$Utilities->WaterPrice = $data->WaterPrice;


if ($Utilities->create()) {
    echo json_encode(["message" => "Tạo utilities thành công"]);
} else {
    echo json_encode(["message" => "Tạo utilities thất bại"]);
}
