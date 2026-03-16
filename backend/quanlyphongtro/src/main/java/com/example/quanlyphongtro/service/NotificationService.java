package com.example.quanlyphongtro.service;

import com.example.quanlyphongtro.model.Notification;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.NotificationRepository;
import com.example.quanlyphongtro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public Notification createNotification (String message, Integer senderId, Integer receiverId){
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found!"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found!"));

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setSender(sender);
        notification.setReceiver(receiver);

        return notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(User user) {
        if(user.getRole() == User.Role.ADMIN) {
            return notificationRepository.findAll();
        } else {
            return notificationRepository.findByReceiver(user);
        }
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found!"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public User getUserById(Integer userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Receiver not found!"));
        return user;
    }
}
