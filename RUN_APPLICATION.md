# How to Run Medical Store Application

## 🗄️ Database Information

**YES, we are using a REMOTE database!**

- **Database Type:** PostgreSQL (CockroachDB Cloud)
- **Host:** `steady-boar-19881.j77.aws-ap-south-1.cockroachlabs.cloud`
- **Port:** `26257`
- **Database:** `defaultdb`
- **Location:** AWS Asia Pacific (Mumbai) - ap-south-1
- **Connection:** SSL enabled (verify-full)

The database is already configured in `Medical-Store-Backend/src/main/resources/application.properties`. No local database setup is required!

---

## 🚀 Quick Start (Easiest Method)

### Option 1: Use Batch Scripts (Windows)

1. **Double-click `start-both.bat`**
   - This will start both backend and frontend in separate windows
   - Wait for both to start (about 30-60 seconds)

2. **Or start them separately:**
   - Double-click `start-backend.bat` (Terminal 1)
   - Double-click `start-frontend.bat` (Terminal 2)

### Option 2: Use PowerShell Scripts

1. **Run both:**
   ```powershell
   .\run-both.ps1
   ```

2. **Or separately:**
   ```powershell
   # Terminal 1
   .\run-backend.ps1
   
   # Terminal 2
   .\run-frontend.ps1
   ```

### Option 3: Manual Commands

#### Terminal 1 - Backend:
```powershell
cd Medical-Store-Backend
mvn spring-boot:run
```

#### Terminal 2 - Frontend:
```powershell
cd client
npm start
```

---

## ⚙️ Prerequisites

Before running, ensure you have:

1. **Java 17 JDK** (NOT JRE)
   - Check: `java -version` and `javac -version`
   - Download: https://adoptium.net/temurin/releases/
   - Set `JAVA_HOME` environment variable

2. **Maven**
   - Check: `mvn -version`
   - Download: https://maven.apache.org/download.cgi

3. **Node.js** (v14+) and npm
   - Check: `node -v` and `npm -v`
   - Download: https://nodejs.org/

---

## 📍 Access Points

Once running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Health Check:** http://localhost:8080/stores/active

---

## 🔧 Troubleshooting

### Backend Won't Start

**Issue:** Java version error
- **Solution:** Install Java 17 JDK and set `JAVA_HOME`

**Issue:** Port 8080 already in use
- **Solution:** 
  ```powershell
  # Find process using port 8080
  netstat -ano | findstr :8080
  # Kill the process (replace PID)
  taskkill /PID <PID> /F
  ```

**Issue:** Database connection error
- **Solution:** Check internet connection (remote database requires internet)

**Issue:** Maven dependencies error
- **Solution:**
  ```powershell
  cd Medical-Store-Backend
  mvn clean install
  ```

### Frontend Won't Start

**Issue:** Port 3000 already in use
- **Solution:**
  ```powershell
  # Find process using port 3000
  netstat -ano | findstr :3000
  # Kill the process
  taskkill /PID <PID> /F
  ```

**Issue:** Dependencies not installed
- **Solution:**
  ```powershell
  cd client
  npm install
  ```

**Issue:** Module not found errors
- **Solution:**
  ```powershell
  cd client
  rm -rf node_modules package-lock.json
  npm install
  ```

### Login/Registration Not Working

**Issue:** "Cannot connect to server" error
- **Solution:** Make sure backend is running on http://localhost:8080
- Check backend terminal for errors
- Verify backend started successfully (look for "Started MedicalStoreBackendApplication")

**Issue:** "Invalid email or password"
- **Solution:** Create a new account via registration page
- Or use test credentials (if already created):
  - Customer: `customer@test.com` / `customer123`
  - Store Owner: `storeowner@test.com` / `store123`

---

## 📝 Common Commands

### Backend Commands:
```powershell
# Clean and build
cd Medical-Store-Backend
mvn clean install

# Run with Maven wrapper (if available)
.\mvnw.cmd spring-boot:run

# Check if backend is running
curl http://localhost:8080/stores/active
```

### Frontend Commands:
```powershell
# Install dependencies
cd client
npm install

# Start development server
npm start

# Build for production
npm run build

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 First Time Setup

1. **Install Prerequisites** (Java 17, Maven, Node.js)

2. **Install Frontend Dependencies:**
   ```powershell
   cd client
   npm install
   ```

3. **Verify Backend Dependencies:**
   ```powershell
   cd Medical-Store-Backend
   mvn clean install
   ```

4. **Start Both Servers:**
   - Use `start-both.bat` or run manually

5. **Create Test Users:**
   - Go to http://localhost:3000/register
   - Create customer and store owner accounts

---

## 📊 Database Status

The application uses a **remote CockroachDB database** hosted on AWS. 

- ✅ No local database installation needed
- ✅ Database is already configured
- ✅ Internet connection required
- ✅ SSL encryption enabled

To verify database connection:
- Check backend logs when starting
- Look for "HikariPool" connection messages
- If connection fails, check internet connectivity

---

## 🛑 Stopping the Application

1. **Close the terminal windows** (Ctrl+C in each)
2. **Or use Task Manager** to kill Java/Node processes

---

## 📞 Need Help?

1. Check backend terminal for error messages
2. Check browser console (F12) for frontend errors
3. Verify all prerequisites are installed
4. Ensure ports 3000 and 8080 are available
5. Check internet connection (for database)

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Java 17 JDK installed and `JAVA_HOME` set
- [ ] Maven installed and in PATH
- [ ] Node.js and npm installed
- [ ] Frontend dependencies installed (`npm install` in client folder)
- [ ] Backend compiles successfully (`mvn clean install`)
- [ ] Ports 3000 and 8080 are free
- [ ] Internet connection is active (for database)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors

---

**Happy Coding! 🎉**
