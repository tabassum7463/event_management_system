package com.example.eventmanagement.controller;



import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.UserRole;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.service.AdminService;
import com.example.eventmanagement.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

	private final AdminService adminService;
 private final UserRepository userRepository;
 private final NotificationService notificationService;

 public AdminController(UserRepository userRepository,NotificationService notificationService,AdminService adminService) {
     this.userRepository = userRepository;
     this.adminService=adminService;
	 this.notificationService = notificationService;
 }


 
 @GetMapping("/users")
 public List<User> getUsers(@RequestParam(required = false) String role) {
     if (role != null && !role.isEmpty()) {
         return adminService.getUsers(role);
     }
     return userRepository.findAll();
 }

 
 

 @DeleteMapping("/users/{id}")
 public ResponseEntity<?> deleteUser(@PathVariable Long id) {
     adminService.deleteUser(id);
     return ResponseEntity.ok("User deleted successfully");
 }

 
 
 @PutMapping("/users/{id}/role")
 public ResponseEntity<?> updateUserRole(
         @PathVariable Long id,
         @RequestBody RoleUpdateRequest request) {

     User user = userRepository.findById(id)
             .orElseThrow(() -> new ResourceNotFoundException("User not found"));

     user.setRole(UserRole.valueOf(request.getRole()));
     userRepository.save(user);

     return ResponseEntity.ok("User role updated to " + request.getRole());
 }


 @PostMapping("/users")
 public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {

  
     if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
         return ResponseEntity.badRequest().body("Email already exists");
     }

     User newUser = new User();
     newUser.setUsername(request.getUsername());
     newUser.setEmail(request.getEmail());
     newUser.setPassword(
         new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(request.getPassword())
     );
     newUser.setRole(UserRole.valueOf(request.getRole()));

  adminService.createUser(newUser);

     List<User> admins = userRepository.findByRole(UserRole.ADMIN);
     for (User admin : admins) {
         
	 
      notificationService.createNotification(admin.getId(), "New user created: " + newUser.getUsername() + " (" + newUser.getEmail() + ")");
     }

    
     return ResponseEntity.ok("User created successfully");
 }
 
 public static class RoleUpdateRequest {
     private String role;
     public String getRole() { return role; }
     public void setRole(String role) { this.role = role; }
 }

 public static class CreateUserRequest {
     private String username;
     private String email;
     private String password;
     private String role;

     public String getUsername() { return username; }
     public void setUsername(String username) { this.username = username; }

     public String getEmail() { return email; }
     public void setEmail(String email) { this.email = email; }

     public String getPassword() { return password; }
     public void setPassword(String password) { this.password = password; }

     public String getRole() { return role; }
     public void setRole(String role) { this.role = role; }
 }
}