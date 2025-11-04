package com.tecnocampus.LS2.protube_back.domain.video;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String text;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    public int getId() {
        return id;
    }


    public String getUsername() {
        return username;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public Video getVideo() {
        return video;
    }

}
