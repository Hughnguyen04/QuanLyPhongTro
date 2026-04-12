package com.example.quanlyphongtro.dto;

import com.example.quanlyphongtro.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StaffDTO {
    private Integer userId;
    private String fullName;
    private String username;
    private User.Role role;
    private String manageBuilding;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public StaffDTO(Integer userId, String fullName, String username, User.Role role, String manageBuilding, Boolean isActive, LocalDateTime createdAt) {
        this.userId = userId;
        this.fullName = fullName;
        this.username = username;
        this.role = role;
        this.manageBuilding = manageBuilding;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public String getManageBuilding() {
        return manageBuilding;
    }

    public void setManageBuilding(String manageBuilding) {
        this.manageBuilding = manageBuilding;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
