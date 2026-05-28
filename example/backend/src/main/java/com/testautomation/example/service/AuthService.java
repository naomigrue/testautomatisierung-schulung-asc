package com.testautomation.example.service;

import com.testautomation.example.dto.AuthRequest;
import com.testautomation.example.dto.AuthResponse;
import com.testautomation.example.entity.User;
import com.testautomation.example.exception.DuplicateUsernameException;
import com.testautomation.example.exception.InvalidCredentialsException;
import com.testautomation.example.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse signup(AuthRequest request) {
        String username = request.username();
        if (userRepository.existsByUsername(username)) {
            log.warn("Signup rejected: username already exists [{}]", username);
            throw new DuplicateUsernameException();
        }
        User user = new User(username, passwordEncoder.encode(request.password()));
        userRepository.save(user);
        log.info("User signed up [{}]", username);
        return new AuthResponse(user.getUsername());
    }

    public AuthResponse signin(AuthRequest request) {
        String username = request.username();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("Signin failed: unknown username [{}]", username);
                    return new InvalidCredentialsException();
                });
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("Signin failed: invalid password [{}]", username);
            throw new InvalidCredentialsException();
        }
        log.info("User signed in [{}]", username);
        return new AuthResponse(user.getUsername());
    }
}
