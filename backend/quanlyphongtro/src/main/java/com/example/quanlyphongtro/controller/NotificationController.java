package com.example.quanlyphongtro.controller;

import com.example.quanlyphongtro.dto.request.NotificationRequest;
import com.example.quanlyphongtro.dto.response.NotificationResponse;
import com.example.quanlyphongtro.model.Notification;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import com.example.quanlyphongtro.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    //Tạo thông báo
    @PostMapping("/create")
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody NotificationRequest request,
                                                           Authentication authentication) {
        User sender = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Sender not found!"));

        Notification notification = notificationService.createNotification(
                request.getTitle(),
                request.getMessage(),
                sender.getUserId(),
                request.getReceiverId()
        );

        NotificationResponse response = new NotificationResponse(
                notification.getNotificationId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getCreatedAt(),
                notification.getSender().getUserId(),
                notification.getSender().getUsername(),
                notification.getReceiver().getUserId(),
                notification.getReceiver().getUsername()
        );

        return ResponseEntity.ok(response);
    }

    // Lấy thông báo theo userId
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return ResponseEntity.ok(notificationService.getNotifications(user));
    }

    // Đánh dấu đã đọc
    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }

}
