package com.tecnocampus.LS2.protube_back.security.authentication;

import com.tecnocampus.LS2.protube_back.application.dto.user.AuthenticationRequest;
import com.tecnocampus.LS2.protube_back.application.dto.user.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, tokenPrefix + response.accessToken())
                .body(response);
    }
}
