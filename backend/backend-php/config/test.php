<?php
require_once "database.php";

$db = new db();
$conn = $db->getConnection();

if ($conn) {
    echo "Kết nối database thành công!";
}
