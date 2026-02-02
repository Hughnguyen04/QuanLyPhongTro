package com.example.quanlyphongtro.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ROOMS")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomId;

    @Column(name = "RoomName", nullable = false, length = 50)
    private String roomName;

    @Column(name = "BasePrice", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private RoomStatus status = RoomStatus.TRONG;

    @Column(name = "CurrentElectric", nullable = false)
    private Integer currentElectric = 0;

    @Column(name = "CurrentWater", nullable = false)
    private Integer currentWater = 0;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum cho trạng thái phòng
    public enum RoomStatus {
        TRONG,
        DANG_THUE,
        BAO_TRI
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public Integer getCurrentElectric() {
        return currentElectric;
    }

    public void setCurrentElectric(Integer currentElectric) {
        this.currentElectric = currentElectric;
    }

    public Integer getCurrentWater() {
        return currentWater;
    }

    public void setCurrentWater(Integer currentWater) {
        this.currentWater = currentWater;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
