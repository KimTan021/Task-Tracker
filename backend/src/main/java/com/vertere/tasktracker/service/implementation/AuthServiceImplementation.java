package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.dto.request.LoginRequestDTO;
import com.vertere.tasktracker.dto.response.LoginResponseDTO;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.repository.UserRepository;
import com.vertere.tasktracker.security.JwtUtil;
import com.vertere.tasktracker.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        if (user.getUserName() != null) user.setUserName(user.getUserName().trim());
        if (user.getUserEmail() != null) user.setUserEmail(user.getUserEmail().trim());

        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT, "Username is already taken."
            );
        }

        if (userRepository.findByUserEmail(user.getUserEmail()).isPresent()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT, "Email is already registered."
            );
        }

        if (user.getUserPassword() != null) {
            String encoded = passwordEncoder.encode(user.getUserPassword());
            user.setUserPassword(encoded);
        }
        user.setUserRole("ROLE_USER");
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User editUser(Integer userId, User updatedUser){
        User existing = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getUserName() == null || updatedUser.getUserName().isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Username cannot be blank."
            );
        }
        if (updatedUser.getUserEmail() == null || updatedUser.getUserEmail().isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Email cannot be blank."
            );
        }

        existing.setUserName(updatedUser.getUserName().trim());
        existing.setUserEmail(updatedUser.getUserEmail().trim());

        if(updatedUser.getUserPassword() != null && !updatedUser.getUserPassword().isBlank()){
            existing.setUserPassword(passwordEncoder.encode(updatedUser.getUserPassword()));
        }

        return userRepository.save(existing);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        String username = request.getUserName() != null ? request.getUserName().trim() : "";
        String password = request.getUserPassword() != null ? request.getUserPassword() : "";

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "User not found"));

        if(!passwordEncoder.matches(password, user.getUserPassword())){
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid credential");
        }

        String token = jwtUtil.generateToken(user.getUserEmail(), user.getUserRole());
        return new LoginResponseDTO(token, user.getUserId(), user.getUserName(), user.getUserEmail());
    }
}
