package com.tecnocampus.LS2.protube_back.api;

import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VideosControllerTest {

    @InjectMocks
    VideosController videosController;

    @Mock
    VideoService videoService;

    @Test
    void getVideos() {
        when(videoService.getVideos()).thenReturn(List.of("video 1", "video 2"));
        assertEquals(List.of("video 1", "video 2"), videosController.getVideos().getBody());
    }
}