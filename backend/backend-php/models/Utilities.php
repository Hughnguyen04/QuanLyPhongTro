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


    // read data
    public function read()
    {
        $query = "SELECT 
    u.*,
    r.RoomName
FROM utilities u
INNER JOIN rooms r 
    ON u.RoomID = r.RoomID
ORDER BY u.UtilityID";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    //    TÍNH & UPDATE BILL   
    private function updateBill()
    {
        // tính tiền
        $electricCost = ($this->ElectricNew - $this->ElectricOld) * $this->ElectricPrice;
        $waterCost = ($this->WaterNew - $this->WaterOld) * $this->WaterPrice;

        // tìm bill cùng tháng
        $sql = "
    SELECT b.BillID, b.RoomPrice, b.LateFee
    FROM bills b
    INNER JOIN contracts c 
        ON b.ContractID = c.ContractID
    WHERE c.RoomID = :roomID
    AND b.Month = :month
    AND b.Year = :year
    LIMIT 1
";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':roomID' => $this->RoomID,
            ':month' => $this->Month,
            ':year' => $this->Year
        ]);

        $bill = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($bill) {
            $total = $bill['RoomPrice'] + $electricCost + $waterCost + (float)$bill['LateFee'];

            $update = $this->conn->prepare("
                UPDATE bills SET
                    ElectricCost = :electric,
                    WaterCost = :water,
                    TotalAmount = :total
                WHERE BillID = :id
            ");

            $update->execute([
                ':electric' => $electricCost,
                ':water' => $waterCost,
                ':total' => $total,
                ':id' => $bill['BillID']
            ]);
        }
    }

    //    CREATE   
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

        $stmt->execute([
            ':RoomID' => $this->RoomID,
            ':Month' => $this->Month,
            ':Year' => $this->Year,
            ':ElectricOld' => $this->ElectricOld,
            ':ElectricNew' => $this->ElectricNew,
            ':WaterOld' => $this->WaterOld,
            ':WaterNew' => $this->WaterNew,
            ':ElectricPrice' => $this->ElectricPrice,
            ':WaterPrice' => $this->WaterPrice
        ]);

        // 👉 update bill sau khi insert
        $this->updateBill();

        return true;
    }

    //    UPDATE   
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

        $stmt->execute([
            ':UtilityID' => $this->UtilityID,
            ':RoomID' => $this->RoomID,
            ':Month' => $this->Month,
            ':Year' => $this->Year,
            ':ElectricOld' => $this->ElectricOld,
            ':ElectricNew' => $this->ElectricNew,
            ':WaterOld' => $this->WaterOld,
            ':WaterNew' => $this->WaterNew,
            ':ElectricPrice' => $this->ElectricPrice,
            ':WaterPrice' => $this->WaterPrice
        ]);

        // 👉 update bill sau khi update
        $this->updateBill();

        return true;
    }

    //    DELETE   
    public function delete()
    {
        $query = "DELETE FROM " . $this->table . " WHERE UtilityID = :UtilityID";

        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':UtilityID' => $this->UtilityID]);
    }
}
