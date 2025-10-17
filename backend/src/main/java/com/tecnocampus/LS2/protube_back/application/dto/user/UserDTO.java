package com.tecnocampus.LS2.protube_back.application.dto.user;

import java.time.LocalDateTime;

public record UserDTO(
        String name, String surname, String email,
        LocalDateTime dateOfBirth, LocalDateTime dateOfRegistration
) {}
