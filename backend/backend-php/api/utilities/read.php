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

// Tất cả role đều có thể truy cập
$decoded = checkAuth(["ROLE_ADMIN", "ROLE_STAFF", "ROLE_GUEST"]);

// if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép GET"]);
//     exit();
// }
$db = new db();
$conn = $db->getConnection();

$Utilities = new Utilities($conn);
$read = $Utilities->read();

$Utilities_array = [];
$Utilities_array['data'] = [];

while ($row = $read->fetch(PDO::FETCH_ASSOC)) {

    $item = array(
        "UtilityID"     => $row["UtilityID"],
        "RoomName"      => $row["RoomName"],

        "Month"         => $row["Month"],
        "Year"          => $row["Year"],

        "ElectricOld"   => $row["ElectricOld"],
        "ElectricNew"   => $row["ElectricNew"],
        "WaterOld"      => $row["WaterOld"],
        "WaterNew"      => $row["WaterNew"],

        "ElectricPrice" => $row["ElectricPrice"],
        "WaterPrice"    => $row["WaterPrice"]
    );

    $Utilities_array['data'][] = $item;
}

echo json_encode($Utilities_array);
