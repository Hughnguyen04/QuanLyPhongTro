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

// kiểm tra dữ liệu bắt buộc
if (
    empty($data['RoomName']) ||
    empty($data['BasePrice'])
) {
    echo json_encode(["message" => "Thiếu dữ liệu bắt buộc"]);
    exit;
}

$sql = "INSERT INTO rooms 
        (RoomName, BasePrice, Status, CurrentElectric, CurrentWater)
        VALUES (:RoomName, :BasePrice, :Status, :CurrentElectric, :CurrentWater)";

$stmt = $conn->prepare($sql);

$stmt->bindValue(":RoomName", $data['RoomName']);
$stmt->bindValue(":BasePrice", $data['BasePrice']);
$stmt->bindValue(":Status", $data['Status'] ?? 'TRONG');
$stmt->bindValue(":CurrentElectric", $data['CurrentElectric'] ?? 0);
$stmt->bindValue(":CurrentWater", $data['CurrentWater'] ?? 0);

if ($stmt->execute()) {
    echo json_encode(["message" => "Thêm phòng thành công"]);
} else {
    echo json_encode(["message" => "Thêm phòng thất bại"]);
}
