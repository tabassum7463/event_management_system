package com.example.eventmanagement.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.SignupRequest;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.UserRole;
import com.example.eventmanagement.exception.EmailAlreadyExistsException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
		this.notificationService = notificationService;
    }

   
    public void signup(SignupRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("User already exists use diffrent email");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword())); 
        user.setRole(UserRole.USER);

        userRepository.save(user);
        
        String message = "New user signed up: " + user.getUsername();
        notificationService.createNotificationForAdmin(message);

    }

    


    public User findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

}