package com.tecnocampus.LS2.protube_back.application.dto.video;

public record VideoDTO(
        Long id,
        String thumbnailURL,
        String name // ← nuevo
) {}
