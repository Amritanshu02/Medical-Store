# Medical Store Order System - Setup Instructions

## Overview
This system allows customers to:
1. Browse medicines from medical stores
2. Add medicines to cart
3. Place orders with delivery address
4. Receive order confirmations via email
5. Medical stores receive order notifications via email

**Payment Method:** Cash on Delivery
**Delivery Time:** 24-48 hours

## Backend Setup (Java Spring Boot)

### 1. Email Configuration
Update `Medical-Store-Backend/src/main/resources/application.properties` with your email credentials:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

**Note:** For Gmail, you need to generate an "App Password" from your Google Account settings:
- Go to Google Account → Security → 2-Step Verification → App passwords
- Generate a password for "Mail" and use that instead of your regular password

### 2. Database
The system uses PostgreSQL (configured in `application.properties`). The database schema will be automatically created on first run due to:
```properties
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run Backend
```bash
cd Medical-Store-Backend
mvn spring-boot:run
```

The backend will run on `http://localhost:8080`

## Frontend Setup (React)

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Run Frontend
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Key Features Implemented

### Backend:
1. **Order Entity** - Stores order information with delivery address
2. **OrderItem Entity** - Stores individual medicine items in an order
3. **OrderService** - Handles order creation and email notifications
4. **OrderController** - REST API endpoints for orders
5. **Email Notifications**:
   - Sends order confirmation to customer
   - Sends order notification to medical store

### Frontend:
1. **CartContext** - Manages shopping cart state globally
2. **Store Page** - Displays medicines with add to cart functionality
3. **Cart Page** - Shows cart items with quantity management
4. **Checkout Page** - Address form and order placement
5. **Order Success Page** - Confirmation after order placement

## API Endpoints

### Orders
- `POST /orders/create` - Create a new order
- `GET /orders/user/{userId}` - Get orders by user
- `GET /orders/store/{storeId}` - Get orders by store
- `GET /orders/{orderId}` - Get order by ID

### Medicines
- `GET /medicines` - Get all medicines
- `GET /medicine/{medId}` - Get medicine by ID
- `GET /product/{medicineId}/image` - Get medicine image

## Usage Flow

1. **Customer browses medicines** at `/store?storeId=1`
2. **Adds medicines to cart** by clicking "Add to Cart"
3. **Views cart** at `/cart`
4. **Proceeds to checkout** at `/checkout`
5. **Enters delivery address** and customer details
6. **Places order** - Order is saved to database
7. **Email notifications sent**:
   - Customer receives order confirmation
   - Medical store receives order details
8. **Order processed** - Store dispatches within 24-48 hours
9. **Payment collected** - Cash on delivery

## WhatsApp Integration (Future Enhancement)

For WhatsApp notifications, you would need to integrate with:
- **Twilio API** - For WhatsApp Business API
- **WhatsApp Business API** - Direct integration

The current implementation includes a placeholder for WhatsApp notifications in `OrderService.sendOrderNotificationToStore()`.

## Important Notes

1. **Medical Store Email**: Make sure medical stores have email addresses set in the database
2. **User Authentication**: The system currently uses a default userId (1) if user is not logged in. You may want to integrate with your authentication system
3. **Store ID**: The Store page uses URL parameter `?storeId=1`. You may want to pass this from the store selection page
4. **Image Handling**: Medicine images are served from `/product/{medicineId}/image` endpoint

## Testing

1. Create some medicines in the database
2. Ensure a medical store exists with an email address
3. Browse medicines at `/store`
4. Add medicines to cart
5. Complete checkout with a valid email address
6. Check email inboxes for notifications

## Troubleshooting

### Email not sending:
- Verify email credentials in `application.properties`
- Check if 2-Step Verification is enabled (required for Gmail App Passwords)
- Check backend logs for email errors

### Images not displaying:
- Ensure medicine images are uploaded correctly
- Check if image endpoint is accessible
- Verify image data is stored in database

### Order creation fails:
- Check database connection
- Verify storeId exists in database
- Check backend logs for errors
