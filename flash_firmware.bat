@echo off
REM Rankify Assist Flash Script
REM Usage: flash_firmware.bat COMx (e.g., COM3)

if "%1"=="" (
    echo [ERROR] No COM port specified.
    echo Usage: flash_firmware.bat COMx
    echo Example: flash_firmware.bat COM3
    pause
    exit /b
)

echo [INFO] Switching to build directory...
cd /d c:\TUYA\TuyaOpen\apps\rankify_assist

echo [INFO] Flashing Firmware to T5-E1 Board on %1...
py ..\..\tos.py flash --port %1

if %errorlevel% neq 0 (
    echo [ERROR] Flashing Failed. Check connections and try again.
    pause
    exit /b
)

echo [SUCCESS] Firmware Flashed Successfully!
echo [INFO] Please RESET your board now.
pause
