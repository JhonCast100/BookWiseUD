package com.example.Authentication.Auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping(value = "login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        System.out.println("📝 LOGIN REQUEST: " + request.getUsername());
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping(value = "register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        System.out.println("========================================");
        System.out.println("📝 REGISTER REQUEST RECEIVED");
        System.out.println("   Username: " + request.getUsername());
        System.out.println("========================================");

        try {
            AuthResponse response = authService.register(request);
            System.out.println("✅ Registration successful! Token generated.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Registration failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}