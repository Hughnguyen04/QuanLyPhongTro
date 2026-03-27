<?php
class Bill
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

    // =====================================================
    // READ
    // =====================================================
    public function read()
    {
        $query = "SELECT 
                    b.*,
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

    // =====================================================
    // CREATE BILL
    // =====================================================
    public function create()
    {
        // ===== CHECK CONTRACT =====
        $query = "SELECT * FROM contracts WHERE ContractID = :id AND Status = 'HIEU_LUC'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $this->ContractID]);

        $contract = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$contract) return false;

        $roomID = $contract['RoomID'];
        $this->RoomPrice = (float)$contract['RentPrice'];

        // ===== LẤY UTILITIES =====
        $util = $this->getUtilities($roomID, $this->Month, $this->Year);

        $this->ElectricCost = $util['electric'];
        $this->WaterCost = $util['water'];

        // ===== CLEAN =====
        $this->LateFee = (float)($this->LateFee ?? 0);
        $this->PaidAmount = (float)($this->PaidAmount ?? 0);

        // ===== TOTAL =====
        $this->TotalAmount =
            $this->RoomPrice +
            $this->ElectricCost +
            $this->WaterCost +
            $this->LateFee;

        // ===== STATUS =====
        $today = date('Y-m-d');

        if ($this->PaidAmount >= $this->TotalAmount && $this->TotalAmount > 0) {
            $this->Status = 'DA_THANH_TOAN';
            $this->PaymentDate = date('Y-m-d');
        } else if ($today > $this->DueDate) {
            $this->Status = 'CHUA_THANH_TOAN';
        } else {
            $this->Status = 'CHUA_DEN_KY';
        }

        // ===== INSERT =====
        $query = "INSERT INTO bills SET
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
            Status = :Status";

        $stmt = $this->conn->prepare($query);

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

    // =====================================================
    // UPDATE (THANH TOÁN + PHẠT + TẠO BILL THÁNG SAU)
    // =====================================================
    public function update()
    {
        // ===== GET BILL =====
        $stmt = $this->conn->prepare("SELECT * FROM bills WHERE BillID = :id");
        $stmt->execute([':id' => $this->BillID]);
        $old = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$old) return false;

        $this->PaidAmount = (float)($this->PaidAmount ?? $old['PaidAmount']);
        $this->PaymentDate = $this->PaymentDate ?? null;

        $lateFeeNext = 0;

        // ===== STATUS =====
        if (empty($this->PaymentDate)) {

            $this->Status = 'CHUA_DEN_KY';
        } else {

            $due = strtotime($old['DueDate']);
            $pay = strtotime($this->PaymentDate);

            // trả sớm
            if ($pay < $due) {

                $this->Status = 'CHUA_DEN_KY';
            }
            // trả trễ
            else if ($pay > $due) {

                $lateDays = floor(($pay - $due) / 86400);

                if ($lateDays >= 5) {
                    $lateFeeNext = ($lateDays - 5) * 100;
                }

                $this->Status = 'DA_THANH_TOAN';
            }
            // đúng hạn
            else {

                $this->Status = 'DA_THANH_TOAN';
            }
        }

        // ===== UPDATE =====
        $query = "UPDATE bills SET
            PaidAmount = :PaidAmount,
            PaymentDate = :PaymentDate,
            Status = :Status
        WHERE BillID = :BillID";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ':PaidAmount' => $this->PaidAmount,
            ':PaymentDate' => $this->PaymentDate,
            ':Status' => $this->Status,
            ':BillID' => $this->BillID
        ]);

        // ===== TẠO BILL THÁNG SAU =====
        if ($lateFeeNext > 0) {
            $this->createNextBill($old, $lateFeeNext);
        }

        return true;
    }

    // =====================================================
    // TẠO BILL THÁNG SAU
    // =====================================================
    private function createNextBill($old, $lateFee)
    {
        $nextMonth = $old['Month'] + 1;
        $nextYear = $old['Year'];

        if ($nextMonth > 12) {
            $nextMonth = 1;
            $nextYear++;
        }

        // ===== CHECK TRÙNG =====
        $check = $this->conn->prepare("
            SELECT * FROM bills 
            WHERE ContractID = :cid AND Month = :m AND Year = :y
        ");
        $check->execute([
            ':cid' => $old['ContractID'],
            ':m' => $nextMonth,
            ':y' => $nextYear
        ]);

        if ($check->rowCount() > 0) return;

        // ===== CONTRACT =====
        $stmt = $this->conn->prepare("SELECT * FROM contracts WHERE ContractID = :id");
        $stmt->execute([':id' => $old['ContractID']]);
        $contract = $stmt->fetch(PDO::FETCH_ASSOC);

        $roomID = $contract['RoomID'];
        $roomPrice = $contract['RentPrice'];

        // ===== UTILITIES =====
        $util = $this->getUtilities($roomID, $nextMonth, $nextYear);

        $electric = $util['electric'];
        $water = $util['water'];

        $total = $roomPrice + $electric + $water + $lateFee;

        $dueDate = date('Y-m-10', strtotime("+1 month"));

        // ===== INSERT =====
        $stmt = $this->conn->prepare("
            INSERT INTO bills SET
            ContractID = :cid,
            Month = :m,
            Year = :y,
            RoomPrice = :rp,
            ElectricCost = :e,
            WaterCost = :w,
            LateFee = :lf,
            TotalAmount = :t,
            PaidAmount = 0,
            DueDate = :d,
            PaymentDate = NULL,
            Status = 'CHUA_DEN_KY'
        ");

        $stmt->execute([
            ':cid' => $old['ContractID'],
            ':m' => $nextMonth,
            ':y' => $nextYear,
            ':rp' => $roomPrice,
            ':e' => $electric,
            ':w' => $water,
            ':lf' => $lateFee,
            ':t' => $total,
            ':d' => $dueDate
        ]);
    }

    // =====================================================
    // UTILITIES HELPER
    // =====================================================
    private function getUtilities($roomID, $month, $year)
    {
        $stmt = $this->conn->prepare("
            SELECT * FROM utilities 
            WHERE RoomID = :roomID AND Month = :m AND Year = :y
        ");

        $stmt->execute([
            ':roomID' => $roomID,
            ':m' => $month,
            ':y' => $year
        ]);

        $u = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$u) {
            return ['electric' => 0, 'water' => 0];
        }

        return [
            'electric' => ($u['ElectricNew'] - $u['ElectricOld']) * $u['ElectricPrice'],
            'water' => ($u['WaterNew'] - $u['WaterOld']) * $u['WaterPrice']
        ];
    }

    // =====================================================
    // DELETE
    // =====================================================
    public function delete()
    {
        $stmt = $this->conn->prepare("DELETE FROM bills WHERE BillID = :id");
        return $stmt->execute([':id' => $this->BillID]);
    }
}
