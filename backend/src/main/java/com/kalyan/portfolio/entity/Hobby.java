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

    private Integer rowOrder;


    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
    public String getDescription() { return description; }
    public Integer getRowOrder() { return rowOrder; }


    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setDescription(String description) { this.description = description; }
    public void setRowOrder(Integer rowOrder) { this.rowOrder = rowOrder; }

}
