package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.repository.ProjectRepository;
import com.vertere.tasktracker.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectServiceImplementation implements ProjectService {
    private final ProjectRepository projectRepository;
    private final com.vertere.tasktracker.repository.UserRepository userRepository;

    public ProjectServiceImplementation(ProjectRepository projectRepository, com.vertere.tasktracker.repository.UserRepository userRepository){
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
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
        // Ensure owner is added as a member and is a managed entity
        if (project.getUser() != null && project.getUser().getUserId() != null) {
            com.vertere.tasktracker.entity.User managedUser = userRepository.findById(project.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
            project.setUser(managedUser);
            
            // Fix NPE: Ensure members set is initialized
            if (project.getMembers() == null) {
                project.setMembers(new java.util.HashSet<>());
            }
            project.getMembers().add(managedUser);
        }
        return projectRepository.save(project);
    }

    @Override
    public void deleteProjectById(Integer projectId){
        projectRepository.deleteById(projectId);
    }

    @Override
    public void addMember(Integer projectId, String username) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        com.vertere.tasktracker.entity.User user = userRepository.findByUserName(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        project.getMembers().add(user);
        projectRepository.save(project);
    }

    @Override
    public java.util.List<Project> findAllProjectsByUserId(Integer userId) {
        return projectRepository.findAllByMembers_UserId(userId);
    }

    @Override
    public java.util.Set<com.vertere.tasktracker.entity.User> getMembers(Integer projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        return project.getMembers();
    }
}
