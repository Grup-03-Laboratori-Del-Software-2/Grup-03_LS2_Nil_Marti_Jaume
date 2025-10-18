package com.tecnocampus.LS2.protube_back;

import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class AppStartupRunner implements ApplicationRunner {
    private static final Logger LOG = LoggerFactory.getLogger(AppStartupRunner.class);

    private final VideoService videoService;

    @Value("${pro-tube.store-dir:/home/jangladag/protube/store}")
    private String storeDir;

    @Value("${pro-tube.load-initial-data:true}")
    private boolean loadInitialData;

    public AppStartupRunner(VideoService videoService) {
        this.videoService = videoService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (storeDir == null || storeDir.isBlank()) {
            LOG.warn("pro-tube.store-dir no definido. Saltando carga inicial.");
            return;
        }

        Path storePath = Path.of(storeDir);
        LOG.info("Store: {} | loadInitialData: {}", storePath, loadInitialData);

        if (loadInitialData) {
            var list = videoService.getVideos();
            LOG.info("Vídeos disponibles al arrancar: {}", list.size());
        }
    }
}
