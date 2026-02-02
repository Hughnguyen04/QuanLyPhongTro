<?php
require_once "database.php";

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    echo "Kết nối database thành công!";
}
?>