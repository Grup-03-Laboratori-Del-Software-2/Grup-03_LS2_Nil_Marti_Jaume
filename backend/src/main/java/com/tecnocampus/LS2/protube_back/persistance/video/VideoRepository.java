package com.tecnocampus.LS2.protube_back.persistance.video;

import com.tecnocampus.LS2.protube_back.domain.video.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {

}
