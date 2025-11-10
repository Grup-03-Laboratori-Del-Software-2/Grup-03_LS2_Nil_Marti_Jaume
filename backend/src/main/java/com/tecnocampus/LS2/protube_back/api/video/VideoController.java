package com.tecnocampus.LS2.protube_back.api.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("")
    public ResponseEntity<List<VideoDTO>> getVideos() {
        return ResponseEntity.ok().body(videoService.getVideos());
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<Optional<VideoDetailDTO>> getVideo(@PathVariable Long videoId) {
        return ResponseEntity.ok().body(videoService.getVideoDetail(videoId));
    }
}
