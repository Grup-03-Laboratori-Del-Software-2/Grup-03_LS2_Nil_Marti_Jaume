package com.tecnocampus.LS2.protube_back.api.channel;

import com.tecnocampus.LS2.protube_back.application.service.user.ChannelSubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ChannelControllerTest {

    private ChannelSubscriptionService subscriptionService;
    private ChannelController controller;

    @BeforeEach
    void setUp() {
        subscriptionService = mock(ChannelSubscriptionService.class);
        controller = new ChannelController(subscriptionService);
    }

    private Principal principal(String email) {
        return () -> email;
    }

    @Test
    void getSubscription_returnsSubscribedAndCount() {
        String email = "sub.user@protube.dev";
        String channel = "channelUser";

        when(subscriptionService.isSubscribed(email, channel)).thenReturn(true);
        when(subscriptionService.countSubscribers(channel)).thenReturn(5L);

        ResponseEntity<Map<String, Object>> response =
                controller.getSubscription(channel, principal(email));

        assertEquals(200, response.getStatusCode().value());
        Map<String, Object> body = response.getBody();
        assertEquals(true, body.get("subscribed"));
        assertEquals(5L, body.get("subscribers"));

        verify(subscriptionService, times(1)).isSubscribed(email, channel);
        verify(subscriptionService, times(1)).countSubscribers(channel);
    }

    @Test
    void subscribe_callsServiceAndReturnsSubscribedTrue() {
        String email = "sub.user@protube.dev";
        String channel = "channelUser";

        when(subscriptionService.countSubscribers(channel)).thenReturn(10L);

        ResponseEntity<Map<String, Object>> response =
                controller.subscribe(channel, principal(email));

        assertEquals(200, response.getStatusCode().value());
        Map<String, Object> body = response.getBody();
        assertEquals(true, body.get("subscribed"));
        assertEquals(10L, body.get("subscribers"));

        verify(subscriptionService, times(1)).subscribe(email, channel);
        verify(subscriptionService, times(1)).countSubscribers(channel);
    }

    @Test
    void unsubscribe_callsServiceAndReturnsSubscribedFalse() {
        String email = "sub.user@protube.dev";
        String channel = "channelUser";

        when(subscriptionService.countSubscribers(channel)).thenReturn(3L);

        ResponseEntity<Map<String, Object>> response =
                controller.unsubscribe(channel, principal(email));

        assertEquals(200, response.getStatusCode().value());
        Map<String, Object> body = response.getBody();
        assertEquals(false, body.get("subscribed"));
        assertEquals(3L, body.get("subscribers"));

        verify(subscriptionService, times(1)).unsubscribe(email, channel);
        verify(subscriptionService, times(1)).countSubscribers(channel);
    }
}