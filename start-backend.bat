@echo off
echo ========================================
echo Starting Medical Store Backend
echo ========================================
echo.

cd Medical-Store-Backend

echo Checking Java version...
java -version
echo.

echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run

pause
