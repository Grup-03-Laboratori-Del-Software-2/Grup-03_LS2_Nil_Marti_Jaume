package com.tecnocampus.LS2.protube_back;

import com.tecnocampus.LS2.protube_back.application.service.VideoService;
import com.tecnocampus.LS2.protube_back.configuration.ProtubeProps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class AppStartupRunner implements ApplicationRunner {
    private static final Logger LOG =
            LoggerFactory.getLogger(AppStartupRunner.class);

    private final VideoService videoService;
    private final ProtubeProps props;

    public AppStartupRunner(VideoService videoService, ProtubeProps props) {
        this.videoService = videoService;
        this.props = props;
    }

    @Override
    public void run(ApplicationArguments args) {
        Path storeDir = props.storeDir();
        boolean load = Boolean.TRUE.equals(props.loadInitialData());

        if (storeDir == null || storeDir.toString().isBlank()) {
            LOG.warn("pro-tube.store.dir no definido. Saltando carga inicial.");
            return;
        }
        LOG.info("Store: {} | loadInitialData: {}", storeDir, load);

        if (load) {
            var list = videoService.getVideos();
            LOG.info("Vídeos disponibles al arrancar: {}", list.size());
        }
    }
    /*
    // Example variables from our implementation.
    // Feel free to adapt them to your needs.
    //private final Environment env;
    //private final Path rootPath;
    //private final Boolean loadInitialData;

    /*public AppStartupRunner(VideoService videoService, Environment env) {
        this.env = env;
        //final var rootDir = env.getProperty("pro-tube.store.dir");
        //this.rootPath = Paths.get(rootDir);
        //loadInitialData = env.getProperty("pro-tube.load_initial_data", Boolean.class);
        this.videoService = videoService;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Should your backend perform any task during the bootstrap, do it here
        String rootDir = env.getProperty("pro-tube.store.dir");
        boolean load = Boolean.TRUE.equals(env.getProperty("pro-tube.load_initial_data", Boolean.class));

        if (rootDir == null || rootDir.isBlank()) {
            LOG.warn("pro-tube.store.dir no definido. Saltando carga inicial.");
            return;
        }
        LOG.info("Store: {} | loadInitialData: {}", rootDir, load);
        // if (load) videoService.seedFrom(Paths.get(rootDir));
    }*/
}
