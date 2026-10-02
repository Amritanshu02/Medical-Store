# Medical Store Application - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Architecture](#database-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Code Flow](#code-flow)
8. [API Endpoints](#api-endpoints)
9. [Key Features](#key-features)
10. [Running the Application](#running-the-application)

---

## Overview

This is a full-stack medical store management application that allows customers to browse medicines, search for medical stores, place orders, and allows store owners to manage their inventory. The application uses MongoDB (NoSQL) as the database, Spring Boot for the backend, and React.js for the frontend.

### Key Functionalities:
- User Registration & Authentication (Customers and Store Owners)
- Medical Store Search and Discovery
- Medicine Catalog Browsing
- Shopping Cart Management
- Order Placement and Management
- Store Owner Dashboard
- Prescription Upload
- Contact/Support System

---

## Technology Stack

### Backend
- **Java 17** - Programming Language
- **Spring Boot 4.0.1** - Framework
- **Spring Data MongoDB** - Database Integration
- **MongoDB** - NoSQL Database (Cloud - MongoDB Atlas)
- **Maven** - Build Tool
- **Spring Security** - Security Framework
- **Spring Mail** - Email Service

### Frontend
- **React.js** - UI Framework
- **React Router DOM** - Navigation
- **Axios** - HTTP Client
- **Context API** - State Management
- **Material-UI (MUI)** - UI Components
- **CSS3** - Styling

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB
- Connection String: `mongodb+srv://amritanshu9794:amritanshu123@cluster0.xzxxkao.mongodb.net/medical_store`

---

## Project Structure

```
Medical store/
├── Medical-Store-Backend/          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/Medical/Store/Backend/
│   │   │   │       ├── Controller/     # REST Controllers
│   │   │   │       ├── Service/        # Business Logic
│   │   │   │       ├── Repo/            # MongoDB Repositories
│   │   │   │       ├── Entities/       # MongoDB Documents
│   │   │   │       ├── DTOs/            # Data Transfer Objects
│   │   │   │       ├── Config/          # Configuration Classes
│   │   │   │       └── MedicalStoreBackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── client/                          # React Frontend
    ├── src/
    │   ├── components/              # Reusable Components
    │   ├── pages/                    # Page Components
    │   ├── context/                  # Context Providers
    │   ├── styles/                   # CSS Files
    │   ├── utils/                    # Utility Functions
    │   ├── data/                     # Dummy Data
    │   ├── App.js                    # Main App Component
    │   └── index.js                  # Entry Point
    ├── public/
    └── package.json
```

---

## Database Architecture

### MongoDB Collections

#### 1. **users** Collection
```javascript
{
  _id: ObjectId,              // MongoDB auto-generated ID
  name: String,
  email: String (unique),
  password: String,
  role: String,              // "CUSTOMER" or "STORE_OWNER"
  address: String,
  medicalStore: DBRef         // Reference to medical_stores collection (if store owner)
}
```

#### 2. **medical_stores** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  pincode: String,
  phone: String,
  email: String,
  isActive: Boolean,
  storeImage: Binary,         // Store image as byte array
  storeImageType: String,     // MIME type (e.g., "image/jpeg")
  owner: DBRef                 // Reference to users collection
}
```

#### 3. **medicines** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  brand: String,
  composition: String,
  description: String,
  imageName: String,
  imageType: String,
  imageData: Binary,           // Medicine image as byte array
  price: Number,
  available: Boolean,
  substitutes: String          // Comma-separated list
}
```

#### 4. **store_medicines** Collection
```javascript
{
  _id: ObjectId,
  store: DBRef,                // Reference to medical_stores
  medicine: DBRef,             // Reference to medicines
  available: Boolean,
  storePrice: Number           // Store-specific price (can override global price)
}
```

#### 5. **orders** Collection
```javascript
{
  _id: ObjectId,
  userId: String,              // User ID (String for MongoDB compatibility)
  storeId: String,              // Store ID
  totalAmount: Number,
  status: String,              // "PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELLED"
  deliveryAddress: String,
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  orderDate: ISODate,
  orderItems: [                // Embedded documents
    {
      id: String,
      orderId: String,
      medicineId: String,
      medicineName: String,
      quantity: Number,
      price: Number,
      totalPrice: Number
    }
  ]
}
```

#### 6. **order_items** Collection (Optional - can be embedded in orders)
```javascript
{
  _id: ObjectId,
  orderId: String,
  medicineId: String,
  medicineName: String,
  quantity: Number,
  price: Number,
  totalPrice: Number
}
```

### Database Relationships

- **User ↔ MedicalStore**: One-to-One (via `@DBRef`)
  - A user with role "STORE_OWNER" can own one medical store
  - A medical store has one owner

- **MedicalStore ↔ Medicine**: Many-to-Many (via `StoreMedicine`)
  - A store can have many medicines
  - A medicine can be available in many stores

- **User ↔ Order**: One-to-Many
  - A user can place many orders
  - An order belongs to one user

- **MedicalStore ↔ Order**: One-to-Many
  - A store can receive many orders
  - An order is placed at one store

---

## Backend Architecture

### 1. **Entities (MongoDB Documents)**

All entities are annotated with `@Document` and use `@Id` for MongoDB ObjectId.

**Key Changes from SQL to MongoDB:**
- `@Entity` → `@Document(collection = "collection_name")`
- `@Id @GeneratedValue` → `@Id` (MongoDB auto-generates ObjectId)
- `int id` → `String id` (MongoDB ObjectId as String)
- `@OneToOne/@ManyToOne` → `@DBRef` (for references)
- `@OneToMany` → Embedded documents or separate collection with `@DBRef`

### 2. **Repositories**

All repositories extend `MongoRepository<Entity, String>` instead of `JpaRepository`.

**Example:**
```java
@Repository
public interface UserRepo extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
```

**MongoDB Query Methods:**
- `findByIsActiveTrue()` - Finds documents where `isActive == true`
- `findByStore_Id(String id)` - Queries nested DBRef fields using `_id`
- `findByStore_IdAndMedicine_Id()` - Multiple conditions

### 3. **Services**

Services contain business logic and handle:
- User authentication and registration
- Order creation and management
- Medicine management
- Email notifications

**ID Conversion:**
Since the frontend uses `int` IDs but MongoDB uses `String` IDs, services include helper methods:
```java
private int stringIdToInt(String id) {
    return Math.abs(id.hashCode());
}
```

### 4. **Controllers**

REST Controllers handle HTTP requests and responses:
- `@RestController` - Marks as REST controller
- `@CrossOrigin` - Enables CORS
- `@RequestMapping` - Base path mapping
- `@GetMapping/@PostMapping` - HTTP method mapping

---

## Frontend Architecture

### 1. **Component Structure**

**Pages:**
- `Home.jsx` - Landing page with category cards
- `Login.jsx` - User login
- `Register.jsx` - User registration
- `SearchStore.jsx` - Medical store search
- `Store.jsx` - Individual store page with medicines
- `Medicines.jsx`, `Healthcare.jsx`, `LabTests.jsx`, etc. - Category pages
- `Cart.jsx` - Shopping cart
- `Checkout.jsx` - Order placement
- `AdminDashboard.jsx` - Store owner dashboard

**Components:**
- `Navbar.jsx` - Navigation bar with hamburger menu
- `Footer.jsx` - Application footer
- `StoreCard.jsx` - Medical store card
- `ProductCard.jsx` - Product/service card
- `Toast.jsx` - Toast notification component

### 2. **State Management**

**Context API:**
- `AuthContext` - User authentication state
- `CartContext` - Shopping cart state

**Local Storage:**
- User session persistence
- Cart persistence

### 3. **Routing**

React Router DOM handles navigation:
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  // ... more routes
</Routes>
```

### 4. **API Communication**

Axios is configured in `utils/api.js`:
- Base URL: `http://localhost:9000`
- Error interceptors for backend connectivity
- Toast notifications for errors

---

## Code Flow

### 1. **User Registration Flow**

```
Frontend (Register.jsx)
  ↓ User fills form
  ↓ POST /auth/register
Backend (AuthController)
  ↓ AuthService.register()
  ↓ Check if email exists
  ↓ Create User entity
  ↓ If STORE_OWNER: Create MedicalStore
  ↓ Save to MongoDB
  ↓ Return AuthResponseDTO
Frontend
  ↓ Store user in AuthContext
  ↓ Navigate to appropriate page
```

### 2. **User Login Flow**

```
Frontend (Login.jsx)
  ↓ User enters credentials
  ↓ POST /auth/login
Backend (AuthController)
  ↓ AuthService.login()
  ↓ Find user by email
  ↓ Verify password
  ↓ Return AuthResponseDTO with token
Frontend
  ↓ Store user in AuthContext & localStorage
  ↓ Navigate to home/dashboard
```

### 3. **Store Search Flow**

```
Frontend (SearchStore.jsx)
  ↓ User clicks search bar
  ↓ GET /stores/active
Backend (StoreController)
  ↓ MedicalStoreRepo.findByIsActiveTrue()
  ↓ Query MongoDB
  ↓ Return List<MedicalStore>
Frontend
  ↓ Display StoreCard components
```

### 4. **Add to Cart Flow**

```
Frontend (ProductCard.jsx or Store.jsx)
  ↓ User clicks "Add to Cart"
  ↓ CartContext.addToCart(product)
  ↓ Update cart state
  ↓ Save to localStorage
  ↓ Show toast notification
```

### 5. **Order Placement Flow**

```
Frontend (Checkout.jsx)
  ↓ User fills delivery details
  ↓ POST /orders/create
Backend (OrderController)
  ↓ OrderService.createOrder()
  ↓ Create Order entity
  ↓ Create OrderItem entities (embedded)
  ↓ Calculate total
  ↓ Save to MongoDB
  ↓ Send email notifications
  ↓ Return Order
Frontend
  ↓ Clear cart
  ↓ Show success message
  ↓ Navigate to order confirmation
```

### 6. **Medicine Display Flow**

```
Frontend (Store.jsx)
  ↓ GET /stores/{storeId}
Backend (StoreController)
  ↓ Get store details
  ↓ (Optional) Get store medicines via StoreMedicineRepo
Frontend
  ↓ Display medicines
  ↓ User can add to cart
```

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/user/{userId}` - Get user by ID

### Stores
- `GET /stores` - Get all stores
- `GET /stores/active` - Get active stores
- `GET /stores/{storeId}` - Get store by ID
- `GET /stores/owner/{ownerId}` - Get store by owner ID
- `GET /stores/{storeId}/image` - Get store image

### Medicines
- `GET /medicines` - Get all medicines
- `GET /medicine/{medId}` - Get medicine by ID
- `POST /medicine` - Add new medicine (with image)
- `GET /product/{medicineId}/image` - Get medicine image

### Orders
- `POST /orders/create` - Create new order
- `GET /orders/user/{userId}` - Get user orders
- `GET /orders/store/{storeId}` - Get store orders
- `GET /orders/{orderId}` - Get order by ID
- `PUT /orders/{orderId}/status` - Update order status

### Support
- `POST /support/contact` - Submit contact form
- `POST /prescription/upload` - Upload prescription

---

## Key Features

### 1. **Responsive Design**
- Mobile-first approach
- Hamburger menu for mobile
- Media queries for tablets, laptops, monitors
- Flexible grid layouts

### 2. **Toast Notifications**
- Replaces browser `alert()`
- Auto-dismissing messages
- Success, error, warning, info types
- Non-blocking UI

### 3. **Search Functionality**
- Medical store search
- Category-based filtering
- Real-time results

### 4. **Shopping Cart**
- Persistent cart (localStorage)
- Add/remove items
- Quantity management
- Price calculation with discounts

### 5. **User Roles**
- **CUSTOMER**: Browse, search, order
- **STORE_OWNER**: Manage store, view orders, manage medicines

### 6. **Email Notifications**
- Order confirmation to customer
- Order notification to store
- Prescription upload confirmation
- Contact form acknowledgments

---

## Running the Application

### Prerequisites
1. **Java 17 JDK** - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
2. **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
3. **Node.js 16+** - [Download](https://nodejs.org/)
4. **MongoDB Atlas Account** - Already configured

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "Medical-Store-Backend"
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the backend:**
   ```bash
   mvn spring-boot:run
   ```
   
   Or use the provided scripts:
   - PowerShell: `.\run-backend.ps1`
   - Batch: `start-backend.bat`

4. **Backend runs on:** `http://localhost:9000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the frontend:**
   ```bash
   npm start
   ```
   
   Or use the provided scripts:
   - PowerShell: `.\run-frontend.ps1`
   - Batch: `start-frontend.bat`

4. **Frontend runs on:** `http://localhost:3000`

### Run Both Together

Use the provided scripts:
- PowerShell: `.\run-both.ps1`
- Batch: `start-both.bat`

---

## MongoDB Connection Details

- **Connection String:** `mongodb+srv://amritanshu9794:amritanshu123@cluster0.xzxxkao.mongodb.net/medical_store`
- **Database Name:** `medical_store`
- **Provider:** MongoDB Atlas (Cloud)
- **Collections:** `users`, `medical_stores`, `medicines`, `store_medicines`, `orders`, `order_items`

---

## Important Notes

### ID Conversion
- MongoDB uses `String` IDs (ObjectId)
- Frontend uses `int` IDs for backward compatibility
- Services convert between String and int using hash codes
- This is a temporary solution; in production, consider using String IDs throughout

### Security
- Passwords are stored in plain text (for demo purposes)
- In production, use BCrypt or similar hashing
- Implement JWT tokens for authentication
- Add input validation and sanitization

### Error Handling
- Backend returns appropriate HTTP status codes
- Frontend displays user-friendly error messages via toast
- Network errors are caught and displayed

### Future Improvements
1. Implement JWT authentication
2. Add password hashing (BCrypt)
3. Implement pagination for large datasets
4. Add image upload to cloud storage (AWS S3, Cloudinary)
5. Implement real-time notifications (WebSocket)
6. Add payment gateway integration
7. Implement order tracking
8. Add reviews and ratings
9. Implement advanced search with filters
10. Add analytics dashboard

---

## Troubleshooting

### Backend Issues
- **Port 9000 already in use:** Change port in `application.properties`
- **MongoDB connection failed:** Check connection string and network access
- **Compilation errors:** Ensure Java 17 JDK is installed and `JAVA_HOME` is set

### Frontend Issues
- **Port 3000 already in use:** React will prompt to use another port
- **Backend not connecting:** Ensure backend is running on port 9000
- **Dependencies not installing:** Clear `node_modules` and `package-lock.json`, then reinstall

### Database Issues
- **Connection timeout:** Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)
- **Authentication failed:** Verify username and password in connection string

---

## Support

For issues or questions, refer to:
- Application logs (backend console)
- Browser console (frontend errors)
- MongoDB Atlas dashboard (database status)

---

**Document Version:** 1.0  
**Last Updated:** February 2025  
**Author:** Development Team
