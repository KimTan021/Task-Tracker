package com.vertere.tasktracker.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    private String userEmail;
    private String userPassword;
}
