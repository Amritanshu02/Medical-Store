package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.DTOs.OrderRequestDTO;
import com.example.Medical.Store.Backend.Entities.*;
import com.example.Medical.Store.Backend.Repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private MedicineRepo medicineRepo;

    @Autowired
    private MedicalStoreRepo medicalStoreRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JavaMailSender mailSender;

    // Helper method to convert String ID to int (for backward compatibility)
    private int stringIdToInt(String id) {
        if (id == null) return 0;
        try {
            return Math.abs(id.hashCode());
        } catch (Exception e) {
            return 0;
        }
    }

    // Helper method to convert int ID to String (find by hash)
    private String intIdToString(int id, List<?> allItems) {
        // This is a simplified approach - find item whose hash matches
        // In production, you might want a better mapping strategy
        return allItems.stream()
                .map(item -> {
                    try {
                        String itemId = (String) item.getClass().getMethod("getId").invoke(item);
                        if (stringIdToInt(itemId) == id) {
                            return itemId;
                        }
                    } catch (Exception e) {
                        // Ignore
                    }
                    return null;
                })
                .filter(idStr -> idStr != null)
                .findFirst()
                .orElse(null);
    }

    public Order createOrder(OrderRequestDTO orderRequest) {
        // Convert int IDs to String IDs
//        String userIdStr = String.valueOf(orderRequest.getUserId());
//        String storeIdStr = String.valueOf(orderRequest.getStoreId());
        String userIdStr = orderRequest.getUserId();
        String storeIdStr = orderRequest.getStoreId();

        // Create order
        Order order = new Order();
        order.setUserId(userIdStr);
        order.setStoreId(storeIdStr);
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setCustomerName(orderRequest.getCustomerName());
        order.setCustomerPhone(orderRequest.getCustomerPhone());
        order.setCustomerEmail(orderRequest.getCustomerEmail());
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (com.example.Medical.Store.Backend.DTOs.OrderItemDTO itemDTO : orderRequest.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
//            orderItem.setMedicineId(String.valueOf(itemDTO.getMedicineId()));
            orderItem.setMedicineId(itemDTO.getMedicineId());
            orderItem.setMedicineName(itemDTO.getMedicineName());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemDTO.getPrice());
            orderItem.setTotalPrice(itemDTO.getPrice() * itemDTO.getQuantity());
            // Note: orderId will be set after order is saved

            orderItems.add(orderItem);
            totalAmount += orderItem.getTotalPrice();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        // Save order
        Order savedOrder = orderRepo.save(order);

        // Update order items with order ID
        for (OrderItem item : savedOrder.getOrderItems()) {
            item.setOrderId(savedOrder.getId());
        }
        System.out.println("Saved order is "+order);
        savedOrder = orderRepo.save(savedOrder);

        // Send notification to medical store
        sendOrderNotificationToStore(savedOrder);

        // Send confirmation to customer
        sendOrderConfirmationToCustomer(savedOrder);

        return savedOrder;
    }

    private void sendOrderNotificationToStore(Order order) {
        Optional<MedicalStore> storeOpt = medicalStoreRepo.findById(order.getStoreId());
        if (storeOpt.isPresent()) {
            MedicalStore store = storeOpt.get();
            String storeEmail = store.getEmail() != null ? store.getEmail() : "store@example.com";

            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(storeEmail);
                message.setSubject("New Order Received - Order #" + order.getId());

                StringBuilder emailBody = new StringBuilder();
                emailBody.append("Dear ").append(store.getName()).append(",\n\n");
                emailBody.append("You have received a new order!\n\n");
                emailBody.append("Order Details:\n");
                emailBody.append("Order ID: ").append(order.getId()).append("\n");
                emailBody.append("Customer Name: ").append(order.getCustomerName()).append("\n");
                emailBody.append("Customer Phone: ").append(order.getCustomerPhone()).append("\n");
                emailBody.append("Customer Email: ").append(order.getCustomerEmail()).append("\n");
                emailBody.append("Delivery Address: ").append(order.getDeliveryAddress()).append("\n\n");
                emailBody.append("Order Items:\n");
                emailBody.append("----------------------------------------\n");

                for (OrderItem item : order.getOrderItems()) {
                    emailBody.append(item.getMedicineName())
                            .append(" x ").append(item.getQuantity())
                            .append(" = ₹").append(item.getTotalPrice()).append("\n");
                }

                emailBody.append("----------------------------------------\n");
                emailBody.append("Total Amount: ₹").append(order.getTotalAmount()).append("\n\n");
                emailBody.append("Payment Method: Cash on Delivery\n");
                emailBody.append("Please dispatch this order within 24-48 hours.\n\n");
                emailBody.append("Thank you!");

                message.setText(emailBody.toString());
                mailSender.send(message);

                System.out.println("WhatsApp notification would be sent to: " + store.getPhone());

            } catch (Exception e) {
                System.err.println("Failed to send email notification: " + e.getMessage());
            }
        }
    }

    private void sendOrderConfirmationToCustomer(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getCustomerEmail());
            message.setSubject("Order Confirmation - Order #" + order.getId());

            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Dear ").append(order.getCustomerName()).append(",\n\n");
            emailBody.append("Thank you for your order!\n\n");
            emailBody.append("Order Details:\n");
            emailBody.append("Order ID: ").append(order.getId()).append("\n");
            emailBody.append("Status: ").append(order.getStatus()).append("\n\n");
            emailBody.append("Order Items:\n");
            emailBody.append("----------------------------------------\n");

            for (OrderItem item : order.getOrderItems()) {
                emailBody.append(item.getMedicineName())
                        .append(" x ").append(item.getQuantity())
                        .append(" = ₹").append(item.getTotalPrice()).append("\n");
            }

            emailBody.append("----------------------------------------\n");
            emailBody.append("Total Amount: ₹").append(order.getTotalAmount()).append("\n\n");
            emailBody.append("Delivery Address: ").append(order.getDeliveryAddress()).append("\n");
            emailBody.append("Payment Method: Cash on Delivery\n\n");
            emailBody.append("Your order will be dispatched within 24-48 hours.\n");
            emailBody.append("You will receive a call before delivery.\n\n");
            emailBody.append("Thank you for choosing our service!");

            message.setText(emailBody.toString());
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
    }

    public List<Order> getOrdersByUserId(String userId) {
        String userIdStr = userId;
        return orderRepo.findByUserId(userIdStr);
    }

    public List<Order> getOrdersByStoreId(String storeId) {
//        String storeIdStr = String.valueOf(storeId);
        String storeIdStr = storeId;
        return orderRepo.findByStoreId(storeIdStr);
    }

    public Optional<Order> getOrderById(String orderId) {
        return orderRepo.findById(orderId);
    }

    // Overloaded for int ID
    public Optional<Order> getOrderById(int orderId) {
        String orderIdStr = String.valueOf(orderId);
        // Try direct lookup first
        Optional<Order> order = orderRepo.findById(orderIdStr);
        if (order.isPresent()) {
            return order;
        }
        // If not found, search by hash
        return orderRepo.findAll().stream()
                .filter(o -> stringIdToInt(o.getId()) == orderId)
                .findFirst();
    }

    public Order updateOrderStatus(String orderId, String status) {
        System.out.println("Inside updateOrderStatus where status is "+status);
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        System.out.println("Fetched order status is "+order.getStatus());
        order.setStatus(status);
        return orderRepo.save(order);
    }

    // Overloaded for int ID
    public Order updateOrderStatus(int orderId, String status) {
        Optional<Order> orderOpt = getOrderById(orderId);
        Order order = orderOpt.orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepo.save(order);
    }
}
