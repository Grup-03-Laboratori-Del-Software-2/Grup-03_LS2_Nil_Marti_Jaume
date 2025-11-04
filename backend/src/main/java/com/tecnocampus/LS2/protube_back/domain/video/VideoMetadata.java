package com.tecnocampus.LS2.protube_back.domain.video;

import java.util.List;

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
    public record Meta(
            String description,
            List<String> categories,
            List<String> tags,
            int view_count,
            int like_count,
            String channel,
            int channel_follower_count,
            List<Comment> comments
    ) {}

    public record Comment(
            String text,
            String author,
            long timestamp,
            int like_count
    ) {}
}
