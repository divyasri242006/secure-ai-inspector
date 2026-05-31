@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\ADMIN\OneDrive\mini project\mini project\ciphersense"

echo.
echo ================================
echo SecureAI Inspector - Full Setup
echo ================================
echo.

REM Create directories
echo Creating directories...
if not exist "app\api\scan" mkdir "app\api\scan"
if not exist "app\api\generate-pdf" mkdir "app\api\generate-pdf"
if not exist "components" mkdir "components"
if not exist "types" mkdir "types"
if not exist "public" mkdir "public"
echo ✓ Directories created

REM Move files
echo.
echo Moving files to correct locations...

if exist "layout.tsx" move "layout.tsx" "app\" >nul 2>&1 && echo ✓ layout.tsx
if exist "page.tsx" move "page.tsx" "app\" >nul 2>&1 && echo ✓ page.tsx
if exist "globals.css" move "globals.css" "app\" >nul 2>&1 && echo ✓ globals.css

if exist "scan-form.tsx" move "scan-form.tsx" "components\" >nul 2>&1 && echo ✓ scan-form.tsx
if exist "security-dashboard.tsx" move "security-dashboard.tsx" "components\" >nul 2>&1 && echo ✓ security-dashboard.tsx
if exist "recent-scans.tsx" move "recent-scans.tsx" "components\" >nul 2>&1 && echo ✓ recent-scans.tsx

if exist "scan-route.ts" move "scan-route.ts" "app\api\scan\route.ts" >nul 2>&1 && echo ✓ scan-route.ts
if exist "pdf-route.ts" move "pdf-route.ts" "app\api\generate-pdf\route.ts" >nul 2>&1 && echo ✓ pdf-route.ts

if exist "scan-types.ts" move "scan-types.ts" "types\scan.ts" >nul 2>&1 && echo ✓ scan-types.ts
if exist "favicon.ico" move "favicon.ico" "public\" >nul 2>&1 && echo ✓ favicon.ico

if exist "api-scan-route.ts" del "api-scan-route.ts" >nul 2>&1
if exist "api-pdf-route.ts" del "api-pdf-route.ts" >nul 2>&1

echo.
echo Creating .env.local...
if not exist ".env.local" (
  (
    echo ANTHROPIC_API_KEY=sk-ant-placeholder-key
    echo NEXT_PUBLIC_APP_NAME=SecureAI Inspector
  ) > .env.local
  echo ✓ .env.local created (using placeholder key - update with real key)
) else (
  echo ✓ .env.local already exists
)

echo.
echo Installing dependencies...
call npm install >nul 2>&1
if errorlevel 1 (
  echo ⚠ npm install had issues, continuing anyway...
) else (
  echo ✓ Dependencies installed
)

echo.
echo Building project...
call npm run build >nul 2>&1
if errorlevel 1 (
  echo ⚠ Build had warnings/errors, attempting to start anyway...
) else (
  echo ✓ Build successful
)

echo.
echo ================================
echo ✨ Setup Complete!
echo ================================
echo.
echo Starting development server...
echo.
echo Access the website at:
echo   http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
