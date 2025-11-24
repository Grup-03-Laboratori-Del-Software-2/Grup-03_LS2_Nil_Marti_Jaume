package com.tecnocampus.LS2.protube_back.application.dto.video;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateDTO(
        @NotBlank String text
) {
}
