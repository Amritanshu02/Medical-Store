package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.DTOs.AuthResponseDTO;
import com.example.Medical.Store.Backend.DTOs.LoginDTO;
import com.example.Medical.Store.Backend.DTOs.RegisterDTO;
import com.example.Medical.Store.Backend.Entities.MedicalStore;
import com.example.Medical.Store.Backend.Entities.User;
import com.example.Medical.Store.Backend.Repo.MedicalStoreRepo;
import com.example.Medical.Store.Backend.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MedicalStoreRepo medicalStoreRepo;

    // Helper method to convert String ID to int (for backward compatibility)
    private int stringIdToInt(String id) {
        if (id == null) return 0;
        try {
            // Use hash code of the string ID
            return Math.abs(id.hashCode());
        } catch (Exception e) {
            return 0;
        }
    }

    public AuthResponseDTO register(RegisterDTO registerDTO) {
        // Check if email already exists
        if (userRepo.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();
        user.setName(registerDTO.getName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(registerDTO.getPassword()); // In production, hash this password
        user.setRole(registerDTO.getRole());
        user.setAddress(registerDTO.getAddress());

        User savedUser = userRepo.save(user);

        // If store owner, create store
        String storeId = null;
        if ("STORE_OWNER".equals(registerDTO.getRole())) {
            MedicalStore store = new MedicalStore();
            store.setName(registerDTO.getStoreName());
            store.setAddress(registerDTO.getStoreAddress());
            store.setPincode(registerDTO.getStorePincode());
            store.setPhone(registerDTO.getStorePhone());
            store.setEmail(registerDTO.getStoreEmail() != null ? registerDTO.getStoreEmail() : registerDTO.getEmail());
            store.setActive(true);
            store.setOwner(savedUser);

            MedicalStore savedStore = medicalStoreRepo.save(store);
            storeId = savedStore.getId();

            // Link store back to user
            savedUser.setMedicalStore(savedStore);
            userRepo.save(savedUser);
        }

        // Create response
        AuthResponseDTO response = new AuthResponseDTO();
//        response.setUserId(stringIdToInt(savedUser.getId()));
        response.setUserId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        response.setToken(UUID.randomUUID().toString()); // Simple token for now
        response.setStoreId(storeId != null ? stringIdToInt(storeId) : 0);

        return response;
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepo.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Simple password check (in production, use password hashing)
        if (!user.getPassword().equals(loginDTO.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Get store ID if store owner
        int storeId = 0;
        if ("STORE_OWNER".equals(user.getRole()) && user.getMedicalStore() != null) {
            storeId = stringIdToInt(user.getMedicalStore().getId());
        }

        // Create response
        AuthResponseDTO response = new AuthResponseDTO();
//        response.setUserId(stringIdToInt(user.getId()));
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken(UUID.randomUUID().toString());
        response.setStoreId(storeId);

        return response;
    }

    public User getUserById(String userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Overloaded method for int ID (backward compatibility)
    public User getUserById(int userId) {
        // Find user by converting int back to possible string IDs
        // This is a simplified approach - in production, you might want to store a mapping
        return userRepo.findAll().stream()
                .filter(u -> stringIdToInt(u.getId()) == userId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
