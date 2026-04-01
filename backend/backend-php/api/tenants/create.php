<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Xử lý preflight request (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";

$db = new db();
$conn = $db->getConnection();

$Tenant = new Tenant($conn);

$data = json_decode(file_get_contents("php://input"));

// CHECK JSON
if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => false, "message" => "Không nhận được JSON"]);
    exit;
}

// CHECK BẮT BUỘC
if (empty($data->Phone) || empty($data->FullName)) {
    http_response_code(422);
    echo json_encode(["status" => false, "message" => "Thiếu dữ liệu bắt buộc: FullName hoặc Phone"]);
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
    http_response_code(201);
    echo json_encode(["status" => true, "message" => "Người thuê đã được tạo"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Không thể tạo người thuê"]);
}