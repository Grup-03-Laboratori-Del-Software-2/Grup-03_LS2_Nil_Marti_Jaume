package com.tecnocampus.LS2.protube_back.application.mapper.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.domain.user.User;

public class UserMapper {
    public static UserDTO toDto(User u){
        return new UserDTO(u.getName(), u.getSurname(), u.getEmail(),
                u.getDateOfBirth(), u.getDateOfRegistration());
    }
}
