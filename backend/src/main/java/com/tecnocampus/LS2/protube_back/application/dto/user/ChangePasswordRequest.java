package com.tecnocampus.LS2.protube_back.application.dto.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @Size(min = 8, message = "Current password must be at least 8 characters long")
        String currentPassword,
        @Size(min = 8, message = "Password must be at least 8 characters long")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-+]).*$",
                message = "The password must contain at least one UPPERCASE letter, one digit, and one special character (!@#$%^&*()-+)."
        )
        String newPassword
) {
}
