package com.tecnocampus.groupprojectinformaticawithjoseplogsboats.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends Exception {
    public NotFoundException() {
        super("Item not found in the repository");
    }

    public NotFoundException(String msg) {
        super(msg);
    }
}
