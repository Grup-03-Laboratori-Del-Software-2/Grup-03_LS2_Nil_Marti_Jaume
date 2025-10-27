package com.tecnocampus.LS2.protube_back.domain.video;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "app_video")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String videoURL;

    @NotBlank
    private String name;

    @NotBlank
    private String username;

    @NotBlank
    private String description;

    @NotBlank
    private LocalDateTime dateOfPublish;

    @NotBlank
    private String thumbnailURL;

    @NotBlank
    private long duration;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Like> likes = new ArrayList<>();

    protected Video() {}

    public Video(String videoURL, String name, String username, String description, LocalDateTime dateOfPublish, String thumbnailURL, long duration) {
        this.videoURL = videoURL;
        this.name = name;
        this.username = username;
        this.description = description;
        this.dateOfPublish = dateOfPublish;
        this.thumbnailURL = thumbnailURL;
        this.duration = duration;
    }

    public Long getId() {return id;}

    public String getUsername() {return username;}

    public String getVideoURL() {
        return videoURL;
    }

    public void setVideoURL(String videoURL) {
        this.videoURL = videoURL;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {return description;}

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateOfPublish() {
        return dateOfPublish;
    }

    public String getThumbnailURL() {
        return thumbnailURL;
    }

    public void setThumbnailURL(String thumbnailURL) {
        this.thumbnailURL = thumbnailURL;
    }

    public long getDuration() {
        return duration;
    }

    public List<Like> getLikes() { return this.likes; }

    public List<Comment> getComments() { return this.comments; }
}
