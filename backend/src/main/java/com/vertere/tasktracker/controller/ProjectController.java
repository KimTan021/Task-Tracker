package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.dto.response.ProjectInvitationResponseDTO;
import com.vertere.tasktracker.dto.response.ProjectMemberResponseDTO;
import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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

    @PostMapping
    @Operation(description = "Save project data")
    public Project saveProject(@RequestBody Project project){
        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Delete a project based on provided id number")
    public void deleteProjectById(@PathVariable Integer id, Principal principal){
        projectService.deleteProjectById(id, principal.getName());
    }

    @PostMapping("/{projectId}/members")
    public ProjectInvitationResponseDTO addMember(@PathVariable Integer projectId, @RequestParam String username, Principal principal) {
        return projectService.addMember(projectId, username, principal.getName());
    }

    @GetMapping("/{projectId}/members")
    public List<ProjectMemberResponseDTO> getMembers(@PathVariable Integer projectId) {
        return projectService.getMembers(projectId);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public void removeMember(@PathVariable Integer projectId, @PathVariable Integer userId, Principal principal) {
        projectService.removeMember(projectId, userId, principal.getName());
    }

    @PostMapping("/{projectId}/members/{userId}/promote")
    public void promoteMember(@PathVariable Integer projectId, @PathVariable Integer userId, Principal principal) {
        projectService.promoteMember(projectId, userId, principal.getName());
    }

    @GetMapping("/user/{userId}")
    public List<Project> findProjectsByUserId(@PathVariable Integer userId) {
        return projectService.findAllProjectsByUserId(userId);
    }

    @GetMapping("/{projectId}/invitations")
    public List<ProjectInvitationResponseDTO> getPendingInvitationsForProject(@PathVariable Integer projectId) {
        return projectService.getPendingInvitationsForProject(projectId);
    }

    @GetMapping("/invitations/user/{userId}")
    public List<ProjectInvitationResponseDTO> getPendingInvitations(@PathVariable Integer userId) {
        return projectService.getPendingInvitations(userId);
    }

    @PostMapping("/invitations/{invitationId}/accept")
    public void acceptInvitation(@PathVariable Integer invitationId, Principal principal) {
        projectService.acceptInvitation(invitationId, principal.getName());
    }

    @PostMapping("/invitations/{invitationId}/reject")
    public void rejectInvitation(@PathVariable Integer invitationId, Principal principal) {
        projectService.rejectInvitation(invitationId, principal.getName());
    }
}
