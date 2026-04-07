package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> findAllProjects(){
        return projectService.findAllProjects();
    }

    @GetMapping("/{projectId}")
    public Project findProjectById(@PathVariable Integer projectId){
        return projectService.findProjectById(projectId);
    }

    @PostMapping
    public Project saveProject(@RequestBody Project project){
        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProjectById(@PathVariable Integer id){
        projectService.deleteProjectById(id);
    }

    @PostMapping("/{projectId}/members")
    public void addMember(@PathVariable Integer projectId, @RequestParam String username) {
        projectService.addMember(projectId, username);
    }

    @GetMapping("/{projectId}/members")
    public java.util.Set<User> getMembers(@PathVariable Integer projectId) {
        return projectService.getMembers(projectId);
    }

    @GetMapping("/user/{userId}")
    public List<Project> findProjectsByUserId(@PathVariable Integer userId) {
        return projectService.findAllProjectsByUserId(userId);
    }
}
