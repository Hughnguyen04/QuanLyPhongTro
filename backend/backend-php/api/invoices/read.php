<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "../../config/database.php";

$db = new Database();
$conn = $db->getConnection();

$query = "SELECT * FROM invoices ORDER BY InvoiceID DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$data = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $data[] = $row;
}

echo json_encode($data);