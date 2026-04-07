package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.dto.request.LoginRequestDTO;
import com.vertere.tasktracker.dto.response.LoginResponseDTO;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for registration, login, and edit")
@SecurityRequirement(name = "bearerAuth")
@org.springframework.web.bind.annotation.CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public User register(@RequestBody User user){
        return authService.register(user);
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive a JWT token")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request){
        return authService.login(request);
    }

    @PutMapping("/edit/{id}")
    @Operation(summary = "Edit a user's details")
    public User editUser(@PathVariable Integer id, @RequestBody User updatedUser){
        return authService.editUser(id, updatedUser);
    }
}
