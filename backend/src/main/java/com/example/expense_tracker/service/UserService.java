package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.auth.AuthResponse;
import com.example.expense_tracker.dto.auth.LoginRequest;
import com.example.expense_tracker.dto.auth.RegisterRequest;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.BadRequestException;
import com.example.expense_tracker.exception.UnauthorizedException;
import com.example.expense_tracker.repository.UserRepository;
import com.example.expense_tracker.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {

            throw new BadRequestException(
                    "An account with this email already exists");
        }

        User user = new User();

        user.setUsername(
                request.getUsername().trim());

        user.setEmail(email);

        // Hash password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        User savedUser = userRepository.save(user);

        // Generate JWT
        String token = jwtService.generateToken(
                savedUser.getEmail());

        return new AuthResponse(
                token,
                savedUser.getUserId(),
                savedUser.getUsername(),
                savedUser.getEmail());
    }

    // =========================
    // LOGIN
    // =========================

    public AuthResponse loginUser(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException(
                        "Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new UnauthorizedException(
                    "Invalid email or password");
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getEmail());

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getUsername(),
                user.getEmail());
    }
}