package com.tecnocampus.groupprojectinformaticawithjoseplogsboats.security.authentication;

import com.tecnocampus.groupprojectinformaticawithjoseplogsboats.domain.user.User;
import com.tecnocampus.groupprojectinformaticawithjoseplogsboats.persistance.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.getUser(email);
        if(user == null) throw new UsernameNotFoundException("User with email " + email+ " not found");
        return new CustomUserDetails(user);
    }
}
