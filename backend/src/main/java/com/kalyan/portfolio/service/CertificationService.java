package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.Certification;
import com.kalyan.portfolio.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationService(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    public Certification addCertification(Certification certification) {
        return certificationRepository.save(certification);
    }

    public Certification updateCertification(Long id, Certification updatedCertification) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
        
        certification.setName(updatedCertification.getName());
        certification.setIssuingOrganization(updatedCertification.getIssuingOrganization());
        certification.setIssueDate(updatedCertification.getIssueDate());
        certification.setCredentialUrl(updatedCertification.getCredentialUrl());
        
        return certificationRepository.save(certification);
    }

    public void deleteCertification(Long id) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
        certificationRepository.delete(certification);
    }
}
