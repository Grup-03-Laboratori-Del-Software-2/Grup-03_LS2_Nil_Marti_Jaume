package com.tecnocampus.LS2.protube_back.api.frontendException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class ErrorValidationHandlingAdvice {

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ValidationErrorResponse onConstraintValidationException(ConstraintViolationException e) {
        ValidationErrorResponse error = new ValidationErrorResponse();
        for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
            error.getViolations().add(new Violation(
                    violation.getPropertyPath().toString(),
                    violation.getMessage()
            ));
        }
        return error;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ValidationErrorResponse onMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        ValidationErrorResponse error = new ValidationErrorResponse();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            error.getViolations().add(new Violation(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
            ));
        }
        return error;
    }

    public class ValidationErrorResponse {
        private final List<Violation> violations = new ArrayList<>();
        public List<Violation> getViolations() { return violations; }
    }

    public class Violation {
        private final String fieldName;
        private final String message;
        public Violation(String fieldName, String message) {
            this.fieldName = fieldName;
            this.message = message;
        }
        public String getFieldName() { return fieldName; }
        public String getMessage() { return message; }
    }
}
