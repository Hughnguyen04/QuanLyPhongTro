<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["message" => "API chỉ hỗ trợ POST"]);
    exit;
}

require_once "../../config/Database.php";

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['FullName']) ||
    empty($data['CitizenID']) ||
    empty($data['Phone'])
) {
    echo json_encode(["message" => "Thiếu dữ liệu bắt buộc"]);
    exit;
}

$sql = "INSERT INTO tenants 
        (FullName, CitizenID, Phone, Address)
        VALUES (:FullName, :CitizenID, :Phone, :Address)";

$stmt = $conn->prepare($sql);

$stmt->bindValue(":FullName", $data['FullName']);
$stmt->bindValue(":CitizenID", $data['CitizenID']);
$stmt->bindValue(":Phone", $data['Phone']);
$stmt->bindValue(":Address", $data['Address'] ?? null);

if ($stmt->execute()) {
    echo json_encode(["message" => "Thêm người thuê thành công"]);
} else {
    echo json_encode(["message" => "Thêm người thuê thất bại"]);
}
