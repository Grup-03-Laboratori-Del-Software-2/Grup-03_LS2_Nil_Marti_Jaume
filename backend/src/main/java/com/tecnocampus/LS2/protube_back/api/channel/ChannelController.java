package com.tecnocampus.LS2.protube_back.api.channel;

import com.tecnocampus.LS2.protube_back.application.service.user.ChannelSubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelSubscriptionService subscriptionService;

    public ChannelController(ChannelSubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{channelName}/subscription")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getSubscription(@PathVariable String channelName, Principal principal) {
        String email = principal.getName();
        boolean subscribed = subscriptionService.isSubscribed(email, channelName);
        long count = subscriptionService.countSubscribers(channelName);
        return ResponseEntity.ok(Map.of(
                "subscribed", subscribed,
                "subscribers", count
        ));
    }

    @PostMapping("/{channelName}/subscription")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> subscribe(@PathVariable String channelName, Principal principal) {
        String email = principal.getName();
        subscriptionService.subscribe(email, channelName);
        long count = subscriptionService.countSubscribers(channelName);
        return ResponseEntity.ok(Map.of(
                "subscribed", true,
                "subscribers", count
        ));
    }

    @DeleteMapping("/{channelName}/subscription")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> unsubscribe(@PathVariable String channelName, Principal principal) {
        String email = principal.getName();
        subscriptionService.unsubscribe(email, channelName);
        long count = subscriptionService.countSubscribers(channelName);
        return ResponseEntity.ok(Map.of(
                "subscribed", false,
                "subscribers", count
        ));
    }
}
