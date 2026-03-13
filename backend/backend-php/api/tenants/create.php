<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Chỉ cho phép POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["message" => "API chỉ hỗ trợ POST"]);
    exit;
}

require_once "../../config/Database.php";

$db = new Database();
$conn = $db->getConnection();

// Lấy dữ liệu JSON từ frontend
$data = json_decode(file_get_contents("php://input"), true);

// ===== Validate dữ liệu bắt buộc =====
if (
    empty($data['FullName']) ||
    empty($data['CCCD']) ||
    empty($data['RoomID']) ||
    empty($data['Phone'])
) {
    echo json_encode(["message" => "Thiếu dữ liệu bắt buộc"]);
    exit;
}

// ===== SQL INSERT =====
$sql = "INSERT INTO tenants 
        (FullName, CCCD, RoomID, Phone, Address, Status) 
        VALUES 
        (:FullName, :CCCD, :RoomID, :Phone, :Address, :Status)";

$stmt = $conn->prepare($sql);

// ===== Bind dữ liệu =====
$stmt->bindValue(":FullName", $data['FullName']);
$stmt->bindValue(":CCCD", $data['CCCD']);
$stmt->bindValue(":RoomID", $data['RoomID']);
$stmt->bindValue(":Phone", $data['Phone']);
$stmt->bindValue(":Address", $data['Address'] ?? null);
$stmt->bindValue(":Status", $data['Status'] ?? "Đang thuê");

// ===== Execute =====
if ($stmt->execute()) {
    echo json_encode([
        "message" => "Thêm người thuê thành công",
        "TenantID" => $conn->lastInsertId()
    ]);
} else {
    echo json_encode(["message" => "Thêm người thuê thất bại"]);
}