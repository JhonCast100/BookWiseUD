package com.example.Authentication.Auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // Endpoint público para login
    @PostMapping(value = "login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Endpoint público para auto-registro (opcional, puedes deshabilitarlo)
    @PostMapping(value = "register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ✅ NUEVO: Endpoint protegido para que ADMIN cree usuarios
    @PostMapping(value = "admin/create-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AuthResponse> createUserByAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}