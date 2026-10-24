package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.DTOs.CsvUploadResultDTO;
import com.example.Medical.Store.Backend.Entities.Medicine;
import com.example.Medical.Store.Backend.Service.MedicineService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MedicineControllerTest {

    @Test
    void getAllProductsReturnsMedicines() {
        MedicineService service = mock(MedicineService.class);
        MedicineController controller = new MedicineController();
        setService(controller, service);

        Medicine medicine = new Medicine();
        medicine.setName("Pan 40");
        when(service.getAllMedicines()).thenReturn(List.of(medicine));

        ResponseEntity<List<Medicine>> response = controller.getAllProducts();
        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void uploadCsvRejectsEmptyFile() {
        MedicineController controller = new MedicineController();
        MockMultipartFile empty = new MockMultipartFile("file", "medicines.csv", "text/csv", new byte[0]);
        ResponseEntity<?> response = controller.uploadMedicinesCsv(empty);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void uploadCsvRejectsNonCsv() {
        MedicineController controller = new MedicineController();
        MockMultipartFile file = new MockMultipartFile("file", "medicines.txt", "text/plain", "hello".getBytes());
        ResponseEntity<?> response = controller.uploadMedicinesCsv(file);
        assertEquals(400, response.getStatusCode().value());
        assertEquals("Only .csv files are supported", response.getBody());
    }

    @Test
    void uploadCsvReturnsServiceResult() throws Exception {
        MedicineService service = mock(MedicineService.class);
        MedicineController controller = new MedicineController();
        setService(controller, service);

        CsvUploadResultDTO result = new CsvUploadResultDTO();
        result.setCreated(2);
        when(service.uploadMedicinesFromCsv(any())).thenReturn(result);

        MockMultipartFile file = new MockMultipartFile(
                "file", "medicines.csv", "text/csv", "name,brand,price\nA,B,1\n".getBytes()
        );
        ResponseEntity<?> response = controller.uploadMedicinesCsv(file);
        assertEquals(200, response.getStatusCode().value());
        CsvUploadResultDTO body = (CsvUploadResultDTO) response.getBody();
        assertEquals(2, body.getCreated());
        assertTrue(body.getExpectedColumns().contains("name"));
    }

    @Test
    void csvTemplateIsDownloadable() {
        MedicineController controller = new MedicineController();
        ResponseEntity<byte[]> response = controller.downloadCsvTemplate();
        assertEquals(200, response.getStatusCode().value());
        String body = new String(response.getBody());
        assertTrue(body.startsWith("name,brand,composition"));
    }

    private void setService(MedicineController controller, MedicineService service) {
        try {
            var field = MedicineController.class.getDeclaredField("service");
            field.setAccessible(true);
            field.set(controller, service);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
