package com.tecnocampus.LS2.protube_back.application.service.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import org.springframework.stereotype.Service;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import com.tecnocampus.LS2.protube_back.application.mapper.video.VideoMapper;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    private final VideoRepository videoRepository;

    public VideoService(VideoRepository videoRepository){
        this.videoRepository = videoRepository;
    }

    public List<VideoDTO> getVideos() {
        return videoRepository.findAll().stream().map(VideoMapper::videoToVideoDTO).toList();
    }

    public Optional<VideoDetailDTO> getVideoDetail(Long videoId) {
        return videoRepository.findById(videoId).map(VideoMapper::videoToVideoDetailDTO);
    }

}
