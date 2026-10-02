package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.Entities.Medicine;
import com.example.Medical.Store.Backend.Service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}
