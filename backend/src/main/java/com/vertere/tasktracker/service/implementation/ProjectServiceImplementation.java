package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.dto.response.ProjectInvitationResponseDTO;
import com.vertere.tasktracker.dto.response.ProjectMemberResponseDTO;
import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.entity.ProjectInvitation;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.repository.ProjectInvitationRepository;
import com.vertere.tasktracker.repository.ProjectRepository;
import com.vertere.tasktracker.repository.TaskRepository;
import com.vertere.tasktracker.repository.UserRepository;
import com.vertere.tasktracker.service.ProjectService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class ProjectServiceImplementation implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectInvitationRepository projectInvitationRepository;
    private final TaskRepository taskRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ProjectServiceImplementation(ProjectRepository projectRepository,
                                        UserRepository userRepository,
                                        ProjectInvitationRepository projectInvitationRepository,
                                        TaskRepository taskRepository,
                                        SimpMessagingTemplate messagingTemplate){
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectInvitationRepository = projectInvitationRepository;
        this.taskRepository = taskRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public List<Project> findAllProjects(){
        return projectRepository.findAll();
    }

    @Override
    public Project findProjectById(Integer projectId){
        return projectRepository.findById(projectId).orElse(null);
    }

    @Override
    public Project saveProject(Project project){
        if (project.getUser() != null && project.getUser().getUserId() != null) {
            User managedUser = userRepository.findById(project.getUser().getUserId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Owner not found"));
            project.setUser(managedUser);
        if (project.getMembers() == null) {
            project.setMembers(new java.util.HashSet<>());
        }
        if (project.getCoOwners() == null) {
            project.setCoOwners(new java.util.HashSet<>());
        }
        project.getMembers().add(managedUser);
        }
        return projectRepository.save(project);
    }

    @Override
    public void deleteProjectById(Integer projectId, String requesterEmail){
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Project not found"));
        User requester = userRepository.findByUserEmail(requesterEmail)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Requester not found"));

        if (!project.getUser().getUserId().equals(requester.getUserId())) {
            throw new ResponseStatusException(FORBIDDEN, "Only the project owner can delete this project");
        }

        projectRepository.deleteById(projectId);
        broadcastProjectTasksUpdate(project, null);
    }

    @Override
    public ProjectInvitationResponseDTO addMember(Integer projectId, String username, String inviterEmail) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Project not found"));
        User invitedUser = userRepository.findByUserName(username.trim())
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        User inviter = userRepository.findByUserEmail(inviterEmail)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Inviter not found"));

        if (!canInvite(project, inviter)) {
            throw new ResponseStatusException(FORBIDDEN, "Only the project owner or co-architect can invite collaborators");
        }
        if (project.getUser().getUserId().equals(invitedUser.getUserId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Project owner is already part of this project");
        }
        if (project.getMembers().stream().anyMatch(member -> member.getUserId().equals(invitedUser.getUserId()))) {
            throw new ResponseStatusException(CONFLICT, "User is already a collaborator");
        }
        if (projectInvitationRepository.existsByProject_ProjectIdAndInvitedUser_UserIdAndStatus(projectId, invitedUser.getUserId(), "PENDING")) {
            throw new ResponseStatusException(CONFLICT, "User already has a pending invite");
        }

        ProjectInvitation invitation = projectInvitationRepository
            .findByProject_ProjectIdAndInvitedUser_UserId(projectId, invitedUser.getUserId())
            .map(existingInvitation -> {
                existingInvitation.setInvitedBy(inviter);
                existingInvitation.setStatus("PENDING");
                existingInvitation.setCreatedAt(java.time.LocalDateTime.now());
                return existingInvitation;
            })
            .orElseGet(() -> ProjectInvitation.builder()
                .project(project)
                .invitedUser(invitedUser)
                .invitedBy(inviter)
                .status("PENDING")
                .createdAt(java.time.LocalDateTime.now())
                .build());

        try {
            return toInvitationResponse(projectInvitationRepository.save(invitation));
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(CONFLICT, "User already has a pending invite");
        }
    }

    @Override
    public java.util.List<Project> findAllProjectsByUserId(Integer userId) {
        return projectRepository.findAllByMembers_UserId(userId);
    }

    @Override
    public List<ProjectMemberResponseDTO> getMembers(Integer projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Project not found"));
        return project.getMembers().stream()
            .map(member -> toProjectMemberResponse(project, member))
            .sorted(java.util.Comparator.comparing(ProjectMemberResponseDTO::role).thenComparing(ProjectMemberResponseDTO::userName, String.CASE_INSENSITIVE_ORDER))
            .toList();
    }

    @Override
    public void removeMember(Integer projectId, Integer userId, String requesterEmail) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Project not found"));
        User requester = userRepository.findByUserEmail(requesterEmail)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Requester not found"));

        if (!project.getUser().getUserId().equals(requester.getUserId())) {
            throw new ResponseStatusException(FORBIDDEN, "Only the project owner can remove collaborators");
        }
        if (project.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(BAD_REQUEST, "Project owner cannot be removed");
        }

        User member = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        boolean removed = project.getMembers().removeIf(existingMember -> existingMember.getUserId().equals(userId));
        if (!removed) {
            throw new ResponseStatusException(NOT_FOUND, "Collaborator not found in this project");
        }
        project.getCoOwners().removeIf(existingCoOwner -> existingCoOwner.getUserId().equals(userId));
        taskRepository.findProjectTasksAssignedToUser(projectId, userId).forEach(task -> {
            task.getAssignees().removeIf(assignee -> assignee.getUserId().equals(userId));
            task.setAssigneeName(task.getAssignees().stream()
                .map(User::getUserName)
                .collect(java.util.stream.Collectors.joining(", ")));
        });
        projectRepository.save(project);
        broadcastProjectTasksUpdate(project, member.getUserEmail());
    }

    @Override
    public void promoteMember(Integer projectId, Integer userId, String requesterEmail) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Project not found"));
        User requester = userRepository.findByUserEmail(requesterEmail)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Requester not found"));

        if (!project.getUser().getUserId().equals(requester.getUserId())) {
            throw new ResponseStatusException(FORBIDDEN, "Only the project owner can promote collaborators");
        }
        if (project.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(BAD_REQUEST, "Project owner already has full access");
        }

        User member = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        boolean isMember = project.getMembers().stream().anyMatch(existingMember -> existingMember.getUserId().equals(userId));
        if (!isMember) {
            throw new ResponseStatusException(NOT_FOUND, "Collaborator not found in this project");
        }
        boolean alreadyCoOwner = project.getCoOwners().stream().anyMatch(existingCoOwner -> existingCoOwner.getUserId().equals(userId));
        if (alreadyCoOwner) {
            throw new ResponseStatusException(CONFLICT, "Collaborator is already a co-architect");
        }

        project.getCoOwners().add(member);
        projectRepository.save(project);
    }

    @Override
    public List<ProjectInvitationResponseDTO> getPendingInvitations(Integer userId) {
        return projectInvitationRepository.findAllByInvitedUser_UserIdAndStatusOrderByCreatedAtDesc(userId, "PENDING")
            .stream()
            .map(this::toInvitationResponse)
            .toList();
    }

    @Override
    public List<ProjectInvitationResponseDTO> getPendingInvitationsForProject(Integer projectId) {
        return projectInvitationRepository.findAllByProject_ProjectIdAndStatusOrderByCreatedAtDesc(projectId, "PENDING")
            .stream()
            .map(this::toInvitationResponse)
            .toList();
    }

    @Override
    public void acceptInvitation(Integer invitationId, String userEmail) {
        ProjectInvitation invitation = projectInvitationRepository.findByProjectInvitationIdAndStatus(invitationId, "PENDING")
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Invitation not found"));

        if (!invitation.getInvitedUser().getUserEmail().equals(userEmail)) {
            throw new ResponseStatusException(FORBIDDEN, "You cannot accept this invitation");
        }

        Project project = invitation.getProject();
        if (project.getMembers() == null) {
            project.setMembers(new java.util.HashSet<>());
        }
        project.getMembers().add(invitation.getInvitedUser());
        projectRepository.save(project);

        invitation.setStatus("ACCEPTED");
        projectInvitationRepository.save(invitation);
    }

    @Override
    public void rejectInvitation(Integer invitationId, String userEmail) {
        ProjectInvitation invitation = projectInvitationRepository.findByProjectInvitationIdAndStatus(invitationId, "PENDING")
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Invitation not found"));

        if (!invitation.getInvitedUser().getUserEmail().equals(userEmail)) {
            throw new ResponseStatusException(FORBIDDEN, "You cannot reject this invitation");
        }

        invitation.setStatus("REJECTED");
        projectInvitationRepository.save(invitation);
    }

    private ProjectInvitationResponseDTO toInvitationResponse(ProjectInvitation invitation) {
        return new ProjectInvitationResponseDTO(
            invitation.getProjectInvitationId(),
            invitation.getProject().getProjectId(),
            invitation.getProject().getProjectName(),
            invitation.getProject().getProjectDescription(),
            invitation.getInvitedUser().getUserId(),
            invitation.getInvitedUser().getUserName(),
            invitation.getInvitedBy().getUserId(),
            invitation.getInvitedBy().getUserName(),
            invitation.getStatus(),
            invitation.getCreatedAt()
        );
    }

    private ProjectMemberResponseDTO toProjectMemberResponse(Project project, User member) {
        String role = "COLLABORATOR";
        if (project.getUser().getUserId().equals(member.getUserId())) {
            role = "OWNER";
        } else if (project.getCoOwners().stream().anyMatch(coOwner -> coOwner.getUserId().equals(member.getUserId()))) {
            role = "CO_OWNER";
        }

        return new ProjectMemberResponseDTO(
            member.getUserId(),
            member.getUserName(),
            member.getUserEmail(),
            role
        );
    }

    private boolean canInvite(Project project, User user) {
        return project.getUser().getUserId().equals(user.getUserId()) ||
            project.getCoOwners().stream().anyMatch(coOwner -> coOwner.getUserId().equals(user.getUserId()));
    }

    private void broadcastProjectTasksUpdate(Project project, String additionalRecipientEmail) {
        java.util.Set<String> recipients = new java.util.HashSet<>();
        if (project.getUser() != null && project.getUser().getUserEmail() != null) {
            recipients.add(project.getUser().getUserEmail());
        }
        if (project.getMembers() != null) {
            project.getMembers().stream()
                .map(User::getUserEmail)
                .filter(java.util.Objects::nonNull)
                .forEach(recipients::add);
        }
        if (additionalRecipientEmail != null && !additionalRecipientEmail.isBlank()) {
            recipients.add(additionalRecipientEmail);
        }

        recipients.forEach(email -> messagingTemplate.convertAndSend("/topic/workspace-" + email, "UPDATED"));
    }
}
