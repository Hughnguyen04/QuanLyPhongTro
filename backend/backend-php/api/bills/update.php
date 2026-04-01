<?php
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
//     http_response_code(405);
//     echo json_encode(["message" => "Chỉ cho phép PUT"]);
//     exit();
// }

//    INCLUDE   
include_once "../../config/database.php";
include_once "../../models/Bill2.php";

//    DB   
$database = new db();
$db = $database->getConnection();

$bill = new Bill2($db);

//    GET DATA   
$data = json_decode(file_get_contents("php://input"));

//    CHECK ID   
if (!isset($data->BillID)) {
    echo json_encode(["message" => "Thiếu BillID"]);
    exit;
}

$bill->BillID = $data->BillID;

//    GÁN DỮ LIỆU 
$bill->RoomPrice    = $data->RoomPrice ?? null;
$bill->ElectricCost = $data->ElectricCost ?? null;
$bill->WaterCost    = $data->WaterCost ?? null;
$bill->LateFee      = $data->LateFee ?? null;
$bill->PaidAmount   = $data->PaidAmount ?? null;
$bill->PaymentDate  = $data->PaymentDate ?? null;
$bill->DueDate      = $data->DueDate ?? null;

//    UPDATE   
if ($bill->update()) {
    echo json_encode([
        "message" => "Cập nhật thành công",
        "BillID" => $bill->BillID
    ]);
} else {
    echo json_encode([
        "message" => "Cập nhật thất bại"
    ]);
}