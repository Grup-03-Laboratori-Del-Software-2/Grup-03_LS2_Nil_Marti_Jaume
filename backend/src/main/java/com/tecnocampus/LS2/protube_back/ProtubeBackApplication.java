package com.tecnocampus.LS2.protube_back;

import com.tecnocampus.LS2.protube_back.configuration.ProtubeProps;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ProtubeProps.class)
public class ProtubeBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProtubeBackApplication.class, args);
	}

}
