package org.example.spring_react_postg.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex, WebRequest request) {
        String errorId = UUID.randomUUID().toString();
        logger.error("Error ID {} - Exception occurred: {}", errorId, ex.getMessage(), ex);

        Map<String, Object> body = new HashMap<>();
        body.put("errorId", errorId);
        body.put("message", "Сталася неочікувана помилка. Будь ласка, зверніться до підтримки.");
        body.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}