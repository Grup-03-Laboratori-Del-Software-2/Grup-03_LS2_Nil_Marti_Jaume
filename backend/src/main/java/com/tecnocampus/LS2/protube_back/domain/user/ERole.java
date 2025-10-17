package com.tecnocampus.LS2.protube_back.domain.user;

import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;

public enum ERole {
    FREE(0),
    PREMIUM(1),
    ADMIN(2);

    private final int id;

    private ERole(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static ERole getEnum(int id) {
        for (ERole eRole : ERole.values()) {
            if (eRole.getId() == id) {
                return eRole;
            }
        }
        return null;
    }

    public static ERole parseRole(String roleName) throws NotFoundException {
        try {
            return ERole.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new NotFoundException("Invalid role name: " + roleName);
        }
    }
}
