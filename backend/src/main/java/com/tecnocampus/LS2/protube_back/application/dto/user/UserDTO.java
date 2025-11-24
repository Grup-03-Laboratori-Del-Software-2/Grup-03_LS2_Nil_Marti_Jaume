package com.tecnocampus.LS2.protube_back.application.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record UserDTO(
        String name,
        String surname,
        String email,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dateOfBirth,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dateOfRegistration,

        String avatarURL
) {
}
