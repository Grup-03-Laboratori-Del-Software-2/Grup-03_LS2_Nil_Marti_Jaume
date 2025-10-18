package com.tecnocampus.LS2.protube_back.application.service.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.mapper.user.UserMapper;
import com.tecnocampus.LS2.protube_back.domain.user.ERole;
import com.tecnocampus.LS2.protube_back.domain.user.Role;
import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.persistance.user.RoleRepository;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder encoder){
        this.userRepo = userRepo; this.roleRepo = roleRepo; this.encoder = encoder;
    }

    public UserDTO register(UserCreate in){
        if (userRepo.existsByEmail(in.email()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ya registrado");

        User u = new User(
                in.name(), in.surname(), in.email(),
                encoder.encode(in.password()),
                in.dateOfBirth(),
                LocalDateTime.now()
        );

        // Rol FREE por defecto
        Role free = roleRepo.findByName(ERole.FREE);
        if (free == null) free = roleRepo.save(new Role(ERole.FREE));
        u.addRole(free);

        userRepo.save(u);
        return UserMapper.toDto(u);
    }
}
