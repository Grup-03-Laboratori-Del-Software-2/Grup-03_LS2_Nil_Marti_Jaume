package com.tecnocampus.LS2.protube_back.domain.user;

public enum ERole { FREE, PREMIUM, ADMIN;
    public static ERole parseRole(String r){
        try { return ERole.valueOf(r.toUpperCase()); }
        catch(Exception e){ throw new IllegalArgumentException("Invalid role name: " + r); }
    }
}
