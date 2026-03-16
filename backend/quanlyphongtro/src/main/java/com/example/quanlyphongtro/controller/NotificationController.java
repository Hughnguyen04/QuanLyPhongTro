package com.example.quanlyphongtro.controller;

import com.example.quanlyphongtro.model.Notification;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/create")
    public Notification createNotification(@RequestParam String message, @RequestParam Integer senderId, @RequestParam Integer receiverId) {
        return notificationService.createNotification(message, senderId, receiverId);
    }

    @GetMapping
    public List<Notification> getNotification(@RequestParam Integer userId) {
        User user = notificationService.getUserById(userId);
        return notificationService.getNotifications(user);
    }

    @PutMapping("/{id}/read")
    public String markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return "Notification marked as read";
    }

}
