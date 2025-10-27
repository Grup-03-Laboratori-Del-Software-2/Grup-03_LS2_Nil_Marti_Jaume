package com.tecnocampus.LS2.protube_back.application.mapper.video;


import java.util.Comparator;
import java.util.List;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Video;

public class VideoMapper {

    public static VideoDTO videoToVideoDTO(Video video) {
        return new VideoDTO(
                video.getId(),
                video.getName(),
                video.getUsername(),
                video.getThumbnailURL(),
                video.getDuration());
    }

    public static VideoDetailDTO videoToVideoDetailDTO(Video video) {
        return new VideoDetailDTO(
                video.getId(),
                video.getVideoURL(),
                video.getName(),
                video.getUsername(),
                video.getDescription(),
                video.getDateOfPublish(),
                video.getThumbnailURL(),
                video.getDuration(),
                video.getLikes().stream().map(LikeMapper::likeToLikeDTO).toList(),
                video.getComments().stream().map(CommentMapper::commentToCommentDTO).toList()
                );
    }

}