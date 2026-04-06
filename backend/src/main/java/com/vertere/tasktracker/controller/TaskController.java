package com.vertere.tasktracker.controller;


import com.vertere.tasktracker.entity.Task;
import com.vertere.tasktracker.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> findAllTasks(){
        return taskService.findAllTasks();
    }

    @GetMapping("/{id}")
    public Task findTaskById(@PathVariable Integer id){
        return taskService.findTaskById(id);
    }

    @PostMapping
    public Task addTask(@RequestBody Task task){
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Integer id, @RequestBody Task task){
        return taskService.updateTask(id,task);
    }

    @DeleteMapping("/{id}")
    public void deleteTaskById(@PathVariable Integer id){
        taskService.deleteTaskById(id);
    }
}
