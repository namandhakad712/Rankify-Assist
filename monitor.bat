@echo off
REM Rankify Assist Monitor Script
REM Usage: monitor.bat COMx

if "%1"=="" (
    echo [ERROR] No COM port specified.
    echo Usage: monitor.bat COMx
    pause
    exit /b
)

cd /d c:\TUYA\TuyaOpen\apps\rankify_assist
echo [INFO] Starting Serial Monitor on %1...
echo [INFO] Press Ctrl+C to exit.
py ..\..\tos.py monitor --port %1
pause
