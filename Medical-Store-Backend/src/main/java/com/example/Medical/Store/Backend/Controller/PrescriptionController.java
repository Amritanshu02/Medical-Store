package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.Service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
@RequestMapping("/prescription")
public class PrescriptionController {

    @Autowired
    private SupportService supportService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPrescription(
            @RequestParam("prescriptionFile") MultipartFile file,
            @RequestParam("storeId") String storeId,
            @RequestParam("patientName") String patientName,
            @RequestParam("patientPhone") String patientPhone,
            @RequestParam("patientEmail") String patientEmail,
            @RequestParam("deliveryAddress") String deliveryAddress,
            @RequestParam(value = "userId", required = false) String userId) {
        
        try {
            if (file.isEmpty()) {
                return new ResponseEntity<>("Please upload a prescription file", HttpStatus.BAD_REQUEST);
            }

            byte[] fileData = file.getBytes();
            String fileName = file.getOriginalFilename();
            String fileType = file.getContentType();

            supportService.sendPrescriptionToStore(
                    storeId,
                    patientName,
                    patientPhone,
                    patientEmail,
                    deliveryAddress,
                    fileData,
                    fileName,
                    fileType
            );

            return new ResponseEntity<>("Prescription uploaded successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error uploading prescription: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
