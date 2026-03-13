package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByStatus(Room.RoomStatus status);
}
