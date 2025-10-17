package com.tecnocampus.LS2.protube_back.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_ACCEPTABLE)
public class ActionDeniedException extends Exception {
    public ActionDeniedException() {
        super("This action is not allowed");
    }

    public ActionDeniedException(String msg) {
        super(msg);
    }
}
