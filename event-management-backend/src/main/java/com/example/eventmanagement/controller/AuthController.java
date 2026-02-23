package com.example.eventmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.LoginResponse;
import com.example.eventmanagement.dto.SignupRequest;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            // Backend password validation
            String password = request.getPassword();
            String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

            if (!password.matches(passwordPattern)) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Password must be at least 8 characters, include uppercase, lowercase, number, and special character");
            }

            authService.signup(request);

            return ResponseEntity.ok("User registered successfully");

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request); 

            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(response); 

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage()); // 
        }
    }
}