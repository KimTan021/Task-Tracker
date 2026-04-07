package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@Tag(name = "Projects", description = "Endpoints for managing projects and project-related data")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(description = "Find all projects in the database")
    public List<Project> findAllProjects(){
        return projectService.findAllProjects();
    }

    @GetMapping("/{projectId}")
    @Operation(description = "Find a specific project based on provided id number")
    public Project findProjectById(@PathVariable Integer projectId){
        return projectService.findProjectById(projectId);
    }

    @PutMapping
    @Operation(description = "Save project data")
    public Project saveProject(@RequestBody Project project){
        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Delete a project based on provided id number")
    public void deleteProjectById(Integer projectId){
        projectService.deleteProjectById(projectId);
    }
}
