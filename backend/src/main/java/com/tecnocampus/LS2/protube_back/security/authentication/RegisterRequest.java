package com.tecnocampus.groupprojectinformaticawithjoseplogsboats.security.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record RegisterRequest(
        @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters long")
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9]*$", message = "Name must begin with a capital letter and can only contain letters and numbers")
        String name,
        @Size(min = 2, max = 255, message = "Surname must be between 2 and 255 characters long")
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9]*$", message = "Surname must begin with a capital letter and can only contain letters and numbers")
        String surname,
        @Email(message = "Value must be a valid email")
        String email,
        @Size(min = 8, message = "Password must be at least 8 characters long")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+]).*$", message = "The password must contain at least one UPPERCASE letter, one digit, and one special character (!@#$%^&*()-+).")
        String password,
        @Past(message = "Date of birth must be in the past")
        LocalDateTime dateOfBirth) {

}
