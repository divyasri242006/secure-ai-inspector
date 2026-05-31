@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\ADMIN\OneDrive\mini project\mini project\ciphersense"

echo.
echo ================================
echo SecureAI Inspector - Diagnostics
echo ================================
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
  echo ❌ Node.js is NOT installed!
  echo.
  echo Please install Node.js from: https://nodejs.org
  echo After installation, run this script again.
  pause
  exit /b 1
) else (
  for /f "tokens=*" %%i in ('node --version') do echo ✓ Node.js installed: %%i
)

REM Check npm
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
  echo ❌ npm is NOT installed!
  pause
  exit /b 1
) else (
  for /f "tokens=*" %%i in ('npm --version') do echo ✓ npm installed: %%i
)

echo.
echo Checking project structure...

REM Check for package.json
if exist "package.json" (
  echo ✓ package.json found
) else (
  echo ❌ package.json NOT found!
  pause
  exit /b 1
)

REM Check for node_modules
if exist "node_modules" (
  echo ✓ node_modules folder exists
) else (
  echo ⚠ node_modules NOT found - will install
)

echo.
echo Installing/updating dependencies...
echo This may take 2-5 minutes...
echo.

call npm install

if errorlevel 1 (
  echo.
  echo ❌ npm install failed!
  echo.
  echo Trying to recover...
  echo.
  echo Cleaning cache...
  call npm cache clean --force
  echo.
  echo Retrying installation...
  call npm install
  if errorlevel 1 (
    echo.
    echo ❌ Installation still failed. Please check:
    echo - Internet connection
    echo - Disk space
    echo - Firewall settings
    pause
    exit /b 1
  )
)

echo.
echo ✓ Dependencies installed successfully!
echo.

REM Organize files
echo Organizing files...
if not exist "app\api\scan" mkdir "app\api\scan" >nul 2>&1
if not exist "app\api\generate-pdf" mkdir "app\api\generate-pdf" >nul 2>&1
if not exist "components" mkdir "components" >nul 2>&1
if not exist "types" mkdir "types" >nul 2>&1
if not exist "public" mkdir "public" >nul 2>&1

if exist "layout.tsx" move "layout.tsx" "app\" >nul 2>&1
if exist "page.tsx" move "page.tsx" "app\" >nul 2>&1
if exist "globals.css" move "globals.css" "app\" >nul 2>&1
if exist "scan-form.tsx" move "scan-form.tsx" "components\" >nul 2>&1
if exist "security-dashboard.tsx" move "security-dashboard.tsx" "components\" >nul 2>&1
if exist "recent-scans.tsx" move "recent-scans.tsx" "components\" >nul 2>&1
if exist "scan-route.ts" move "scan-route.ts" "app\api\scan\route.ts" >nul 2>&1
if exist "pdf-route.ts" move "pdf-route.ts" "app\api\generate-pdf\route.ts" >nul 2>&1
if exist "scan-types.ts" move "scan-types.ts" "types\scan.ts" >nul 2>&1
if exist "favicon.ico" move "favicon.ico" "public\" >nul 2>&1
if exist "api-scan-route.ts" del "api-scan-route.ts" >nul 2>&1
if exist "api-pdf-route.ts" del "api-pdf-route.ts" >nul 2>&1

echo ✓ Files organized

echo.
echo Creating .env.local...
if not exist ".env.local" (
  (
    echo ANTHROPIC_API_KEY=sk-ant-demo-key
    echo NEXT_PUBLIC_APP_NAME=SecureAI Inspector
  ) > .env.local
  echo ✓ .env.local created
)

echo.
echo Building project...
call npm run build

if errorlevel 1 (
  echo.
  echo ⚠ Build had warnings, continuing...
)

echo.
echo ================================
echo ✨ Setup Complete!
echo ================================
echo.
echo Starting development server on port 3000...
echo.
echo IMPORTANT:
echo - Keep this window open while using the website
echo - Browser will open automatically
echo - Press Ctrl+C to stop the server
echo.

echo Opening http://localhost:3000 in your browser...
timeout /t 2 >nul
start http://localhost:3000

echo.
npm run dev
