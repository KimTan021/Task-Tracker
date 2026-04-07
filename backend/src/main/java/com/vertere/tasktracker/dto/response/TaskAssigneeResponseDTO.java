package com.vertere.tasktracker.dto.response;

public record TaskAssigneeResponseDTO(
    Integer userId,
    String userName,
    String userEmail
) {
}
