@echo off
REM Globe Link - Development Helper Script for Windows
REM Run from root directory: start-dev.bat

echo.
echo ==================================================
echo      🌍 Globe Link Development Environment 🌍
echo ==================================================
echo.

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Start Backend
echo 📦 Starting Backend Server on port 5000...
start "Globe Link Backend" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
echo ⏳ Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak

REM Start Frontend
echo 📦 Starting Frontend Server on port 5173...
start "Globe Link Frontend" cmd /k "cd frontend && npm run dev"

REM Wait for frontend to start
timeout /t 2 /nobreak

echo.
echo ==================================================
echo ✅ Globe Link is starting up!
echo ==================================================
echo.
echo 🔗 Frontend:  http://localhost:5173
echo 🔗 Backend:   http://localhost:5000
echo 🗄️  Database:  MongoDB Atlas
echo.
echo 📚 Documentation:
echo    - Main:     README.md
echo    - Setup:    SETUP.md
echo    - Backend:  backend/README.md
echo    - Frontend: frontend/README.md
echo.
echo ⚠️  Note: Each server is running in a separate terminal window.
echo    Close each terminal window to stop the respective server.
echo.
pause
