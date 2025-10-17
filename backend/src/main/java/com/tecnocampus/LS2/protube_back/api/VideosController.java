package com.tecnocampus.LS2.protube_back.api;

import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideosController {

    VideoService videoService;

    public VideosController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("")
    public ResponseEntity<List<String>> getVideos() {
        return ResponseEntity.ok().body(videoService.getVideos());

    }
}
