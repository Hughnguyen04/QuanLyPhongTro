<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Contract.php";

$db = new Database();
$conn = $db->getConnection();

$contract = new Contract($conn);

// GET /contracts?id=1
if (isset($_GET['id'])) {

    $stmt = $contract->getById($_GET['id']);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode([
            "message" => "Không tìm thấy hợp đồng"
        ]);
    }

}
// GET /contracts
else {

    $stmt = $contract->getAll();
    $contracts = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $contracts[] = $row;
    }

    echo json_encode($contracts);

}
?>