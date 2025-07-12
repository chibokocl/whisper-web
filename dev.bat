@echo off
echo 🚀 Starting Whisper Web Development Environment...
echo.

REM Check if backend node_modules exists
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed successfully
)

echo 🌐 Starting Frontend (Vite)...
echo 🔧 Starting Backend (Express)...
echo.

REM Start both servers using concurrently
call npm run dev

pause 