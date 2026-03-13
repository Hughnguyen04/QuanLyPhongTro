<?php
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/database.php";
require_once "../../models/Contract.php";

$db = new Database();
$conn = $db->getConnection();

$contract = new Contract($conn);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->ContractID) &&
    !empty($data->EndDate)
){

    $contract->ContractID = $data->ContractID;
    $contract->EndDate = $data->EndDate;

    if($contract->extend()){
        echo json_encode([
            "message" => "Gia hạn hợp đồng thành công"
        ]);
    }
    else{
        echo json_encode([
            "message" => "Không thể gia hạn hợp đồng"
        ]);
    }

}
else{
    echo json_encode([
        "message" => "Thiếu dữ liệu"
    ]);
}