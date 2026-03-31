<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../middleware/auth.php";

// Chỉ cho phép admin và staff truy cập
$decoded = checkAuth(["ADMIN", "STAFF"]);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép POST"]);
//     exit();
// }
//    Nếu Database.php dùng class   
$db = new db();
$conn = $db->getConnection();

//    Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$Tenant = new Tenant($conn);

$data = json_decode(file_get_contents("php://input"));

//    CHECK JSON   
if (!$data) {
    echo json_encode(["message" => "Khong nhan duoc JSON"]);
    exit;
}

//    CHECK BẮT BUỘC   
if (empty($data->Phone) || empty($data->FullName)) {
    echo json_encode(["message" => "Thieu du lieu bat buoc"]);
    exit;
}

$Tenant->FullName = $data->FullName;
$Tenant->Phone = $data->Phone;
$Tenant->CCCD = $data->CCCD;
$Tenant->BirthDate = $data->BirthDate;
$Tenant->Gender = $data->Gender;
$Tenant->Address = $data->Address;
$Tenant->Email = $data->Email;
$Tenant->Note = $data->Note;


if ($Tenant->create()) {
    echo json_encode(array('message', 'phong da duoc tao'));
} else {
    echo json_encode(array('message', 'phong khong duoc tao'));
}
