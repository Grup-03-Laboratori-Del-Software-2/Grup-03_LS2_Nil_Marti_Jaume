package com.tecnocampus.LS2.protube_back.security.authentication;

import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository repo;
    public CustomUserDetailsService(UserRepository repo) { this.repo = repo; }
    @Override public UserDetails loadUserByUsername(String username) {
        var u = repo.findByEmail(username).orElseThrow();
        return new CustomUserDetails(u);
    }
}
