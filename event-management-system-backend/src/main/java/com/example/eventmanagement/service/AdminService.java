package com.example.eventmanagement.service;

import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.UserRole;
import com.example.eventmanagement.exception.CustomAccessDeniedHandler;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;

@Service
public class AdminService {

    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder, CustomAccessDeniedHandler customAccessDeniedHandler) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
    }

   
    
    public List<User> getUsers(String role) {
        if (role == null || role.isEmpty()) {
            return userRepository.findAll();
        }
        return userRepository.findByRole(UserRole.valueOf(role));
    }

   
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == UserRole.ADMIN) {
            throw new AccessDeniedException("Cannot delete ADMIN");
        }

        userRepository.delete(user);
    }


    public void promoteToOrganizer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(UserRole.ORGANIZER);
        userRepository.save(user);
        
    }

 
    public User createUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.valueOf(user.getRole().name()));

        return userRepository.save(user);
    }
}