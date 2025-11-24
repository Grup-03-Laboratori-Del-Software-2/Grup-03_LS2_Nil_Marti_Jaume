package com.tecnocampus.LS2.protube_back.application.service.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.ChangePasswordRequest;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserUpdateRequest;
import com.tecnocampus.LS2.protube_back.application.mapper.user.UserMapper;
import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Value("${pro-tube.store-dir:}")
    private String configuredStoreDir;

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

    /**
     * Actualiza el perfil (nombre, apellido, email y fecha de nacimiento).
     * Si cambia el email, recrea el usuario con el nuevo email.
     */
    @Transactional
    public UserDTO updateProfile(String currentEmail, UserUpdateRequest body) throws NotFoundException {
        var original = userRepo.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        String targetName = body.name() != null ? body.name() : original.getName();
        String targetSurname = body.surname() != null ? body.surname() : original.getSurname();
        var targetDob = body.dateOfBirth() != null ? body.dateOfBirth() : original.getDateOfBirth();

        String requestedEmail = body.email();
        String targetEmail = (requestedEmail != null && !requestedEmail.isBlank())
                ? requestedEmail
                : original.getEmail();

        if (!targetEmail.equalsIgnoreCase(original.getEmail()) && userRepo.existsByEmail(targetEmail)) {
            throw new IllegalArgumentException("Email already in use");
        }

        var rolesCopy = Set.copyOf(original.getRoles());

        User updated = new User(
                targetName,
                targetSurname,
                targetEmail,
                targetDob,
                original.getPasswordHash(),
                original.getDateOfRegistration(),
                rolesCopy
        );
        updated.setAvatarPath(original.getAvatarPath());

        userRepo.delete(original);
        userRepo.save(updated);

        return UserMapper.userToUserDTO(updated);
    }

    /**
     * Cambia la contraseña del usuario autenticado.
     */
    @Transactional
    public void changePassword(String email, ChangePasswordRequest body) throws NotFoundException {
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(body.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String newHash = passwordEncoder.encode(body.newPassword());

        var rolesCopy = Set.copyOf(user.getRoles());

        User updated = new User(
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getDateOfBirth(),
                newHash,
                user.getDateOfRegistration(),
                rolesCopy
        );
        updated.setAvatarPath(user.getAvatarPath());

        userRepo.delete(user);
        userRepo.save(updated);
    }

    /**
     * Sube un avatar nuevo y lo asocia al usuario.
     */
    @Transactional
    public UserDTO updateAvatar(String email, MultipartFile avatarFile) throws NotFoundException, IOException {
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (configuredStoreDir == null || configuredStoreDir.isBlank()) {
            throw new IllegalStateException("Storage directory is not configured");
        }

        Path storePath = Paths.get(configuredStoreDir);
        Files.createDirectories(storePath);

        String originalName = avatarFile.getOriginalFilename();
        String extension = ".png";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.'));
        }

        String baseName = "avatar-" + UUID.randomUUID();
        Path target = storePath.resolve(baseName + extension);

        Files.copy(avatarFile.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        user.setAvatarPath(target.toString());
        userRepo.save(user);

        return UserMapper.userToUserDTO(user);
    }
}