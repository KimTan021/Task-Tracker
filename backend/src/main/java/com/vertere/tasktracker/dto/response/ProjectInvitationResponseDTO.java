package com.vertere.tasktracker.dto.response;

import java.time.LocalDateTime;

public record ProjectInvitationResponseDTO(
    Integer invitationId,
    Integer projectId,
    String projectName,
    String projectDescription,
    Integer invitedUserId,
    String invitedUserName,
    Integer invitedByUserId,
    String invitedByUserName,
    String status,
    LocalDateTime createdAt
) {
}
