package com.tecnocampus.LS2.protube_back.application.service.user;

import com.tecnocampus.LS2.protube_back.domain.user.ChannelSubscription;
import com.tecnocampus.LS2.protube_back.persistance.user.ChannelSubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChannelSubscriptionService {

    private final ChannelSubscriptionRepository repository;

    public ChannelSubscriptionService(ChannelSubscriptionRepository repository) {
        this.repository = repository;
    }

    public boolean isSubscribed(String subscriberEmail, String channelName) {
        return repository.existsBySubscriberEmailAndChannelName(subscriberEmail, channelName);
    }

    @Transactional
    public void subscribe(String subscriberEmail, String channelName) {
        boolean exists = repository.existsBySubscriberEmailAndChannelName(subscriberEmail, channelName);
        if (!exists) {
            ChannelSubscription sub = new ChannelSubscription(subscriberEmail, channelName);
            repository.save(sub);
        }
    }

    @Transactional
    public void unsubscribe(String subscriberEmail, String channelName) {
        repository.deleteBySubscriberEmailAndChannelName(subscriberEmail, channelName);
    }

    public long countSubscribers(String channelName) {
        return repository.countByChannelName(channelName);
    }
}
