<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require_once "../../config/Database.php";
require_once "../../models/Utilities.php";
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../middleware/auth.php";

// Chỉ cho phép admin và staff truy cập
$decoded = checkAuth(["ROLE_ADMIN", "ROLE_STAFF"]);



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

$utilities = new Utilities($conn);



// lấy data
$data = json_decode(file_get_contents("php://input"));

// validate
if (!isset($data->UtilityID)) {
    echo json_encode(["message" => "Thiếu UtilityID"]);
    exit;
}

$utilities->UtilityID = $data->UtilityID;

// delete
if ($utilities->delete()) {
    echo json_encode(["message" => "Xóa thành công"]);
} else {
    echo json_encode(["message" => "Xóa thất bại"]);
}
