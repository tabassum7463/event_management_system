package com.example.eventmanagement.service;

import com.example.eventmanagement.entity.Notification;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.UserRole;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.NotificationRepository;
import com.example.eventmanagement.repository.UserRepository;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;    

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
		this.userRepository = userRepository;
    }

    public void createNotification(Long userId, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    
    public void markAllAsRead(Long userId) {
    	
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

	public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

	public void createNotificationForAdmin(String message) {
        
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);

        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUserId(admin.getId());
            notification.setMessage(message);
            notificationRepository.save(notification);
        }
    }
}