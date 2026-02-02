package com.example.quanlyphongtro.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "CONTRACTS")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ContractID")
    private Integer contractId;

    // Quan hệ với Room
    @ManyToOne
    @JoinColumn(name = "RoomID", nullable = false)
    private Room room;

    // Quan hệ với Tenant
    @ManyToOne
    @JoinColumn(name = "TenantID", nullable = false)
    private Tenant tenant;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "RentPrice", nullable = false, precision = 12, scale = 2)
    private BigDecimal rentPrice;

    @Column(name = "DepositAmount", precision = 12, scale = 2)
    private BigDecimal depositAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private ContractStatus status;

    // Enum cho trạng thái hợp đồng
    public enum ContractStatus {
        DANG_HIEU_LUC,
        DA_KET_THUC,
        DA_HUY
    }

    // Getter & Setter
    public Integer getContractId() {
        return contractId;
    }

    public void setContractId(Integer contractId) {
        this.contractId = contractId;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getRentPrice() {
        return rentPrice;
    }

    public void setRentPrice(BigDecimal rentPrice) {
        this.rentPrice = rentPrice;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public ContractStatus getStatus() {
        return status;
    }

    public void setStatus(ContractStatus status) {
        this.status = status;
    }
}

