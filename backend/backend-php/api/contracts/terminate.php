<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/database.php";
require_once "../../models/Contract.php";

$db = new Database();
$conn = $db->getConnection();

$contract = new Contract($conn);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->ContractID)){

    $contract->ContractID = $data->ContractID;

    if($contract->terminate()){
        echo json_encode([
            "message" => "Thanh lý hợp đồng thành công"
        ]);
    }
    else{
        echo json_encode([
            "message" => "Không thể thanh lý hợp đồng"
        ]);
    }

}
else{
    echo json_encode([
        "message" => "Thiếu ContractID"
    ]);
}