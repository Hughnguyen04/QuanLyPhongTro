<?php
class Utilities
{
    private $conn;
    private $table = "utilities";

    public $UtilityID;
    public $RoomID;
    public $Month;
    public $Year;

    public $ElectricOld;
    public $ElectricNew;
    public $WaterOld;
    public $WaterNew;

    public $ElectricPrice;
    public $WaterPrice;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // ===== READ =====
    public function read()
    {
        $query = "SELECT 
                    u.*,
                    r.RoomName,
                    r.BuildingName
                  FROM " . $this->table . " u
                  INNER JOIN rooms r ON u.RoomID = r.RoomID
                  ORDER BY u.Year DESC, u.Month DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // ===== CREATE =====
    public function create()
    {
        $query = "INSERT INTO " . $this->table . " 
        SET
            RoomID = :RoomID,
            Month = :Month,
            Year = :Year,
            ElectricOld = :ElectricOld,
            ElectricNew = :ElectricNew,
            WaterOld = :WaterOld,
            WaterNew = :WaterNew,
            ElectricPrice = :ElectricPrice,
            WaterPrice = :WaterPrice";

        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->RoomID = htmlspecialchars(strip_tags($this->RoomID));
        $this->Month = htmlspecialchars(strip_tags($this->Month));
        $this->Year = htmlspecialchars(strip_tags($this->Year));
        $this->ElectricOld = htmlspecialchars(strip_tags($this->ElectricOld));
        $this->ElectricNew = htmlspecialchars(strip_tags($this->ElectricNew));
        $this->WaterOld = htmlspecialchars(strip_tags($this->WaterOld));
        $this->WaterNew = htmlspecialchars(strip_tags($this->WaterNew));
        $this->ElectricPrice = htmlspecialchars(strip_tags($this->ElectricPrice));
        $this->WaterPrice = htmlspecialchars(strip_tags($this->WaterPrice));

        // bind
        $stmt->bindParam(":RoomID", $this->RoomID);
        $stmt->bindParam(":Month", $this->Month);
        $stmt->bindParam(":Year", $this->Year);
        $stmt->bindParam(":ElectricOld", $this->ElectricOld);
        $stmt->bindParam(":ElectricNew", $this->ElectricNew);
        $stmt->bindParam(":WaterOld", $this->WaterOld);
        $stmt->bindParam(":WaterNew", $this->WaterNew);
        $stmt->bindParam(":ElectricPrice", $this->ElectricPrice);
        $stmt->bindParam(":WaterPrice", $this->WaterPrice);

        return $stmt->execute();
    }

    // ===== UPDATE =====
    public function update()
    {
        $query = "UPDATE " . $this->table . " 
        SET
            RoomID = :RoomID,
            Month = :Month,
            Year = :Year,
            ElectricOld = :ElectricOld,
            ElectricNew = :ElectricNew,
            WaterOld = :WaterOld,
            WaterNew = :WaterNew,
            ElectricPrice = :ElectricPrice,
            WaterPrice = :WaterPrice
        WHERE UtilityID = :UtilityID";

        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->UtilityID = htmlspecialchars(strip_tags($this->UtilityID));
        $this->RoomID = htmlspecialchars(strip_tags($this->RoomID));
        $this->Month = htmlspecialchars(strip_tags($this->Month));
        $this->Year = htmlspecialchars(strip_tags($this->Year));
        $this->ElectricOld = htmlspecialchars(strip_tags($this->ElectricOld));
        $this->ElectricNew = htmlspecialchars(strip_tags($this->ElectricNew));
        $this->WaterOld = htmlspecialchars(strip_tags($this->WaterOld));
        $this->WaterNew = htmlspecialchars(strip_tags($this->WaterNew));
        $this->ElectricPrice = htmlspecialchars(strip_tags($this->ElectricPrice));
        $this->WaterPrice = htmlspecialchars(strip_tags($this->WaterPrice));

        // bind
        $stmt->bindParam(":UtilityID", $this->UtilityID);
        $stmt->bindParam(":RoomID", $this->RoomID);
        $stmt->bindParam(":Month", $this->Month);
        $stmt->bindParam(":Year", $this->Year);
        $stmt->bindParam(":ElectricOld", $this->ElectricOld);
        $stmt->bindParam(":ElectricNew", $this->ElectricNew);
        $stmt->bindParam(":WaterOld", $this->WaterOld);
        $stmt->bindParam(":WaterNew", $this->WaterNew);
        $stmt->bindParam(":ElectricPrice", $this->ElectricPrice);
        $stmt->bindParam(":WaterPrice", $this->WaterPrice);

        return $stmt->execute();
    }

    // ===== DELETE =====
    public function delete()
    {
        $query = "DELETE FROM " . $this->table . " WHERE UtilityID = :UtilityID";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":UtilityID", $this->UtilityID);

        return $stmt->execute();
    }
}
