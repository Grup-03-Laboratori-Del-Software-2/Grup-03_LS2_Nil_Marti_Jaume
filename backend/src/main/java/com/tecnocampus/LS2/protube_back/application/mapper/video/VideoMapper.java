// src/main/java/com/tecnocampus/LS2/protube_back/application/mapper/video/VideoMapper.java
package com.tecnocampus.LS2.protube_back.application.mapper.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Video;

import java.nio.file.Path;
import java.util.List;

public class VideoMapper {

    private static String toPublicUrl(String absolutePath) {
        String fileName = Path.of(absolutePath).getFileName().toString(); // p.ej. abc123.webp
        return "/media/" + fileName;
    }

    public static VideoDTO videoToVideoDTO(Video v) {
        return new VideoDTO(
                v.getId(),
                toPublicUrl(v.getThumbnailURL()),
                v.getName()
        );
    }

    public static VideoDetailDTO videoToVideoDetailDTO(Video v) {
        return new VideoDetailDTO(
                v.getId(),
                toPublicUrl(v.getVideoURL()),
                v.getName(),
                v.getUsername(),
                v.getDescription(),
                v.getDateOfPublish(),
                toPublicUrl(v.getThumbnailURL()),
                v.getDuration(),
                v.getLikes() != null ? v.getLikes().stream()
                        .map(l -> new com.tecnocampus.LS2.protube_back.application.dto.video.LikeDTO(l.getUsername()))
                        .toList() : List.of(),
                v.getComments() != null ? v.getComments().stream()
                        .map(c -> new com.tecnocampus.LS2.protube_back.application.dto.video.CommentDTO(
                                c.getId(), c.getUsername(), c.getText(), c.getCreatedAt()
                        )).toList() : List.of()
        );
    }
}
