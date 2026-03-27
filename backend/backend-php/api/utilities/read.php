<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once "../../config/Database.php";
require_once "../../models/Utilities.php";

$db = new db();
$conn = $db->getConnection();

$Utilities = new Utilities($conn);
$read = $Utilities->read();

$Utilities_array = [];
$Utilities_array['data'] = [];

while ($row = $read->fetch(PDO::FETCH_ASSOC)) {

    $item = array(
        "UtilityID"     => $row["UtilityID"],
        "RoomName"      => $row["RoomName"],

        "Month"         => $row["Month"],
        "Year"          => $row["Year"],

        "ElectricOld"   => $row["ElectricOld"],
        "ElectricNew"   => $row["ElectricNew"],
        "WaterOld"      => $row["WaterOld"],
        "WaterNew"      => $row["WaterNew"],

        "ElectricPrice" => $row["ElectricPrice"],
        "WaterPrice"    => $row["WaterPrice"]
    );

    $Utilities_array['data'][] = $item;
}

echo json_encode($Utilities_array);
