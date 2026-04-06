package com.vertere.tasktracker.repository;

import com.task_tracker.task.service.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {
}
