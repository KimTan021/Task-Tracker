package com.vertere.tasktracker.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjectRequestDTO(
    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 120, message = "Project name must be between 3 and 120 characters")
    String projectName,

    @Size(max = 1000, message = "Project description must be 1000 characters or fewer")
    String projectDescription,

    @Valid
    @NotNull(message = "Project owner is required")
    OwnerReferenceDTO user
) {
    public record OwnerReferenceDTO(
        @NotNull(message = "Project owner id is required")
        Integer userId
    ) {
    }
}
