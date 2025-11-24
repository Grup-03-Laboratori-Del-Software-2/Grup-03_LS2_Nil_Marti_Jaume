package com.tecnocampus.LS2.protube_back.domain.video;

import jakarta.persistence.*;

@Entity
@Table(name = "video_like")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    protected Like() {
    }

    public Like(String username, Video video) {
        this.username = username;
        this.video = video;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public Video getVideo() {
        return video;
    }
}
