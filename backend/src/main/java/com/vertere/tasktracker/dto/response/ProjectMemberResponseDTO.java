package com.vertere.tasktracker.dto.response;

public record ProjectMemberResponseDTO(
    Integer userId,
    String userName,
    String userEmail,
    String role
) {
}
