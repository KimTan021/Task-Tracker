package com.vertere.tasktracker.controller;

import com.task_tracker.task.service.entity.Project;
import com.task_tracker.task.service.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project")
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

    @PutMapping
    public Project saveProject(@RequestBody Project project){
        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProjectById(Integer projectId){
        projectService.deleteProjectById(projectId);
    }
}
