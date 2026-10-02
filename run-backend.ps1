# Backend Run Script for Medical Store
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Medical Store Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to backend directory
Set-Location "Medical-Store-Backend"

# Check Java version
Write-Host "`nChecking Java version..." -ForegroundColor Yellow
try {
    $javaVersionOutput = java -version 2>&1 | Out-String
    Write-Host $javaVersionOutput -ForegroundColor White
    
    # Check if Java 17+ is available
    if ($javaVersionOutput -match "version ""1\.([0-9])") {
        $minorVersion = [int]$matches[1]
        if ($minorVersion -lt 17) {
            Write-Host "`n❌ ERROR: Java 17 or higher is required!" -ForegroundColor Red
            Write-Host "Current version: Java 1.$minorVersion" -ForegroundColor Red
            Write-Host "`nPlease install Java 17 JDK (not JRE) from:" -ForegroundColor Yellow
            Write-Host "  https://adoptium.net/temurin/releases/" -ForegroundColor Cyan
            Write-Host "`nAfter installation:" -ForegroundColor Yellow
            Write-Host "  1. Set JAVA_HOME environment variable to JDK installation path" -ForegroundColor White
            Write-Host "  2. Add %JAVA_HOME%\bin to your PATH" -ForegroundColor White
            Write-Host "  3. Restart this terminal and try again" -ForegroundColor White
            exit 1
        }
    }
    
    # Check if JDK is available (not just JRE)
    $javacCheck = javac -version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ ERROR: JDK (Java Development Kit) is required, not just JRE!" -ForegroundColor Red
        Write-Host "Please install JDK 17+ from: https://adoptium.net/" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "JDK found: $javacCheck" -ForegroundColor Green
} catch {
    Write-Host "`n❌ ERROR: Java is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Java 17 JDK from: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# Run Maven Spring Boot
Write-Host "`nStarting Spring Boot application..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

mvn spring-boot:run
