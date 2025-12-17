# 📖 The Absolute Beginner's Guide to Building Rankify Assist

**Goal:** Transform your "Tuya T5-E1 Board" into the "Rankify Assist Voice Master".
**Time Required:** ~30 Minutes
**Difficulty:** Very Easy (Just follow exactly)

---

## 🛑 PHASE 1: PREPARATION (Do this first!)

### Step 1: Install Python (The Brains)
The build tools need Python to run. Your computer's Python is currently broken, so let's fix it.

1.  **Download This File**: [Python 3.11 Installer (Windows)](https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe)
2.  **Open the Installer**.
3.  **⚠️ LOOK AT THE BOTTOM**: Check the box that says **"Add python.exe to PATH"**.
    *   *Why?* This lets you type `python` in any terminal. Without this, nothing works.
4.  **Click "Install Now"**.
5.  Wait for it to finish.

### Step 2: Open "PowerShell"
We will type all commands here.
1.  Press `Start` (Windows/Flag key).
2.  Type `powershell`.
3.  Right-click "Windows PowerShell" -> **Run as Administrator**.
4.  A blue window appears. This is your command center.

---

## 🏗️ PHASE 2: SETUP THE CODE workspace

### Step 3: Go to the Project Folder
We need to be in the folder where the Tuya Software Development Kit (SDK) lives.

**Command:**
```powershell
cd c:\TUYA\TuyaOpen\apps
```
*What happens:* It changes directory (`cd`) to the Apps folder.

### Step 4: Create the "Rankify" App Folder
We need a place for our specific code.

**Command:**
```powershell
mkdir rankify_assist
```
*What happens:* Creates a new empty folder `rankify_assist`.

### Step 5: Copy Your Code
Now we take the code we wrote (`c:\TUYA\RankifyAssist\firmware`) and put it into the SDK so it can be built.

**Command:**
```powershell
xcopy /E /I /Y "c:\TUYA\RankifyAssist\firmware" "c:\TUYA\TuyaOpen\apps\rankify_assist"
```
*What happens:* Copies all files. `/E` means subfolders too. `/Y` means overwrite without asking.

---

## 🔧 PHASE 3: CONFIGURE (Tell it who you are)

### Step 6: Go Into the App Folder
**Command:**
```powershell
cd rankify_assist
```

### Step 7: Select Your Board (T5AI)
We need to tell the build system "Hey, I am using the T5-E1 board".

**Command:**
```powershell
py ..\..\tos.py config choice
```
*What happens:*
1.  It runs the `tos.py` tool.
2.  It shows a list of boards (ESP32, T5AI, etc.).
3.  **ACTION:** Type `9` (or the number for **T5AI**) and press **Enter**.
4.  It saves a file `.config` saying "Target = T5AI".

---

## 🏭 PHASE 4: BUILD (The Heavy Lifting)

### Step 8: Compile the Firmware
This turns our C code into a `.bin` file the chip understands.

**Command:**
```powershell
py ..\..\tos.py build
```
*What happens:*
1.  **Download:** It downloads "Tools" (GCC Compiler) from the internet (~160MB). *Only the first time.*
2.  **Unzip:** It extracts the tools.
3.  **Compile:** It reads `tuya_config.h` (your IDs) and `tuya_main.c` (logic).
4.  **Link:** It joins them into one file.
5.  **Success:** It prints `Build Success`!

**⏳ WAIT:** This can take 5-10 minutes. Don't close the window.

---

## ⚡ PHASE 5: FLASH (Send to Board)

### Step 9: Plugin Your Board
Connect the T5-E1 to your PC using the USB-C cable.

### Step 10: Find the "COM Port"
The computer gives the board a numbner (like COM3).
1.  Right-click `Start` button -> **Device Manager**.
2.  Expand **Ports (COM & LPT)**.
3.  Look for **"USB Serial Device (COMx)"**.
4.  Remember the number (e.g., `COM3`).

### Step 11: Flash It!
Replace `COM3` with *your* number.

**Command:**
```powershell
py ..\..\tos.py flash -p COM3
```
*What happens:*
1.  It puts the board in "Download Mode".
2.  It sends the `.bin` file over the cable.
3.  It verifies the data.
4.  The board restarts.

---

## 🎉 PHASE 6: IT'S ALIVE!

### Step 12: Verify
1.  The board LED should blink or turn solid.
2.  Say **"Check my Gmail"**.
3.  If correctly paired, it should trigger!

### 🆘 Troubleshooting
*   **"Python not found"?** -> You skipped Step 1!
*   **"Build failed"?** -> Check Step 5 (Did you copy code?).
*   **"Flash failed"?** -> Check Step 10 (Wrong COM port?).

**Follow this exactly, and you CANNOT fail!** 🚀
