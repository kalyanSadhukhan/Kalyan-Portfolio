package com.kalyan.portfolio.ai;

import com.kalyan.portfolio.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Builds compressed, token-efficient context strings from portfolio database records.
 * Each build method produces a short, information-dense text block ready to include
 * in a Gemini prompt. Only fields relevant to answering questions are included.
 */
@Component
public class ContextBuilder {

    // ──────────────────────────────── PUBLIC API ────────────────────────────────

    /**
     * Builds a combined context string from all provided data lists.
     * Null / empty lists are safely skipped.
     */
    public String buildFullContext(List<About> aboutList,
                                   List<Skill> skills,
                                   List<Project> projects,
                                   List<Education> educationList,
                                   List<Certification> certifications,
                                   List<Achievement> achievements,
                                   List<Hobby> hobbies) {
        StringBuilder sb = new StringBuilder();

        if (aboutList != null && !aboutList.isEmpty())
            sb.append(buildAboutContext(aboutList)).append("\n\n");
        if (skills != null && !skills.isEmpty())
            sb.append(buildSkillsContext(skills)).append("\n\n");
        if (projects != null && !projects.isEmpty())
            sb.append(buildProjectsContext(projects, null)).append("\n\n");
        if (educationList != null && !educationList.isEmpty())
            sb.append(buildEducationContext(educationList)).append("\n\n");
        if (certifications != null && !certifications.isEmpty())
            sb.append(buildCertificationsContext(certifications)).append("\n\n");
        if (achievements != null && !achievements.isEmpty())
            sb.append(buildAchievementsContext(achievements)).append("\n\n");
        if (hobbies != null && !hobbies.isEmpty())
            sb.append(buildHobbiesContext(hobbies)).append("\n\n");

        return sb.toString().trim();
    }

    // ──────────────────────────────── SECTION BUILDERS ──────────────────────────

    public String buildAboutContext(List<About> aboutList) {
        if (aboutList == null || aboutList.isEmpty()) return "";
        String bio = aboutList.stream()
            .map(About::getBio)
            .filter(b -> b != null && !b.isBlank())
            .collect(Collectors.joining(" "));
        return "ABOUT:\n" + bio;
    }

    public String buildSkillsContext(List<Skill> skills) {
        if (skills == null || skills.isEmpty()) return "";
        // Group by category if available
        String grouped = skills.stream()
            .collect(Collectors.groupingBy(
                s -> s.getCategory() != null ? s.getCategory() : "General",
                Collectors.mapping(Skill::getName, Collectors.joining(", "))
            ))
            .entrySet().stream()
            .map(e -> e.getKey() + ": " + e.getValue())
            .collect(Collectors.joining("\n"));
        return "SKILLS:\n" + grouped;
    }

    /**
     * Builds project context. If readmeMap is provided, README content is appended
     * under each project where the githubLink matches a key.
     */
    public String buildProjectsContext(List<Project> projects, java.util.Map<String, String> readmeMap) {
        if (projects == null || projects.isEmpty()) return "";
        StringBuilder sb = new StringBuilder("PROJECTS:\n");
        for (Project p : projects) {
            sb.append("• ").append(p.getTitle()).append("\n");
            if (notBlank(p.getDescription()))
                sb.append("  Desc: ").append(p.getDescription()).append("\n");
            if (notBlank(p.getTechStack()))
                sb.append("  Tech: ").append(p.getTechStack()).append("\n");
            if (notBlank(p.getFeatures()))
                sb.append("  Features: ").append(p.getFeatures()).append("\n");
            if (notBlank(p.getArchitecture()))
                sb.append("  Architecture: ").append(p.getArchitecture()).append("\n");
            if (notBlank(p.getGithubLink()))
                sb.append("  GitHub: ").append(p.getGithubLink()).append("\n");
            if (notBlank(p.getLiveDemo()))
                sb.append("  Demo: ").append(p.getLiveDemo()).append("\n");

            // Inject README summary if available
            if (readmeMap != null && notBlank(p.getGithubLink())) {
                String readme = readmeMap.get(p.getGithubLink());
                if (readme != null && !readme.isBlank()) {
                    sb.append("  README:\n").append(readme.trim()).append("\n");
                }
            }
            sb.append("\n");
        }
        return sb.toString().trim();
    }

    public String buildEducationContext(List<Education> educationList) {
        if (educationList == null || educationList.isEmpty()) return "";
        StringBuilder sb = new StringBuilder("EDUCATION:\n");
        for (Education e : educationList) {
            sb.append("• ").append(e.getDegree()).append(" @ ").append(e.getInstitution());
            String start = e.getStartDate();
            String end   = e.getEndDate();
            if (notBlank(start) || notBlank(end)) {
                sb.append(" (").append(notBlank(start) ? start.substring(0, Math.min(4, start.length())) : "?")
                  .append(" – ").append(notBlank(end) ? end.substring(0, Math.min(4, end.length())) : "Present").append(")");
            }
            sb.append("\n");
            if (notBlank(e.getGradeScore()))
                sb.append("  Grade: ").append(e.getGradeScore()).append("\n");
            if (notBlank(e.getDescription()))
                sb.append("  ").append(e.getDescription()).append("\n");
        }
        return sb.toString().trim();
    }

    public String buildCertificationsContext(List<Certification> certifications) {
        if (certifications == null || certifications.isEmpty()) return "";
        StringBuilder sb = new StringBuilder("CERTIFICATIONS:\n");
        for (Certification c : certifications) {
            sb.append("• ").append(c.getName()).append(" by ").append(c.getIssuingOrganization());
            if (notBlank(c.getIssueDate())) sb.append(" (").append(c.getIssueDate()).append(")");
            sb.append("\n");
        }
        return sb.toString().trim();
    }

    public String buildAchievementsContext(List<Achievement> achievements) {
        if (achievements == null || achievements.isEmpty()) return "";
        StringBuilder sb = new StringBuilder("ACHIEVEMENTS:\n");
        for (Achievement a : achievements) {
            sb.append("• ").append(a.getTitle()).append(" — ").append(a.getOrganization());
            if (notBlank(a.getDate())) sb.append(" (").append(a.getDate()).append(")");
            sb.append("\n");
            if (notBlank(a.getDescription())) sb.append("  ").append(a.getDescription()).append("\n");
        }
        return sb.toString().trim();
    }

    public String buildHobbiesContext(List<Hobby> hobbies) {
        if (hobbies == null || hobbies.isEmpty()) return "";
        String list = hobbies.stream()
            .map(h -> notBlank(h.getDescription())
                ? h.getName() + " (" + h.getDescription() + ")"
                : h.getName())
            .collect(Collectors.joining(", "));
        return "HOBBIES:\n" + list;
    }

    // ──────────────────────────────── HELPERS ───────────────────────────────────

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}