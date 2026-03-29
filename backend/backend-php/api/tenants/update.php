<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";


if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Chỉ cho phép PUT"]);
    exit();
}
//    Nếu Database.php dùng class   
$db = new db();
$conn = $db->getConnection();

//    Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$Tenant = new Tenant($conn);

$data = json_decode(file_get_contents("php://input"));
if (!$data) {
    echo json_encode(["message" => "No input"]);
    exit;
}

$Tenant->TenantID = $data->TenantID;
$Tenant->FullName = $data->FullName;
$Tenant->Phone = $data->Phone;
$Tenant->CCCD = $data->CCCD;
$Tenant->BirthDate = $data->BirthDate;
$Tenant->Gender = $data->Gender;
$Tenant->Address = $data->Address;
$Tenant->Email = $data->Email;
$Tenant->Note = $data->Note;

if ($Tenant->update()) {
    echo json_encode(array('message', 'phong da duoc cap nhat'));
} else {
    echo json_encode(array('message', 'phong khong duoc cap nhat'));
}
