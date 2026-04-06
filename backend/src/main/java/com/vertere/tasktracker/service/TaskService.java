package com.vertere.tasktracker.service;

import com.vertere.tasktracker.entity.Task;

import java.util.List;

public interface TaskService {
    public List<Task> findAllTasks();
    public Task findTaskById(Integer taskId);
    public Task saveTask(Task task);
    public Task updateTask(Integer id, Task task);
    public void deleteTaskById(Integer taskId);
}
