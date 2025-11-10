package com.tecnocampus.LS2.protube_back.security.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

import jakarta.servlet.http.Cookie;

@Configuration
public class BearerTokenResolverConfig {

    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        return request -> {
            // 1) Cookie "access_token"
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie c : cookies) {
                    if ("access_token".equals(c.getName())) {
                        String v = c.getValue();
                        if (v != null && !v.isBlank()) return v;
                    }
                }
            }
            // 2) Authorization: Bearer ...
            String auth = request.getHeader("Authorization");
            if (auth != null && auth.startsWith("Bearer ")) {
                return auth.substring(7);
            }
            return null;
        };
    }
}
