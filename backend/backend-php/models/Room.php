<?php
class Room {
    private $conn;
    private $table = "rooms";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy tất cả phòng
    public function getAll() {
        $sql = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt;
    }

    // Lấy phòng theo ID
    public function getById($id) {
        $sql = "SELECT * FROM " . $this->table . " WHERE RoomID = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt;
    }
}
