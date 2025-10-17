package com.tecnocampus.LS2.protube_back.application.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tecnocampus.LS2.protube_back.domain.user.ERole;
import com.tecnocampus.LS2.protube_back.domain.user.Role;

import java.time.LocalDateTime;
import java.util.Set;

public record UserDTO(
        String name,
        String surname,
        String email,
        LocalDateTime dateOfBirth,
        LocalDateTime dateOfRegistration,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        Set<Role> role
) {
}