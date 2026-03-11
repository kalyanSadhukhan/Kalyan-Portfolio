package com.kalyan.portfolio.service;

import com.kalyan.portfolio.dto.LoginRequest;
import com.kalyan.portfolio.entity.Admin;
import com.kalyan.portfolio.repository.AdminRepository;
import com.kalyan.portfolio.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(AdminRepository adminRepository,
                       BCryptPasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(LoginRequest request){

        Admin admin = adminRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if(!encoder.matches(request.getPassword(), admin.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(admin.getUsername());
    }
}