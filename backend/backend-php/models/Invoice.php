<?php

class Invoice {

    private $conn;
    private $table = "invoices";

    public $InvoiceID;
    public $ContractID;
    public $BillingMonth;
    public $ElectricNew;
    public $ElectricOld;
    public $WaterNew;
    public $WaterOld;
    public $TotalAmount;
    public $PaymentStatus;
    public $PaymentDate;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 📌 READ ALL
    public function read() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY InvoiceID DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // 📌 READ ONE
    public function readOne() {
        $query = "SELECT * FROM " . $this->table . " WHERE InvoiceID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->InvoiceID);
        $stmt->execute();
        return $stmt;
    }

    // 📌 CREATE
    public function create() {

        $query = "INSERT INTO " . $this->table . "
            SET
                ContractID = :ContractID,
                BillingMonth = :BillingMonth,
                ElectricNew = :ElectricNew,
                ElectricOld = :ElectricOld,
                WaterNew = :WaterNew,
                WaterOld = :WaterOld,
                TotalAmount = :TotalAmount,
                PaymentStatus = :PaymentStatus,
                PaymentDate = :PaymentDate";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":ContractID", $this->ContractID);
        $stmt->bindParam(":BillingMonth", $this->BillingMonth);
        $stmt->bindParam(":ElectricNew", $this->ElectricNew);
        $stmt->bindParam(":ElectricOld", $this->ElectricOld);
        $stmt->bindParam(":WaterNew", $this->WaterNew);
        $stmt->bindParam(":WaterOld", $this->WaterOld);
        $stmt->bindParam(":TotalAmount", $this->TotalAmount);
        $stmt->bindParam(":PaymentStatus", $this->PaymentStatus);
        $stmt->bindParam(":PaymentDate", $this->PaymentDate);

        return $stmt->execute();
    }

    // 📌 UPDATE
    public function update() {

        $query = "UPDATE " . $this->table . "
            SET
                ContractID = :ContractID,
                BillingMonth = :BillingMonth,
                ElectricNew = :ElectricNew,
                ElectricOld = :ElectricOld,
                WaterNew = :WaterNew,
                WaterOld = :WaterOld,
                TotalAmount = :TotalAmount,
                PaymentStatus = :PaymentStatus,
                PaymentDate = :PaymentDate
            WHERE InvoiceID = :InvoiceID";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":ContractID", $this->ContractID);
        $stmt->bindParam(":BillingMonth", $this->BillingMonth);
        $stmt->bindParam(":ElectricNew", $this->ElectricNew);
        $stmt->bindParam(":ElectricOld", $this->ElectricOld);
        $stmt->bindParam(":WaterNew", $this->WaterNew);
        $stmt->bindParam(":WaterOld", $this->WaterOld);
        $stmt->bindParam(":TotalAmount", $this->TotalAmount);
        $stmt->bindParam(":PaymentStatus", $this->PaymentStatus);
        $stmt->bindParam(":PaymentDate", $this->PaymentDate);
        $stmt->bindParam(":InvoiceID", $this->InvoiceID);

        return $stmt->execute();
    }

    // 📌 DELETE
    public function delete() {

        $query = "DELETE FROM " . $this->table . " WHERE InvoiceID = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->InvoiceID);

        return $stmt->execute();
    }
}