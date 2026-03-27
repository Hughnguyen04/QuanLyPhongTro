<?php
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/Database.php";
require_once "../../models/Bill.php";

$db = new db();
$conn = $db->getConnection();

$bill = new Bill($conn);

$data = json_decode(file_get_contents("php://input"));

/* =====================================================
   GÁN DỮ LIỆU
===================================================== */

$bill->ContractID = $data->ContractID;
$bill->Month      = $data->Month;
$bill->Year       = $data->Year;

$bill->LateFee    = $data->LateFee ?? 0;
$bill->PaidAmount = $data->PaidAmount ?? 0;

$bill->DueDate    = $data->DueDate;
$bill->PaymentDate = $data->PaymentDate ?? NULL;


/* =====================================================
   TẠO BILL
===================================================== */

if ($bill->create()) {

    echo json_encode([
        "message" => "Tạo hóa đơn thành công"
    ]);
} else {

    echo json_encode([
        "message" => "Không thể tạo hóa đơn"
    ]);
}
