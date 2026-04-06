package com.vertere.tasktracker.exception;

import com.vertere.tasktracker.exception.classes.TaskNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(TaskNotFound.class)
    public ResponseEntity<String> handleTaskNotFound(
            TaskNotFound e
    ){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
    }
}
