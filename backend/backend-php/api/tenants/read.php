<?php
header("Content-Type: application/json; charset=UTF-8");

require_once "../../config/Database.php";
require_once "../../models/Tenant.php";

$db = new Database();
$conn = $db->getConnection();
$tenant = new Tenant($conn);

// GET /tenants?id=1
if (isset($_GET['id'])) {
    $stmt = $tenant->getById($_GET['id']);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode(["message" => "Không tìm thấy người thuê"]);
    }
}
// GET /tenants
else {
    $stmt = $tenant->getAll();
    $tenants = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $tenants[] = $row;
    }

    echo json_encode($tenants);
}
