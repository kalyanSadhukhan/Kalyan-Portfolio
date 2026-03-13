package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.Achievement;
import com.kalyan.portfolio.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository repository;

    public List<Achievement> getAllAchievements() {
        return repository.findAll();
    }

    public Achievement saveAchievement(Achievement achievement) {
        return repository.save(achievement);
    }

    public void deleteAchievement(Long id) {
        repository.deleteById(id);
    }

    public Achievement updateAchievement(Long id, Achievement updatedData) {
        return repository.findById(id).map(achievement -> {
            achievement.setTitle(updatedData.getTitle());
            achievement.setOrganization(updatedData.getOrganization());
            achievement.setDate(updatedData.getDate());
            achievement.setDescription(updatedData.getDescription());
            achievement.setUrl(updatedData.getUrl());
            return repository.save(achievement);
        }).orElseThrow(() -> new RuntimeException("Achievement not found"));
    }
}
