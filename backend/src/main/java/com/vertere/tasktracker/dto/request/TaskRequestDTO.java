package com.vertere.tasktracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record TaskRequestDTO(
    Integer projectId,

    @NotBlank(message = "Task title is required")
    @Size(max = 120, message = "Task title must be 120 characters or fewer")
    String taskName,

    @Size(max = 1000, message = "Task description must be 1000 characters or fewer")
    String taskDescription,

    @Pattern(regexp = "todo|in_progress|review|completed", message = "Invalid task status")
    String taskStatus,

    LocalDateTime taskDateDue,
    LocalDateTime taskStartDate,

    @Pattern(regexp = "High|Medium|Low", message = "Invalid task priority")
    String taskPriority,

    @Size(max = 255, message = "Task tags must be 255 characters or fewer")
    String taskTags,

    @Size(max = 120, message = "Assignee name must be 120 characters or fewer")
    String assigneeName,

    Boolean archived
) {
}
