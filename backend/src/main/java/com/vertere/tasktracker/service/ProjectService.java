package com.vertere.tasktracker.service;

import com.vertere.tasktracker.dto.response.ProjectInvitationResponseDTO;
import com.vertere.tasktracker.entity.Project;

import java.util.List;

public interface ProjectService {
    public List<Project> findAllProjects();
    public Project findProjectById(Integer projectId);
    public    Project saveProject(Project project);
    void deleteProjectById(Integer projectId);
    ProjectInvitationResponseDTO addMember(Integer projectId, String username, String inviterEmail);
    java.util.List<Project> findAllProjectsByUserId(Integer userId);
    java.util.Set<com.vertere.tasktracker.entity.User> getMembers(Integer projectId);
    void removeMember(Integer projectId, Integer userId, String requesterEmail);
    java.util.List<ProjectInvitationResponseDTO> getPendingInvitations(Integer userId);
    java.util.List<ProjectInvitationResponseDTO> getPendingInvitationsForProject(Integer projectId);
    void acceptInvitation(Integer invitationId, String userEmail);
    void rejectInvitation(Integer invitationId, String userEmail);
}
