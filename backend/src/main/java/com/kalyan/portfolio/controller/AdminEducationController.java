package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.entity.Education;
import com.kalyan.portfolio.service.EducationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education")
public class AdminEducationController {

    private final EducationService educationService;

    public AdminEducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @GetMapping
    public ResponseEntity<List<Education>> getAllEducation() {
        return ResponseEntity.ok(educationService.getAllEducation());
    }

    @PostMapping
    public ResponseEntity<Education> addEducation(@RequestBody Education education) {
        return ResponseEntity.ok(educationService.addEducation(education));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> updateEducation(@PathVariable Long id, @RequestBody Education education) {
        return ResponseEntity.ok(educationService.updateEducation(id, education));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.ok().build();
    }
}
