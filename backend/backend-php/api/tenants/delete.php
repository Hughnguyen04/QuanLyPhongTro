<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";

// Cho phép cả POST và DELETE method
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["status" => false, "message" => "Chỉ cho phép POST hoặc DELETE"]);
    exit();
}

// Kết nối DB
$db = new db();
$conn = $db->getConnection();

$tenant = new Tenant($conn);

// Lấy TenantID từ request
$tenantId = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lấy từ POST (FormData)
    $tenantId = $_POST['TenantID'] ?? null;
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Lấy từ JSON body
    $input = json_decode(file_get_contents("php://input"), true);
    $tenantId = $input['TenantID'] ?? null;
    
    // Nếu không có trong body, lấy từ query string
    if (!$tenantId) {
        $tenantId = $_GET['TenantID'] ?? null;
    }
}

if (empty($tenantId)) {
    echo json_encode(["status" => false, "message" => "Thiếu TenantID"]);
    exit();
}

$tenant->TenantID = $tenantId;

if ($tenant->delete()) {
    echo json_encode(["status" => true, "message" => "Người thuê đã được xóa"]);
} else {
    echo json_encode(["status" => false, "message" => "Người thuê không được xóa"]);
}
?>