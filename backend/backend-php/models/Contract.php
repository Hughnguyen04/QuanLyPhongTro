<?php

class Contract {

    private $conn;
    private $table = "contracts";

    public $ContractID;
    public $RoomID;
    public $TenantID;
    public $StartDate;
    public $EndDate;
    public $RentPrice;
    public $DepositAmount;
    public $Status;

    public function __construct($db){
        $this->conn = $db;
    }


    public function create(){

        $query = "INSERT INTO " . $this->table . "
                SET
                RoomID = :RoomID,
                TenantID = :TenantID,
                StartDate = :StartDate,
                EndDate = :EndDate,
                RentPrice = :RentPrice,
                DepositAmount = :DepositAmount,
                Status = 'ACTIVE'";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":RoomID", $this->RoomID);
        $stmt->bindParam(":TenantID", $this->TenantID);
        $stmt->bindParam(":StartDate", $this->StartDate);
        $stmt->bindParam(":EndDate", $this->EndDate);
        $stmt->bindParam(":RentPrice", $this->RentPrice);
        $stmt->bindParam(":DepositAmount", $this->DepositAmount);

        return $stmt->execute();
    }


    public function extend(){

        $query = "UPDATE " . $this->table . "
                SET EndDate = :EndDate
                WHERE ContractID = :ContractID";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":EndDate", $this->EndDate);
        $stmt->bindParam(":ContractID", $this->ContractID);

        return $stmt->execute();
    }


    public function terminate(){

        $query = "UPDATE " . $this->table . "
                SET Status = 'TERMINATED'
                WHERE ContractID = :ContractID";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":ContractID", $this->ContractID);

        return $stmt->execute();
    }


    public function getAll(){

        $query = "SELECT * FROM " . $this->table . " ORDER BY ContractID DESC";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt;
    }

    public function getById($id){

        $query = "SELECT * FROM " . $this->table . " 
                WHERE ContractID = ? 
                LIMIT 1";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $id);

        $stmt->execute();

        return $stmt;
    }

}