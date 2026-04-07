package com.vertere.tasktracker.service;

import com.vertere.tasktracker.entity.Project;

import java.util.List;

public interface ProjectService {
    public List<Project> findAllProjects();
    public Project findProjectById(Integer projectId);
    public    Project saveProject(Project project);
    void deleteProjectById(Integer projectId);
    void addMember(Integer projectId, String username);
    java.util.List<Project> findAllProjectsByUserId(Integer userId);
    java.util.Set<com.vertere.tasktracker.entity.User> getMembers(Integer projectId);
}
