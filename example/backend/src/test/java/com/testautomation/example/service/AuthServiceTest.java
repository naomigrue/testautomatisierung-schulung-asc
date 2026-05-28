package com.testautomation.example.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.testautomation.example.dto.AuthRequest;
import com.testautomation.example.dto.AuthResponse;
import com.testautomation.example.entity.User;
import com.testautomation.example.exception.DuplicateUsernameException;
import com.testautomation.example.exception.InvalidCredentialsException;
import com.testautomation.example.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private AuthRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new AuthRequest("testuser", "password123");
    }

    @Test
    void signup_createsUserAndReturnsUsername() {
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.signup(validRequest);

        assertThat(response.username()).isEqualTo("testuser");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signup_throwsWhenUsernameExists() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(validRequest))
                .isInstanceOf(DuplicateUsernameException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void signin_returnsUsernameForValidCredentials() {
        User user = new User("testuser", "hashed");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);

        AuthResponse response = authService.signin(validRequest);

        assertThat(response.username()).isEqualTo("testuser");
    }

    @Test
    void signin_throwsWhenUserNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.signin(validRequest))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void signin_throwsWhenPasswordDoesNotMatch() {
        User user = new User("testuser", "hashed");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.signin(validRequest))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
