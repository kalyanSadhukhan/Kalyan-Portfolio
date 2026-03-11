package com.kalyan.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "issuing_organization")
    private String issuingOrganization;

    // Stored as ISO string "YYYY-MM-DD" to avoid LocalDate serialization issues
    @Column(name = "issue_date")
    private String issueDate;

    @Column(name = "credential_url")
    private String credentialUrl;

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIssuingOrganization() { return issuingOrganization; }
    public String getIssueDate() { return issueDate; }
    public String getCredentialUrl() { return credentialUrl; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setIssuingOrganization(String issuingOrganization) { this.issuingOrganization = issuingOrganization; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }
}
