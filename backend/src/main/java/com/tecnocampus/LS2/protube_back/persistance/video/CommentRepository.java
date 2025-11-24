package com.tecnocampus.LS2.protube_back.persistance.video;

import com.tecnocampus.LS2.protube_back.domain.video.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
}
