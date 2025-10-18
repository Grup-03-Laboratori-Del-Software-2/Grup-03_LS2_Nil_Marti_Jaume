package com.tecnocampus.LS2.protube_back.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ElementNotFoundInBBDD extends RuntimeException{
    public ElementNotFoundInBBDD(String message) {
        super(message + " not found in BBDD");
    }
}
