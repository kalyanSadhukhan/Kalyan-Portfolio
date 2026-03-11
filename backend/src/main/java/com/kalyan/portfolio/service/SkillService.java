package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.Skill;
import com.kalyan.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    // Get all skills
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // Add new skill
    public Skill addSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    // Update skill
    public Skill updateSkill(Long id, Skill updatedSkill) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skill.setName(updatedSkill.getName());
        skill.setCategory(updatedSkill.getCategory());
        skill.setUrl(updatedSkill.getUrl());
        skill.setDisplayOrder(updatedSkill.getDisplayOrder());

        return skillRepository.save(skill);
    }

    // Delete skill
    public void deleteSkill(Long id) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skillRepository.delete(skill);
    }
}