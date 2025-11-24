package com.tecnocampus.LS2.protube_back.api.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.ChangePasswordRequest;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserUpdateRequest;
import com.tecnocampus.LS2.protube_back.application.service.user.UserService;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid UserCreate body) {
        var dto = userService.register(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Principal principal) throws NotFoundException {
        var dto = userService.getByEmail(principal.getName());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(@RequestBody @Valid UserUpdateRequest body,
                                            Principal principal) throws NotFoundException {
        var dto = userService.updateProfile(principal.getName(), body);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordRequest body,
                                               Principal principal) throws NotFoundException {
        userService.changePassword(principal.getName(), body);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadAvatar(@RequestPart("avatar") MultipartFile avatar,
                                                Principal principal) throws NotFoundException, IOException {
        var dto = userService.updateAvatar(principal.getName(), avatar);
        return ResponseEntity.ok(dto);
    }
}
