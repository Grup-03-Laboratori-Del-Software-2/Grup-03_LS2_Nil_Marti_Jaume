package com.tecnocampus.LS2.protube_back.application.service.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDTO;
import com.tecnocampus.LS2.protube_back.application.dto.video.VideoDetailDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class VideoService {

    private final Path storeDir;

    public VideoService(@Value("${pro-tube.store-dir:}") String storeDir) {
        if (storeDir == null || storeDir.isBlank()) {
            throw new IllegalStateException("pro-tube.store-dir vacío. Configura ENV_PROTUBE_STORE_DIR o application.properties");
        }
        this.storeDir = Paths.get(storeDir).toAbsolutePath();
    }

    public List<VideoDTO> getVideos() {
        List<VideoFile> files = scan();
        return files.stream()
                .map(v -> new VideoDTO(
                        v.id,
                        v.title,
                        v.description,
                        v.durationSec,
                        "/media/" + v.baseName + ".webp",
                        "/media/" + v.baseName + ".mp4"
                ))
                .collect(Collectors.toList());
    }

    public Optional<VideoDetailDTO> getVideoDetail(Long id) {
        return scan().stream()
                .filter(v -> Objects.equals(v.id, id))
                .findFirst()
                .map(v -> new VideoDetailDTO(
                        v.id,
                        v.title,
                        v.description,
                        v.durationSec,
                        "/media/" + v.baseName + ".webp",
                        "/media/" + v.baseName + ".mp4"
                ));
    }

    // -------- internals --------

    private List<VideoFile> scan() {
        try (Stream<Path> files = Files.list(storeDir)) {
            // cada .json define un video
            List<String> basenames = files
                    .filter(p -> p.getFileName().toString().endsWith(".json"))
                    .map(p -> p.getFileName().toString().replaceFirst("\\.json$", ""))
                    .sorted()
                    .toList();

            List<VideoFile> out = new ArrayList<>();
            long idx = 1;
            for (String base : basenames) {
                Path json = storeDir.resolve(base + ".json");
                Path mp4  = storeDir.resolve(base + ".mp4");
                Path webp = storeDir.resolve(base + ".webp");

                if (!Files.exists(mp4) || !Files.exists(webp)) {
                    // si falta media, lo saltamos
                    continue;
                }

                String raw = Files.readString(json);
                String title = extract(raw, "\"title\"\\s*:\\s*\"(.*?)\"");
                String description = extract(raw, "\"description\"\\s*:\\s*\"(.*?)\"");
                String dur = extract(raw, "\"duration\"\\s*:\\s*(\\d+)");

                Integer duration = null;
                try { duration = Integer.parseInt(dur); } catch (Exception ignored) {}

                VideoFile vf = new VideoFile();
                vf.id = idx++;
                vf.baseName = base;
                vf.title = title != null && !title.isBlank() ? title : base;
                vf.description = description != null ? description : "";
                vf.durationSec = duration;

                out.add(vf);
            }
            return out;
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer el store: " + storeDir, e);
        }
    }

    private static String extract(String src, String regex) {
        var m = java.util.regex.Pattern.compile(regex, java.util.regex.Pattern.DOTALL).matcher(src);
        return m.find() ? m.group(1) : null;
    }

    private static class VideoFile {
        long id;
        String baseName;
        String title;
        String description;
        Integer durationSec;
    }
}
