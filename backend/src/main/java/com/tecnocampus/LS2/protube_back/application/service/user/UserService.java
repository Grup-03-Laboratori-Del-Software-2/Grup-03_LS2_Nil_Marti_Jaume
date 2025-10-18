package com.tecnocampus.LS2.protube_back.application.service.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.mapper.user.UserMapper;
import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO register(UserCreate body) {
        if (userRepo.existsByEmail(body.email())) {
            throw new IllegalArgumentException("Email already in use");
        }
        var hashed = passwordEncoder.encode(body.password());
        var user = new User(
                body.name(),
                body.surname(),
                body.email(),
                body.dateOfBirth(),
                hashed,
                LocalDateTime.now(),
                Set.of("ROLE_USER")
        );
        userRepo.save(user);
        return UserMapper.userToUserDTO(user);
    }

    public void validate(String email, String rawPassword) throws NotFoundException {
        var user = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
    }

    public UserDTO getByEmail(String email) throws NotFoundException {
        var user = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
        return UserMapper.userToUserDTO(user);
    }
}
