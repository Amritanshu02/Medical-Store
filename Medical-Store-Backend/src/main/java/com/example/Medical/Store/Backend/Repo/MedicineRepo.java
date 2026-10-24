package com.example.Medical.Store.Backend.Repo;

import com.example.Medical.Store.Backend.Entities.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicineRepo extends MongoRepository<Medicine, String> {
    Optional<Medicine> findByNameIgnoreCaseAndBrandIgnoreCase(String name, String brand);
}
