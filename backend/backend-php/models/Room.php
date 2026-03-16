<?php
class Room
{
    private $conn;

    public $RoomID;
    public $BuildingID;
    public $RoomName;
    public $Floor;
    public $Area;
    public $BasePrice;
    public $Status;
    public $CurrentElectric;
    public $CurrentWater;
    public $Note;

    public function __construct($db)
    {
        $this->conn = $db;
    }
    // read data
    public function read()
    {
        $query = "SELECT * FROM rooms ORDER BY RoomID";
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
        $query = "INSERT INTO rooms SET RoomName=:RoomName,Floor=:Floor,Area=:Area,BasePrice=:BasePrice,Status=:Status,CurrentElectric=:CurrentElectric,CurrentWater=:CurrentWater,Note=:Note";
        $stmt = $this->conn->prepare($query);

        //clean data
        $this->RoomName = htmlspecialchars(strip_tags($this->RoomName));
        $this->Floor = htmlspecialchars(strip_tags($this->Floor));
        $this->Area = htmlspecialchars(strip_tags($this->Area));
        $this->BasePrice = htmlspecialchars(strip_tags($this->BasePrice));
        $this->Status = htmlspecialchars(strip_tags($this->Status));
        $this->CurrentElectric = htmlspecialchars(strip_tags($this->CurrentElectric));
        $this->CurrentWater = htmlspecialchars(strip_tags($this->CurrentWater));
        $this->Note = htmlspecialchars(strip_tags($this->Note));


        $stmt->bindParam(':RoomName', $this->RoomName);
        $stmt->bindParam(':Floor', $this->Floor);
        $stmt->bindParam(':Area', $this->Area);
        $stmt->bindParam(':BasePrice', $this->BasePrice);
        $stmt->bindParam(':Status', $this->Status);
        $stmt->bindParam(':CurrentElectric', $this->CurrentElectric);
        $stmt->bindParam(':CurrentWater', $this->CurrentWater);
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
        $query = "UPDATE rooms SET RoomName=:RoomName,BasePrice=:BasePrice,Status=:Status,CurrentElectric=:CurrentElectric,CurrentWater=:CurrentWater WHERE RoomID=:RoomID";
        $stmt = $this->conn->prepare($query);

        //clean data
        $this->RoomID = htmlspecialchars(strip_tags($this->RoomID));
        $this->RoomName = htmlspecialchars(strip_tags($this->RoomName));
        $this->BasePrice = htmlspecialchars(strip_tags($this->BasePrice));
        $this->Status = htmlspecialchars(strip_tags($this->Status));
        $this->CurrentElectric = htmlspecialchars(strip_tags($this->CurrentElectric));
        $this->CurrentWater = htmlspecialchars(strip_tags($this->CurrentWater));

        $stmt->bindParam(':RoomID', $this->RoomID);
        $stmt->bindParam(':RoomName', $this->RoomName);
        $stmt->bindParam(':BasePrice', $this->BasePrice);
        $stmt->bindParam(':Status', $this->Status);
        $stmt->bindParam(':CurrentElectric', $this->CurrentElectric);
        $stmt->bindParam(':CurrentWater', $this->CurrentWater);
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
