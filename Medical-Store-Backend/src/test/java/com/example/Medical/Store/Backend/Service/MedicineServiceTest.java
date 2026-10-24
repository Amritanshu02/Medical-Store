package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.DTOs.CsvUploadResultDTO;
import com.example.Medical.Store.Backend.Entities.Medicine;
import com.example.Medical.Store.Backend.Repo.MedicineRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicineServiceTest {

    @Mock
    private MedicineRepo medicineRepo;

    @InjectMocks
    private MedicineService medicineService;

    @Test
    void getAllMedicinesReturnsRepoData() {
        Medicine medicine = new Medicine();
        medicine.setName("Dolo 650");
        when(medicineRepo.findAll()).thenReturn(List.of(medicine));

        List<Medicine> result = medicineService.getAllMedicines();

        assertEquals(1, result.size());
        assertEquals("Dolo 650", result.get(0).getName());
    }

    @Test
    void addMedicineStoresImageMetadata() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "imageFile", "dolo.png", "image/png", new byte[]{1, 2, 3}
        );
        Medicine medicine = new Medicine();
        medicine.setName("Dolo 650");
        when(medicineRepo.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Medicine saved = medicineService.addMedicine(medicine, image);

        assertEquals("dolo.png", saved.getImageName());
        assertEquals("image/png", saved.getImageType());
        assertEquals(3, saved.getImageData().length);
        verify(medicineRepo).save(medicine);
    }

    @Test
    void csvUploadCreatesNewMedicine() {
        String csv = "name,brand,price\nDolo 650,Micro Labs,30\n";
        when(medicineRepo.findByNameIgnoreCaseAndBrandIgnoreCase("Dolo 650", "Micro Labs"))
                .thenReturn(Optional.empty());
        when(medicineRepo.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CsvUploadResultDTO result = medicineService.uploadMedicinesFromCsv(
                new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8))
        );

        assertEquals(1, result.getCreated());
        assertEquals(0, result.getUpdated());
        ArgumentCaptor<Medicine> captor = ArgumentCaptor.forClass(Medicine.class);
        verify(medicineRepo).save(captor.capture());
        assertEquals("Dolo 650", captor.getValue().getName());
        assertTrue(captor.getValue().isAvailable());
    }

    @Test
    void csvUploadUpdatesExistingMedicine() {
        Medicine existing = new Medicine();
        existing.setId("abc");
        existing.setName("Dolo 650");
        existing.setBrand("Micro Labs");
        existing.setPrice(20);
        existing.setAvailable(true);

        String csv = "name,brand,price,available\nDolo 650,Micro Labs,35,false\n";
        when(medicineRepo.findByNameIgnoreCaseAndBrandIgnoreCase("Dolo 650", "Micro Labs"))
                .thenReturn(Optional.of(existing));
        when(medicineRepo.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CsvUploadResultDTO result = medicineService.uploadMedicinesFromCsv(
                new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8))
        );

        assertEquals(0, result.getCreated());
        assertEquals(1, result.getUpdated());
        verify(medicineRepo, times(1)).save(existing);
        assertEquals(35.0, existing.getPrice());
        assertEquals(false, existing.isAvailable());
    }
}
