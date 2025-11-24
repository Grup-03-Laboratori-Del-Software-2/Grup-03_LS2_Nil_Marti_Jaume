package com.tecnocampus.LS2.protube_back.application.service.video;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.mapper.video.VideoMapper;
import com.tecnocampus.LS2.protube_back.domain.video.Comment;
import com.tecnocampus.LS2.protube_back.domain.video.Like;
import com.tecnocampus.LS2.protube_back.domain.video.Video;
import com.tecnocampus.LS2.protube_back.domain.video.VideoMetadata;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class VideoService {

    private static final Logger LOG = LoggerFactory.getLogger(VideoService.class);

    private final VideoRepository videoRepository;

    @Value("${pro-tube.store-dir:}")
    private String configuredStoreDir;

    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    public List<VideoDTO> getVideos() {
        return videoRepository.findAll().stream().map(VideoMapper::videoToVideoDTO).toList();
    }

    public Optional<VideoDetailDTO> getVideoDetail(Long videoId) {
        return videoRepository.findById(videoId).map(VideoMapper::videoToVideoDetailDTO);
    }

    @Transactional
    public VideoDetailDTO uploadVideo(MultipartFile videoFile,
                                      MultipartFile thumbnailFile,
                                      String name,
                                      String username,
                                      String description,
                                      long duration) throws IOException {

        Path storePath = Paths.get(configuredStoreDir);
        Files.createDirectories(storePath);

        String baseName = UUID.randomUUID().toString();

        Path targetVideo = storePath.resolve(baseName + ".mp4");
        Path targetThumb = storePath.resolve(baseName + ".webp");

        Files.copy(videoFile.getInputStream(), targetVideo, StandardCopyOption.REPLACE_EXISTING);
        Files.copy(thumbnailFile.getInputStream(), targetThumb, StandardCopyOption.REPLACE_EXISTING);

        Video video = new Video(
                targetVideo.toString(),
                name,
                username,
                description,
                LocalDateTime.now(),
                targetThumb.toString(),
                duration
        );

        Video saved = videoRepository.save(video);

        return VideoMapper.videoToVideoDetailDTO(saved);
    }

    @Transactional
    public boolean deleteVideo(Long videoId) {
        Optional<Video> opt = videoRepository.findById(videoId);
        if (opt.isEmpty()) return false;

        Video v = opt.get();

        try {
            Files.deleteIfExists(Paths.get(v.getVideoURL()));
        } catch (Exception ignored) {
        }
        try {
            Files.deleteIfExists(Paths.get(v.getThumbnailURL()));
        } catch (Exception ignored) {
        }

        videoRepository.delete(v);
        return true;
    }

    public List<String> loadVideosFromDisk(String storeDir) {
        List<String> loadedVideos = new ArrayList<>();
        Path storePath = Paths.get(storeDir);

        ObjectMapper mapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try (Stream<Path> paths = Files.list(storePath)) {
            List<Path> jsonFiles = paths
                    .filter(p -> p.toString().endsWith(".json"))
                    .sorted()
                    .toList();

            for (Path jsonFile : jsonFiles) {
                try {
                    String baseName = jsonFile.getFileName().toString().replace(".json", "");
                    Path videoPath = storePath.resolve(baseName + ".mp4");
                    Path thumbPath = storePath.resolve(baseName + ".webp");

                    if (!Files.exists(videoPath) || !Files.exists(thumbPath)) continue;

                    VideoMetadata metadata = mapper.readValue(jsonFile.toFile(), VideoMetadata.class);

                    Video video = new Video(
                            videoPath.toString(),
                            metadata.title(),
                            metadata.user(),
                            metadata.meta() != null ? metadata.meta().description() : "",
                            Instant.ofEpochSecond(metadata.timestamp())
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDateTime(),
                            thumbPath.toString(),
                            Math.round(metadata.duration())
                    );

                    videoRepository.save(video);
                    loadedVideos.add(video.getName());

                } catch (Exception ignored) {
                }
            }
        } catch (Exception ignored) {
        }

        return loadedVideos;
    }

    @Transactional
    public Optional<VideoDetailDTO> addComment(Long videoId, String username, String text) {
        return videoRepository.findById(videoId).map(video -> {
            Comment comment = new Comment();
            comment.setUsername(username);
            comment.setText(text);
            comment.setVideo(video);
            video.getComments().add(comment);
            Video saved = videoRepository.save(video);
            return VideoMapper.videoToVideoDetailDTO(saved);
        });
    }

    @Transactional
    public VideoDetailDTO addLike(Long videoId, String username) throws NotFoundException {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new NotFoundException("Video not found"));

        boolean exists = video.getLikes().stream()
                .anyMatch(l -> username.equalsIgnoreCase(l.getUsername()));

        if (!exists) {
            Like like = new Like(username, video);
            video.getLikes().add(like);
            video = videoRepository.save(video);
        }

        return VideoMapper.videoToVideoDetailDTO(video);
    }

    @Transactional
    public VideoDetailDTO removeLike(Long videoId, String username) throws NotFoundException {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new NotFoundException("Video not found"));

        boolean removed = video.getLikes().removeIf(l -> username.equalsIgnoreCase(l.getUsername()));
        if (removed) {
            video = videoRepository.save(video);
        }

        return VideoMapper.videoToVideoDetailDTO(video);
    }
}
