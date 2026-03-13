<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require "../../config/database.php";
require "../../models/Contract.php";

$db = new Database();
$conn = $db->getConnection();

$contract = new Contract($conn);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->RoomID) &&!empty($data->TenantID) && !empty($data->StartDate) && !empty($data->EndDate)
){

    $contract->RoomID = $data->RoomID;
    $contract->TenantID = $data->TenantID;
    $contract->StartDate = $data->StartDate;
    $contract->EndDate = $data->EndDate;
    $contract->RentPrice = $data->RentPrice;
    $contract->DepositAmount = $data->DepositAmount;

    if($contract->create()){
        echo json_encode([
            "message" => "Tạo hợp đồng thành công"
        ]);
    }
    else{
        echo json_encode([
            "message" => "Không thể tạo hợp đồng"
        ]);
    }

}
else{
    echo json_encode([
        "message" => "Thiếu dữ liệu"
    ]);
}