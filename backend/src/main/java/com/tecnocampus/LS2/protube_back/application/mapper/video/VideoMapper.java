package com.tecnocampus.LS2.protube_back.application.mapper.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Video;

import java.nio.file.Path;

public class VideoMapper {

    private static String toPublicUrl(String absolutePath) {
        // "/home/.../store/XYZ.webp" -> "/media/XYZ.webp"
        String fileName = Path.of(absolutePath).getFileName().toString();
        return "/media/" + fileName;
    }

    public static VideoDTO videoToVideoDTO(Video video) {
        return new VideoDTO(
                video.getId(),
                toPublicUrl(video.getThumbnailURL())
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
                // ✅ usa tus mappers existentes
                v.getLikes() != null ? v.getLikes().stream()
                        .map(LikeMapper::likeToLikeDTO)
                        .toList() : java.util.List.of(),
                v.getComments() != null ? v.getComments().stream()
                        .map(CommentMapper::commentToCommentDTO)
                        .toList() : java.util.List.of()
        );
    }
}
