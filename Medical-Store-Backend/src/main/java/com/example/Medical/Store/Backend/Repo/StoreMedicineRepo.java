package com.example.Medical.Store.Backend.Repo;

import com.example.Medical.Store.Backend.Entities.StoreMedicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreMedicineRepo extends MongoRepository<StoreMedicine, String> {
    // Note: These queries work with DBRef objects, so we query by store.id and medicine.id
    List<StoreMedicine> findByStore_Id(String storeId);
    Optional<StoreMedicine> findByStore_IdAndMedicine_Id(String storeId, String medicineId);
    List<StoreMedicine> findByStore_IdAndAvailableTrue(String storeId);
}
