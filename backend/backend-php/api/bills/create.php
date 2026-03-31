<?php
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép POST"]);
//     exit();
// }
require_once "../../config/Database.php";
require_once "../../models/Bill.php";
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../middleware/auth.php";

// Chỉ cho phép admin và staff truy cập
checkAuth(["ROLE_ADMIN", "ROLE_STAFF"]);

$db = new db();
$conn = $db->getConnection();

$bill = new Bill2($conn);

$data = json_decode(file_get_contents("php://input"));



$bill->ContractID = $data->ContractID;
$bill->Month      = $data->Month;
$bill->Year       = $data->Year;

$bill->LateFee    = $data->LateFee ?? 0;
$bill->PaidAmount = $data->PaidAmount ?? 0;

$bill->DueDate    = $data->DueDate;
$bill->PaymentDate = $data->PaymentDate ?? NULL;





if ($bill->create()) {

    echo json_encode([
        "message" => "Tạo hóa đơn thành công"
    ]);
} else {

    echo json_encode([
        "message" => "Không thể tạo hóa đơn hoặc hết hiệu lực hợp đồng"
    ]);
}
