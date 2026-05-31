@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\ADMIN\OneDrive\mini project\mini project\ciphersense"

echo.
echo ================================
echo SecureAI Inspector - Clean Setup
echo ================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version
if errorlevel 1 (
  echo ERROR: Node.js not found! Install from https://nodejs.org
  pause
  exit /b 1
)

echo.
echo Cleaning old installation...
echo.

REM Remove old files
if exist "node_modules" (
  echo Removing node_modules...
  rmdir /s /q node_modules 2>nul
  echo ✓ Removed
)

if exist "package-lock.json" (
  echo Removing package-lock.json...
  del package-lock.json 2>nul
  echo ✓ Removed
)

if exist ".next" (
  echo Removing .next cache...
  rmdir /s /q .next 2>nul
  echo ✓ Removed
)

echo.
echo Clearing npm cache...
call npm cache clean --force >nul 2>&1
echo ✓ Cache cleared

echo.
echo Installing dependencies...
echo (This takes 2-5 minutes, please wait...)
echo.

call npm install

if errorlevel 1 (
  echo.
  echo ERROR: npm install failed!
  echo.
  echo Trying with legacy peer deps...
  call npm install --legacy-peer-deps
  
  if errorlevel 1 (
    echo.
    echo ERROR: Installation failed even with legacy peer deps
    echo.
    echo Please check:
    echo - Internet connection
    echo - Node.js installation
    echo - Disk space
    echo.
    pause
    exit /b 1
  )
)

echo.
echo ✓ Dependencies installed successfully!
echo.

echo Building project...
call npm run build

if errorlevel 1 (
  echo.
  echo ERROR: Build failed!
  echo.
  pause
  exit /b 1
)

echo.
echo ✓ Build successful!
echo.
echo ================================
echo ✨ Ready to run!
echo ================================
echo.
echo Starting development server...
echo.
echo Website will be at: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev
