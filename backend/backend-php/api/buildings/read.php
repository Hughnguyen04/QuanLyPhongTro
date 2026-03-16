<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Building.php";

// ===== Nếu Database.php dùng class =====
$db = new db();
$conn = $db->getConnection();

// ===== Nếu Database.php không dùng class thì chỉ cần:
// $conn đã tồn tại sẵn

$building = new Building($conn);
$read = $building->read();

$building_array = [];
$building_array['data'] = [];

while ($row = $read->fetch(PDO::FETCH_ASSOC)) {

    $row_item = array(
        'ID_toa'   => $row['BuildingID'],
        'Ten_toa'  => $row['BuildingName'],
        'Dia_chi'  => $row['Address'],
        'So_Tang' => $row['Floors'],
        'Ghi_chu'    => $row['Note']
    );

    $building_array['data'][] = $row_item;
}

echo json_encode($building_array);
