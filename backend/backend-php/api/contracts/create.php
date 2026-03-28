<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Contract.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Chỉ cho phép POST"]);
    exit();
}
// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$Contract = new Contract($conn);

$data = json_decode(file_get_contents("php://input"));

// ===== CHECK JSON =====
if (!$data) {
    echo json_encode(["message" => "Khong nhan duoc JSON"]);
    exit;
}

// ===== CHECK BẮT BUỘC =====
if (empty($data->RoomID) || empty($data->RentPrice)) {
    echo json_encode(["message" => "Thieu du lieu bat buoc"]);
    exit;
}
$Contract->RoomID = $data->RoomID;
$Contract->TenantID = $data->TenantID;
$Contract->StartDate = $data->StartDate;
$Contract->EndDate = $data->EndDate;
$Contract->ActualEndDate = $data->ActualEndDate;
$Contract->Deposit = $data->Deposit;
$Contract->ReturnedDeposit = $data->ReturnedDeposit;
$Contract->RentPrice = $data->RentPrice;
$Contract->Status = $data->Status;
$Contract->Note = $data->Note;


if ($Contract->create()) {
    echo json_encode(array('message', 'phong da duoc tao'));
} else {
    echo json_encode(array('message', 'phong khong duoc tao'));
}
