<?php
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép DELETE"]);
//     exit();
// }

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
