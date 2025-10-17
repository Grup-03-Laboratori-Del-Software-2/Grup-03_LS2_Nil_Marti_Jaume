package com.tecnocampus.LS2.protube_back.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.lang.NonNull;

import java.nio.file.Path;

//@EnableWebMvc
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    /*private static final Logger LOG =
            LoggerFactory.getLogger(MvcConfig.class);*/
    /*@Autowired
    private Environment env;*/
    private final ProtubeProps props;

    public MvcConfig(ProtubeProps props) {
        this.props = props;
    }



    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        Path store = props.storeDir();
        if (store != null && !store.toString().isBlank()) {
            registry
                    .addResourceHandler("/media/**")
                    .addResourceLocations(
                            String.format("file:%s", store));
        }
        registry.addResourceHandler("/**")
           .addResourceLocations("classpath:/static/", "classpath:/public/",
                        "classpath:/resources/",
                        "classpath:/META-INF/resources/")
           .setCachePeriod(3600);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*");
        registry.addMapping("/auth/**")
                .allowedOriginPatterns("*");
    }
}
