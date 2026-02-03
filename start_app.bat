@echo off
echo ========================================
echo   🌾 Brinjal Disease Scanner
echo ========================================
echo.
echo Starting AI Server...
cd /d "C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www"
start /B python prediction_server.py
timeout /t 3 /nobreak > nul
echo.
echo Opening application in browser...
start http://localhost:5000/
echo.
echo Server is running at: http://localhost:5000/
echo Press Ctrl+C in the server window to stop.
echo.
pause