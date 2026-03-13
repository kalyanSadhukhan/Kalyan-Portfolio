package com.kalyan.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String organization;

    @Column(name = "achievement_date")
    private String date;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getOrganization() { return organization; }
    public String getDate() { return date; }
    public String getDescription() { return description; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setOrganization(String organization) { this.organization = organization; }
    public void setDate(String date) { this.date = date; }
    public void setDescription(String description) { this.description = description; }
}
