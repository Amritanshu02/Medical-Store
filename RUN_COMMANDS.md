# Commands to Run the Application

## Quick Start

### Option 1: Using Batch Scripts (Windows - Easiest)

**Run Backend Only:**
```bash
start-backend.bat
```

**Run Frontend Only:**
```bash
start-frontend.bat
```

**Run Both (Backend + Frontend):**
```bash
start-both.bat
```

---

### Option 2: Using PowerShell Scripts

**Run Backend Only:**
```powershell
.\run-backend.ps1
```

**Run Frontend Only:**
```powershell
.\run-frontend.ps1
```

**Run Both:**
```powershell
.\run-both.ps1
```

---

### Option 3: Manual Commands

#### Backend

1. **Navigate to backend directory:**
   ```bash
   cd "Medical-Store-Backend"
   ```

2. **Build (optional, if you made changes):**
   ```bash
   mvn clean install
   ```

3. **Run:**
   ```bash
   mvn spring-boot:run
   ```

   Backend will start on: **http://localhost:9000**

#### Frontend

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies (first time only):**
   ```bash
   npm install
   ```

3. **Run:**
   ```bash
   npm start
   ```

   Frontend will start on: **http://localhost:3000**

---

## Prerequisites Check

Before running, ensure you have:

1. **Java 17 JDK** installed
   ```bash
   java -version
   ```
   Should show: `openjdk version "17"` or similar

2. **Maven** installed
   ```bash
   mvn -version
   ```

3. **Node.js** installed
   ```bash
   node -version
   ```
   Should show: `v16.x.x` or higher

4. **npm** installed
   ```bash
   npm -version
   ```

---

## MongoDB Connection

The application connects to MongoDB Atlas automatically using the connection string in `application.properties`:
```
mongodb+srv://amritanshu9794:amritanshu123@cluster0.xzxxkao.mongodb.net/medical_store
```

No additional setup required - the database is cloud-hosted.

---

## Stopping the Application

### Backend
- Press `Ctrl + C` in the terminal where backend is running

### Frontend
- Press `Ctrl + C` in the terminal where frontend is running

---

## Troubleshooting

### Backend won't start
- Check if port 9000 is available
- Verify Java 17 is installed: `java -version`
- Check MongoDB connection string

### Frontend won't start
- Check if port 3000 is available
- Run `npm install` if dependencies are missing
- Clear cache: `npm cache clean --force`

### Both won't start together
- Use separate terminal windows
- Or use the batch/PowerShell scripts which open separate windows

---

## Default URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:9000
- **MongoDB Atlas:** https://cloud.mongodb.com/

---

**Note:** The first time you run the application, it may take a few minutes to:
- Download Maven dependencies (backend)
- Download npm packages (frontend)
- Connect to MongoDB Atlas

Subsequent runs will be faster.
