package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.entity.Task;
import com.vertere.tasktracker.exception.classes.TaskNotFound;
import com.vertere.tasktracker.repository.TaskRepository;
import com.vertere.tasktracker.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImplementation implements TaskService {
    private final TaskRepository taskRepository;

    public TaskServiceImplementation(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> findAllTasks(){
        return taskRepository.findAll();
    }

    @Override
    public Task findTaskById(Integer taskId){
        return taskRepository.findById(taskId).orElse(null);
    }

    @Override
    public Task saveTask(Task task){
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Integer id, Task task){
        if(!taskRepository.existsById(id)){
            throw new TaskNotFound("No task exists at specified id.");
        }

        task.setTaskId(id);
        return taskRepository.save(task);
    }

    @Override
    public void deleteTaskById(Integer taskId){
        taskRepository.deleteById(taskId);
    }
}
