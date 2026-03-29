<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";

// Check method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Chỉ cho phép POST"]);
    exit();
}

// Kết nối DB
$db = new db();
$conn = $db->getConnection();

$room = new Room($conn);

/* =====================================================
   📥 NHẬN DỮ LIỆU
===================================================== */

$room->BuildingName = $_POST['BuildingName'] ?? null;
$room->BuildingAddress = $_POST['BuildingAddress'] ?? null;
$room->BuildingTotalFloors = $_POST['BuildingTotalFloors'] ?? null;
$room->RoomName = $_POST['RoomName'] ?? null;
$room->RoomFloor = $_POST['RoomFloor'] ?? null;
$room->Area = $_POST['Area'] ?? null;
$room->BasePrice = $_POST['BasePrice'] ?? null;
$room->Status = $_POST['Status'] ?? null;
$room->Note = $_POST['Note'] ?? null;

/* =====================================================
   ✅ VALIDATE
===================================================== */

if (empty($room->BuildingName) || empty($room->RoomName)) {
    echo json_encode([
        "status" => false,
        "message" => "Thiếu dữ liệu bắt buộc"
    ]);
    exit();
}

/* =====================================================
   📸 UPLOAD ẢNH
===================================================== */

$imagePath = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

    $targetDir = "../../image/";

    // tạo folder nếu chưa có
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $file = $_FILES['image'];

    // validate loại file
    $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($ext, $allowed)) {
        echo json_encode([
            "status" => false,
            "message" => "File ảnh không hợp lệ"
        ]);
        exit();
    }

    // rename file
    $fileName = uniqid() . "." . $ext;
    $targetFile = $targetDir . $fileName;

    // upload
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {

        // 👉 FIX QUAN TRỌNG: đúng path
        $imagePath = "image/" . $fileName;
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Upload ảnh thất bại"
        ]);
        exit();
    }
}

/* =====================================================
   💾 GÁN ẢNH
===================================================== */

$room->Image = $imagePath;

/* =====================================================
   🏗️ CREATE
===================================================== */

if ($room->create()) {
    echo json_encode([
        "status" => true,
        "message" => "Phòng đã được tạo",
        "image" => $imagePath
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Không thể tạo phòng"
    ]);
}
