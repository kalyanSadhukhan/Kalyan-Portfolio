package com.kalyan.portfolio.service;
import com.kalyan.portfolio.entity.About;
import com.kalyan.portfolio.repository.AboutRepository;
import org.springframework.stereotype.Service;

@Service
public class AboutService {

    private final AboutRepository aboutRepository;

    public AboutService(AboutRepository aboutRepository) {
        this.aboutRepository = aboutRepository;
    }

    public About getAbout() {
        return aboutRepository.findAll().stream().findFirst().orElse(null);
    }

    public About createAbout(About about) {
        return aboutRepository.save(about);
    }

    public About updateAbout(Long id, About updatedAbout) {
        About about = aboutRepository.findById(id)
                .orElseGet(() -> aboutRepository.findAll().stream().findFirst().orElse(new About()));

        about.setProfileImageUrl(updatedAbout.getProfileImageUrl());
        about.setBio(updatedAbout.getBio());

        return aboutRepository.save(about);
    }

    public void deleteAbout(Long id) {
        aboutRepository.deleteById(id);
    }
}