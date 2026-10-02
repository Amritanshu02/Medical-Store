package com.example.Medical.Store.Backend.Repo;

import com.example.Medical.Store.Backend.Entities.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByStoreId(String storeId);
//    List<Order> findByStore_Id(String storeId);
}
