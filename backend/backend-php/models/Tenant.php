<?php
class Tenant
{
    private $conn;
    public $TenantID;
    public $RoomID;
    public $FullName;
    public $Phone;
    public $CCCD;
    public $BirthDate;
    public $Gender;
    public $Address;
    public $Email;
    public $Note;

    public function __construct($db)
    {
        $this->conn = $db;
    }
    // read data
    public function read()
    {
        $query = "SELECT *
FROM tenants 
ORDER BY TenantID";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // show data
    // public function show()
    // {
    //     $query = "SELECT * FROM rooms Where RoomID=? LIMIT 1";
    //     $stmt = $this->conn->prepare($query);
    //     $stmt->bindParam(1, $this->RoomID);
    //     $stmt->execute();

    //     $row = $stmt->fetch(PDO::FETCH_ASSOC);
    //     $this->RoomName = $row['RoomName'];
    //     $this->BasePrice = $row['BasePrice'];
    //     $this->Status = $row['Status'];
    //     $this->CurrentElectric = $row['CurrentElectric'];
    //     $this->CurrentWater = $row['CurrentWater'];
    // }

    //create data
    public function create()
    {
        $query = "INSERT INTO tenants SET  FullName=:FullName,Phone=:Phone,CCCD=:CCCD,BirthDate=:BirthDate,Gender=:Gender,Address=:Address,Email=:Email,Note=:Note";
        $stmt = $this->conn->prepare($query);

        // ===== CLEAN DATA =====
        $this->FullName = htmlspecialchars(strip_tags($this->FullName));
        $this->Phone = htmlspecialchars(strip_tags($this->Phone));
        $this->CCCD = htmlspecialchars(strip_tags($this->CCCD));
        $this->BirthDate = date($this->BirthDate);
        $this->Gender = htmlspecialchars(strip_tags($this->Gender));
        $this->Address = htmlspecialchars(strip_tags($this->Address));
        $this->Email = htmlspecialchars(strip_tags($this->Email));
        $this->Note = htmlspecialchars(strip_tags($this->Note));

        // ===== BIND =====
        $stmt->bindParam(':FullName', $this->FullName);
        $stmt->bindParam(':Phone', $this->Phone);
        $stmt->bindParam(':CCCD', $this->CCCD);
        $stmt->bindParam(':BirthDate', $this->BirthDate);
        $stmt->bindParam(':Gender', $this->Gender);
        $stmt->bindParam(':Address', $this->Address);
        $stmt->bindParam(':Email', $this->Email);
        $stmt->bindParam(':Note', $this->Note);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }

    //update data
    public function update()
    {
        // $query = "UPDATE rooms r
        // JOIN buildings b ON r.BuildingID=b.BuildingID        
        // SET  BuildingID=:BuildingID,RoomName=:RoomName,Floor=:Floor,Area=:Area,BasePrice=:BasePrice,Status=:Status,CurrentElectric=:CurrentElectric,CurrentWater=:CurrentWater,Note=:Note Where RoomID=:RoomID";

        $query = "UPDATE tenants SET  
                FullName = :FullName,
                Phone = :Phone,
                CCCD = :CCCD,
                BirthDate = :BirthDate,
                Gender = :Gender,
                Address = :Address,
                Email = :Email,
                Note = :Note
              WHERE TenantID = :TenantID";
        $stmt = $this->conn->prepare($query);

        // ===== CLEAN DATA =====
        $this->TenantID = (int)$this->TenantID;
        $this->FullName = htmlspecialchars(strip_tags($this->FullName));
        $this->Phone = htmlspecialchars(strip_tags($this->Phone));
        $this->CCCD = htmlspecialchars(strip_tags($this->CCCD));
        $this->BirthDate = date($this->BirthDate);
        $this->Gender = htmlspecialchars(strip_tags($this->Gender));
        $this->Address = htmlspecialchars(strip_tags($this->Address));
        $this->Email = htmlspecialchars(strip_tags($this->Email));
        $this->Note = htmlspecialchars(strip_tags($this->Note));

        // ===== BIND =====
        $stmt->bindParam(':TenantID', $this->TenantID);
        $stmt->bindParam(':FullName', $this->FullName);
        $stmt->bindParam(':Phone', $this->Phone);
        $stmt->bindParam(':CCCD', $this->CCCD);
        $stmt->bindParam(':BirthDate', $this->BirthDate);
        $stmt->bindParam(':Gender', $this->Gender);
        $stmt->bindParam(':Address', $this->Address);
        $stmt->bindParam(':Email', $this->Email);
        $stmt->bindParam(':Note', $this->Note);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }

    //delete data
    public function delete()
    {
        $query = "DELETE FROM tenants WHERE TenantID=:TenantID";
        $stmt = $this->conn->prepare($query);

        //clean data
        $this->TenantID = htmlspecialchars(strip_tags($this->TenantID));

        $stmt->bindParam(':TenantID', $this->TenantID);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }
}
