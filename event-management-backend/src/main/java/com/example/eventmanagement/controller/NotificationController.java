package com.example.eventmanagement.controller;

import com.example.eventmanagement.entity.Notification;
import com.example.eventmanagement.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    
    
    //1
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(
                notificationService.getNotificationsByUser(userId)
        );
    }

 
    
    //2
    @PutMapping("/read/{id}")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }

  
    
    
    //3
    @PutMapping("/read-all/{userId}")
    public ResponseEntity<?> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }
}