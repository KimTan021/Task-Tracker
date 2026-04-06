package com.vertere.tasktracker.service;

import com.task_tracker.task.service.entity.Project;

import java.util.List;

public interface ProjectService {
    public List<Project> findAllProjects();
    public Project findProjectById(Integer projectId);
    public Project saveProject(Project project);
    public void deleteProjectById(Integer projectId);
}
