package com.tecnocampus.LS2.protube_back.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Path;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    // Ruta del store. Coge application.properties (ENV_PROTUBE_STORE_DIR o fallback)
    @Value("${pro-tube.store-dir:}")
    private String storeDir;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // /media/** -> archivos del store en disco
        if (storeDir != null && !storeDir.isBlank()) {
            Path store = Path.of(storeDir);
            registry.addResourceHandler("/media/**")
                    .addResourceLocations("file:%s/".formatted(store.toAbsolutePath().toString()));
        }

        // estáticos del classpath
        registry.addResourceHandler("/**")
                .addResourceLocations(
                        "classpath:/static/",
                        "classpath:/public/",
                        "classpath:/resources/",
                        "classpath:/META-INF/resources/")
                .setCachePeriod(3600);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOriginPatterns("*");
        registry.addMapping("/auth/**").allowedOriginPatterns("*");
        // Añadimos CORS para media (por si el tag <video> lo requiere entre puertos distintos)
        registry.addMapping("/media/**").allowedOriginPatterns("*");
    }

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Servir el index de /static en la raíz
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
