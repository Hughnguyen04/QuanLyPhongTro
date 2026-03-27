<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Contract.php";

// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$Contract = new Contract($conn);

$data = json_decode(file_get_contents("php://input"));
// if (!$data) {
//     echo json_encode(["message" => "No input"]);
//     exit;
// }

$Contract->ContractID = $data->ContractID;
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

if ($Contract->update()) {
    echo json_encode(array('message', 'phong da duoc cap nhat'));
} else {
    echo json_encode(array('message', 'phong khong duoc cap nhat'));
}
