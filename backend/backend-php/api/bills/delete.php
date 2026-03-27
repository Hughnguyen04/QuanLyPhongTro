<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once '../../config/database.php';
include_once '../../models/Bill2.php';

$database = new db();
$db = $database->getConnection();

$bill = new Bill2($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->BillID)) {

    $bill->BillID = $data->BillID;

    if ($bill->delete()) {
        echo json_encode(["message" => "Xóa thành công"]);
    } else {
        echo json_encode(["message" => "Xóa thất bại"]);
    }
} else {
    echo json_encode(["message" => "Thiếu BillID"]);
}
