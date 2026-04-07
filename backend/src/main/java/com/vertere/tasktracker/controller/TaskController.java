package com.vertere.tasktracker.controller;


import com.vertere.tasktracker.entity.Task;
import com.vertere.tasktracker.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Endpoints for managing tasks and task-related data")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @GetMapping
    @Operation(summary = "Get all tasks in the database")
    public List<Task> findAllTasks(){
        return taskService.findAllTasks();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific task by provided ID number")
    public Task findTaskById(@PathVariable Integer id){
        return taskService.findTaskById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public Task addTask(@RequestBody Task task){
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing task")
    public Task updateTask(@PathVariable Integer id, @RequestBody Task task){
        return taskService.updateTask(id,task);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an existing task by provided ID number")
    public void deleteTaskById(@PathVariable Integer id){
        taskService.deleteTaskById(id);
    }
}
