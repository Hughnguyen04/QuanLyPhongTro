<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once "../../config/Database.php";
require_once "../../models/Utilities.php";

$db = new db();
$conn = $db->getConnection();

$Utilities = new Utilities($conn);
$stmt = $Utilities->read();
$num = $stmt->rowCount();

if ($num > 0) {

    $arr = [];
    $arr["data"] = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $item = array(
            "UtilityID"     => $row["UtilityID"],
            "RoomName"      => $row["RoomName"],
            "BuildingName"  => $row["BuildingName"],

            "Month"         => $row["Month"],
            "Year"          => $row["Year"],

            "ElectricOld"   => $row["ElectricOld"],
            "ElectricNew"   => $row["ElectricNew"],
            "WaterOld"      => $row["WaterOld"],
            "WaterNew"      => $row["WaterNew"],

            "ElectricPrice" => $row["ElectricPrice"],
            "WaterPrice"    => $row["WaterPrice"]
        );

        $arr["data"][] = $item;
    }

    echo json_encode($arr);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Không có dữ liệu utilities"]);
}
