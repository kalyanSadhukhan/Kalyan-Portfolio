package com.kalyan.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String institution;
    private String degree;

    // Stored as ISO string "YYYY-MM-DD" to avoid LocalDate serialization issues
    private String startDate;
    private String endDate;

    @Column(length = 2000)
    private String description;

    // e.g. "8.5 CGPA" or "85%"
    private String gradeScore;

    // URL to degree certificate or marksheet
    private String marksheetUrl;

    // Getters
    public Long getId() { return id; }
    public String getInstitution() { return institution; }
    public String getDegree() { return degree; }
    public String getStartDate() { return startDate; }
    public String getEndDate() { return endDate; }
    public String getDescription() { return description; }
    public String getGradeScore() { return gradeScore; }
    public String getMarksheetUrl() { return marksheetUrl; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setInstitution(String institution) { this.institution = institution; }
    public void setDegree(String degree) { this.degree = degree; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public void setDescription(String description) { this.description = description; }
    public void setGradeScore(String gradeScore) { this.gradeScore = gradeScore; }
    public void setMarksheetUrl(String marksheetUrl) { this.marksheetUrl = marksheetUrl; }
}
