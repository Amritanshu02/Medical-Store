package com.example.Medical.Store.Backend.DTOs;

public class OrderItemDTO {
//    private int medicineId;
private String medicineId;
    private String medicineName;
    private int quantity;
    private double price;

    public String getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(String medicineId) {
        this.medicineId = medicineId;
    }
// Getters and Setters
//    public int getMedicineId() {
//        return medicineId;
//    }
//
//    public void setMedicineId(int medicineId) {
//        this.medicineId = medicineId;
//    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
