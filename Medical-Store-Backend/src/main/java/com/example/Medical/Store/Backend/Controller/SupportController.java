package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.DTOs.ContactFormDTO;
import com.example.Medical.Store.Backend.Service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/support")
public class SupportController {

    @Autowired
    private SupportService supportService;

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@RequestBody ContactFormDTO contactForm) {
        try {
            supportService.sendContactEmail(contactForm);
            return new ResponseEntity<>("Query submitted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error submitting query: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
