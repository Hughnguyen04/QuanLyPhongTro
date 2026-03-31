<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";
require_once __DIR__ . "../../vendor/autoload.php";
require_once __DIR__ . "../../middleware/auth.php";

//Chỉ cho phép admin và staff truy cập
$decoded = checkAuth(["ADMIN", "STAFF"]);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép DELETE"]);
//     exit();
// }

$db = new db();
$conn = $db->getConnection();

$Tenant = new Tenant($conn);

$data = json_decode(file_get_contents("php://input"));
$Tenant->TenantID = $data->TenantID;


if ($Tenant->delete()) {
    echo json_encode(array('message', 'phong da duoc xoa'));
} else {
    echo json_encode(array('message', 'phong khong duoc xoa'));
}
