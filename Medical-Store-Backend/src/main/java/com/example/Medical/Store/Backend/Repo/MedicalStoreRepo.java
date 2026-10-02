package com.example.Medical.Store.Backend.Repo;

import com.example.Medical.Store.Backend.Entities.MedicalStore;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalStoreRepo extends MongoRepository<MedicalStore, String> {
    List<MedicalStore> findByIsActiveTrue();
}
