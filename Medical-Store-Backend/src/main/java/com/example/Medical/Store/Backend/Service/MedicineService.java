package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.DTOs.CsvUploadResultDTO;
import com.example.Medical.Store.Backend.Entities.Medicine;
import com.example.Medical.Store.Backend.Repo.MedicineRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepo medicineRepo;

    // Helper method to convert String ID to int (for backward compatibility)
    private int stringIdToInt(String id) {
        if (id == null) return 0;
        try {
            return Math.abs(id.hashCode());
        } catch (Exception e) {
            return 0;
        }
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepo.findAll();
    }

    public Medicine getMedicine(String medId) {
        // Find medicine by converting int to possible string IDs
//        return medicineRepo.findAll().stream()
//                .filter(m -> stringIdToInt(m.getId()) == medId)
//                .findFirst()
//                .orElse(null);
        return medicineRepo.findById(medId).orElse(null);
    }

    public Medicine getMedicineById(String medicineId) {
        Optional<Medicine> medicine = medicineRepo.findById(medicineId);
        return medicine.orElse(null);
    }

    // Overloaded for int ID
//    public Medicine getMedicineById(String medicineId) {
//        return getMedicine(medicineId);
//    }

    public Medicine addMedicine(Medicine medicine, MultipartFile imageFile) {
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                medicine.setImageData(imageFile.getBytes());
                medicine.setImageType(imageFile.getContentType());
                medicine.setImageName(imageFile.getOriginalFilename());
            }
            return medicineRepo.save(medicine);
        } catch (Exception e) {
            throw new RuntimeException("Error adding medicine: " + e.getMessage());
        }
    }

    public CsvUploadResultDTO uploadMedicinesFromCsv(InputStream inputStream) {
        CsvUploadResultDTO result = new CsvUploadResultDTO();
        try {
            MedicineCsvParser.ParseResult parsed = new MedicineCsvParser().parse(inputStream);
            result.getErrors().addAll(parsed.getErrors());

            for (Medicine incoming : parsed.getMedicines()) {
                Optional<Medicine> existing = medicineRepo.findByNameIgnoreCaseAndBrandIgnoreCase(
                        incoming.getName(), incoming.getBrand()
                );
                if (existing.isPresent()) {
                    Medicine current = existing.get();
                    current.setComposition(incoming.getComposition());
                    current.setDescription(incoming.getDescription());
                    current.setPrice(incoming.getPrice());
                    current.setAvailable(incoming.isAvailable());
                    current.setSubstitutes(incoming.getSubstitutes());
                    medicineRepo.save(current);
                    result.incrementUpdated();
                } else {
                    medicineRepo.save(incoming);
                    result.incrementCreated();
                }
            }
            result.setSkipped(parsed.getErrors().size());
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error uploading medicines CSV: " + e.getMessage());
        }
    }
}
