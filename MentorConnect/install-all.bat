@echo off
echo ========================================
echo MentorConnect Full Installation
echo ========================================
echo.

echo Installing Frontend Dependencies...
call npm install
echo.

echo Installing Backend Dependencies...
cd server
call npm install
cd ..
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Start Backend:  cd server ^&^& npm start
echo 2. Start Frontend: npm run dev (in new terminal)
echo.
pause
