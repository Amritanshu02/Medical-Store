# Frontend Run Script for Medical Store
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Medical Store Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location "client"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
    npm install
}

# Run React app
Write-Host "`nStarting React development server..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm start
