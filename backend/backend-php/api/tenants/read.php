<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";
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

$Tenant = new Tenant($conn);
$read = $Tenant->read();

$Tenant_array = [];
$Tenant_array['data'] = [];

while ($row = $read->fetch(PDO::FETCH_ASSOC)) {

    $row_item = array(
        'TenantID'   => $row['TenantID'],
        'FullName'  => $row['FullName'],
        'Phone' => $row['Phone'],
        'CCCD' => $row['CCCD'],
        'BirthDate'  => $row['BirthDate'],
        'Gender' => $row['Gender'],
        'Address'    => $row['Address'],
        'Email'    => $row['Email'],
        'Note' => $row['Note']
    );

    $Tenant_array['data'][] = $row_item;
}

echo json_encode($Tenant_array);
