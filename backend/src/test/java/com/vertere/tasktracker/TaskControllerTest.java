package com.vertere.tasktracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.vertere.tasktracker.controller.TaskController;
import com.vertere.tasktracker.dto.request.TaskRequestDTO;
import com.vertere.tasktracker.exception.GlobalExceptionHandler;
import com.vertere.tasktracker.exception.classes.TaskNotFound;
import com.vertere.tasktracker.service.TaskService;
import com.vertere.tasktracker.entity.Task;
import com.vertere.tasktracker.entity.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    // A reusable task entity for mock returns
    private Task sampleTask;

    @BeforeEach
    void setUp() {
        // Build MockMvc manually with the GlobalExceptionHandler so all
        // @ExceptionHandler methods (TaskNotFound, MethodArgumentNotValidException,
        // ResponseStatusException) are active during tests — exactly as they are
        // in the real application context.
        mockMvc = MockMvcBuilders
                .standaloneSetup(taskController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Build a sample Project shell (only ID needed for response mapping)
        Project project = new Project();
        project.setProjectId(1);

        // Build a sample Task used across multiple tests
        sampleTask = new Task();
        sampleTask.setTaskId(1);
        sampleTask.setProject(project);
        sampleTask.setTaskName("Sample Task");
        sampleTask.setTaskDescription("A sample description");
        sampleTask.setTaskStatus("todo");
        sampleTask.setTaskPriority("Medium");
        sampleTask.setAssignees(new LinkedHashSet<>());
        sampleTask.setArchived(false);
        sampleTask.setCreatedAt(LocalDateTime.now());
        sampleTask.setUpdatedAt(LocalDateTime.now());
    }

    // -------------------------------------------------------------------------
    // TC_001 — GET /api/tasks — Retrieve all tasks (empty and non-empty)
    // -------------------------------------------------------------------------

    @Test
    void TC_001_getAllTasks_emptyList_returns200WithEmptyArray() throws Exception {
        when(taskService.findAllTasks()).thenReturn(List.of());

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void TC_001_getAllTasks_nonEmptyList_returns200WithTasks() throws Exception {
        when(taskService.findAllTasks()).thenReturn(List.of(sampleTask));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].taskName").value("Sample Task"));
    }

    // -------------------------------------------------------------------------
    // TC_002 — GET /api/tasks/{id} — Valid ID returns correct task
    // -------------------------------------------------------------------------

    @Test
    void TC_002_getTaskById_validId_returns200WithTask() throws Exception {
        when(taskService.findTaskById(1)).thenReturn(sampleTask);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(1))
                .andExpect(jsonPath("$.taskName").value("Sample Task"))
                .andExpect(jsonPath("$.taskStatus").value("todo"));
    }

    // -------------------------------------------------------------------------
    // TC_003 — GET /api/tasks/{id} — Non-existing ID returns 404
    // -------------------------------------------------------------------------

    @Test
    void TC_003_getTaskById_invalidId_returns404() throws Exception {
        when(taskService.findTaskById(999))
                .thenThrow(new TaskNotFound("No task found at specified id or unauthorized access."));

        mockMvc.perform(get("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("No task found at specified id or unauthorized access."));
    }

    // -------------------------------------------------------------------------
    // TC_004 — POST /api/tasks — Valid data returns 201 Created
    // -------------------------------------------------------------------------

    @Test
    void TC_004_createTask_validData_returns201WithTask() throws Exception {
        TaskRequestDTO request = new TaskRequestDTO(
                1,              // projectId
                "New Task",     // taskName
                "Description",  // taskDescription
                "todo",         // taskStatus
                null,           // taskDateDue
                null,           // taskStartDate
                "Medium",       // taskPriority
                null,           // taskTags
                List.of(),      // assigneeIds
                false           // archived
        );

        when(taskService.saveTask(any(Task.class))).thenReturn(sampleTask);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.taskName").value("Sample Task"));
    }

    // -------------------------------------------------------------------------
    // TC_005 — POST /api/tasks — Missing required title returns 400
    // -------------------------------------------------------------------------

    @Test
    void TC_005_createTask_missingTitle_returns400() throws Exception {
        // taskName is null — violates @NotBlank
        TaskRequestDTO request = new TaskRequestDTO(
                1,
                null,           // missing title
                "Description",
                "todo",
                null,
                null,
                "Medium",
                null,
                List.of(),
                false
        );

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("taskName")));
    }

    // -------------------------------------------------------------------------
    // TC_006 — PUT /api/tasks/{id} — Valid ID + body returns 200
    // -------------------------------------------------------------------------

    @Test
    void TC_006_updateTask_validId_returns200WithUpdatedTask() throws Exception {
        Task updatedTask = new Task();
        updatedTask.setTaskId(1);
        updatedTask.setProject(sampleTask.getProject());
        updatedTask.setTaskName("Updated Task");
        updatedTask.setTaskDescription("Updated description");
        updatedTask.setTaskStatus("in_progress");
        updatedTask.setTaskPriority("High");
        updatedTask.setArchived(false);
        updatedTask.setCreatedAt(sampleTask.getCreatedAt());
        updatedTask.setUpdatedAt(LocalDateTime.now());

        TaskRequestDTO request = new TaskRequestDTO(
                1,
                "Updated Task",
                "Updated description",
                "in_progress",
                null,
                null,
                "High",
                null,
                List.of(),
                false
        );

        when(taskService.updateTask(eq(1), any(Task.class))).thenReturn(updatedTask);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskName").value("Updated Task"))
                .andExpect(jsonPath("$.taskStatus").value("in_progress"));
    }

    // -------------------------------------------------------------------------
    // TC_007 — PUT /api/tasks/{id} — Invalid ID returns 404
    // -------------------------------------------------------------------------

    @Test
    void TC_007_updateTask_invalidId_returns404() throws Exception {
        TaskRequestDTO request = new TaskRequestDTO(
                1,
                "Some Task",
                null,
                "todo",
                null,
                null,
                "Medium",
                null,
                List.of(),
                false
        );

        when(taskService.updateTask(eq(999), any(Task.class)))
                .thenThrow(new TaskNotFound("No task exists at specified id or unauthorized."));

        mockMvc.perform(put("/api/tasks/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("No task exists at specified id or unauthorized."));
    }

    // -------------------------------------------------------------------------
    // TC_008 — DELETE /api/tasks/{id} — Valid ID returns 204 No Content
    // -------------------------------------------------------------------------

    @Test
    void TC_008_deleteTask_validId_returns204() throws Exception {
        doNothing().when(taskService).deleteTaskById(1);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).deleteTaskById(1);
    }

    // -------------------------------------------------------------------------
    // TC_009 — DELETE /api/tasks/{id} — Invalid ID returns 404
    // -------------------------------------------------------------------------

    @Test
    void TC_009_deleteTask_invalidId_returns404() throws Exception {
        doThrow(new TaskNotFound("No task found at specified id or unauthorized access."))
                .when(taskService).deleteTaskById(999);

        mockMvc.perform(delete("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("No task found at specified id or unauthorized access."));
    }

    // -------------------------------------------------------------------------
    // TC_010 — POST /api/tasks — Excessively long title/description returns 400
    // -------------------------------------------------------------------------

    @Test
    void TC_010_createTask_titleTooLong_returns400() throws Exception {
        String longTitle = "A".repeat(121); // exceeds @Size(max = 120)

        TaskRequestDTO request = new TaskRequestDTO(
                1,
                longTitle,
                "Normal description",
                "todo",
                null,
                null,
                "Medium",
                null,
                List.of(),
                false
        );

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("taskName")));
    }

    @Test
    void TC_010_createTask_descriptionTooLong_returns400() throws Exception {
        String longDescription = "D".repeat(1001); // exceeds @Size(max = 1000)

        TaskRequestDTO request = new TaskRequestDTO(
                1,
                "Valid Title",
                longDescription,
                "todo",
                null,
                null,
                "Medium",
                null,
                List.of(),
                false
        );

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("taskDescription")));
    }

    // -------------------------------------------------------------------------
    // TC_011 — GET /api/tasks — Returns newly created tasks (integration check)
    // -------------------------------------------------------------------------

    @Test
    void TC_011_getAllTasks_afterCreation_returnsCreatedTasks() throws Exception {
        Task secondTask = new Task();
        secondTask.setTaskId(2);
        secondTask.setProject(sampleTask.getProject());
        secondTask.setTaskName("Second Task");
        secondTask.setTaskDescription("Another task");
        secondTask.setTaskStatus("todo");
        secondTask.setTaskPriority("Low");
        secondTask.setArchived(false);
        secondTask.setCreatedAt(LocalDateTime.now());
        secondTask.setUpdatedAt(LocalDateTime.now());

        when(taskService.findAllTasks()).thenReturn(List.of(sampleTask, secondTask));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].taskName").value("Sample Task"))
                .andExpect(jsonPath("$[1].taskName").value("Second Task"));
    }
}
