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
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
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
        User user = userRepository.findByUserEmail(request.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(request.getUserPassword(), user.getUserPassword())){
            throw new RuntimeException("Invalid credential");
        }

        String token = jwtUtil.generateToken(user.getUserEmail(),user.getUserRole());
        return new LoginResponseDTO(token);
    }
}
