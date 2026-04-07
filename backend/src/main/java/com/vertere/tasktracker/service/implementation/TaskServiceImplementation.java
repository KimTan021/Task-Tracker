package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.entity.Task;
import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.exception.classes.TaskNotFound;
import com.vertere.tasktracker.repository.ProjectRepository;
import com.vertere.tasktracker.repository.TaskRepository;
import com.vertere.tasktracker.repository.UserRepository;
import com.vertere.tasktracker.service.TaskService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImplementation implements TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public TaskServiceImplementation(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate){
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    
    private void broadcastTasksUpdate(String email) {
        // Broadcasts a generic message to the user's specific channel that tasks have updated.
        messagingTemplate.convertAndSend("/topic/workspace-" + email, "UPDATED");
    }

    private void broadcastProjectTasksUpdate(Project project) {
        if (project == null) {
            return;
        }

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

        recipients.forEach(this::broadcastTasksUpdate);
    }

    @Override
    public List<Task> findAllTasks(){
        return taskRepository.findAccessibleTasks(getCurrentUserEmail());
    }

    @Override
    public Task findTaskById(Integer taskId){
        return taskRepository.findAccessibleTaskById(taskId, getCurrentUserEmail())
                .orElseThrow(() -> new TaskNotFound("No task found at specified id or unauthorized access."));
    }

    @Override
    public Task saveTask(Task task){
        String email = getCurrentUserEmail();
        
        if (task.getProject() != null && task.getProject().getProjectId() != null) {
            Project accessibleProject = projectRepository.findAccessibleProject(task.getProject().getProjectId(), email)
                .orElseThrow(() -> new TaskNotFound("No project exists at specified id or unauthorized."));
            task.setProject(accessibleProject);
        } else {
            Project userProject = projectRepository.findFirstByUser_UserEmail(email)
                .orElseGet(() -> {
                    User user = userRepository.findByUserEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
                    Project newProj = new Project();
                    newProj.setProjectName("Default Workspace");
                    newProj.setUser(user);
                    return projectRepository.save(newProj);
                });
            task.setProject(userProject);
        }
        
        if (task.getTaskStatus() == null || task.getTaskStatus().isBlank()) {
            task.setTaskStatus("todo");
        }
        if (task.getTaskPriority() == null || task.getTaskPriority().isBlank()) {
            task.setTaskPriority("Medium");
        }
        if (task.getArchived() == null) {
            task.setArchived(false);
        }

        Task saved = taskRepository.save(task);
        broadcastProjectTasksUpdate(saved.getProject());
        return saved;
    }

    @Override
    public Task updateTask(Integer id, Task task){
        Task existing = findTaskById(id);
        if(existing == null){
            throw new TaskNotFound("No task exists at specified id or unauthorized.");
        }

        task.setTaskId(id);
        task.setProject(existing.getProject()); // Preserve ownership
        task.setCreatedAt(existing.getCreatedAt());
        if (task.getTaskStatus() == null || task.getTaskStatus().isBlank()) {
            task.setTaskStatus(existing.getTaskStatus());
        }
        if (task.getTaskPriority() == null || task.getTaskPriority().isBlank()) {
            task.setTaskPriority(existing.getTaskPriority());
        }
        if (task.getArchived() == null) {
            task.setArchived(existing.getArchived());
        }
        Task saved = taskRepository.save(task);
        broadcastProjectTasksUpdate(saved.getProject());
        return saved;
    }

    @Override
    public void deleteTaskById(Integer taskId){
        Task existing = findTaskById(taskId);
        taskRepository.deleteById(taskId);
        broadcastProjectTasksUpdate(existing.getProject());
    }
}
