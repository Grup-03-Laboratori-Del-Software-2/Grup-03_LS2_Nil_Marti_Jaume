package com.tecnocampus.LS2.protube_back.application.dto.video;

import java.time.LocalDateTime;
import java.util.List;

public record VideoDetailDTO(
        Long id,
        String videoURL,
        String name,
        String username,
        String description,
        LocalDateTime dateOfPublish,
        String thumbnailURL,
        long duration,
        List<LikeDTO> likes,
        List<CommentDTO> comments
) {}