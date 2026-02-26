@echo off
echo ==========================================
echo   Brinjal Disease Scanner - Model Update
echo ==========================================
echo.
echo [1/2] Starting Model Training (this may take 30-40 mins)...
python train_model.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Training failed! Please check the error messages above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Converting Model to TFJS Format...
python convert.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Conversion failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echoParameters
echo ==========================================
echo   SUCCESS! Model updated and deployed.
echo ==========================================
echo.
pause
