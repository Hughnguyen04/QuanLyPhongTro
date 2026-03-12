<?php
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/database.php";
require_once "../../models/Contract.php";

$db = new Database();
$conn = $db->getConnection();

$contract = new Contract($conn);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->RoomID) &&
    !empty($data->TenantID) &&
    !empty($data->StartDate) &&
    !empty($data->EndDate)
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