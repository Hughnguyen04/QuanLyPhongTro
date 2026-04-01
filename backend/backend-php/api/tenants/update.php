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

// Kết nối DB
$db = new db();
$conn = $db->getConnection();

$Tenant = new Tenant($conn);

// Lấy JSON từ request
$data = json_decode(file_get_contents("php://input"));


// Gán dữ liệu
$Tenant->TenantID = $data->TenantID;
$Tenant->FullName = $data->FullName;
$Tenant->Phone = $data->Phone;
$Tenant->CCCD = $data->CCCD;
$Tenant->BirthDate = $data->BirthDate;
$Tenant->Gender = $data->Gender;
$Tenant->Address = $data->Address;
$Tenant->Email = $data->Email;
$Tenant->Note = $data->Note;

// Update
if ($Tenant->update()) {
    echo json_encode([
        "message" => "Cập nhật thành công"
    ]);
} else {
    echo json_encode([
        "message" => "Cập nhật thất bại"
    ]);
}