package com.tecnocampus.LS2.protube_back.application.dto.video;

public record VideoDetailDTO(
        Long id,
        String title,
        String description,
        Integer durationSec,
        String thumbnailURL,
        String src
) {}
