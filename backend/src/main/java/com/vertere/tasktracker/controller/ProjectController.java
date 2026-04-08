package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.dto.request.ProjectRequestDTO;
import com.vertere.tasktracker.dto.response.ProjectInvitationResponseDTO;
import com.vertere.tasktracker.dto.response.ProjectMemberResponseDTO;
import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    @Operation(summary = "Find all projects in the database.")
    public List<Project> findAllProjects(){
        return projectService.findAllProjects();
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Find a specific project based on provided id number.")
    public Project findProjectById(@PathVariable Integer projectId){
        return projectService.findProjectById(projectId);
    }

    @PostMapping
    @Operation(summary = "Save project data.")
    public Project saveProject(@Valid @RequestBody ProjectRequestDTO request){
        Project project = Project.builder()
            .projectName(request.projectName())
            .projectDescription(request.projectDescription())
            .user(User.builder().userId(request.user().userId()).build())
            .build();
        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project based on provided id number")
    public void deleteProjectById(@PathVariable Integer id, Principal principal){
        projectService.deleteProjectById(id, principal.getName());
    }

    @PostMapping("/{projectId}/members")
    @Operation(summary = "Add a member to the specified project.")
    public ProjectInvitationResponseDTO addMember(@PathVariable Integer projectId, @RequestParam String username, Principal principal) {
        return projectService.addMember(projectId, username, principal.getName());
    }

    @GetMapping("/{projectId}/members")
    @Operation(summary = "Fetch all members of a project.")
    public List<ProjectMemberResponseDTO> getMembers(@PathVariable Integer projectId) {
        return projectService.getMembers(projectId);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @Operation(summary = "Remove a specified member from the project.")
    public void removeMember(@PathVariable Integer projectId, @PathVariable Integer userId, Principal principal) {
        projectService.removeMember(projectId, userId, principal.getName());
    }

    @PostMapping("/{projectId}/members/{userId}/promote")
    @Operation(summary = "Promote a project member")
    public void promoteMember(@PathVariable Integer projectId, @PathVariable Integer userId, Principal principal) {
        projectService.promoteMember(projectId, userId, principal.getName());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Find all projects associated with a specific user id.")
    public List<Project> findProjectsByUserId(@PathVariable Integer userId) {
        return projectService.findAllProjectsByUserId(userId);
    }

    @GetMapping("/{projectId}/invitations")
    @Operation(summary = "Find all pending invitations for a project.")
    public List<ProjectInvitationResponseDTO> getPendingInvitationsForProject(@PathVariable Integer projectId) {
        return projectService.getPendingInvitationsForProject(projectId);
    }

    @GetMapping("/invitations/user/{userId}")
    @Operation(summary = "Get all pending invitations meant for a user")
    public List<ProjectInvitationResponseDTO> getPendingInvitations(@PathVariable Integer userId) {
        return projectService.getPendingInvitations(userId);
    }

    @PostMapping("/invitations/{invitationId}/accept")
    @Operation(summary = "Accept a specific invitation.")
    public void acceptInvitation(@PathVariable Integer invitationId, Principal principal) {
        projectService.acceptInvitation(invitationId, principal.getName());
    }

    @PostMapping("/invitations/{invitationId}/reject")
    @Operation(summary = "Reject a specific invitation.")
    public void rejectInvitation(@PathVariable Integer invitationId, Principal principal) {
        projectService.rejectInvitation(invitationId, principal.getName());
    }
}
