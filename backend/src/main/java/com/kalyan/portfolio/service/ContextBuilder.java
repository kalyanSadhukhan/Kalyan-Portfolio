package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.About;
import com.kalyan.portfolio.entity.Project;
import com.kalyan.portfolio.entity.Skill;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContextBuilder {

    public String buildContext(List<Skill> skills, List<Project> projects, List<About> abouts) {
        StringBuilder context = new StringBuilder();

        context.append("ABOUT:\n");
        if (abouts != null && !abouts.isEmpty()) {
            for (About about : abouts) {
                if (about.getBio() != null) {
                    context.append(about.getBio()).append("\n");
                }
            }
        } else {
            context.append("No about information available.\n");
        }
        context.append("\n");

        context.append("SKILLS:\n");
        if (skills != null && !skills.isEmpty()) {
            String skillsStr = skills.stream()
                    .map(Skill::getName)
                    .collect(Collectors.joining(", "));
            context.append(skillsStr).append("\n");
        } else {
            context.append("No skills listed.\n");
        }
        context.append("\n");

        context.append("PROJECTS:\n");
        if (projects != null && !projects.isEmpty()) {
            for (Project project : projects) {
                context.append(project.getTitle()).append(" - ");
                if (project.getDescription() != null) {
                    context.append(project.getDescription());
                }
                if (project.getTechStack() != null && !project.getTechStack().isEmpty()) {
                    context.append(" (Tech Stack: ").append(project.getTechStack()).append(")");
                }
                context.append("\n");
            }
        } else {
            context.append("No projects listed.\n");
        }

        return context.toString();
    }
}
