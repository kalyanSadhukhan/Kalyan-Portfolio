package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.entity.Skill;
import com.kalyan.portfolio.service.SkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:8083")
public class AdminSkillController {

    private final SkillService skillService;

    public AdminSkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // Get all skills
    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    // Add skill
    @PostMapping
    public Skill addSkill(@RequestBody Skill skill) {
        return skillService.addSkill(skill);
    }

    // Update skill
    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable("id") Long id, @RequestBody Skill skill) {
        return skillService.updateSkill(id, skill);
    }

    // Delete skill
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable("id") Long id) {
        skillService.deleteSkill(id);
    }
}