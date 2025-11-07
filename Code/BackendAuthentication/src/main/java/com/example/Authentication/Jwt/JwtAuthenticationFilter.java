package com.example.Authentication.Jwt;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.StringUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        
        System.out.println("🔍 JWT Filter - Method: " + method + ", Path: " + path);

        // ✅ Excluir peticiones OPTIONS (CORS preflight)
        if ("OPTIONS".equals(method)) {
            System.out.println("⚪ Skipping JWT filter for OPTIONS request");
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Excluir endpoints públicos
        if (path.startsWith("/auth/")) {
            System.out.println("⚪ Skipping JWT filter for public endpoint: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        final String token = getTokenFromRequest(request);
        if (token == null) {
            System.out.println("⚠️ No token found in request");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String username = jwtService.getUsernameFromToken(token);
            System.out.println("🔍 JWT Filter - Username from token: " + username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ JWT Filter - Authentication successful");
                } else {
                    System.out.println("❌ JWT Filter - Token validation failed");
                }
            }
        } catch (Exception e) {
            System.err.println("❌ JWT Filter - Error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}