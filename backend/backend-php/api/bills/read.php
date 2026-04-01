<?php
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
//     http_response_code(405); // Method Not Allowed
//     echo json_encode(["message" => "Chỉ cho phép GET"]);
//     exit();
// }

include_once '../../config/database.php';
include_once '../../models/Bill2.php';

$database = new db();
$db = $database->getConnection();

$bill = new Bill2($db);
$result = $bill->read();

$num = $result->rowCount();

if ($num > 0) {

    $bill_arr = [];
    $bill_arr["data"] = [];

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $item = [
            "BillID" => $BillID,
            "ContractID" => $ContractID,
            "RoomName" => $RoomName,
            "FullName" => $FullName,
            "Month" => $Month,
            "Year" => $Year,
            "RoomPrice" => $RoomPrice,
            "ElectricCost" => $ElectricCost,
            "WaterCost" => $WaterCost,
            "LateFee" => $LateFee,
            "TotalAmount" => $TotalAmount,
            "PaidAmount" => $PaidAmount,
            "DueDate" => $DueDate,
            "PaymentDate" => $PaymentDate,
            "Status" => $Status
        ];

        array_push($bill_arr["data"], $item);
    }

    echo json_encode($bill_arr);
} else {
    echo json_encode(["message" => "Không có dữ liệu"]);
}