<?php
class Contract
{
    private $conn;
    public $ContractID;
    public $RoomID;
    public $TenantID;
    public $StartDate;
    public $EndDate;
    public $ActualEndDate;
    public $Deposit;
    public $ReturnedDeposit;
    public $RentPrice;
    public $Status;
    public $Note;

    public function __construct($db)
    {
        $this->conn = $db;
    }
    // read data
    public function read()
    {
        $query = "SELECT 
    c.*,
    r.BuildingName, 
    r.RoomName,
    t.FullName
FROM contracts c
INNER JOIN rooms r 
    ON c.RoomID = r.RoomID
INNER JOIN tenants t 
    ON c.TenantID = t.TenantID
ORDER BY c.ContractID";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }


    //   
    //  UPDATE ROOM STATUS
    //   
    private function updateRoomStatus($status)
    {
        $room = $this->conn->prepare("
            UPDATE rooms 
            SET Status = :status 
            WHERE RoomID = :roomID
        ");

        $room->bindParam(':status', $status);
        $room->bindParam(':roomID', $this->RoomID);

        if (!$room->execute()) {
            print_r($room->errorInfo());
        }
    }

    //create data
    public function create()
    {
        $query = "INSERT INTO contracts SET  RoomID=:RoomID,TenantID=:TenantID,StartDate=:StartDate,EndDate=:EndDate,ActualEndDate=:ActualEndDate,Deposit=:Deposit,ReturnedDeposit=:ReturnedDeposit,RentPrice=:RentPrice,Status=:Status,Note=:Note";
        $stmt = $this->conn->prepare($query);

        //    CLEAN DATA   
        $this->RoomID = (int)$this->RoomID;
        $this->TenantID = (int)$this->TenantID;
        $this->StartDate = htmlspecialchars(strip_tags($this->StartDate));
        $this->EndDate = htmlspecialchars(strip_tags($this->EndDate));
        $this->ActualEndDate = htmlspecialchars(strip_tags($this->ActualEndDate));
        $this->Deposit = (float)$this->Deposit;
        $this->ReturnedDeposit = (float)$this->ReturnedDeposit;
        $this->RentPrice = (float)$this->RentPrice;
        $this->Status = htmlspecialchars(strip_tags($this->Status));
        $this->Note = htmlspecialchars(strip_tags($this->Note));

        $this->Status = 'HIEU_LUC'; // mặc định khi tạo mới sẽ là hiệu lực

        //    BIND   
        $stmt->bindParam(':RoomID', $this->RoomID);
        $stmt->bindParam(':TenantID', $this->TenantID);
        $stmt->bindParam(':StartDate', $this->StartDate);
        $stmt->bindParam(':EndDate', $this->EndDate);
        $stmt->bindParam(':ActualEndDate', $this->ActualEndDate);
        $stmt->bindParam(':Deposit', $this->Deposit);
        $stmt->bindParam(':ReturnedDeposit', $this->ReturnedDeposit);
        $stmt->bindParam(':RentPrice', $this->RentPrice);
        $stmt->bindParam(':Status', $this->Status);
        $stmt->bindParam(':Note', $this->Note);



        if ($stmt->execute()) {
            $this->updateRoomStatus('DANG_THUE'); // đúng
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }

    public function update()
    {
        // CLEAN DATA
        $this->RoomID = (int)$this->RoomID;
        $this->TenantID = (int)$this->TenantID;
        $this->StartDate = htmlspecialchars(strip_tags($this->StartDate));
        $this->EndDate = htmlspecialchars(strip_tags($this->EndDate));
        $this->ActualEndDate = !empty($this->ActualEndDate) ? $this->ActualEndDate : null;
        $this->Deposit = (float)$this->Deposit;
        $this->ReturnedDeposit = (float)$this->ReturnedDeposit;
        $this->RentPrice = (float)$this->RentPrice;
        $this->Note = htmlspecialchars(strip_tags($this->Note));

        $roomsStatus = 'DANG_THUE';

        if ($this->ActualEndDate !== null) {

            if ($this->ActualEndDate < $this->EndDate) {
                $this->Status = 'HUY';
                $this->ReturnedDeposit = 0;
                $this->Deposit = 0;
            } else {
                $this->Status = 'HET_HAN';
                $this->ReturnedDeposit = $this->Deposit;
                $this->Deposit = 0;
            }

            $roomsStatus = 'TRONG';
        } else {
            $this->Status = 'HIEU_LUC';
        }

        // UPDATE CONTRACT
        $query = "UPDATE contracts SET  
        RoomID = :RoomID,
        TenantID = :TenantID,
        StartDate = :StartDate,
        EndDate = :EndDate,
        ActualEndDate = :ActualEndDate,
        Deposit = :Deposit,
        ReturnedDeposit = :ReturnedDeposit,
        RentPrice = :RentPrice,
        Status = :Status,
        Note = :Note
    WHERE ContractID = :ContractID";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':ContractID', $this->ContractID);
        $stmt->bindParam(':RoomID', $this->RoomID);
        $stmt->bindParam(':TenantID', $this->TenantID);
        $stmt->bindParam(':StartDate', $this->StartDate);
        $stmt->bindParam(':EndDate', $this->EndDate);
        $stmt->bindParam(':ActualEndDate', $this->ActualEndDate);
        $stmt->bindParam(':Deposit', $this->Deposit);
        $stmt->bindParam(':ReturnedDeposit', $this->ReturnedDeposit);
        $stmt->bindParam(':RentPrice', $this->RentPrice);
        $stmt->bindParam(':Status', $this->Status);
        $stmt->bindParam(':Note', $this->Note);

        if ($stmt->execute()) {

            // 🔥 UPDATE ROOM
            $this->updateRoomStatus($roomsStatus);

            return true;
        }

        print_r($stmt->errorInfo());
        return false;
    }


    //delete data
    public function delete()
    {
        $query = "DELETE FROM contracts WHERE ContractID=:ContractID";
        $stmt = $this->conn->prepare($query);

        //clean data
        $this->ContractID = htmlspecialchars(strip_tags($this->ContractID));

        $stmt->bindParam(':ContractID', $this->ContractID);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }
}
