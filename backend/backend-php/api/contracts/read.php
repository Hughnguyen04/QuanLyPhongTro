<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Contract.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Chỉ cho phép GET"]);
    exit();
}
//    Nếu Database.php dùng class   
$db = new db();
$conn = $db->getConnection();

//    Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$Contract = new Contract($conn);
// $Contract->handleContractStatus();
$read = $Contract->read();

$Contract_array = [];
$Contract_array['data'] = [];

while ($row = $read->fetch(PDO::FETCH_ASSOC)) {
    $row_item = array(
        'ContractID'   => $row['ContractID'],
        'RoomName'   => $row['RoomName'],
        'FullName'  => $row['FullName'],
        'BuildingName'   => $row['BuildingName'],
        'StartDate' => $row['StartDate'],
        'EndDate' => $row['EndDate'],
        'ActualEndDate'  => $row['ActualEndDate'],
        'Deposit' => $row['Deposit'],
        'ReturnedDeposit'    => $row['ReturnedDeposit'],
        'RentPrice'    => $row['RentPrice'],
        'Status'    => $row['Status'],
        'Note' => $row['Note']
    );

    $Contract_array['data'][] = $row_item;
}

echo json_encode($Contract_array);
