package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.model.Notification;
import com.example.quanlyphongtro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiver(User receiver);
}
