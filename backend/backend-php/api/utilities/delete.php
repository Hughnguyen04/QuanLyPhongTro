<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");

require_once "../../config/Database.php";
require_once "../../models/Utilities.php";

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Chỉ cho phép DELETE"]);
    exit();
}
$db = new db();
$conn = $db->getConnection();

$utilities = new Utilities($conn);



// lấy data
$data = json_decode(file_get_contents("php://input"));

// validate
if (!isset($data->UtilityID)) {
    echo json_encode(["message" => "Thiếu UtilityID"]);
    exit;
}

$utilities->UtilityID = $data->UtilityID;

// delete
if ($utilities->delete()) {
    echo json_encode(["message" => "Xóa thành công"]);
} else {
    echo json_encode(["message" => "Xóa thất bại"]);
}
