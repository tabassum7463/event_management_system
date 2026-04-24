package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.LoginResponse;
import com.example.eventmanagement.dto.SignupRequest;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.exception.EmailAlreadyExistsException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.security.JwtService;
import com.example.eventmanagement.service.AuthService;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.http.HttpStatus;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthService authService,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

   
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("User registered successfully");
    }

    
    
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
       
            
       
            	 Authentication authentication = authenticationManager.authenticate(
                         new UsernamePasswordAuthenticationToken(
                                 request.getEmail(),
                                 request.getPassword()
                         )
                 );
            
            
            User user = authService.findByEmail(request.getEmail());
                       
           
           
            String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

           
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name(),
                    token
            );

            return ResponseEntity.ok(response);
        
    }
}