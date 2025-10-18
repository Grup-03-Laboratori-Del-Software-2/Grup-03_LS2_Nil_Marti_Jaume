package com.tecnocampus.LS2.protube_back.api.frontendException;

import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@ControllerAdvice
public class ExceptionHandlingAdvice {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    @ResponseBody
    ErrorMessage onNotFoundException(Exception ex) {
        return new ErrorMessage(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity<ErrorMessage> onIllegalArgumentException(IllegalArgumentException e) {
        HttpStatus status = "Email already in use".equals(e.getMessage())
                ? HttpStatus.CONFLICT
                : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(new ErrorMessage(e.getMessage()));
    }

    public class ErrorMessage {
        private final String message;
        public ErrorMessage(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
