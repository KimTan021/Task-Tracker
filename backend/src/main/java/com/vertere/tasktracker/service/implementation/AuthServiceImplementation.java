package com.task_tracker.task.service.service.implementation;

import com.task_tracker.task.service.dto.request.LoginRequestDTO;
import com.task_tracker.task.service.dto.response.LoginResponseDTO;
import com.task_tracker.task.service.entity.User;
import com.task_tracker.task.service.repository.UserRepository;
import com.task_tracker.task.service.security.JwtUtil;
import com.task_tracker.task.service.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImplementation implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImplementation(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder,
                                     JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public User register(User user){
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        return userRepository.save(user);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUserEmail(request.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(request.getUserPassword(), user.getUserPassword())){
            throw new RuntimeException("Invalid credential");
        }

        String token = jwtUtil.generateToken(user.getUserEmail());
        return new LoginResponseDTO(token);
    }
}
