package com.vertere.tasktracker.service;

import com.vertere.tasktracker.dto.request.LoginRequestDTO;
import com.vertere.tasktracker.dto.response.LoginResponseDTO;
import com.vertere.tasktracker.entity.User;

public interface AuthService {
    User register(User user);
    LoginResponseDTO login(LoginRequestDTO request);
    User editUser(Integer userId, User updatedUser);
}
