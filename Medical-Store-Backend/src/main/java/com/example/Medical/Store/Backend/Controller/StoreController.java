package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.Entities.MedicalStore;
import com.example.Medical.Store.Backend.Repo.MedicalStoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/stores")
public class StoreController {

    @Autowired
    private MedicalStoreRepo storeRepo;

    // Helper method to convert String ID to int (for backward compatibility)
    private int stringIdToInt(String id) {
        if (id == null) return 0;
        try {
            return Math.abs(id.hashCode());
        } catch (Exception e) {
            return 0;
        }
    }

    @GetMapping
    public ResponseEntity<List<MedicalStore>> getAllStores() {
        return new ResponseEntity<>(storeRepo.findAll(), HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<MedicalStore>> getActiveStores() {
        return new ResponseEntity<>(storeRepo.findByIsActiveTrue(), HttpStatus.OK);
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<?> getStoreById(@PathVariable String storeId) {
        // Try direct lookup first
//        Optional<MedicalStore> store = storeRepo.findById(storeId);
//        if (store.isPresent()) {
//            return new ResponseEntity<>(store.get(), HttpStatus.OK);
//        }
//        // If not found, try to find by int ID (for backward compatibility)
//        try {
////            int intId = Integer.parseInt(storeId);
//            String intId = storeId;
//            Optional<MedicalStore> storeByInt = storeRepo.findAll().stream()
//                    .filter(s -> stringIdToInt(s.getId()) == intId)
//                    .findFirst();
//            return storeByInt.map(s -> new ResponseEntity<>(s, HttpStatus.OK))
//                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//        } catch (NumberFormatException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
        return storeRepo.findById(storeId)
                .map(store -> new ResponseEntity<>(store, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getStoreByOwner(@PathVariable String ownerId) {
//        List<MedicalStore> stores = storeRepo.findAll();
//        Optional<MedicalStore> store = stores.stream()
//                .filter(s -> s.getOwner() != null && s.getOwner().getId().equals(ownerId))
//                .findFirst();
//        if (store.isPresent()) {
//            return new ResponseEntity<>(store.get(), HttpStatus.OK);
//        }
//        // Try with int ID conversion
//        try {
//            int intId = Integer.parseInt(ownerId);
//            Optional<MedicalStore> storeByInt = stores.stream()
//                    .filter(s -> s.getOwner() != null && stringIdToInt(s.getOwner().getId()) == intId)
//                    .findFirst();
//            return storeByInt.map(s -> new ResponseEntity<>(s, HttpStatus.OK))
//                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//        } catch (NumberFormatException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
        return storeRepo.findAll().stream()
                .filter(s -> s.getOwner() != null &&
                        s.getOwner().getId().equals(ownerId))
                .findFirst()
                .map(store -> new ResponseEntity<>(store, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{storeId}/image")
    public ResponseEntity<byte[]> getStoreImage(@PathVariable String storeId) {
//        Optional<MedicalStore> storeOpt = storeRepo.findById(storeId);
//        if (!storeOpt.isPresent()) {
//            // Try with int ID
//            try {
//                int intId = Integer.parseInt(storeId);
//                storeOpt = storeRepo.findAll().stream()
//                        .filter(s -> stringIdToInt(s.getId()) == intId)
//                        .findFirst();
//            } catch (NumberFormatException e) {
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//        }
//
//        if (storeOpt.isPresent() && storeOpt.get().getStoreImage() != null) {
//            MedicalStore store = storeOpt.get();
//            return ResponseEntity.ok()
//                    .contentType(MediaType.valueOf(store.getStoreImageType() != null ? store.getStoreImageType() : "image/jpeg"))
//                    .body(store.getStoreImage());
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Optional<MedicalStore> storeOpt = storeRepo.findById(storeId);

        if (storeOpt.isPresent() && storeOpt.get().getStoreImage() != null) {
            MedicalStore store = storeOpt.get();

            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(
                            store.getStoreImageType() != null
                                    ? store.getStoreImageType()
                                    : "image/jpeg"))
                    .body(store.getStoreImage());
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
