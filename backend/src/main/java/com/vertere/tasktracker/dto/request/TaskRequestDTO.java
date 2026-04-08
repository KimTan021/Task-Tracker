package com.vertere.tasktracker.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record TaskRequestDTO(
    @NotNull(message = "Project is required")
    Integer projectId,

    @NotBlank(message = "Task title is required")
    @Size(max = 120, message = "Task title must be 120 characters or fewer")
    String taskName,

    @Size(max = 1000, message = "Task description must be 1000 characters or fewer")
    String taskDescription,

    @NotBlank(message = "Task status is required")
    @Pattern(regexp = "todo|in_progress|review|completed", message = "Invalid task status")
    String taskStatus,

    LocalDateTime taskDateDue,
    LocalDateTime taskStartDate,

    @NotBlank(message = "Task priority is required")
    @Pattern(regexp = "High|Medium|Low", message = "Invalid task priority")
    String taskPriority,

    @Size(max = 255, message = "Task tags must be 255 characters or fewer")
    String taskTags,

    List<Integer> assigneeIds,

    Boolean archived
) {
    @AssertTrue(message = "Due date must be on or after the start date")
    public boolean isDateRangeValid() {
        return taskStartDate == null || taskDateDue == null || !taskDateDue.isBefore(taskStartDate);
    }
}
