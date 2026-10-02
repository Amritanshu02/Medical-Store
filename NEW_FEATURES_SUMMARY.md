# New Features - Need Help & Prescription Upload

## ✅ Implemented Features

### 1. Need Help Page (`/need-help`)

**Features:**
- Contact form for customer queries
- Direct phone support (placeholder: `+91-XXX-XXX-XXXX`)
- Direct email support (placeholder: `support@arcmedical.com`)
- Query submission form with:
  - Name, Email, Phone (optional)
  - Subject, Message
- Auto-fills user details if logged in
- Email notifications:
  - Query sent to support email (configured in `application.properties`)
  - Confirmation email sent to customer
- Fully responsive design

**Access:**
- Available from navbar "Need Help?" link (all users)

### 2. Prescription Upload Page (`/prescription-upload`)

**Features:**
- Store selection dropdown (active stores only)
- Patient details form:
  - Patient Name
  - Phone Number
  - Email
  - Delivery Address
- Prescription file upload:
  - Supports JPEG, JPG, PNG, PDF formats
  - Max file size: 5MB
  - Drag and drop or click to upload
  - File preview and removal option
- Auto-fills user details if logged in
- Authentication required (redirects to login if not logged in)
- Email notifications:
  - Prescription sent to selected store owner
  - Includes patient details and delivery address
  - Prescription file attached as email attachment
  - Confirmation email sent to patient
- Fully responsive design

**Access:**
- Available from navbar "Upload Prescription" link (customers only)
- Direct URL: `/prescription-upload`

## 📧 Email Configuration

Update these in `application.properties`:

```properties
# Support Email (where queries are sent)
app.support.email=support@arcmedical.com

# Mail server configuration (for sending emails)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

**Note:** Update the placeholder phone number in `NeedHelp.jsx`:
```javascript
const supportPhone = '+91-XXX-XXX-XXXX'; // Update with your phone number
```

## 🔧 Backend Endpoints

### Support Endpoints

1. **POST `/support/contact`**
   - Submit customer query
   - Body: `ContactFormDTO` (name, email, phone, subject, message)
   - Sends email to support email and customer confirmation

### Prescription Endpoints

1. **POST `/prescription/upload`**
   - Upload prescription with patient details
   - Multipart form data:
     - `prescriptionFile`: File (required)
     - `storeId`: int (required)
     - `patientName`: String (required)
     - `patientPhone`: String (required)
     - `patientEmail`: String (required)
     - `deliveryAddress`: String (required)
     - `userId`: Integer (optional)
   - Sends email to store owner with prescription attached
   - Sends confirmation email to patient

## 📝 Files Created/Modified

### Frontend

**New Pages:**
- `client/src/pages/NeedHelp.jsx`
- `client/src/pages/PrescriptionUpload.jsx`

**New Styles:**
- `client/src/styles/NeedHelp.css`
- `client/src/styles/PrescriptionUpload.css`

**Updated:**
- `client/src/App.js` - Added routes
- `client/src/components/Navbar.jsx` - Added links

### Backend

**New Controllers:**
- `Medical-Store-Backend/.../Controller/SupportController.java`
- `Medical-Store-Backend/.../Controller/PrescriptionController.java`

**New Services:**
- `Medical-Store-Backend/.../Service/SupportService.java`

**New DTOs:**
- `Medical-Store-Backend/.../DTOs/ContactFormDTO.java`

**Updated:**
- `Medical-Store-Backend/.../resources/application.properties` - Added support email config

## 🎯 User Flow

### Need Help Flow

1. User clicks "Need Help?" in navbar
2. Sees contact options (Phone & Email)
3. Can call directly or fill query form
4. Submits query
5. Receives confirmation email
6. Support team receives query via email

### Prescription Upload Flow

1. **Customer must be logged in**
2. Navigates to "Upload Prescription" (navbar) or `/prescription-upload`
3. Selects store from dropdown
4. Fills patient details (auto-filled if logged in)
5. Uploads prescription file (JPEG, PNG, or PDF)
6. Enters delivery address
7. Submits form
8. Receives confirmation email
9. Store owner receives email with:
   - Patient details
   - Delivery address
   - Prescription file attached
10. Store owner reviews and contacts patient

## 🔒 Security & Validation

### Prescription Upload
- ✅ Authentication required
- ✅ File type validation (JPEG, PNG, PDF only)
- ✅ File size validation (max 5MB)
- ✅ Form validation (all required fields)
- ✅ Email format validation
- ✅ Phone number format validation

### Contact Form
- ✅ Email format validation
- ✅ Required field validation
- ✅ Optional phone number

## 📱 Responsive Design

Both pages are fully responsive:
- **Desktop**: Two-column layout for Need Help, full-width form for Prescription
- **Tablet**: Adjusted spacing and layout
- **Mobile**: Single column, optimized touch targets

## 🧪 Testing

### Test Need Help Page:
1. Go to `/need-help`
2. Try calling (should open phone dialer)
3. Try emailing (should open email client)
4. Fill and submit query form
5. Check email inbox for confirmation

### Test Prescription Upload:
1. Login as customer
2. Go to `/prescription-upload`
3. Select a store
4. Fill patient details
5. Upload a prescription file
6. Enter delivery address
7. Submit
8. Check emails:
   - Customer: Confirmation email
   - Store Owner: Prescription email with attachment

## 🎨 UI/UX Features

### Need Help Page:
- Icon-based visual design
- Direct action buttons (Call, Email)
- Clear form layout
- Success/error messages

### Prescription Upload:
- Drag and drop file upload area
- File preview with remove option
- Store selection with full details
- Informative notes section
- Success/error feedback

## 📞 Contact Information Placeholders

**Update these in `NeedHelp.jsx`:**
```javascript
const supportPhone = '+91-XXX-XXX-XXXX'; // Replace with actual phone
const supportEmail = 'support@arcmedical.com'; // Or use from backend config
```

**Update in `application.properties`:**
```properties
app.support.email=support@arcmedical.com
```

## ✅ Features Summary

- ✅ Need Help page with contact options
- ✅ Query submission form
- ✅ Prescription upload page
- ✅ Store selection for prescriptions
- ✅ File upload with validation
- ✅ Email notifications for queries
- ✅ Email notifications for prescriptions (with attachment)
- ✅ Auto-fill user details when logged in
- ✅ Responsive design
- ✅ Authentication for prescription upload
- ✅ Error handling and validation
- ✅ Success/error feedback messages

All features are fully implemented and ready to use!
