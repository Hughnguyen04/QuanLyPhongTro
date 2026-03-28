<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Chỉ cho phép DELETE"]);
    exit();
}
// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$Tenant = new Tenant($conn);

$data = json_decode(file_get_contents("php://input"));
$Tenant->TenantID = $data->TenantID;


if ($Tenant->delete()) {
    echo json_encode(array('message', 'phong da duoc xoa'));
} else {
    echo json_encode(array('message', 'phong khong duoc xoa'));
}
