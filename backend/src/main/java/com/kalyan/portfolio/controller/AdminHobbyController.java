package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.entity.Hobby;
import com.kalyan.portfolio.service.HobbyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hobbies")
@CrossOrigin(origins = "http://localhost:8083")
public class AdminHobbyController {

    private final HobbyService hobbyService;

    public AdminHobbyController(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    @GetMapping
    public ResponseEntity<List<Hobby>> getAllHobbies() {
        return ResponseEntity.ok(hobbyService.getAllHobbies());
    }

    @PostMapping
    public ResponseEntity<Hobby> addHobby(@RequestBody Hobby hobby) {
        return ResponseEntity.ok(hobbyService.addHobby(hobby));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hobby> updateHobby(@PathVariable Long id, @RequestBody Hobby hobby) {
        return ResponseEntity.ok(hobbyService.updateHobby(id, hobby));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHobby(@PathVariable Long id) {
        hobbyService.deleteHobby(id);
        return ResponseEntity.ok().build();
    }
}
