package com.vertere.tasktracker.dto.response;

import java.time.LocalDateTime;

public record TaskResponseDTO(
    Integer taskId,
    Integer projectId,
    String taskName,
    String taskDescription,
    String taskStatus,
    LocalDateTime taskDateDue,
    LocalDateTime taskStartDate,
    String taskPriority,
    String taskTags,
    String assigneeName,
    Boolean archived,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
