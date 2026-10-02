# Adding Dummy Medicines for Testing

## Option 1: Add via Admin Dashboard (Recommended)

1. Register as a **Store Owner**:
   - Go to `/register`
   - Select "Store Owner" as role
   - Fill in all details including store information
   - Register

2. Login as Store Owner:
   - Go to `/login`
   - Login with your credentials
   - You'll be redirected to Admin Dashboard

3. Add Medicines:
   - Click "Add New Medicine" button
   - Fill in medicine details:
     - Medicine Name (e.g., "Paracetamol 500mg")
     - Brand (e.g., "Crocin")
     - Composition (e.g., "Paracetamol 500mg")
     - Description (e.g., "For fever and pain relief")
     - Price (e.g., 15.00)
     - Check "Available" checkbox
     - Add substitute medicines if any (comma-separated)
     - Upload medicine image (optional)
   - Click "Add Medicine"

4. Repeat for multiple medicines

## Option 2: Add via API/Backend

You can add medicines directly via the API endpoint:

```bash
POST http://localhost:8080/medicine
Content-Type: multipart/form-data

Form Data:
- medicine: JSON object with medicine details
- imageFile: Image file (optional)

Example JSON for medicine:
{
  "name": "Paracetamol 500mg",
  "brand": "Crocin",
  "composition": "Paracetamol 500mg",
  "description": "For fever and pain relief",
  "price": 15.00,
  "available": true,
  "substitutes": "Dolo 650, Calpol"
}
```

## Sample Dummy Medicines

Here are some sample medicines you can add:

1. **Paracetamol 500mg** (Crocin)
   - Price: ₹15
   - Description: For fever and pain relief
   - Substitutes: Dolo 650, Calpol

2. **Ibuprofen 400mg** (Brufen)
   - Price: ₹25
   - Description: Anti-inflammatory and pain reliever
   - Substitutes: Advil, Combiflam

3. **Azithromycin 500mg** (Azithral)
   - Price: ₹180
   - Description: Antibiotic for bacterial infections
   - Substitutes: Azee, Azibact

4. **Cetirizine 10mg** (Cetirizine)
   - Price: ₹35
   - Description: Antihistamine for allergies
   - Substitutes: Zyrtec, Alerid

5. **Omeprazole 20mg** (Omez)
   - Price: ₹45
   - Description: For acidity and heartburn
   - Substitutes: Rantac, Pan D

6. **Montelukast 10mg** (Montair)
   - Price: ₹120
   - Description: For asthma and allergies
   - Substitutes: Asthakind, Lukair

7. **Amoxicillin 500mg** (Mox)
   - Price: ₹65
   - Description: Antibiotic
   - Substitutes: Amoxil, Novamox

8. **Cough Syrup** (Benadryl)
   - Price: ₹95
   - Description: For dry cough
   - Substitutes: Corex, Ascoril

## Quick Test Flow

1. Register as Customer
2. Register as Store Owner
3. Login as Store Owner → Add 5-10 dummy medicines
4. Logout
5. Login as Customer → Browse medicines → Add to cart → Checkout
6. Login as Store Owner → View orders in dashboard → Update order status

## Database Seed Script (Future Enhancement)

For production/testing, you might want to create a database seed script that automatically adds dummy medicines on application startup. This would require:
- Creating a DataLoader class in Spring Boot
- Using `@PostConstruct` or implementing `ApplicationRunner`
- Adding medicines programmatically
