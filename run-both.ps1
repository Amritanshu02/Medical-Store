# Run Both Backend and Frontend Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Medical Store - Full Stack Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nThis script will start both backend and frontend" -ForegroundColor Yellow
Write-Host "You need to run them in separate terminal windows`n" -ForegroundColor Yellow

# Get the current directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = $scriptPath

Write-Host "Project Root: $projectRoot" -ForegroundColor White
Write-Host "`nTo run the application:" -ForegroundColor Green
Write-Host "1. Open a new terminal and run: .\run-backend.ps1" -ForegroundColor Cyan
Write-Host "2. Open another terminal and run: .\run-frontend.ps1" -ForegroundColor Cyan
Write-Host "`nOr run them manually:" -ForegroundColor Yellow
Write-Host "  Backend:  cd Medical-Store-Backend; mvn spring-boot:run" -ForegroundColor White
Write-Host "  Frontend: cd client; npm start" -ForegroundColor White
Write-Host "`nPress any key to open backend in a new window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; .\run-backend.ps1"

Write-Host "`nBackend started in new window. Starting frontend in 5 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; .\run-frontend.ps1"

Write-Host "`nBoth services are starting!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
