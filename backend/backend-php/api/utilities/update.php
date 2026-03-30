<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require_once "../../config/Database.php";
require_once "../../models/Utilities.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép PUT"]);
//     exit();
// }
$db = new db();
$conn = $db->getConnection();

$Utilities = new Utilities($conn);

$data = json_decode(file_get_contents("php://input"));

$Utilities->UtilityID = $data->UtilityID;
$Utilities->RoomID = $data->RoomID;

$Utilities->Month = $data->Month;
$Utilities->Year = $data->Year;

$Utilities->ElectricOld = $data->ElectricOld;
$Utilities->ElectricNew = $data->ElectricNew;
$Utilities->WaterOld = $data->WaterOld;
$Utilities->WaterNew = $data->WaterNew;

$Utilities->ElectricPrice = $data->ElectricPrice;
$Utilities->WaterPrice = $data->WaterPrice;


if ($Utilities->update()) {
    echo json_encode(["message" => "Cập nhật utilities thành công"]);
} else {
    echo json_encode(["message" => "Không thể cập nhật utilities"]);
}
