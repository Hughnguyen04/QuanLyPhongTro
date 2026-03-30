package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.dto.response.NotificationResponse;
import com.example.quanlyphongtro.model.Notification;
import com.example.quanlyphongtro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
//    List<Notification> findByReceiver(User receiver);

    // Query để trả về DTO
    @Query("""
            SELECT new com.example.quanlyphongtro.dto.response.NotificationResponse(
                n.notificationId,
                n.title,
                n.message,
                n.isRead,
                n.createdAt,
                s.userId,
                s.username,
                r.userId,
                r.username
            )
            FROM Notification n
            JOIN n.sender s
            JOIN n.receiver r
            """)
    List<NotificationResponse> getAllNotifications();

    @Query("""
            SELECT new com.example.quanlyphongtro.dto.response.NotificationResponse(
                n.notificationId,
                n.title,
                n.message,
                n.isRead,
                n.createdAt,
                s.userId,
                s.username,
                r.userId,
                r.username
            )
            FROM Notification n
            JOIN n.sender s
            JOIN n.receiver r
            WHERE r.username = :username
            """)
    List<NotificationResponse> findByReceiverUsername(String username);


}
