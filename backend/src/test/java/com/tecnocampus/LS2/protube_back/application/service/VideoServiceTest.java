package com.tecnocampus.LS2.protube_back.application.service;

import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.junit.jupiter.api.Test;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Video;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import org.junit.jupiter.api.BeforeEach;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

class VideoServiceTest {

    private VideoRepository videoRepository;
    private VideoService videoService;

    @BeforeEach
    void setUp() {
        videoRepository = mock(VideoRepository.class);
        videoService = new VideoService(videoRepository);
    }

    @Test
    void getVideos_returnsMappedList() {
        Video v1 = new Video("url1", "name1", "user1", "desc1", LocalDateTime.now(), "thumb1", 10);
        Video v2 = new Video("url2", "name2", "user2", "desc2", LocalDateTime.now(), "thumb2", 20);

        when(videoRepository.findAll()).thenReturn(List.of(v1, v2));

        List<VideoDTO> result = videoService.getVideos();

        assertEquals(2, result.size());
        assertEquals("thumb1", result.get(0).thumbnailURL());
        assertEquals("thumb2", result.get(1).thumbnailURL());
    }

    @Test
    void getVideoDetail_returnsDetailIfExists() {
        Video video = new Video("url", "name", "user", "desc", LocalDateTime.now(), "thumb", 12);
        when(videoRepository.findById(1L)).thenReturn(Optional.of(video));

        Optional<VideoDetailDTO> result = videoService.getVideoDetail(1L);

        assertTrue(result.isPresent());
        assertEquals("url", result.get().videoURL());
        assertEquals("name", result.get().name());
    }

    @Test
    void getVideoDetail_returnsEmptyIfNotFound() {
        when(videoRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<VideoDetailDTO> result = videoService.getVideoDetail(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void loadVideosFromDisk_emptyFolder_returnsEmptyList() {
        // Passa un path inexistent (no llença error, només retorna buit)
        List<String> result = videoService.loadVideosFromDisk("/path/inexistent");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void loadVideosFromDisk_validFolder_parsesFiles() {
        // ⚠️ Aquest test només comprova que no llença excepcions
        // (per provar fitxers reals, caldria crear mocks o fitxers temporals)
        List<String> result = videoService.loadVideosFromDisk(System.getProperty("user.dir"));

        assertNotNull(result);
    }
}