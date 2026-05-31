@echo off
cd /d "c:\Users\ADMIN\OneDrive\mini project\mini project\ciphersense"

echo ================================
echo SecureAI Inspector - Debug Mode
echo ================================
echo.

echo 1. Checking Node.js...
node --version
if errorlevel 1 goto ERROR_NODE

echo.
echo 2. Checking npm...
npm --version
if errorlevel 1 goto ERROR_NPM

echo.
echo 3. Current directory:
cd

echo.
echo 4. Listing files...
dir /b *.* | findstr /E "package.json tsconfig"

echo.
echo 5. Removing old files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .next rmdir /s /q .next

echo ✓ Cleaned

echo.
echo 6. Installing npm packages...
echo (verbose output below)
npm install
if errorlevel 1 goto ERROR_INSTALL

echo ✓ Installation successful

echo.
echo 7. Building...
npm run build
if errorlevel 1 goto ERROR_BUILD

echo ✓ Build successful

echo.
echo 8. Starting server...
echo.
echo ================================
echo Server should start below:
echo ================================
echo.

npm run dev
goto END

:ERROR_NODE
echo.
echo ❌ ERROR: Node.js not found!
echo Install from: https://nodejs.org
pause
goto END

:ERROR_NPM
echo.
echo ❌ ERROR: npm not found!
echo Install Node.js from: https://nodejs.org
pause
goto END

:ERROR_INSTALL
echo.
echo ❌ ERROR: npm install failed!
echo Trying with --legacy-peer-deps...
npm install --legacy-peer-deps
if errorlevel 1 (
  echo Still failed. Check internet connection.
  pause
  goto END
)
npm run build
if errorlevel 1 goto ERROR_BUILD
npm run dev
goto END

:ERROR_BUILD
echo.
echo ❌ ERROR: Build failed!
echo.
echo Press any key to see details...
pause
goto END

:END
pause
