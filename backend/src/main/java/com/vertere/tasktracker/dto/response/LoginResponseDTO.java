package com.vertere.tasktracker.dto.response;

import lombok.Getter;

@Getter
public class LoginResponseDTO {
    private final String token;
    private final Integer userId;
    private final String userName;
    private final String userEmail;

    public LoginResponseDTO(String token, Integer userId, String userName, String userEmail) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
    }
}
