package com.tecnocampus.LS2.protube_back.application.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record UserUpdateRequest(
        @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters long")
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9]*$", message = "Name must begin with a capital letter and can only contain letters and numbers")
        String name,

        @Size(min = 2, max = 255, message = "Surname must be between 2 and 255 characters long")
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9]*$", message = "Surname must begin with a capital letter and can only contain letters and numbers")
        String surname,

        @Email(message = "Value must be a valid email")
        String email,

        @Past(message = "Date of birth must be in the past")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dateOfBirth
) {
}
