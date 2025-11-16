package com.tecnocampus.LS2.protube_back.api.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VideoDetailDTO> uploadVideo(
            @RequestParam("video") MultipartFile videoFile,
            @RequestParam("thumbnail") MultipartFile thumbnailFile,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("username") String username,
            @RequestParam("duration") long duration
    ) throws IOException {
        VideoDetailDTO created = videoService.uploadVideo(
                videoFile,
                thumbnailFile,
                name,
                username,
                description,
                duration
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        boolean deleted = videoService.deleteVideo(videoId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
