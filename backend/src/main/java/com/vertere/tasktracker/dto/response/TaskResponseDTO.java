package com.vertere.tasktracker.dto.response;

import java.time.LocalDateTime;
import java.util.List;

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
    List<TaskAssigneeResponseDTO> assignees,
    String assigneeName,
    Boolean archived,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
