# Test Credentials for Medical Store Application

## Test User (Customer)

**Email:** customer@test.com  
**Password:** customer123  
**Role:** CUSTOMER  
**Name:** John Doe

### How to Create:
1. Go to http://localhost:3000/register
2. Fill in the registration form:
   - Name: John Doe
   - Email: customer@test.com
   - Password: customer123
   - Role: Select "CUSTOMER"
   - Address: 123 Main Street, City, State, 12345
3. Click Register

**OR** use the API directly:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "customer@test.com",
    "password": "customer123",
    "role": "CUSTOMER",
    "address": "123 Main Street, City, State, 12345"
  }'
```

---

## Test Medical Store Owner

**Email:** storeowner@test.com  
**Password:** store123  
**Role:** STORE_OWNER  
**Name:** Dr. Sarah Smith  
**Store Name:** ARCEE Medicals  
**Store Address:** 456 Medical Plaza, Healthcare City, 54321  
**Store Phone:** +1-555-0123  
**Store Email:** store@arcee.com

### How to Create:
1. Go to http://localhost:3000/register
2. Fill in the registration form:
   - Name: Dr. Sarah Smith
   - Email: storeowner@test.com
   - Password: store123
   - Role: Select "STORE_OWNER"
   - Address: 456 Medical Plaza, Healthcare City, 54321
   - Store Name: ARCEE Medicals
   - Store Address: 456 Medical Plaza, Healthcare City, 54321
   - Store Pincode: 54321
   - Store Phone: +1-555-0123
   - Store Email: store@arcee.com
3. Click Register

**OR** use the API directly:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Smith",
    "email": "storeowner@test.com",
    "password": "store123",
    "role": "STORE_OWNER",
    "address": "456 Medical Plaza, Healthcare City, 54321",
    "storeName": "ARCEE Medicals",
    "storeAddress": "456 Medical Plaza, Healthcare City, 54321",
    "storePincode": "54321",
    "storePhone": "+1-555-0123",
    "storeEmail": "store@arcee.com"
  }'
```

---

## Additional Test Medical Store

**Email:** store2@test.com  
**Password:** store456  
**Role:** STORE_OWNER  
**Name:** Dr. Michael Johnson  
**Store Name:** HealthCare Plus  
**Store Address:** 789 Wellness Avenue, Health District, 67890  
**Store Phone:** +1-555-0456  
**Store Email:** info@healthcareplus.com

### API Call:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Michael Johnson",
    "email": "store2@test.com",
    "password": "store456",
    "role": "STORE_OWNER",
    "address": "789 Wellness Avenue, Health District, 67890",
    "storeName": "HealthCare Plus",
    "storeAddress": "789 Wellness Avenue, Health District, 67890",
    "storePincode": "67890",
    "storePhone": "+1-555-0456",
    "storeEmail": "info@healthcareplus.com"
  }'
```

---

## Quick Login Test

### Customer Login:
- **URL:** http://localhost:3000/login
- **Email:** customer@test.com
- **Password:** customer123

### Store Owner Login:
- **URL:** http://localhost:3000/login
- **Email:** storeowner@test.com
- **Password:** store123

---

## Features to Test

### As Customer:
1. ✅ Browse medical stores (Search page)
2. ✅ View medicines in a store
3. ✅ Add medicines to cart
4. ✅ Checkout and place order
5. ✅ Browse medicines, healthcare, lab tests pages
6. ✅ View offers
7. ✅ Upload prescription

### As Store Owner:
1. ✅ Access admin dashboard
2. ✅ Add medicines to store
3. ✅ Manage medicines
4. ✅ View orders

---

## Notes

- All passwords are stored in plain text for testing (not recommended for production)
- The backend uses UUID tokens for authentication
- Medical stores must be active (`isActive: true`) to appear in search results
- Make sure the backend is running on http://localhost:8080 before testing
