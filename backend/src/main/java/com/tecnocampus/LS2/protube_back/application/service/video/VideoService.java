package com.tecnocampus.LS2.protube_back.application.service.video;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import com.tecnocampus.LS2.protube_back.application.mapper.video.VideoMapper;
import com.tecnocampus.LS2.protube_back.domain.video.Video;
import com.tecnocampus.LS2.protube_back.domain.video.VideoMetadata;
import com.tecnocampus.LS2.protube_back.persistance.video.VideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class VideoService {

    private final VideoRepository videoRepository;

    @Value("${pro-tube.store-dir:}")
    private String configuredStoreDir;

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

        // Mapper tolerante (ignora campos desconocidos)
        ObjectMapper objectMapper = new ObjectMapper()
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
                    Path thumbnailPath = storePath.resolve(baseName + ".webp");

                    // Si falta vídeo o thumbnail, saltamos ese entry
                    if (!Files.exists(videoPath) || !Files.exists(thumbnailPath)) {
                        System.out.println("⏭️ Faltan archivos para " + baseName + " (mp4/webp). Saltando.");
                        continue;
                    }

                    VideoMetadata metadata = objectMapper.readValue(jsonFile.toFile(), VideoMetadata.class);

                    Video video = new Video(
                            videoPath.toString(),                    // ruta absoluta en disco
                            metadata.title(),
                            metadata.user(),
                            metadata.meta() != null ? metadata.meta().description() : "",
                            Instant.ofEpochSecond(metadata.timestamp())
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDateTime(),
                            thumbnailPath.toString(),
                            Math.round(metadata.duration())          // ← long correcto
                    );

                    videoRepository.save(video);
                    System.out.println("✔️ Guardado vídeo: " + video.getName() + " | ID: " + video.getId());
                    loadedVideos.add(video.getName());

                } catch (Exception perFileEx) {
                    // No paramos el import por un json problemático: lo reportamos y seguimos
                    System.err.println("❌ Error procesando " + jsonFile.getFileName() + ": " + perFileEx.getMessage());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("📦 Vídeos en repositorio: " + videoRepository.count());
        return loadedVideos;
    }

    /*
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void preloadStoreOnStartup() {
        String storeDir = configuredStoreDir;
        if (storeDir == null || storeDir.isBlank()) {
            System.out.println("[WARN] pro-tube.store-dir no definido. Saltando precarga.");
            return;
        }
        if (videoRepository.count() > 0) {
            System.out.println("[INFO] Vídeos ya cargados. Saltando precarga.");
            return;
        }
        System.out.println("[INFO] Precargando vídeos desde disco: " + storeDir);
        loadVideosFromDisk(storeDir);
    }
    */
}
