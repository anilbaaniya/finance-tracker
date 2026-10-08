package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.auth.AuthResponse;
import com.example.expense_tracker.dto.auth.LoginRequest;
import com.example.expense_tracker.dto.auth.RegisterRequest;
import com.example.expense_tracker.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = userService.registerUser(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = userService.loginUser(request);

        return ResponseEntity.ok(response);
    }
}