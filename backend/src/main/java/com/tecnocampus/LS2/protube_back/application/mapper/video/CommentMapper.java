package com.tecnocampus.LS2.protube_back.application.mapper.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.CommentDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Comment;

public class CommentMapper {
    public static CommentDTO commentToCommentDTO(Comment comment){
        return new CommentDTO(
                comment.getId(),
                comment.getUsername(),
                comment.getText(),
                comment.getCreatedAt()
        );
    }
}
