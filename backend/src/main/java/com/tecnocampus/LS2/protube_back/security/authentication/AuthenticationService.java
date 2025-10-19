package com.tecnocampus.LS2.protube_back.security.authentication;

import com.tecnocampus.LS2.protube_back.application.dto.user.AuthenticationRequest;
import com.tecnocampus.LS2.protube_back.application.dto.user.AuthenticationResponse;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthenticationService {
    private final AuthenticationManager authManager;
    private final JwtEncoder jwtEncoder;
    private final UserRepository userRepository;

    public AuthenticationService(AuthenticationManager authManager, JwtEncoder jwtEncoder, UserRepository userRepository) {
        this.authManager = authManager;
        this.jwtEncoder = jwtEncoder;
        this.userRepository = userRepository;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        var user = userRepository.findByEmail(req.email()).orElseThrow();

        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer("protube")
                .issuedAt(now)
                .expiresAt(now.plus(2, ChronoUnit.HOURS))
                .subject(user.getEmail())
                .claim("roles", user.getRoles())
                .build();

        var headers = JwsHeader.with(MacAlgorithm.HS512).build();
        var token = jwtEncoder.encode(JwtEncoderParameters.from(headers, claims)).getTokenValue();

        return new AuthenticationResponse(token);
    }
}
