package com.kalyan.portfolio.repository;

import com.kalyan.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}