@echo off
echo ========================================
echo Medical Store - Full Stack Application
echo ========================================
echo.
echo Starting both backend and frontend...
echo.

start "Backend Server" cmd /k "start-backend.bat"
timeout /t 5 /nobreak >nul
start "Frontend Server" cmd /k "start-frontend.bat"

echo.
echo Both servers are starting in separate windows!
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Close the windows to stop the servers.
echo.
pause
