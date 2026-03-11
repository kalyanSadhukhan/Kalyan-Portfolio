package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.Project;
import com.kalyan.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Get project by ID
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    // Add project
    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    // Update project
    public Project updateProject(Long id, Project updatedProject) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setTitle(updatedProject.getTitle());
        project.setDescription(updatedProject.getDescription());
        project.setTechStack(updatedProject.getTechStack());
        project.setGithubLink(updatedProject.getGithubLink());
        project.setLiveDemo(updatedProject.getLiveDemo());
        project.setDemoVideo(updatedProject.getDemoVideo());
        project.setFeatures(updatedProject.getFeatures());
        project.setArchitecture(updatedProject.getArchitecture());
        project.setComplexity(updatedProject.getComplexity());
        project.setImageUrl(updatedProject.getImageUrl());
        if (updatedProject.getFeatured() != null) {
            project.setFeatured(updatedProject.getFeatured());
        }

        return projectRepository.save(project);
    }

    // Delete project
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }
}