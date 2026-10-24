package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.DTOs.CsvUploadResultDTO;
import com.example.Medical.Store.Backend.Entities.Medicine;
import com.example.Medical.Store.Backend.Service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/")
public class MedicineController {

    @Autowired
    private MedicineService service;

    @RequestMapping("/medicines")
    public ResponseEntity<List<Medicine>> getAllProducts() {
        return new ResponseEntity<>(service.getAllMedicines(), HttpStatus.OK);
    }

    @RequestMapping("/medicine/{medId}")
    public ResponseEntity<Medicine> getProduct(@PathVariable String medId) {
        Medicine medicine = service.getMedicine(medId);

        if (medicine != null)
            return new ResponseEntity<>(medicine, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/medicine")
    public ResponseEntity<?> addProduct(@RequestPart Medicine medicine,
                                        @RequestPart MultipartFile imageFile) {
        try {
            Medicine medicine1 = service.addMedicine(medicine, imageFile);
            return new ResponseEntity<>(medicine1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{medicineId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable String medicineId) {
        Medicine medicine = service.getMedicineById(medicineId);
        if (medicine == null || medicine.getImageData() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        byte[] imageFile = medicine.getImageData();

        return ResponseEntity.ok().contentType(MediaType.valueOf(medicine.getImageType()))
                .body(imageFile);
    }

    @GetMapping("/medicines/csv-template")
    public ResponseEntity<byte[]> downloadCsvTemplate() {
        String template = "name,brand,composition,description,price,available,substitutes\n"
                + "Dolo 650,Micro Labs,Paracetamol 650mg,Used for fever and mild pain,30.00,true,\"Crocin 650, Calpol 650\"\n"
                + "Azithral 500,Alembic,Azithromycin 500mg,Antibiotic for bacterial infections,119.00,false,\"Azithro 500, Azee 500\"\n";
        byte[] bytes = template.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medicine-template.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @PostMapping(value = "/medicines/upload-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMedicinesCsv(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new ResponseEntity<>("CSV file is required", HttpStatus.BAD_REQUEST);
        }
        String filename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (!filename.endsWith(".csv")) {
            return new ResponseEntity<>("Only .csv files are supported", HttpStatus.BAD_REQUEST);
        }
        try {
            CsvUploadResultDTO result = service.uploadMedicinesFromCsv(file.getInputStream());
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
