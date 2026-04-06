package com.task_tracker.task.service.service;

import com.task_tracker.task.service.dto.request.LoginRequestDTO;
import com.task_tracker.task.service.dto.response.LoginResponseDTO;
import com.task_tracker.task.service.entity.User;

public interface AuthService {
    User register(User user);
    LoginResponseDTO login(LoginRequestDTO request);
}
