package com.tecnocampus.groupprojectinformaticawithjoseplogsboats.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class AuthenticationTokenException extends Exception {
    public AuthenticationTokenException() {
        super("This action has been denied");
    }

    public AuthenticationTokenException(String msg) {
        super(msg);
    }
}
