package com.tecnocampus.LS2.protube_back.security.authentication;

import com.tecnocampus.LS2.protube_back.application.dto.user.AuthenticationRequest;
import com.tecnocampus.LS2.protube_back.application.dto.user.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/user")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @Value("${application.security.jwt.token-prefix:Bearer }")
    private String tokenPrefix;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        var response = authenticationService.authenticate(request);
        var token = response.accessToken();

        var cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(12))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.AUTHORIZATION, tokenPrefix + token)
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        var cookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
