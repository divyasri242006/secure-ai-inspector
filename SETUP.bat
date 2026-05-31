@echo off
REM SecureAI Inspector - Complete Setup and Build Script for Windows

setlocal enabledelayedexpansion

echo.
echo ================================
echo SecureAI Inspector Setup
echo ================================
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ npm found
echo.

REM Step 1: Create directory structure
echo 📁 Creating project structure...
if not exist "app\api\scan" mkdir "app\api\scan"
if not exist "app\api\generate-pdf" mkdir "app\api\generate-pdf"
if not exist "components" mkdir "components"
if not exist "lib" mkdir "lib"
if not exist "public" mkdir "public"
if not exist "types" mkdir "types"

echo ✅ Directories created
echo.

REM Step 2: Move files to correct locations
echo 🔄 Organizing files...

if exist "layout.tsx" (
    move "layout.tsx" "app\" >nul 2>&1
    echo ✓ Moved layout.tsx to app\
)

if exist "page.tsx" (
    move "page.tsx" "app\" >nul 2>&1
    echo ✓ Moved page.tsx to app\
)

if exist "globals.css" (
    move "globals.css" "app\" >nul 2>&1
    echo ✓ Moved globals.css to app\
)

if exist "scan-form.tsx" (
    move "scan-form.tsx" "components\" >nul 2>&1
    echo ✓ Moved scan-form.tsx to components\
)

if exist "security-dashboard.tsx" (
    move "security-dashboard.tsx" "components\" >nul 2>&1
    echo ✓ Moved security-dashboard.tsx to components\
)

if exist "recent-scans.tsx" (
    move "recent-scans.tsx" "components\" >nul 2>&1
    echo ✓ Moved recent-scans.tsx to components\
)

if exist "scan-route.ts" (
    move "scan-route.ts" "app\api\scan\route.ts" >nul 2>&1
    echo ✓ Moved scan-route.ts to app\api\scan\route.ts
)

if exist "pdf-route.ts" (
    move "pdf-route.ts" "app\api\generate-pdf\route.ts" >nul 2>&1
    echo ✓ Moved pdf-route.ts to app\api\generate-pdf\route.ts
)

if exist "scan-types.ts" (
    move "scan-types.ts" "types\scan.ts" >nul 2>&1
    echo ✓ Moved scan-types.ts to types\scan.ts
)

if exist "favicon.ico" (
    move "favicon.ico" "public\" >nul 2>&1
    echo ✓ Moved favicon.ico to public\
)

echo.

REM Step 3: Clean up temporary files
echo 🧹 Cleaning up temporary files...
if exist "api-scan-route.ts" del "api-scan-route.ts" >nul 2>&1
if exist "api-pdf-route.ts" del "api-pdf-route.ts" >nul 2>&1

echo ✅ Cleanup complete
echo.

REM Step 4: Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed
    exit /b 1
)

echo.

REM Step 5: Build
echo 🔨 Building project...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

echo.
echo ================================
echo ✨ Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Create .env.local with your API key:
echo    ANTHROPIC_API_KEY=sk-ant-...
echo.
echo 2. Start development server:
echo    npm run dev
echo.
echo 3. Open http://localhost:3000 in your browser
echo.

pause
