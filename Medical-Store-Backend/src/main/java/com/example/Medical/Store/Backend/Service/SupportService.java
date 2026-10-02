package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.DTOs.ContactFormDTO;
import com.example.Medical.Store.Backend.Entities.MedicalStore;
import com.example.Medical.Store.Backend.Repo.MedicalStoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Value;
import java.util.Optional;

@Service
public class SupportService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MedicalStoreRepo medicalStoreRepo;

    @Value("${app.support.email:support@arcmedical.com}")
    private String supportEmail;

    public void sendContactEmail(ContactFormDTO contactForm) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(supportEmail);
            message.setSubject("Customer Query: " + contactForm.getSubject());
            
            StringBuilder emailBody = new StringBuilder();
            emailBody.append("New customer query received:\n\n");
            emailBody.append("Name: ").append(contactForm.getName()).append("\n");
            emailBody.append("Email: ").append(contactForm.getEmail()).append("\n");
            if (contactForm.getPhone() != null && !contactForm.getPhone().isEmpty()) {
                emailBody.append("Phone: ").append(contactForm.getPhone()).append("\n");
            }
            emailBody.append("Subject: ").append(contactForm.getSubject()).append("\n\n");
            emailBody.append("Message:\n").append(contactForm.getMessage()).append("\n");
            
            message.setText(emailBody.toString());
            mailSender.send(message);

            // Send confirmation to customer
            SimpleMailMessage confirmation = new SimpleMailMessage();
            confirmation.setTo(contactForm.getEmail());
            confirmation.setSubject("We received your query - ARCEE Medicals");
            confirmation.setText("Dear " + contactForm.getName() + ",\n\n" +
                    "Thank you for contacting us. We have received your query and will get back to you within 24 hours.\n\n" +
                    "Your Query Subject: " + contactForm.getSubject() + "\n\n" +
                    "If you have any urgent concerns, please call us at +91-XXX-XXX-XXXX\n\n" +
                    "Best regards,\nARCEE Medicals Support Team");
            mailSender.send(confirmation);

        } catch (Exception e) {
            System.err.println("Failed to send contact email: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendPrescriptionToStore(String storeId, String patientName, String patientPhone,
                                       String patientEmail, String deliveryAddress,
                                       byte[] prescriptionData, String fileName, String fileType) {
        try {
            Optional<MedicalStore> storeOpt = medicalStoreRepo.findById(storeId);
            if (!storeOpt.isPresent()) {
                throw new RuntimeException("Store not found");
            }

            MedicalStore store = storeOpt.get();
            String storeEmail = store.getEmail() != null ? store.getEmail() : supportEmail;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(storeEmail);
            helper.setSubject("New Prescription Upload - " + patientName);

            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(store.getName()).append(",\n\n");
            emailBody.append("You have received a new prescription upload:\n\n");
            emailBody.append("Patient Details:\n");
            emailBody.append("Name: ").append(patientName).append("\n");
            emailBody.append("Phone: ").append(patientPhone).append("\n");
            emailBody.append("Email: ").append(patientEmail).append("\n\n");
            emailBody.append("Delivery Address:\n");
            emailBody.append(deliveryAddress).append("\n\n");
            emailBody.append("Please review the attached prescription and contact the patient to confirm the medicines and pricing.\n\n");
            emailBody.append("Thank you!");

            helper.setText(emailBody.toString());

            // Attach prescription file
            ByteArrayDataSource dataSource = new ByteArrayDataSource(prescriptionData, fileType);
            helper.addAttachment(fileName, dataSource);

            mailSender.send(message);

            // Send confirmation to patient
            SimpleMailMessage confirmation = new SimpleMailMessage();
            confirmation.setTo(patientEmail);
            confirmation.setSubject("Prescription Received - ARCEE Medicals");
            confirmation.setText("Dear " + patientName + ",\n\n" +
                    "We have received your prescription and forwarded it to " + store.getName() + ".\n\n" +
                    "The store will review your prescription and contact you shortly to confirm:\n" +
                    "- Available medicines\n" +
                    "- Pricing\n" +
                    "- Delivery timeline\n\n" +
                    "Store Details:\n" +
                    "Name: " + store.getName() + "\n" +
                    "Phone: " + store.getPhone() + "\n\n" +
                    "If you have any questions, please contact the store directly or our support team.\n\n" +
                    "Best regards,\nARCEE Medicals");
            mailSender.send(confirmation);

        } catch (Exception e) {
            System.err.println("Failed to send prescription email: " + e.getMessage());
            throw new RuntimeException("Failed to send prescription", e);
        }
    }
}
