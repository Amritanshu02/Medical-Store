package com.example.Medical.Store.Backend.Entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "medical_stores")
public class MedicalStore {

    @Id
    private String id;
    private String name;
    private String address;

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public byte[] getStoreImage() {
        return storeImage;
    }

    public void setStoreImage(byte[] storeImage) {
        this.storeImage = storeImage;
    }

    public String getStoreImageType() {
        return storeImageType;
    }

    public void setStoreImageType(String storeImageType) {
        this.storeImageType = storeImageType;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    private String pincode;
    private String phone;
    private String email;
    private boolean isActive;
    private byte[] storeImage;
    private String storeImageType;
    
    @DBRef
    private User owner; // Store owner (User with role STORE_OWNER)

    // Helper method to get integer ID for backward compatibility
    public int getIdAsInt() {
        try {
            return Integer.parseInt(id);
        } catch (Exception e) {
            return 0;
        }
    }
}
