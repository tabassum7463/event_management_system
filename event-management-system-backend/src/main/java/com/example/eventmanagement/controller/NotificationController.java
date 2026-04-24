package com.example.eventmanagement.controller;

import com.example.eventmanagement.entity.Notification;
import com.example.eventmanagement.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ORGANIZER')")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(
                notificationService.getNotificationsByUser(userId)
        );
    }

   
 
    @PreAuthorize("hasAnyRole('USER','ADMIN','ORGANIZER')")
    @PutMapping("/read/{id}")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }

 
    
    @PreAuthorize("hasAnyRole('USER','ADMIN','ORGANIZER')")
    @PutMapping("/read-all/{userId}")
    public ResponseEntity<?> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/notifications/admin/{adminId}")
    public ResponseEntity<List<Notification>> getAdminNotifications(@PathVariable Long adminId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(adminId);
        return ResponseEntity.ok(notifications);
    }
}