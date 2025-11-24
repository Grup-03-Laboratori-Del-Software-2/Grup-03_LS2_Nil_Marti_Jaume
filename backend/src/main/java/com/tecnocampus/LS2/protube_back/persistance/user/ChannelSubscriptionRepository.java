package com.tecnocampus.LS2.protube_back.persistance.user;

import com.tecnocampus.LS2.protube_back.domain.user.ChannelSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelSubscriptionRepository extends JpaRepository<ChannelSubscription, Long> {
    boolean existsBySubscriberEmailAndChannelName(String subscriberEmail, String channelName);
    void deleteBySubscriberEmailAndChannelName(String subscriberEmail, String channelName);
    long countByChannelName(String channelName);
}
