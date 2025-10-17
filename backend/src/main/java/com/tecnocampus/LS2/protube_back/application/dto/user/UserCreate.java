package com.tecnocampus.LS2.protube_back.application.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record UserCreate(
        @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters long")
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9]*$", message = "Name must begin with a capital letter and can only contain letters and numbers")
        String name,
        @Size(min = 2, max = 255, message = "Surname must be between 2 and 255 characters long")
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9]*$", message = "Surname must begin with a capital letter and can only contain letters and numbers")
        String surname,
        @Email(message = "Value must be a valid email")
        String email,
        @Size(min = 8, message = "Password must be at least 8 characters long")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+]).*$", message = "Password must contain at least one uppercase letter, one digit, and one special character")
        String password,
        @Past(message = "Date of birth must be in the past")
        LocalDateTime dateOfBirth) {

    public UserCreate(String name, String surname, String email, String password, LocalDateTime dateOfBirth){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getDateOfBirth() {
        return dateOfBirth;
    }

    public String getPassword() { return password; }

}
