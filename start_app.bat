@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   🌾 Brinjal Disease Scanner
echo ========================================
echo.

set "BASE_DIR=%~dp0"
set "SERVER_DIR=%BASE_DIR%www"
set "PYTHON_EXE=%BASE_DIR%.venv\Scripts\python.exe"

if not exist "!PYTHON_EXE!" (
    set "PYTHON_EXE=python"
)

echo Using Python: !PYTHON_EXE!
echo Server Directory: !SERVER_DIR!
echo.

echo Starting AI Server...
cd /d "!SERVER_DIR!"
start /B "" "!PYTHON_EXE!" prediction_server.py > "%BASE_DIR%server.log" 2>&1

timeout /t 5 /nobreak > nul

echo.
echo Opening application in browser...
start http://localhost:5000/

echo.
echo Server is running at: http://localhost:5000/
echo.
echo [LOGS] You can check server.log for details.
echo.
pause