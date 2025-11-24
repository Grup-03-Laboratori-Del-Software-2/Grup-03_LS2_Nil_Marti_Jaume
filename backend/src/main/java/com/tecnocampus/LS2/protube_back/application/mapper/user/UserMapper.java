package com.tecnocampus.LS2.protube_back.application.mapper.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.domain.user.User;

import java.nio.file.Path;

public class UserMapper {

    private static String toPublicUrl(String absolutePath) {
        if (absolutePath == null || absolutePath.isBlank()) return null;
        String fileName = Path.of(absolutePath).getFileName().toString();
        return "/media/" + fileName;
    }

    public static UserDTO userToUserDTO(User u) {
        return new UserDTO(
                u.getName(),
                u.getSurname(),
                u.getEmail(),
                u.getDateOfBirth(),
                u.getDateOfRegistration(),
                toPublicUrl(u.getAvatarPath())
        );
    }
}
