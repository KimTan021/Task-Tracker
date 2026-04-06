package com.vertere.tasktracker.controller;

import com.task_tracker.task.service.dto.request.LoginRequestDTO;
import com.task_tracker.task.service.dto.response.LoginResponseDTO;
import com.task_tracker.task.service.entity.User;
import com.task_tracker.task.service.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
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
}
