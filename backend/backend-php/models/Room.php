<?php
class Room
{
    private $conn;

    public $RoomID;
    public $BuildingName;
    public $BuildingAddress;
    public $BuildingTotalFloors;
    public $RoomName;
    public $RoomFloor;
    public $Area;
    public $BasePrice;
    public $Status;
    public $Note;

    public function __construct($db)
    {
        $this->conn = $db;
    }
    // read data
    public function read()
    {
        $query = "SELECT * FROM rooms  
        ORDER BY RoomID";
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

    // create data
    public function create()
    {
        $query = "INSERT INTO rooms SET  BuildingName=:BuildingName,BuildingAddress=:BuildingAddress,BuildingTotalFloors=:BuildingTotalFloors,RoomName=:RoomName,RoomFloor=:RoomFloor,Area=:Area,BasePrice=:BasePrice,Status=:Status,Note=:Note";
        $stmt = $this->conn->prepare($query);

        // ===== CLEAN DATA =====
        $this->BuildingName = htmlspecialchars(strip_tags($this->BuildingName));
        $this->BuildingAddress = htmlspecialchars(strip_tags($this->BuildingAddress));
        $this->BuildingTotalFloors = htmlspecialchars(strip_tags($this->BuildingTotalFloors));
        $this->RoomName = htmlspecialchars(strip_tags($this->RoomName));
        $this->RoomFloor = (int)$this->RoomFloor;
        $this->Area = (float)$this->Area;
        $this->BasePrice = (float)$this->BasePrice;
        $this->Status = htmlspecialchars(strip_tags($this->Status));
        $this->Note = htmlspecialchars(strip_tags($this->Note));

        // ===== BIND =====
        $stmt->bindParam(':BuildingName', $this->BuildingName);
        $stmt->bindParam(':BuildingAddress', $this->BuildingAddress);
        $stmt->bindParam(':BuildingTotalFloors', $this->BuildingTotalFloors);
        $stmt->bindParam(':RoomName', $this->RoomName);
        $stmt->bindParam(':RoomFloor', $this->RoomFloor);
        $stmt->bindParam(':Area', $this->Area);
        $stmt->bindParam(':BasePrice', $this->BasePrice);
        $stmt->bindParam(':Status', $this->Status);
        $stmt->bindParam(':Note', $this->Note);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }

    // update data
    public function update()
    {
        // $query = "UPDATE rooms r
        // JOIN buildings b ON r.BuildingID=b.BuildingID        
        // SET  BuildingID=:BuildingID,RoomName=:RoomName,Floor=:Floor,Area=:Area,BasePrice=:BasePrice,Status=:Status,CurrentElectric=:CurrentElectric,CurrentWater=:CurrentWater,Note=:Note Where RoomID=:RoomID";

        $query = "UPDATE rooms SET  
                    BuildingName = :BuildingName,
                    BuildingAddress = :BuildingAddress,
                    BuildingTotalFloors = :BuildingTotalFloors,
                    RoomName = :RoomName,
                    RoomFloor = :RoomFloor,
                    Area = :Area,
                    BasePrice = :BasePrice,
                    Status = :Status,
                    Note = :Note
                  WHERE RoomID = :RoomID";
        $stmt = $this->conn->prepare($query);

        // ===== CLEAN DATA =====
        $this->RoomID = (int)$this->RoomID;
        $this->BuildingName = htmlspecialchars(strip_tags($this->BuildingName));
        $this->BuildingAddress = htmlspecialchars(strip_tags($this->BuildingAddress));
        $this->BuildingTotalFloors = htmlspecialchars(strip_tags($this->BuildingTotalFloors));
        $this->RoomName = htmlspecialchars(strip_tags($this->RoomName));
        $this->RoomFloor = (int)$this->RoomFloor;
        $this->Area = (float)$this->Area;
        $this->BasePrice = (float)$this->BasePrice;
        $this->Status = htmlspecialchars(strip_tags($this->Status));
        $this->Note = htmlspecialchars(strip_tags($this->Note));



        // ===== BIND =====
        $stmt->bindParam(':RoomID', $this->RoomID);
        $stmt->bindParam(':BuildingName', $this->BuildingName);
        $stmt->bindParam(':BuildingAddress', $this->BuildingAddress);
        $stmt->bindParam(':BuildingTotalFloors', $this->BuildingTotalFloors);
        $stmt->bindParam(':RoomName', $this->RoomName);
        $stmt->bindParam(':RoomFloor', $this->RoomFloor);
        $stmt->bindParam(':Area', $this->Area);
        $stmt->bindParam(':BasePrice', $this->BasePrice);
        $stmt->bindParam(':Status', $this->Status);
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
        $query = "DELETE FROM rooms WHERE RoomID=:RoomID";
        $stmt = $this->conn->prepare($query);

        //clean data
        $this->RoomID = htmlspecialchars(strip_tags($this->RoomID));

        $stmt->bindParam(':RoomID', $this->RoomID);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }
}
