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
        return repository.findAllByOrderByRowOrderAsc();
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
            achievement.setRowOrder(updatedData.getRowOrder());
            return repository.save(achievement);
        }).orElseThrow(() -> new RuntimeException("Achievement not found"));
    }

    public void reorderAchievements(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            int order = i;
            repository.findById(id).ifPresent(achievement -> {
                achievement.setRowOrder(order);
                repository.save(achievement);
            });
        }
    }
}
