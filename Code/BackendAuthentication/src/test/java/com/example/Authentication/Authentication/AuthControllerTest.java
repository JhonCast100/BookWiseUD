package com.example.Authentication.Authentication;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.Authentication.Auth.AuthController;
import com.example.Authentication.Auth.AuthResponse;
import com.example.Authentication.Auth.AuthService;
import com.example.Authentication.Auth.LoginRequest;
import com.example.Authentication.Auth.RegisterRequest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // <-- ESTA ES LA DIFERENCIA
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void testRegister_Success() throws Exception {
        AuthResponse mockResponse = AuthResponse.builder()
                .token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token")
                .build();
        
        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "laura.torres@example.com",
                        "password": "Lt@User2025!",
                        "role": "USER"
                    }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void testRegister_WithDifferentUser() throws Exception {
        AuthResponse mockResponse = AuthResponse.builder()
                .token("another.jwt.token.here")
                .build();
        
        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "maria.garcia@test.com",
                        "password": "SecurePass123!",
                        "role": "ADMIN"
                    }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("another.jwt.token.here"));
    }

    @Test
    void testLogin_Success() throws Exception {
        AuthResponse mockResponse = AuthResponse.builder()
                .token("login.jwt.token.12345")
                .build();
        
        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "john.doe@example.com",
                        "password": "Jd@2025!Secure"
                    }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void testLogin_WithDifferentCredentials() throws Exception {
        AuthResponse mockResponse = AuthResponse.builder()
                .token("different.token.xyz")
                .build();
        
        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "laura.torres@example.com",
                        "password": "Lt@User2025!"
                    }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("different.token.xyz"));
    }

    @Test
    void testRegister_WhenServiceThrowsException() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Usuario ya existe"));

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "duplicate@example.com",
                        "password": "Pass123!",
                        "role": "USER"
                    }
                    """))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testLogin_WhenServiceThrowsException() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Credenciales inválidas"));

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "wrong@example.com",
                        "password": "WrongPass!"
                    }
                    """))
                .andExpect(status().is5xxServerError());
    }
}
