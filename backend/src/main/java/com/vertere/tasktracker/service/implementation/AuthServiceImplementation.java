package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.dto.request.LoginRequestDTO;
import com.vertere.tasktracker.dto.response.LoginResponseDTO;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.repository.UserRepository;
import com.vertere.tasktracker.security.JwtUtil;
import com.vertere.tasktracker.service.AuthService;
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
        // Final Fix: Sanitize input to avoid trailing spaces
        if (user.getUserName() != null) user.setUserName(user.getUserName().trim());
        if (user.getUserPassword() != null) {
            String encoded = passwordEncoder.encode(user.getUserPassword().trim());
            user.setUserPassword(encoded);
        }
        user.setUserRole("ROLE_USER");
        return userRepository.save(user);
    }

    @Override
    public User editUser(Integer userId, User updatedUser){
        User existing = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setUserName((updatedUser.getUserName()));
        existing.setUserEmail(updatedUser.getUserEmail());

        if(updatedUser.getUserPassword() != null && !updatedUser.getUserPassword().isBlank()){
            existing.setUserPassword(passwordEncoder.encode(updatedUser.getUserPassword()));
        }

        return userRepository.save(existing);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        // Final Fix: Sanitize input to avoid trailing spaces
        String username = request.getUserName() != null ? request.getUserName().trim() : "";
        String password = request.getUserPassword() != null ? request.getUserPassword().trim() : "";

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "User not found"));

        if(!passwordEncoder.matches(password, user.getUserPassword())){
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid credential");
        }

        String token = jwtUtil.generateToken(user.getUserEmail(), user.getUserRole());
        return new LoginResponseDTO(token, user.getUserId(), user.getUserName(), user.getUserEmail());
    }
}
