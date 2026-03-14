package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.entity.Achievement;
import com.kalyan.portfolio.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import com.kalyan.portfolio.dto.ReorderRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService service;

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return service.getAllAchievements();
    }

    @PostMapping
    public Achievement addAchievement(@RequestBody Achievement achievement) {
        return service.saveAchievement(achievement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Achievement> updateAchievement(@PathVariable Long id, @RequestBody Achievement achievement) {
        try {
            Achievement updated = service.updateAchievement(id, achievement);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long id) {
        service.deleteAchievement(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderAchievements(@RequestBody ReorderRequest request) {
        service.reorderAchievements(request.getIds());
        return ResponseEntity.ok().build();
    }
}
