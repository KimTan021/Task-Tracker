package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.entity.Project;
import com.vertere.tasktracker.repository.ProjectRepository;
import com.vertere.tasktracker.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImplementation implements ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectServiceImplementation(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
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
        return projectRepository.save(project);
    }

    @Override
    public void deleteProjectById(Integer projectId){
        projectRepository.deleteById(projectId);
    }
}
