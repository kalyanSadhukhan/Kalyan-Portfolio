package com.kalyan.portfolio.ai;

import com.kalyan.portfolio.entity.Skill;
import com.kalyan.portfolio.entity.Project;
import com.kalyan.portfolio.entity.About;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ContextBuilder {

    public String buildContext(List<Skill> skills,
                               List<Project> projects,
                               List<About> aboutList) {

        String skillList = skills.stream()
                .map(Skill::getName)
                .collect(Collectors.joining(", "));

        String projectList = projects.stream()
                .map(p -> p.getTitle() + " - " + p.getDescription())
                .collect(Collectors.joining("\n"));

        String aboutText = aboutList.stream()
                .map(a -> a.getBio() == null ? "" : a.getBio())
                .collect(Collectors.joining("\n"));

        return """
ABOUT:
%s

SKILLS:
%s

PROJECTS:
%s
""".formatted(aboutText, skillList, projectList);
    }
}