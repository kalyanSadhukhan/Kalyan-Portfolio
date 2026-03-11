package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.Education;
import com.kalyan.portfolio.repository.EducationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EducationService {

    private final EducationRepository educationRepository;

    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    public List<Education> getAllEducation() {
        return educationRepository.findAll();
    }

    public Education addEducation(Education education) {
        return educationRepository.save(education);
    }

    public Education updateEducation(Long id, Education updatedEducation) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        education.setInstitution(updatedEducation.getInstitution());
        education.setDegree(updatedEducation.getDegree());
        education.setStartDate(updatedEducation.getStartDate());
        education.setEndDate(updatedEducation.getEndDate());
        education.setDescription(updatedEducation.getDescription());
        education.setGradeScore(updatedEducation.getGradeScore());
        education.setMarksheetUrl(updatedEducation.getMarksheetUrl());

        return educationRepository.save(education);
    }

    public void deleteEducation(Long id) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));
        educationRepository.delete(education);
    }
}
