package com.example.quanlyphongtro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TENANTS")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TenantID")
    private Integer tenantId;

    @Column(name = "FullName", nullable = false, length = 100)
    private String fullName;

    @Column(name = "CitizenID", nullable = false, unique = true, length = 20)
    private String citizenId;

    @Column(name = "Phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "Address", length = 255)
    private String address;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getter & Setter
    public Integer getTenantId() {
        return tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
