package com.tecnocampus.LS2.protube_back.application.service.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.domain.user.ERole;
import com.tecnocampus.LS2.protube_back.domain.user.Role;
import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.persistance.user.RoleRepository;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepo;
    @Mock RoleRepository roleRepo;
    @Mock PasswordEncoder encoder;

    @InjectMocks UserService service;

    @Test
    void register_asigna_FREE_y_guarda() {
        var in = new UserCreate(
                "Jaume", "Anglada",
                "jangladag@edu.tecnocampus.cat",
                "Abc12345#",
                LocalDateTime.parse("2002-05-25T11:00:00")
        );

        when(userRepo.existsByEmail("jangladag@edu.tecnocampus.cat")).thenReturn(false);
        when(encoder.encode("Abc12345#")).thenReturn("ENC");
        when(roleRepo.findByName(ERole.FREE)).thenReturn(new Role(ERole.FREE));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);

        service.register(in);

        verify(userRepo).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("jangladag@edu.tecnocampus.cat", saved.getEmail());
        assertEquals("ENC", saved.getPassword());
        assertEquals(1, saved.getRoles().size()); // tiene FREE
    }
}
