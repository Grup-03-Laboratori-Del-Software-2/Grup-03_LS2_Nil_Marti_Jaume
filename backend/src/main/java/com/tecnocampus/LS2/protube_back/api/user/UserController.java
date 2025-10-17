package com.tecnocampus.LS2.protube_back.api.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserCreate;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService){ this.userService = userService; }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO register(@RequestBody @Valid UserCreate body){
        return userService.register(body);
    }
}
