<?php
class Building
{
    private $conn;
    public $BuildingID;
    public $BuildingName;
    public $Address;
    public $Floors;
    public $Note;


    public function __construct($db)
    {
        $this->conn = $db;
    }
    // read data
    public function read()
    {
        $query = "SELECT * FROM buildings ORDER BY BuildingID";
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
        $query = "INSERT INTO buildings SET BuildingName=:BuildingName, Address=:Address, Floors=:Floors, Note=:Note";
        $stmt = $this->conn->prepare($query);

        //clean data
        $this->BuildingName = htmlspecialchars(strip_tags($this->BuildingName));
        $this->Address = htmlspecialchars(strip_tags($this->Address));
        // $this->Floors = htmlspecialchars(strip_tags($this->Floors));
        $this->Note = htmlspecialchars(strip_tags($this->Note));

        $stmt->bindParam(':BuildingName', $this->BuildingName);
        $stmt->bindParam(':Address', $this->Address);
        $stmt->bindParam(':Floors', $this->Floors);
        $stmt->bindParam(':Note', $this->Note);

        if ($stmt->execute()) {
            return true;
        }
        printf('error %s.\n', $stmt->error);
        return false;
    }

    // //update data
    // public function update()
    // {
    //     $query = "UPDATE rooms SET RoomName=:RoomName,BasePrice=:BasePrice,Status=:Status,CurrentElectric=:CurrentElectric,CurrentWater=:CurrentWater WHERE RoomID=:RoomID";
    //     $stmt = $this->conn->prepare($query);

    //     //clean data
    //     $this->RoomID = htmlspecialchars(strip_tags($this->RoomID));
    //     $this->RoomName = htmlspecialchars(strip_tags($this->RoomName));
    //     $this->BasePrice = htmlspecialchars(strip_tags($this->BasePrice));
    //     $this->Status = htmlspecialchars(strip_tags($this->Status));
    //     $this->CurrentElectric = htmlspecialchars(strip_tags($this->CurrentElectric));
    //     $this->CurrentWater = htmlspecialchars(strip_tags($this->CurrentWater));

    //     $stmt->bindParam(':RoomID', $this->RoomID);
    //     $stmt->bindParam(':RoomName', $this->RoomName);
    //     $stmt->bindParam(':BasePrice', $this->BasePrice);
    //     $stmt->bindParam(':Status', $this->Status);
    //     $stmt->bindParam(':CurrentElectric', $this->CurrentElectric);
    //     $stmt->bindParam(':CurrentWater', $this->CurrentWater);
    //     if ($stmt->execute()) {
    //         return true;
    //     }
    //     printf('error %s.\n', $stmt->error);
    //     return false;
    // }

    // //delete data
    // public function delete()
    // {
    //     $query = "DELETE FROM rooms WHERE RoomID=:RoomID";
    //     $stmt = $this->conn->prepare($query);

    //     //clean data
    //     $this->RoomID = htmlspecialchars(strip_tags($this->RoomID));

    //     $stmt->bindParam(':RoomID', $this->RoomID);

    //     if ($stmt->execute()) {
    //         return true;
    //     }
    //     printf('error %s.\n', $stmt->error);
    //     return false;
    // }
}
