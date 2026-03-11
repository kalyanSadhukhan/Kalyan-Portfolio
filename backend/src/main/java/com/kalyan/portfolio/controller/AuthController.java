package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.dto.LoginRequest;
import com.kalyan.portfolio.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8083")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody LoginRequest request){

        String token = authService.login(request);

        return Map.of("token",token);
    }
}