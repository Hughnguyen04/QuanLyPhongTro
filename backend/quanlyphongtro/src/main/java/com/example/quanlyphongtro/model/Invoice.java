package com.example.quanlyphongtro.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "INVOICES")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvoiceID")
    private Integer invoiceId;

    // Quan hệ với Contract
    @ManyToOne
    @JoinColumn(name = "ContractID", nullable = false)
    private Contract contract;

    @Column(name = "BillingMonth", nullable = false, length = 7)
    private String billingMonth; // định dạng MM/YYYY

    @Column(name = "ElectricOld", nullable = false)
    private Integer electricOld;

    @Column(name = "ElectricNew", nullable = false)
    private Integer electricNew;

    @Column(name = "WaterOld", nullable = false)
    private Integer waterOld;

    @Column(name = "WaterNew", nullable = false)
    private Integer waterNew;

    @Column(name = "TotalAmount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentStatus", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.CHUA_THU;

    @Column(name = "PaymentDate")
    private LocalDate paymentDate;

    // Enum cho trạng thái thanh toán
    public enum PaymentStatus {
        CHUA_THU,
        DA_THU
    }

    // Getter & Setter
    public Integer getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Integer invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public String getBillingMonth() {
        return billingMonth;
    }

    public void setBillingMonth(String billingMonth) {
        this.billingMonth = billingMonth;
    }

    public Integer getElectricOld() {
        return electricOld;
    }

    public void setElectricOld(Integer electricOld) {
        this.electricOld = electricOld;
    }

    public Integer getElectricNew() {
        return electricNew;
    }

    public void setElectricNew(Integer electricNew) {
        this.electricNew = electricNew;
    }

    public Integer getWaterOld() {
        return waterOld;
    }

    public void setWaterOld(Integer waterOld) {
        this.waterOld = waterOld;
    }

    public Integer getWaterNew() {
        return waterNew;
    }

    public void setWaterNew(Integer waterNew) {
        this.waterNew = waterNew;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
}
