package com.vertere.tasktracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    @NotBlank(message = "Username is required")
    @Size(max = 60, message = "Username must be 60 characters or fewer")
    private String userName;

    @NotBlank(message = "Password is required")
    @Size(max = 72, message = "Password must be 72 characters or fewer")
    private String userPassword;
}
