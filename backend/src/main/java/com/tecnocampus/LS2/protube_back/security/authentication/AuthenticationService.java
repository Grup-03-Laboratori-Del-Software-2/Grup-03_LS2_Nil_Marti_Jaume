package com.tecnocampus.groupprojectinformaticawithjoseplogsboats.security.authentication;

import com.tecnocampus.groupprojectinformaticawithjoseplogsboats.application.service.user.UserService;
import com.tecnocampus.groupprojectinformaticawithjoseplogsboats.domain.user.User;
import com.tecnocampus.groupprojectinformaticawithjoseplogsboats.exceptions.NotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public AuthenticationService(AuthenticationManager authenticationManager, JwtEncoder jwtEncoder, PasswordEncoder passwordEncoder, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws NotFoundException {
        userService.validate(request.email(), request.password());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        var jwtToken = generateToken(authentication);
        AuthenticationResponse response = new AuthenticationResponse();
        response.setAccessToken(jwtToken);

        return response;
    }

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();

        System.out.println("Authorities: " + authentication.getAuthorities()
                .stream().map(GrantedAuthority::getAuthority).toList());
        String scope = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(10, ChronoUnit.HOURS))
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();

        var encoderParameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS512).build(), claims);
        return jwtEncoder.encode(encoderParameters).getTokenValue();
    }


}
