package com.tecnocampus.LS2.protube_back.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.nio.file.Path;

@ConfigurationProperties(prefix = "pro-tube")
public record ProtubeProps(Path storeDir, Boolean loadInitialData) {}
