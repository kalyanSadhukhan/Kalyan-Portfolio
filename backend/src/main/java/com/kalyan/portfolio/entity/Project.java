package com.kalyan.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private boolean featured;

    @Column(length = 2000)
    private String description;

    private String techStack;

    private String githubLink;

    private String liveDemo;

    private String demoVideo;

    @Column(length = 2000)
    private String features;

    @Column(length = 2000)
    private String architecture;

    private String complexity;

    private String imageUrl;

    private Integer rowOrder;


    // GETTERS

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getTechStack() {
        return techStack;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public String getLiveDemo() {
        return liveDemo;
    }

    public String getDemoVideo() {
        return demoVideo;
    }

    public String getFeatures() {
        return features;
    }

    public String getArchitecture() {
        return architecture;
    }

    public String getComplexity() {
        return complexity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public Integer getRowOrder() {
        return rowOrder;
    }


    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public void setLiveDemo(String liveDemo) {
        this.liveDemo = liveDemo;
    }

    public void setDemoVideo(String demoVideo) {
        this.demoVideo = demoVideo;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public void setArchitecture(String architecture) {
        this.architecture = architecture;
    }

    public void setComplexity(String complexity) {
        this.complexity = complexity;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public void setRowOrder(Integer rowOrder) {
        this.rowOrder = rowOrder;
    }

}