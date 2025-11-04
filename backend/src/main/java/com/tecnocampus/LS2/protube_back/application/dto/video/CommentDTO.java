package com.tecnocampus.LS2.protube_back.application.dto.video;

import java.time.LocalDateTime;

public record CommentDTO(
    int id,
    String username,
    String text,
    LocalDateTime dateOfPublish
){}
