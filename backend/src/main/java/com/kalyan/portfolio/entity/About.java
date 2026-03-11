package com.kalyan.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class About {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String profileImageUrl;

    @Column(length = 5000)
    private String bio;

    public About() {}

    public Long getId() { return id; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public String getBio() { return bio; }

    public void setId(Long id) { this.id = id; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public void setBio(String bio) { this.bio = bio; }
}