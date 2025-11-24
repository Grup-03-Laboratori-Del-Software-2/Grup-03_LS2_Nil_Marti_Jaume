package com.tecnocampus.LS2.protube_back.api.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.CommentCreateDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("")
    public ResponseEntity<List<VideoDTO>> getVideos() {
        return ResponseEntity.ok(videoService.getVideos());
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<VideoDetailDTO> getVideo(@PathVariable Long videoId) {
        return videoService.getVideoDetail(videoId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VideoDetailDTO> uploadVideo(@RequestPart("video") MultipartFile videoFile,
                                                      @RequestPart("thumbnail") MultipartFile thumbnailFile,
                                                      @RequestParam("name") String name,
                                                      @RequestParam("username") String username,
                                                      @RequestParam("description") String description,
                                                      @RequestParam("duration") long duration) throws IOException {
        VideoDetailDTO dto = videoService.uploadVideo(videoFile, thumbnailFile, name, username, description, duration);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        boolean deleted = videoService.deleteVideo(videoId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{videoId}/comments")
    public ResponseEntity<VideoDetailDTO> addComment(@PathVariable Long videoId,
                                                     @RequestBody CommentCreateDTO body,
                                                     Principal principal) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String text = body.text();
        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return videoService.addComment(videoId, principal.getName(), text.trim())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{videoId}/likes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VideoDetailDTO> addLike(@PathVariable Long videoId, Principal principal) throws NotFoundException, NotFoundException {
        VideoDetailDTO dto = videoService.addLike(videoId, principal.getName());
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{videoId}/likes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VideoDetailDTO> removeLike(@PathVariable Long videoId, Principal principal) throws NotFoundException {
        VideoDetailDTO dto = videoService.removeLike(videoId, principal.getName());
        return ResponseEntity.ok(dto);
    }
}
