create database if not exists QuanLyPhongTro;

use QuanLyPhongTro;

CREATE TABLE USERS (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- mật khẩu đã mã hóa
    Role ENUM('ADMIN', 'STAFF', 'GUEST') NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROOMS (
    RoomID INT AUTO_INCREMENT PRIMARY KEY,
    RoomName VARCHAR(50) NOT NULL,
    BasePrice DECIMAL(12,2) NOT NULL,
    Status ENUM('TRONG', 'DANG_THUE', 'BAO_TRI') DEFAULT 'TRONG',
    CurrentElectric INT DEFAULT 0,
    CurrentWater INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE TENANTS (
    TenantID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    CitizenID VARCHAR(20) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL,
    Address VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE CONTRACTS (
    ContractID INT AUTO_INCREMENT PRIMARY KEY,
    RoomID INT NOT NULL,
    TenantID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    RentPrice DECIMAL(12,2) NOT NULL,
    DepositAmount DECIMAL(12,2) DEFAULT 0,
    Status ENUM('DANG_HIEU_LUC', 'DA_KET_THUC', 'DA_HUY') NOT NULL,

    CONSTRAINT fk_contract_room
        FOREIGN KEY (RoomID)
        REFERENCES ROOMS(RoomID),

    CONSTRAINT fk_contract_tenant
        FOREIGN KEY (TenantID)
        REFERENCES TENANTS(TenantID)
);

CREATE TABLE INVOICES (
    InvoiceID INT AUTO_INCREMENT PRIMARY KEY,
    ContractID INT NOT NULL,
    BillingMonth CHAR(7) NOT NULL, -- MM/YYYY
    ElectricOld INT NOT NULL,
    ElectricNew INT NOT NULL,
    WaterOld INT NOT NULL,
    WaterNew INT NOT NULL,
    TotalAmount DECIMAL(12,2) NOT NULL,
    PaymentStatus ENUM('CHUA_THU', 'DA_THU') DEFAULT 'CHUA_THU',
    PaymentDate DATE,

    CONSTRAINT fk_invoice_contract
        FOREIGN KEY (ContractID)
        REFERENCES CONTRACTS(ContractID),

    CONSTRAINT chk_electric
        CHECK (ElectricNew >= ElectricOld),

    CONSTRAINT chk_water
        CHECK (WaterNew >= WaterOld)
);
