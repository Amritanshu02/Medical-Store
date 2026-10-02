# Quick Start Guide - Medical Store Application

## 🚀 Fastest Way to Run

### **Just Double-Click:**
1. Double-click **`start-both.bat`**
2. Wait 30-60 seconds
3. Open http://localhost:3000 in your browser

That's it! 🎉

---

## 📋 All Available Commands

### Windows Batch Scripts (Easiest):
```batch
start-both.bat      # Start both backend and frontend
start-backend.bat   # Start backend only
start-frontend.bat  # Start frontend only
```

### PowerShell Scripts:
```powershell
.\run-both.ps1      # Start both servers
.\run-backend.ps1   # Start backend only
.\run-frontend.ps1  # Start frontend only
```

### Manual Commands:

**Backend:**
```powershell
cd Medical-Store-Backend
mvn spring-boot:run
```

**Frontend:**
```powershell
cd client
npm start
```

---

## 🗄️ Database

**Remote Database (CockroachDB Cloud)**
- ✅ Already configured
- ✅ No local setup needed
- ✅ Requires internet connection
- ✅ Hosted on AWS (Mumbai region)

---

## 📍 Access URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080

---

## ⚠️ Prerequisites

- Java 17 JDK (not JRE)
- Maven
- Node.js (v14+)
- Internet connection (for database)

---

## 🛑 Stop Application

Press `Ctrl+C` in each terminal window, or close the windows.

---

**For detailed information, see `RUN_APPLICATION.md`**
