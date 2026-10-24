package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.DTOs.AuthResponseDTO;
import com.example.Medical.Store.Backend.DTOs.LoginDTO;
import com.example.Medical.Store.Backend.DTOs.RegisterDTO;
import com.example.Medical.Store.Backend.Entities.User;
import com.example.Medical.Store.Backend.Repo.MedicalStoreRepo;
import com.example.Medical.Store.Backend.Repo.UserRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private MedicalStoreRepo medicalStoreRepo;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerCustomerSucceeds() {
        RegisterDTO dto = new RegisterDTO();
        dto.setName("Asha");
        dto.setEmail("asha@example.com");
        dto.setPassword("secret");
        dto.setRole("CUSTOMER");

        when(userRepo.findByEmail("asha@example.com")).thenReturn(Optional.empty());
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId("user-1");
            return user;
        });

        AuthResponseDTO response = authService.register(dto);

        assertEquals("user-1", response.getUserId());
        assertEquals("CUSTOMER", response.getRole());
        assertEquals("asha@example.com", response.getEmail());
        verify(medicalStoreRepo, never()).save(any());
    }

    @Test
    void registerRejectsDuplicateEmail() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("taken@example.com");
        when(userRepo.findByEmail("taken@example.com")).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.register(dto));
        assertEquals("Email already registered", exception.getMessage());
    }

    @Test
    void loginSucceedsWithMatchingPassword() {
        User user = new User();
        user.setId("user-2");
        user.setName("Ravi");
        user.setEmail("ravi@example.com");
        user.setPassword("pass123");
        user.setRole("CUSTOMER");
        when(userRepo.findByEmail("ravi@example.com")).thenReturn(Optional.of(user));

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("ravi@example.com");
        loginDTO.setPassword("pass123");

        AuthResponseDTO response = authService.login(loginDTO);

        assertEquals("user-2", response.getUserId());
        assertEquals("Ravi", response.getName());
    }

    @Test
    void loginFailsWithWrongPassword() {
        User user = new User();
        user.setEmail("ravi@example.com");
        user.setPassword("pass123");
        when(userRepo.findByEmail("ravi@example.com")).thenReturn(Optional.of(user));

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("ravi@example.com");
        loginDTO.setPassword("wrong");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
        assertEquals("Invalid email or password", exception.getMessage());
    }
}
