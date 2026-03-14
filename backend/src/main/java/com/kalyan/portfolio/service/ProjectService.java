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
        return projectRepository.findAllByOrderByRowOrderAsc();
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
        project.setRowOrder(updatedProject.getRowOrder());
        if (updatedProject.getFeatured() != null) {
            project.setFeatured(updatedProject.getFeatured());
        }

        return projectRepository.save(project);
    }

    public void reorderProjects(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            int order = i;
            projectRepository.findById(id).ifPresent(project -> {
                project.setRowOrder(order);
                projectRepository.save(project);
            });
        }
    }

    // Delete project
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }
}