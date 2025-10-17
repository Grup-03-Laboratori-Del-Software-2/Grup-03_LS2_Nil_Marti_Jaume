package com.tecnocampus.LS2.protube_back.application.mapper.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.domain.user.User;

import java.util.stream.Collectors;


public class UserMapper {
    public static UserDTO userToUserDTO(User u){
        return new UserDTO(
                u.getName(),
                u.getSurname(),
                u.getEmail(),
                u.getDateOfBirth(),
                u.getDateOfRegistration(),
                u.getRoles()
        );
    }
}