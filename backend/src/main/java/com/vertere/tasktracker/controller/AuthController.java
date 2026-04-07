package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.dto.request.LoginRequestDTO;
import com.vertere.tasktracker.dto.response.LoginResponseDTO;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@org.springframework.web.bind.annotation.CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return authService.register(user);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request){
        return authService.login(request);
    }

    @PutMapping("/edit/{id}")
    public User editUser(@PathVariable Integer id, @RequestBody User updatedUser){
        return authService.editUser(id, updatedUser);
    }
}
