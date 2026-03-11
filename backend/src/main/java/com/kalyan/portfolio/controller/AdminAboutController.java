package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.service.AboutService;
import org.springframework.web.bind.annotation.*;
import com.kalyan.portfolio.entity.About;



@RestController
@RequestMapping("/api/about")
@CrossOrigin(origins = "http://localhost:8083")
public class AdminAboutController {

    private final AboutService aboutService;

    public AdminAboutController(AboutService aboutService) {
        this.aboutService = aboutService;
    }

    @GetMapping
    public About getAbout() {
        return aboutService.getAbout();
    }

    @PostMapping
    public About createAbout(@RequestBody About about) {
        return aboutService.createAbout(about);
    }

    @PutMapping("/{id}")
    public About updateAbout(@PathVariable("id") Long id, @RequestBody About updatedAbout) {
        return aboutService.updateAbout(id, updatedAbout);
    }

    @DeleteMapping("/{id}")
    public void deleteAbout(@PathVariable("id") Long id) {
        aboutService.deleteAbout(id);
    }
}