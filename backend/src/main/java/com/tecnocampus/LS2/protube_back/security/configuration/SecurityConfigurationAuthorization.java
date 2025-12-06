// SecurityConfigurationAuthorization.java
package com.tecnocampus.LS2.protube_back.security.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfigurationAuthorization {

    private static final String[] WHITE_LIST_URL = {
            "/",
            "/user/register",
            "/user/login",
            "/media/**",
            "/api/videos/**",
            "/h2-console/**",
            "/index.html",
            "/assets/**",
            "/favicon.ico",
            "/vidflow-logo.png",
            "/protube-logo.png",
            "/vite.svg"
    };

    private final JwtDecoder jwtDecoder;
    private final BearerTokenResolver bearerTokenResolver;

    public SecurityConfigurationAuthorization(JwtDecoder jwtDecoder, BearerTokenResolver bearerTokenResolver) {
        this.jwtDecoder = jwtDecoder;
        this.bearerTokenResolver = bearerTokenResolver;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(WHITE_LIST_URL).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(o -> o
                        .jwt(j -> j.decoder(jwtDecoder))
                        .bearerTokenResolver(bearerTokenResolver)
                )
                .httpBasic(Customizer.withDefaults())
                .build();
    }
}
