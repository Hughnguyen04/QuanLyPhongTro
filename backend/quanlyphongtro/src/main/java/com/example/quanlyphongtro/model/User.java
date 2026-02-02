package com.example.quanlyphongtro.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "Username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "Password", nullable = false, length = 50)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private Role role;

    @Column(name = "IsActive", nullable = false)
    private boolean isActive = true;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role{
        ADMIN,
        STAFF,
        GUEST
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
