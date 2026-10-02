package com.example.Medical.Store.Backend.Controller;

import com.example.Medical.Store.Backend.DTOs.OrderRequestDTO;
import com.example.Medical.Store.Backend.DTOs.UpdateStatusDTO;
import com.example.Medical.Store.Backend.Entities.Order;
import com.example.Medical.Store.Backend.Repo.OrderRepo;
import com.example.Medical.Store.Backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

//    @Autowired
//    private OrderRepo orderRepo;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        try {
            Order order = orderService.createOrder(orderRequest);
            return new ResponseEntity<>(order, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<Order>> getOrdersByStore(@PathVariable String storeId) {
        List<Order> orders = orderService.getOrdersByStoreId(storeId);
        System.out.println("Inside OrderController values storeId "+ storeId + " orders "+ orders);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

//    @GetMapping("/store/{storeId}")
//    public ResponseEntity<List<Order>> getOrdersByStore(@PathVariable String storeId) {
//        return ResponseEntity.ok(orderRepo.findByStore_Id(storeId));
//    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable String orderId) {
        return orderService.getOrderById(orderId)
                .map(order -> new ResponseEntity<>(order, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @PutMapping("/{orderId}/status")
//    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestBody String status) {
//        try {
//            System.out.println("Inside updateOrderStatus controller and here status is "+status);
//            Order order = orderService.updateOrderStatus(orderId, status);
//            return new ResponseEntity<>(order, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody UpdateStatusDTO request) {

        try {
            System.out.println("Status received: " + request.getStatus());

            Order order = orderService.updateOrderStatus(orderId, request.getStatus());

            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
