package com.vertere.tasktracker;

import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.repository.ProjectInvitationRepository;
import com.vertere.tasktracker.repository.ProjectRepository;
import com.vertere.tasktracker.repository.TaskRepository;
import com.vertere.tasktracker.repository.UserRepository;
import com.vertere.tasktracker.service.implementation.ProjectServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceImplementationTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectInvitationRepository projectInvitationRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private ProjectServiceImplementation projectService;

    @BeforeEach
    void setUp() {
        projectService = new ProjectServiceImplementation(
            projectRepository,
            userRepository,
            projectInvitationRepository,
            taskRepository,
            messagingTemplate
        );
    }

    @Test
    void deleteProjectById_deletesTasksBeforeDeletingProject() {
        User owner = new User();
        owner.setUserId(1);
        owner.setUserEmail("owner@example.com");

        Project project = new Project();
        project.setProjectId(10);
        project.setUser(owner);
        project.setMembers(new HashSet<>());

        when(projectRepository.findById(10)).thenReturn(Optional.of(project));
        when(userRepository.findByUserEmail("owner@example.com")).thenReturn(Optional.of(owner));

        projectService.deleteProjectById(10, "owner@example.com");

        verify(taskRepository).deleteByProject_ProjectId(10);
        verify(projectRepository).delete(project);
        verify(messagingTemplate).convertAndSend("/topic/workspace-owner@example.com", "UPDATED");
    }

    @Test
    void deleteProjectById_rejectsNonOwnerBeforeDeletingAnything() {
        User owner = new User();
        owner.setUserId(1);
        owner.setUserEmail("owner@example.com");

        User requester = new User();
        requester.setUserId(2);
        requester.setUserEmail("member@example.com");

        Project project = new Project();
        project.setProjectId(10);
        project.setUser(owner);

        when(projectRepository.findById(10)).thenReturn(Optional.of(project));
        when(userRepository.findByUserEmail("member@example.com")).thenReturn(Optional.of(requester));

        assertThrows(ResponseStatusException.class, () -> projectService.deleteProjectById(10, "member@example.com"));

        verify(taskRepository, never()).deleteByProject_ProjectId(10);
        verify(projectRepository, never()).delete(project);
    }
}
