package com.vertere.tasktracker.controller;


import com.vertere.tasktracker.dto.request.TaskRequestDTO;
import com.vertere.tasktracker.dto.response.TaskResponseDTO;
import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.entity.Task;
import com.vertere.tasktracker.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    private TaskResponseDTO toResponse(Task task) {
        return new TaskResponseDTO(
            task.getTaskId(),
            task.getProject() != null ? task.getProject().getProjectId() : null,
            task.getTaskName(),
            task.getTaskDescription(),
            task.getTaskStatus(),
            task.getTaskDateDue(),
            task.getTaskStartDate(),
            task.getTaskPriority(),
            task.getTaskTags(),
            task.getAssigneeName(),
            task.getArchived(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }

    private Task toEntity(TaskRequestDTO request) {
        Task task = new Task();
        if (request.projectId() != null) {
            Project project = new Project();
            project.setProjectId(request.projectId());
            task.setProject(project);
        }
        task.setTaskName(request.taskName());
        task.setTaskDescription(request.taskDescription());
        task.setTaskStatus(request.taskStatus() != null ? request.taskStatus() : "todo");
        task.setTaskDateDue(request.taskDateDue());
        task.setTaskStartDate(request.taskStartDate());
        task.setTaskPriority(request.taskPriority() != null ? request.taskPriority() : "Medium");
        task.setTaskTags(request.taskTags());
        task.setAssigneeName(request.assigneeName());
        task.setArchived(Boolean.TRUE.equals(request.archived()));
        return task;
    }

    @GetMapping
    public List<TaskResponseDTO> findAllTasks(){
        return taskService.findAllTasks().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public TaskResponseDTO findTaskById(@PathVariable Integer id){
        return toResponse(taskService.findTaskById(id));
    }

    @PostMapping
    public TaskResponseDTO addTask(@Valid @RequestBody TaskRequestDTO request){
        return toResponse(taskService.saveTask(toEntity(request)));
    }

    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Integer id, @Valid @RequestBody TaskRequestDTO request){
        return toResponse(taskService.updateTask(id, toEntity(request)));
    }

    @DeleteMapping("/{id}")
    public void deleteTaskById(@PathVariable Integer id){
        taskService.deleteTaskById(id);
    }
}
