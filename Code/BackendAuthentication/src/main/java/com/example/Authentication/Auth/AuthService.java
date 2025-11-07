package com.example.Authentication.Auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Authentication.Jwt.JwtService;
import com.example.Authentication.User.Role;
import com.example.Authentication.User.User;
import com.example.Authentication.User.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        
        // ✅ MODIFICADO: Pasar el objeto User completo
        String token = jwtService.getToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getUsername())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole()))
                .build();

        userRepository.save(user);

        // ✅ MODIFICADO: Pasar el objeto User completo (que ahora tiene ID)
        String token = jwtService.getToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getUsername())
                .build();
    }
}