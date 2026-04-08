package com.vertere.tasktracker.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(
        regexp = "^[A-Za-z0-9._-]+$",
        message = "Username may only contain letters, numbers, periods, underscores, and hyphens"
    )
    String userName,

    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must be 255 characters or fewer")
    @Email(message = "Enter a valid email address")
    String userEmail,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d)\\S+$",
        message = "Password must contain at least one letter and one number, and must not contain spaces"
    )
    String userPassword
) {
}
