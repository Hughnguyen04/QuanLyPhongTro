<?php
class Tenant {
    private $conn;
    private $table = "tenants";

    public $TenantID;
    public $FullName;
    public $CitizenID;
    public $Phone;
    public $Address;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy danh sách người thuê
    public function getAll() {
        $sql = "SELECT * FROM {$this->table}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt;
    }

    // Thêm người thuê
    public function create() {
        $sql = "INSERT INTO {$this->table}
                (FullName, CitizenID, Phone, Address)
                VALUES (:name, :cccd, :phone, :address)";
        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":name" => $this->FullName,
            ":cccd" => $this->CitizenID,
            ":phone" => $this->Phone,
            ":address" => $this->Address
        ]);
    }
}
