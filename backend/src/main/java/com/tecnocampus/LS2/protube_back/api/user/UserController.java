package com.tecnocampus.LS2.protube_back.api.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.service.user.UserService;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserCreate body) {
        var dto = userService.register(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(java.security.Principal principal) throws NotFoundException {
        var dto = userService.getByEmail(principal.getName());
        return ResponseEntity.ok(dto);
    }
}
