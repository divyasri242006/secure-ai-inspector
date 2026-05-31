@echo off
cd /d "c:\Users\ADMIN\OneDrive\mini project\mini project\ciphersense"

echo Cleaning...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
del yarn.lock 2>nul

echo Installing...
npm install --legacy-peer-deps

echo Building...
npm run build

echo.
echo ================================
echo ✨ STARTING SERVER
echo ================================
echo.
echo Open: http://localhost:3000
echo.

npm run dev
