package com.tecnocampus.LS2.protube_back.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Value("${pro-tube.store-dir:}")
    private String storeDir;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        if (storeDir != null && !storeDir.isBlank()) {
            Path store = Path.of(storeDir);
            registry.addResourceHandler("/media/**")
                    .addResourceLocations("file:%s/".formatted(Path.of(storeDir)));
        }

        registry.addResourceHandler("/**")
                .addResourceLocations(
                        "classpath:/static/",
                        "classpath:/public/",
                        "classpath:/resources/",
                        "classpath:/META-INF/resources/")
                .setCachePeriod(3600);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry r) {
        r.addMapping("/user/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization","Set-Cookie")
                .allowCredentials(true);

        r.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization","Set-Cookie")
                .allowCredentials(true);

        r.addMapping("/media/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET")
                .allowCredentials(false);
    }

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
