package com.tecnocampus.LS2.protube_back.application.service;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import com.tecnocampus.LS2.protube_back.domain.video.Like;
import com.tecnocampus.LS2.protube_back.domain.video.Video;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VideoServiceTest {

    private VideoRepository videoRepository;
    private VideoService videoService;

    @BeforeEach
    void setUp() {
        videoRepository = mock(VideoRepository.class);
        videoService = new VideoService(videoRepository);
    }

    private void setStoreDir(Path dir) throws Exception {
        Field f = VideoService.class.getDeclaredField("configuredStoreDir");
        f.setAccessible(true);
        f.set(videoService, dir.toString());
    }

    @Test
    void getVideos_returnsMappedList() {
        Video v1 = new Video("url1", "name1", "user1", "desc1", LocalDateTime.now(), "thumb1", 10);
        Video v2 = new Video("url2", "name2", "user2", "desc2", LocalDateTime.now(), "thumb2", 20);

        when(videoRepository.findAll()).thenReturn(List.of(v1, v2));

        List<VideoDTO> result = videoService.getVideos();

        assertEquals(2, result.size());
        assertEquals("/media/thumb1", result.get(0).thumbnailURL());
        assertEquals("/media/thumb2", result.get(1).thumbnailURL());
    }

    @Test
    void getVideoDetail_returnsDetailIfExists() {
        Video video = new Video("url", "name", "user", "desc", LocalDateTime.now(), "thumb", 12);
        when(videoRepository.findById(1L)).thenReturn(Optional.of(video));

        Optional<VideoDetailDTO> result = videoService.getVideoDetail(1L);

        assertTrue(result.isPresent());
        assertEquals("/media/url", result.get().videoURL());
        assertEquals("name", result.get().name());
    }

    @Test
    void getVideoDetail_returnsEmptyIfNotFound() {
        when(videoRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<VideoDetailDTO> result = videoService.getVideoDetail(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void loadVideosFromDisk_validFolder_parsesFiles() {
        List<String> result = videoService.loadVideosFromDisk(System.getProperty("user.dir"));
        assertNotNull(result);
    }

    @Test
    void uploadVideo_savesEntityAndReturnsDetail() throws Exception {
        Path tempDir = Files.createTempDirectory("video-store-test");
        setStoreDir(tempDir);

        MockMultipartFile videoFile = new MockMultipartFile(
                "video",
                "video.mp4",
                "video/mp4",
                "data".getBytes()
        );
        MockMultipartFile thumbFile = new MockMultipartFile(
                "thumbnail",
                "thumb.webp",
                "image/webp",
                "img".getBytes()
        );

        when(videoRepository.save(any(Video.class))).thenAnswer(invocation -> {
            Video v = invocation.getArgument(0);
            Field f = Video.class.getDeclaredField("id");
            f.setAccessible(true);
            f.set(v, 1L);
            return v;
        });

        VideoDetailDTO dto = videoService.uploadVideo(
                videoFile,
                thumbFile,
                "name",
                "user",
                "desc",
                42L
        );

        assertNotNull(dto);
        assertEquals("name", dto.name());
        assertEquals("user", dto.username());
        assertEquals(42L, dto.duration());

        long mp4Count;
        long webpCount;
        try (Stream<Path> s = Files.list(tempDir)) {
            mp4Count = s.filter(p -> p.toString().endsWith(".mp4")).count();
        }
        try (Stream<Path> s = Files.list(tempDir)) {
            webpCount = s.filter(p -> p.toString().endsWith(".webp")).count();
        }
        assertEquals(1, mp4Count);
        assertEquals(1, webpCount);

        verify(videoRepository, times(1)).save(any(Video.class));
    }

    @Test
    void deleteVideo_existingVideoRemovesFilesAndEntity() throws Exception {
        Path tempDir = Files.createTempDirectory("video-delete-test");
        Path videoPath = Files.createTempFile(tempDir, "v-", ".mp4");
        Path thumbPath = Files.createTempFile(tempDir, "t-", ".webp");

        Video video = new Video(
                videoPath.toString(),
                "name",
                "user",
                "desc",
                LocalDateTime.now(),
                thumbPath.toString(),
                10L
        );
        Field f = Video.class.getDeclaredField("id");
        f.setAccessible(true);
        f.set(video, 1L);

        when(videoRepository.findById(1L)).thenReturn(Optional.of(video));

        boolean result = videoService.deleteVideo(1L);

        assertTrue(result);
        assertFalse(Files.exists(videoPath));
        assertFalse(Files.exists(thumbPath));
        verify(videoRepository, times(1)).delete(video);
    }

    @Test
    void deleteVideo_nonExistingReturnsFalse() {
        when(videoRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = videoService.deleteVideo(999L);

        assertFalse(result);
        verify(videoRepository, never()).delete(any());
    }

    @Test
    void addLike_addsNewLikeWhenNotExisting() throws Exception {
        Video video = new Video("url", "name", "user", "desc", LocalDateTime.now(), "thumb", 12L);

        // inicializamos lista de likes vacía para estar seguros
        List<Like> likes = new ArrayList<>();
        Field likesField = Video.class.getDeclaredField("likes");
        likesField.setAccessible(true);
        likesField.set(video, likes);

        Field idField = Video.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(video, 1L);

        when(videoRepository.findById(1L)).thenReturn(Optional.of(video));
        when(videoRepository.save(any(Video.class))).thenAnswer(invocation -> invocation.getArgument(0));

        VideoDetailDTO dto = videoService.addLike(1L, "user@example.com");

        assertNotNull(dto);
        assertEquals(1, dto.likes().size());
        assertEquals("user@example.com", dto.likes().get(0).username());
        verify(videoRepository, times(1)).save(any(Video.class));
    }

    @Test
    void removeLike_removesExistingLike() throws Exception {
        Video video = new Video("url", "name", "user", "desc", LocalDateTime.now(), "thumb", 12L);

        Like like1 = new Like("user@example.com", video);
        Like like2 = new Like("other@example.com", video);
        List<Like> likes = new ArrayList<>();
        likes.add(like1);
        likes.add(like2);

        Field likesField = Video.class.getDeclaredField("likes");
        likesField.setAccessible(true);
        likesField.set(video, likes);

        Field idField = Video.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(video, 1L);

        when(videoRepository.findById(1L)).thenReturn(Optional.of(video));
        when(videoRepository.save(any(Video.class))).thenAnswer(invocation -> invocation.getArgument(0));

        VideoDetailDTO dto = videoService.removeLike(1L, "user@example.com");

        assertNotNull(dto);
        // solo debería quedar el like del otro usuario
        assertEquals(1, dto.likes().size());
        assertEquals("other@example.com", dto.likes().get(0).username());
        verify(videoRepository, times(1)).save(any(Video.class));
    }
}
