package com.tecnocampus.LS2.protube_back.api;

import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.domain.video.Video;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "pro-tube.store-dir=c:",
        "pro-tube.load-initial-data=false"
})
@AutoConfigureMockMvc
class VideoCommentsIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VideoRepository videoRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private static final String EMAIL = "comment.user@protube.dev";
    private static final String RAW_PASSWORD = "Abc12345#";

    @BeforeEach
    void setUp() {
        videoRepository.deleteAll();
        userRepository.deleteAll();

        String hash = passwordEncoder.encode(RAW_PASSWORD);
        User u = new User(
                "Comment",
                "User",
                EMAIL,
                LocalDateTime.parse("2000-01-01T00:00:00"),
                hash,
                LocalDateTime.now(),
                Set.of("ROLE_USER")
        );
        userRepository.save(u);
    }

    @Test
    void addComment_returnsUpdatedVideoDetail() throws Exception {
        Video video = new Video(
                "c:/tmp/v1.mp4",
                "Video test",
                "channelUser",
                "desc",
                LocalDateTime.now(),
                "c:/tmp/t1.webp",
                10L
        );
        video = videoRepository.save(video);

        String loginBody = """
                {
                  "email": "%s",
                  "password": "%s"
                }
                """.formatted(EMAIL, RAW_PASSWORD);

        MvcResult loginResult = mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn();

        String authHeader = loginResult.getResponse().getHeader("Authorization");
        assertThat(authHeader).isNotNull();

        String commentBody = """
                {
                  "text": "Primer comentario"
                }
                """;

        mvc.perform(post("/api/videos/" + video.getId() + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", authHeader)
                        .content(commentBody))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(video.getId()))
                .andExpect(jsonPath("$.comments").isArray())
                .andExpect(jsonPath("$.comments[0].text").value("Primer comentario"));
    }
}
