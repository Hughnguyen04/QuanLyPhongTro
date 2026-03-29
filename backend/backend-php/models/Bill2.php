<?php
class Bill2
{
    private $conn;

    public $BillID;
    public $ContractID;
    public $Month;
    public $Year;
    public $RoomPrice;
    public $ElectricCost;
    public $WaterCost;
    public $LateFee;
    public $TotalAmount;
    public $PaidAmount;
    public $DueDate;
    public $PaymentDate;
    public $Status;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // READ
    public function read()
    {
        $query = "SELECT b.*,
                    r.RoomName,
                    t.FullName
                FROM bills b
                INNER JOIN contracts c ON b.ContractID = c.ContractID
                INNER JOIN rooms r ON c.RoomID = r.RoomID
                INNER JOIN tenants t ON c.TenantID = t.TenantID
                ORDER BY b.Year DESC, b.Month DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // CREATE BILL
    public function create()
    {
        //  CHECK CONTRACT 
        $stmt = $this->conn->prepare("
            SELECT * FROM contracts 
            WHERE ContractID = :id AND Status = 'HIEU_LUC'
        ");
        $stmt->execute([':id' => $this->ContractID]);
        $contract = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$contract) return false;

        $roomID = $contract['RoomID'];
        $this->RoomPrice = (float)$contract['RentPrice'];

        // LẤY UTILITIES 
        $stmt = $this->conn->prepare("
            SELECT * FROM utilities 
            WHERE RoomID = :roomID AND Month = :month AND Year = :year
        ");
        $stmt->execute([
            ':roomID' => $roomID,
            ':month' => $this->Month,
            ':year' => $this->Year
        ]);

        $util = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->ElectricCost = 0;
        $this->WaterCost = 0;

        if ($util) {
            $this->ElectricCost =
                ($util['ElectricNew'] - $util['ElectricOld']) * $util['ElectricPrice'];

            $this->WaterCost =
                ($util['WaterNew'] - $util['WaterOld']) * $util['WaterPrice'];
        }

        // TOTAL 
        $this->LateFee = (float)($this->LateFee ?? 0);
        $this->PaidAmount = (float)($this->PaidAmount ?? 0);

        $this->TotalAmount =
            $this->RoomPrice +
            $this->ElectricCost +
            $this->WaterCost +
            $this->LateFee;

        //   STATUS  
        $today = date('Y-m-d');

        if ($this->PaidAmount >= $this->TotalAmount && $this->TotalAmount > 0) {
            $this->Status = 'DA_THANH_TOAN';
            $this->PaymentDate = date('Y-m-d');
        } else if ($today > $this->DueDate) {
            $this->Status = 'CHUA_THANH_TOAN';
            $this->PaymentDate = null;
        } else {
            $this->Status = 'CHUA_DEN_KY';
            $this->PaymentDate = null;
        }

        //   INSERT  
        $stmt = $this->conn->prepare("
            INSERT INTO bills SET
                ContractID = :ContractID,
                Month = :Month,
                Year = :Year,
                RoomPrice = :RoomPrice,
                ElectricCost = :ElectricCost,
                WaterCost = :WaterCost,
                LateFee = :LateFee,
                TotalAmount = :TotalAmount,
                PaidAmount = :PaidAmount,
                DueDate = :DueDate,
                PaymentDate = :PaymentDate,
                Status = :Status
        ");

        return $stmt->execute([
            ':ContractID' => $this->ContractID,
            ':Month' => $this->Month,
            ':Year' => $this->Year,
            ':RoomPrice' => $this->RoomPrice,
            ':ElectricCost' => $this->ElectricCost,
            ':WaterCost' => $this->WaterCost,
            ':LateFee' => $this->LateFee,
            ':TotalAmount' => $this->TotalAmount,
            ':PaidAmount' => $this->PaidAmount,
            ':DueDate' => $this->DueDate,
            ':PaymentDate' => $this->PaymentDate,
            ':Status' => $this->Status
        ]);
    }

    // UPDATE (THANH TOÁN + PHẠT)
    public function update()
    {
        //   LẤY BILL  
        $stmt = $this->conn->prepare("SELECT * FROM bills WHERE BillID = :id");
        $stmt->execute([':id' => $this->BillID]);
        $old = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$old) return false;

        $this->PaidAmount = (float)($this->PaidAmount ?? $old['PaidAmount']);
        $this->PaymentDate = $this->PaymentDate;

        $lateFeeNext = 0;

        //   STATUS  
        if (empty($this->PaymentDate)) {

            $this->Status = 'CHUA_DEN_KY';
        } else {

            $due = strtotime($old['DueDate']);
            $pay = strtotime($this->PaymentDate);

            if ($pay < $due) {
                $this->Status = 'CHUA_DEN_KY';
            } else if ($pay > $due) {

                $lateDays = floor(($pay - $due) / 86400);

                if ($lateDays >= 5) {
                    $lateFeeNext = ($lateDays - 5) * 100;
                }

                $this->Status = ($this->PaidAmount >= $old['TotalAmount'])
                    ? 'DA_THANH_TOAN'
                    : 'CHUA_THANH_TOAN';
            } else {
                $this->Status = ($this->PaidAmount >= $old['TotalAmount'])
                    ? 'DA_THANH_TOAN'
                    : 'CHUA_THANH_TOAN';
            }
        }

        //   UPDATE  
        $stmt = $this->conn->prepare("
            UPDATE bills SET
                PaidAmount = :PaidAmount,
                PaymentDate = :PaymentDate,
                Status = :Status
            WHERE BillID = :BillID
        ");

        $ok = $stmt->execute([
            ':PaidAmount' => $this->PaidAmount,
            ':PaymentDate' => $this->PaymentDate,
            ':Status' => $this->Status,
            ':BillID' => $this->BillID
        ]);

        if (!$ok) return false;

        //   TẠO BILL THÁNG SAU (NẾU CÓ PHẠT)  
        if ($lateFeeNext > 0) {

            // tháng sau
            $nextMonth = $old['Month'] + 1;
            $nextYear = $old['Year'];

            if ($nextMonth > 12) {
                $nextMonth = 1;
                $nextYear++;
            }

            $dueDate = date('Y-m-d', strtotime($old['DueDate'] . ' +1 month'));

            //   LẤY ROOM  
            $stmtRoom = $this->conn->prepare("
                SELECT RoomID, RentPrice FROM contracts WHERE ContractID = :id
            ");
            $stmtRoom->execute([':id' => $old['ContractID']]);
            $room = $stmtRoom->fetch(PDO::FETCH_ASSOC);

            $roomID = $room['RoomID'];
            $roomPrice = $room['RentPrice'];

            //   LẤY UTILITIES THÁNG SAU  
            $stmtUtil = $this->conn->prepare("
                SELECT * FROM utilities 
                WHERE RoomID = :roomID AND Month = :month AND Year = :year
            ");
            $stmtUtil->execute([
                ':roomID' => $roomID,
                ':month' => $nextMonth,
                ':year' => $nextYear
            ]);

            $util = $stmtUtil->fetch(PDO::FETCH_ASSOC);

            $electricCost = 0;
            $waterCost = 0;

            if ($util) {
                $electricCost =
                    ($util['ElectricNew'] - $util['ElectricOld']) * $util['ElectricPrice'];

                $waterCost =
                    ($util['WaterNew'] - $util['WaterOld']) * $util['WaterPrice'];
            }

            //   TOTAL  
            $total = $roomPrice + $electricCost + $waterCost + $lateFeeNext;

            //   INSERT  
            $stmt2 = $this->conn->prepare("
                INSERT INTO bills SET
                    ContractID = :ContractID,
                    Month = :Month,
                    Year = :Year,
                    RoomPrice = :RoomPrice,
                    ElectricCost = :ElectricCost,
                    WaterCost = :WaterCost,
                    LateFee = :LateFee,
                    TotalAmount = :TotalAmount,
                    PaidAmount = 0,
                    DueDate = :DueDate,
                    PaymentDate = NULL,
                    Status = 'CHUA_DEN_KY'
            ");

            $stmt2->execute([
                ':ContractID' => $old['ContractID'],
                ':Month' => $nextMonth,
                ':Year' => $nextYear,
                ':RoomPrice' => $roomPrice,
                ':ElectricCost' => $electricCost,
                ':WaterCost' => $waterCost,
                ':LateFee' => $lateFeeNext,
                ':TotalAmount' => $total,
                ':DueDate' => $dueDate
            ]);
        }

        return true;
    }

    // DELETE
    public function delete()
    {
        $stmt = $this->conn->prepare("DELETE FROM bills WHERE BillID = :id");
        return $stmt->execute([':id' => $this->BillID]);
    }
}
