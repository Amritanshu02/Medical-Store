package com.example.Medical.Store.Backend.Repo;

import com.example.Medical.Store.Backend.Entities.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepo extends MongoRepository<Medicine, String> {
}
