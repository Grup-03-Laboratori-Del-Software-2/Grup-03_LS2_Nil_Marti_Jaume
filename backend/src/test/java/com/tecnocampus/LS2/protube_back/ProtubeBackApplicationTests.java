package com.tecnocampus.LS2.protube_back;

import com.tecnocampus.LS2.protube_back.application.service.video.VideoService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest({
        "pro-tube.store-dir=c:",
        "pro-tube.load-initial-data=false"
})
class ProtubeBackApplicationTests {

    @Autowired
    VideoService videoService;

    @Test
    void shouldStartApp() {
        Assertions.assertNotNull(videoService);
    }

}
