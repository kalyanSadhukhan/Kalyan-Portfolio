package com.kalyan.portfolio.ai;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Analyzes the user question and returns the detected domain type(s).
 * This drives selective database retrieval — only relevant tables are queried.
 * Returns GENERAL when multiple domains are likely or the question is ambiguous.
 */
@Component
public class QueryRouter {

    private static final String[] SKILL_KEYWORDS = {
        "skill", "skills", "technology", "technologies", "tech", "know", "use",
        "programming", "language", "framework", "stack", "expertise", "proficient",
        "capable", "tools", "experienced", "backend", "frontend", "database"
    };

    private static final String[] PROJECT_KEYWORDS = {
        "project", "projects", "build", "built", "made", "created", "developed",
        "application", "app", "system", "website", "platform", "tool", "work",
        "portfolio", "hotel", "reservation", "github", "demo", "feature", "architecture"
    };

    private static final String[] ABOUT_KEYWORDS = {
        "about", "who", "yourself", "introduce", "introduction", "bio", "background",
        "person", "kalyan", "he", "developer", "professional", "describe", "summary"
    };

    private static final String[] EDUCATION_KEYWORDS = {
        "education", "study", "studied", "degree", "university", "college", "school",
        "academic", "course", "graduated", "institution", "cgpa", "gpa", "marks"
    };

    private static final String[] CERTIFICATION_KEYWORDS = {
        "certification", "certifications", "certified", "certificate", "credential",
        "course", "udemy", "coursera", "license", "accreditation", "issued"
    };

    private static final String[] ACHIEVEMENT_KEYWORDS = {
        "achievement", "achievements", "award", "awards", "won", "win", "hackathon",
        "competition", "prize", "accomplishment", "participation", "participated",
        "recognition", "honor"
    };

    private static final String[] HOBBY_KEYWORDS = {
        "hobby", "hobbies", "interest", "interests", "passion", "passions",
        "free time", "spare time", "outside", "beyond", "like to", "enjoy", "fun"
    };

    /**
     * Returns all detected QueryTypes for the given question.
     * Falls back to GENERAL if nothing specific is detected.
     */
    public List<QueryType> route(String question) {
        if (question == null || question.isBlank()) {
            return List.of(QueryType.GENERAL);
        }

        String q = question.toLowerCase();
        List<QueryType> types = new ArrayList<>();

        if (containsAny(q, ABOUT_KEYWORDS))         types.add(QueryType.ABOUT);
        if (containsAny(q, SKILL_KEYWORDS))          types.add(QueryType.SKILLS);
        if (containsAny(q, PROJECT_KEYWORDS))         types.add(QueryType.PROJECTS);
        if (containsAny(q, EDUCATION_KEYWORDS))       types.add(QueryType.EDUCATION);
        if (containsAny(q, CERTIFICATION_KEYWORDS))   types.add(QueryType.CERTIFICATIONS);
        if (containsAny(q, ACHIEVEMENT_KEYWORDS))     types.add(QueryType.ACHIEVEMENTS);
        if (containsAny(q, HOBBY_KEYWORDS))           types.add(QueryType.HOBBIES);

        return types.isEmpty() ? List.of(QueryType.GENERAL) : types;
    }

    private boolean containsAny(String text, String[] keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) return true;
        }
        return false;
    }
}
