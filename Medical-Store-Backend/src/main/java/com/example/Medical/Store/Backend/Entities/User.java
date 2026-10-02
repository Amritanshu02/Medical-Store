package com.example.Medical.Store.Backend.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // "CUSTOMER" or "STORE_OWNER"
    private String address; // Default address for customers
    
    @DBRef
    @JsonIgnore
    private MedicalStore medicalStore; // Link to store if store owner

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public MedicalStore getMedicalStore() {
        return medicalStore;
    }

    public void setMedicalStore(MedicalStore medicalStore) {
        this.medicalStore = medicalStore;
    }

    // Helper method to get integer ID for backward compatibility
    public int getIdAsInt() {
        try {
            return Integer.parseInt(id);
        } catch (Exception e) {
            return 0;
        }
    }
}
