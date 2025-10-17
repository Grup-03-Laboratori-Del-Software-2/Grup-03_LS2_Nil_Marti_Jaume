package com.tecnocampus.LS2.protube_back.application.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record UserCreate(
        @Size(min=2,max=255) @Pattern(regexp="^[A-Z][a-zA-Z0-9]*$") String name,
        @Size(min=2,max=255) @Pattern(regexp="^[A-Z][a-zA-Z0-9]*$") String surname,
        @Email String email,
        @Size(min=8) @Pattern(regexp="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-+]).*$") String password,
        @Past LocalDateTime dateOfBirth
) {}
