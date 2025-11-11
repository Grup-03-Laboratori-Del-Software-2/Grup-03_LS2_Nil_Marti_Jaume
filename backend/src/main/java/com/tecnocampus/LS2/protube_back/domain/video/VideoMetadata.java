package com.tecnocampus.LS2.protube_back.domain.video;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record VideoMetadata(
        int id,
        int width,
        int height,
        double duration,
        String title,
        String user,
        long timestamp,
        Meta meta
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Meta(
            String description,
            List<String> categories,
            List<String> tags,
            long view_count,
            long like_count,
            String channel,
            long channel_follower_count,
            List<Comment> comments
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Comment(
            String text,
            String author,
            long timestamp,
            long like_count
    ) {}
}
