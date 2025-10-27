package com.tecnocampus.LS2.protube_back.application.dto.video;

import java.time.LocalDateTime;

public record VideoDTO(
        Long id,
        String name,
        String username,
        String thumbnailURL,
        long duration
) {}
