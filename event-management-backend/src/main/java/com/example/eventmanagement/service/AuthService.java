package com.example.eventmanagement.service;

import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.LoginResponse;
import com.example.eventmanagement.dto.SignupRequest;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.UserRole;
import com.example.eventmanagement.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public void signup(SignupRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(request.getPassword()); // TODO: use encoder in production
        user.setRole(UserRole.USER);

        userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}