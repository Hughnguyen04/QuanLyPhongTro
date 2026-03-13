<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require "../../config/database.php";

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents("php://input"));

// 🔥 Kiểm tra dữ liệu
if (!$data) {
    echo json_encode(["error" => "Invalid or missing JSON"]);
    exit;
}

$query = "INSERT INTO invoices
SET
    ContractID = :ContractID,
    BillingMonth = :BillingMonth,
    ElectricOld = :ElectricOld,
    ElectricNew = :ElectricNew,
    WaterOld = :WaterOld,
    WaterNew = :WaterNew,
    TotalAmount = :TotalAmount,
    PaymentStatus = :PaymentStatus,
    PaymentDate = :PaymentDate";

$stmt = $conn->prepare($query);

$stmt->bindParam(":ContractID", $data->ContractID);
$stmt->bindParam(":BillingMonth", $data->BillingMonth);
$stmt->bindParam(":ElectricOld", $data->ElectricOld);
$stmt->bindParam(":ElectricNew", $data->ElectricNew);
$stmt->bindParam(":WaterOld", $data->WaterOld);
$stmt->bindParam(":WaterNew", $data->WaterNew);
$stmt->bindParam(":TotalAmount", $data->TotalAmount);
$stmt->bindParam(":PaymentStatus", $data->PaymentStatus);
$stmt->bindParam(":PaymentDate", $data->PaymentDate);

if ($stmt->execute()) {
    echo json_encode(["message" => "Invoice created successfully"]);
} else {
    echo json_encode(["message" => "Create failed"]);
}