package com.tecnocampus.LS2.protube_back.domain.user;

import jakarta.persistence.*;

@Entity
@Table(
        name = "channel_subscription",
        uniqueConstraints = @UniqueConstraint(columnNames = {"subscriber_email", "channel_name"})
)
public class ChannelSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subscriber_email", nullable = false)
    private String subscriberEmail;

    @Column(name = "channel_name", nullable = false)
    private String channelName;

    protected ChannelSubscription() {
    }

    public ChannelSubscription(String subscriberEmail, String channelName) {
        this.subscriberEmail = subscriberEmail;
        this.channelName = channelName;
    }

    public Long getId() {
        return id;
    }

    public String getSubscriberEmail() {
        return subscriberEmail;
    }

    public String getChannelName() {
        return channelName;
    }
}
