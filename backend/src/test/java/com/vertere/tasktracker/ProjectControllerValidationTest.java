package com.vertere.tasktracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vertere.tasktracker.controller.ProjectController;
import com.vertere.tasktracker.exception.GlobalExceptionHandler;
import com.vertere.tasktracker.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProjectControllerValidationTest {

    @Mock
    private ProjectService projectService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .standaloneSetup(new ProjectController(projectService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void saveProject_rejectsShortProjectName() throws Exception {
        Map<String, Object> request = Map.of(
            "projectName", "AB",
            "projectDescription", "Short name should be rejected",
            "user", Map.of("userId", 1)
        );

        mockMvc.perform(post("/api/project")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string(org.hamcrest.Matchers.containsString("Project name must be between 3 and 120 characters")));

        verifyNoInteractions(projectService);
    }
}
