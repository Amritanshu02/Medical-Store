@echo off
echo ========================================
echo Starting Medical Store Frontend
echo ========================================
echo.

cd client

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting React development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
