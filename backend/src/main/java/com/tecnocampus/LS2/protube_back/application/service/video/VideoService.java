package com.tecnocampus.LS2.protube_back.application.service.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Video;
import com.tecnocampus.LS2.protube_back.domain.video.VideoMetadata;
import jakarta.transaction.Transactional;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import com.tecnocampus.LS2.protube_back.application.mapper.video.VideoMapper;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Files;


import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class VideoService {

    private final VideoRepository videoRepository;


    public VideoService(VideoRepository videoRepository){
        this.videoRepository = videoRepository;
    }

    public List<VideoDTO> getVideos() {
        return videoRepository.findAll().stream().map(VideoMapper::videoToVideoDTO).toList();
    }

    public Optional<VideoDetailDTO> getVideoDetail(Long videoId) {
        return videoRepository.findById(videoId).map(VideoMapper::videoToVideoDetailDTO);
    }

    public List<String> loadVideosFromDisk(String storeDir) {
        List<String> loadedVideos = new ArrayList<>();
        Path storePath = Paths.get(storeDir);
        ObjectMapper objectMapper = new ObjectMapper();

        try (Stream<Path> paths = Files.list(storePath)) {
            List<Path> jsonFiles = paths
                    .filter(p -> p.toString().endsWith(".json"))
                    .sorted()
                    .toList();

            for (Path jsonFile : jsonFiles) {
                String baseName = jsonFile.getFileName().toString().replace(".json", "");
                Path videoPath = storePath.resolve(baseName + ".mp4");
                Path thumbnailPath = storePath.resolve(baseName + ".webp");

                VideoMetadata metadata = objectMapper.readValue(jsonFile.toFile(), VideoMetadata.class);

                Video video = new Video(
                        videoPath.toString(),
                        metadata.title(),
                        metadata.user(),
                        metadata.meta().description(),
                        Instant.ofEpochSecond(metadata.timestamp())
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime(),
                        thumbnailPath.toString(),
                        (int) metadata.duration());

                videoRepository.save(video);
                System.out.println("✔️ Guardat vídeo: " + video.getName() + " | ID: " + video.getId());

                loadedVideos.add(video.getName());

            }






        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("📦 Vídeos al repositori: {}"+videoRepository.count());

        return loadedVideos;
    }

}