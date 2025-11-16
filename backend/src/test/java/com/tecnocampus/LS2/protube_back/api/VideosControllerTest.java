package com.tecnocampus.LS2.protube_back.api;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class VideosControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    VideoService videoService;

    @Test
    void getVideos_emptyList_ok() throws Exception {
        when(videoService.getVideos()).thenReturn(List.of());

        mvc.perform(get("/api/videos").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void uploadVideo_returnsCreated() throws Exception {
        VideoDetailDTO dto = new VideoDetailDTO(
                1L,
                "/media/v.mp4",
                "Test video",
                "user1",
                "desc",
                LocalDateTime.now(),
                "/media/t.webp",
                120L,
                List.of(),
                List.of()
        );

        when(videoService.uploadVideo(
                any(),
                any(),
                eq("Test video"),
                eq("user1"),
                eq("desc"),
                eq(120L)
        )).thenReturn(dto);

        MockMultipartFile video = new MockMultipartFile(
                "video",
                "video.mp4",
                "video/mp4",
                "data".getBytes()
        );
        MockMultipartFile thumb = new MockMultipartFile(
                "thumbnail",
                "thumb.webp",
                "image/webp",
                "img".getBytes()
        );

        mvc.perform(
                        multipart("/api/videos")
                                .file(video)
                                .file(thumb)
                                .param("name", "Test video")
                                .param("description", "desc")
                                .param("username", "user1")
                                .param("duration", "120")
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test video"));
    }

    @Test
    void deleteVideo_existing_returnsNoContent() throws Exception {
        when(videoService.deleteVideo(1L)).thenReturn(true);

        mvc.perform(delete("/api/videos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteVideo_notExisting_returnsNotFound() throws Exception {
        when(videoService.deleteVideo(999L)).thenReturn(false);

        mvc.perform(delete("/api/videos/999"))
                .andExpect(status().isNotFound());
    }
}
