<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../../config/Database.php";
require_once "../../models/Room.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new db();
$conn = $db->getConnection();
$room = new Room($conn);



$room->RoomID = $_POST['RoomID'] ?? null;

if (empty($room->RoomID)) {
    echo json_encode(["message" => "Thiếu RoomID"]);
    exit();
}

$room->BuildingName = $_POST['BuildingName'] ?? null;
$room->BuildingAddress = $_POST['BuildingAddress'] ?? null;
$room->BuildingTotalFloors = $_POST['BuildingTotalFloors'] ?? null;
$room->RoomName = $_POST['RoomName'] ?? null;
$room->RoomFloor = $_POST['RoomFloor'] ?? null;
$room->Area = $_POST['Area'] ?? null;
$room->BasePrice = $_POST['BasePrice'] ?? null;
$room->Status = $_POST['Status'] ?? null;
$room->Note = $_POST['Note'] ?? null;



$oldImage = null;

$query = "SELECT Image FROM rooms WHERE RoomID = :RoomID";
$stmt = $conn->prepare($query);
$stmt->bindParam(":RoomID", $room->RoomID);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $oldImage = $row['Image'];
}


//    UPLOAD ẢNH MỚI 


$imagePath = $oldImage;

if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

    $targetDir = "../../image/";

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $file = $_FILES['image'];

    $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($ext, $allowed)) {
        echo json_encode(["message" => "File ảnh không hợp lệ"]);
        exit();
    }

    $fileName = uniqid() . "." . $ext;
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($file["tmp_name"], $targetFile)) {

        $imagePath = "image/" . $fileName;

        //  XÓA ẢNH CŨ
        if ($oldImage && file_exists("../../" . $oldImage)) {
            unlink("../../" . $oldImage);
        }
    } else {
        echo json_encode(["message" => "Upload ảnh thất bại"]);
        exit();
    }
}


//GÁN ẢNH


$room->Image = $imagePath;


// UPDATE


if ($room->update()) {
    echo json_encode([
        "status" => true,
        "message" => "Phòng đã được cập nhật",
        "image" => $imagePath
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Không thể cập nhật phòng"
    ]);
}
