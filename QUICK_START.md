# Quick Start Guide - Medical Store Application

## Prerequisites Check

Before running, ensure you have:
- ⚠️ **Java 17 JDK or higher** (NOT JRE - you need JDK for compilation)
  - Current: Check with `java -version` and `javac -version`
  - Download: https://adoptium.net/temurin/releases/ (Select JDK 17+)
  - **IMPORTANT:** You need JDK (Java Development Kit), not just JRE (Java Runtime Environment)
- ✅ **Maven** (Current: Check with `mvn -version`)
- ✅ **Node.js** (v14+) and npm (Current: Check with `node -v` and `npm -v`)
- ✅ **PostgreSQL Database** (Already configured in cloud - CockroachDB)
- ⚠️ **Email Configuration** (Gmail SMTP - optional, but needed for order notifications)

## Quick Run (Easiest Method)

### Option 1: Use the Run Scripts

1. **Run Backend:**
   ```powershell
   .\run-backend.ps1
   ```

2. **Run Frontend (in a new terminal):**
   ```powershell
   .\run-frontend.ps1
   ```

3. **Or run both automatically:**
   ```powershell
   .\run-both.ps1
   ```

### Option 2: Manual Run

#### Backend (Terminal 1):
```powershell
cd Medical-Store-Backend
mvn spring-boot:run
```

#### Frontend (Terminal 2):
```powershell
cd client
npm start
```

## Important Configuration

### 1. Email Setup (Required for Order Notifications)

Edit `Medical-Store-Backend/src/main/resources/application.properties`:

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

**For Gmail:**
1. Enable 2-Step Verification
2. Go to Google Account → Security → App passwords
3. Generate a password for "Mail"
4. Use that password (not your regular Gmail password)

### 2. Java Version Issue (CRITICAL)

**Current Issue:** Your system has Java 8, but the project requires Java 17 JDK.

**Solution:**
1. **Download Java 17 JDK** (NOT JRE) from: https://adoptium.net/temurin/releases/
   - Select: Version 17 (LTS), Operating System: Windows, Architecture: x64
   - Download the **JDK** installer (not JRE)

2. **Install Java 17 JDK**

3. **Set Environment Variables:**
   - Open System Properties → Environment Variables
   - Set `JAVA_HOME` to: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot` (or your installation path)
   - Add to `PATH`: `%JAVA_HOME%\bin`

4. **Verify Installation:**
   ```powershell
   java -version    # Should show version 17+
   javac -version   # Should show version 17+ (this confirms JDK, not just JRE)
   ```

5. **Restart your terminal** and try running the backend again

**Alternative:** If you can't install Java 17, you can try using the Maven wrapper, but it may still require JDK:
```powershell
cd Medical-Store-Backend
.\mvnw.cmd spring-boot:run
```

## Access Points

Once running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Docs:** Check backend logs for available endpoints

## Troubleshooting

### Backend won't start:
1. Check Java version: `java -version` (needs 17+)
2. Check database connection (cloud DB should be accessible)
3. Check email configuration (can be skipped for testing)
4. Check Maven dependencies: `mvn clean install`

### Frontend won't start:
1. Install dependencies: `cd client; npm install`
2. Check if port 3000 is available
3. Check Node.js version: `node -v` (needs 14+)

### Database Connection Issues:
- The project uses CockroachDB cloud (already configured)
- If connection fails, check internet connectivity
- Database credentials are in `application.properties`

### Email Not Sending:
- This won't prevent the app from running
- Orders will be created but emails won't be sent
- Configure Gmail SMTP to enable email notifications

## Testing the Application

1. Open http://localhost:3000
2. Browse to Store page: `/store?storeId=1`
3. Add medicines to cart
4. Go to cart: `/cart`
5. Proceed to checkout: `/checkout`
6. Place an order (email will be sent if configured)

## Stopping the Servers

- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

## Next Steps

- Configure email for order notifications
- Add medicines to the database
- Test the complete order flow
- Customize store information
