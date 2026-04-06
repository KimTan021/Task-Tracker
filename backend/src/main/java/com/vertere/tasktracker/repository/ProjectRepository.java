package com.vertere.tasktracker.repository;

import com.task_tracker.task.service.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
}
