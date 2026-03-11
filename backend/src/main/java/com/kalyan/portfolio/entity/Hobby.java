package com.kalyan.portfolio.entity;

import jakarta.persistence.*;

@Entity
public class Hobby {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    private String icon;
    
    @Column(length = 2000)
    private String description;

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
    public String getDescription() { return description; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setDescription(String description) { this.description = description; }
}
