package com.kalyan.portfolio.ai;

/**
 * Represents the domain category detected from a user's chat question.
 * Used by QueryRouter to determine which database tables to query
 * and whether full Gemini reasoning is required.
 */
public enum QueryType {
    ABOUT,
    SKILLS,
    PROJECTS,
    EDUCATION,
    CERTIFICATIONS,
    ACHIEVEMENTS,
    HOBBIES,
    GENERAL
}
