package com.example.Medical.Store.Backend.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "store_medicines")
public class StoreMedicine {

    @Id
    private String id;

    @DBRef
    private MedicalStore store;

    @DBRef
    private Medicine medicine;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public MedicalStore getStore() {
        return store;
    }

    public void setStore(MedicalStore store) {
        this.store = store;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public double getStorePrice() {
        return storePrice;
    }

    public void setStorePrice(double storePrice) {
        this.storePrice = storePrice;
    }

    private boolean available; // Whether this medicine is available in this store
    private double storePrice; // Price at this specific store (can override global price)

    // Helper method to get integer ID for backward compatibility
    public int getIdAsInt() {
        try {
            return Integer.parseInt(id);
        } catch (Exception e) {
            return 0;
        }
    }
}
