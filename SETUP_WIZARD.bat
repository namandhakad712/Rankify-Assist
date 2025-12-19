@echo off
chcp 65001 >nul
color 0A
title Rankify Assist - Setup Wizard

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║           🚀 RANKIFY ASSIST - SETUP WIZARD 🚀                   ║
echo ║                                                                ║
echo ║     Voice-Controlled Browser Automation with Tuya AI          ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo This wizard will guide you through the complete setup process.
echo Each step will be checked one by one.
echo.
pause

:CHECK_PYTHON
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 1/15: CHECK PYTHON INSTALLATION
echo ════════════════════════════════════════════════════════════════
echo.
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is NOT installed!
    echo.
    echo Please install Python 3.10 or higher from:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit
)
echo ✅ Python is installed!
python --version
echo.
pause

:CHECK_NODE
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 2/15: CHECK NODE.JS INSTALLATION
echo ════════════════════════════════════════════════════════════════
echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is NOT installed!
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit
)
echo ✅ Node.js is installed!
node --version
echo.
pause

:CHECK_GIT
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 3/15: CHECK GIT INSTALLATION
echo ════════════════════════════════════════════════════════════════
echo.
echo Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is NOT installed!
    echo.
    echo Please install Git from:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit
)
echo ✅ Git is installed!
git --version
echo.
pause

:INSTALL_TUYA_SDK
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 4/15: INSTALL TUYA MCP SDK
echo ════════════════════════════════════════════════════════════════
echo.
echo Have you already installed the Tuya MCP SDK? (Y/N)
set /p SDK_INSTALLED=Your answer: 

if /i "%SDK_INSTALLED%"=="N" (
    echo.
    echo Installing Tuya MCP SDK...
    cd ..
    if not exist "tuya-mcp-sdk" (
        echo Cloning SDK repository...
        git clone https://github.com/tuya/tuya-mcp-sdk.git
    )
    cd tuya-mcp-sdk\mcp-python
    echo Installing SDK...
    pip install -e .
    cd ..\..\RankifyAssist
    echo ✅ SDK installed!
) else (
    echo ✅ SDK already installed!
)
echo.
pause

:INSTALL_DEPS
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 5/15: INSTALL PYTHON DEPENDENCIES
echo ════════════════════════════════════════════════════════════════
echo.
echo Installing Python packages...
pip install fastmcp httpx python-dotenv
echo.
echo ✅ Dependencies installed!
pause

:SUPABASE_SETUP
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 6/15: SUPABASE SETUP
echo ════════════════════════════════════════════════════════════════
echo.
echo Have you created a Supabase project? (Y/N)
set /p SUPABASE_DONE=Your answer: 

if /i "%SUPABASE_DONE%"=="N" (
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to https://supabase.com
    echo 2. Sign up / Sign in
    echo 3. Create a new project
    echo 4. Go to SQL Editor
    echo 5. Run the SQL from: cloud-bridge\supabase-schema.sql
    echo 6. Go to Settings -^> API
    echo 7. Copy your URL and anon key
    echo.
    echo Press any key when done...
    pause >nul
)
echo ✅ Supabase is ready!
pause

:GOOGLE_OAUTH
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 7/15: GOOGLE OAUTH SETUP
echo ════════════════════════════════════════════════════════════════
echo.
echo Have you set up Google OAuth? (Y/N)
set /p GOOGLE_DONE=Your answer: 

if /i "%GOOGLE_DONE%"=="N" (
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to https://console.cloud.google.com
    echo 2. Create a project or select one
    echo 3. Enable "Google+ API"
    echo 4. Create OAuth 2.0 credentials
    echo 5. Add redirect URI: https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
    echo 6. Copy Client ID and Client Secret
    echo.
    echo Press any key when done...
    pause >nul
)
echo ✅ Google OAuth ready!
pause

:VERCEL_DEPLOY
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 8/15: DEPLOY CLOUD BRIDGE TO VERCEL
echo ════════════════════════════════════════════════════════════════
echo.
echo Have you deployed the Cloud Bridge to Vercel? (Y/N)
set /p VERCEL_DONE=Your answer: 

if /i "%VERCEL_DONE%"=="N" (
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Push code to GitHub
    echo 2. Go to https://vercel.com
    echo 3. Import your GitHub repository
    echo 4. Set Root Directory to: cloud-bridge
    echo 5. Add environment variables:
    echo    - SUPABASE_URL
    echo    - SUPABASE_ANON_KEY
    echo    - GOOGLE_CLIENT_ID
    echo    - GOOGLE_CLIENT_SECRET
    echo    - MCP_API_KEY (make up a random string)
    echo 6. Deploy!
    echo.
    echo Press any key when done...
    pause >nul
)
echo ✅ Cloud Bridge deployed!
pause

:TUYA_MCP_BROWSER
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 9/15: CREATE BROWSER AUTOMATION MCP ON TUYA
echo ════════════════════════════════════════════════════════════════
echo.
echo Have you created Browser Automation MCP on Tuya Platform? (Y/N)
set /p TUYA_BROWSER_DONE=Your answer: 

if /i "%TUYA_BROWSER_DONE%"=="N" (
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to https://platform.tuya.com/exp/ai/mcp
    echo 2. Click "Custom MCP Service"
    echo 3. Click "Add custom MCP"
    echo 4. Fill in:
    echo    Name EN: Browser Automation
    echo    Description: Automates browser via extension
    echo 5. Add Data Center (India or your region)
    echo 6. COPY these 3 values:
    echo    - Endpoint
    echo    - Access ID
    echo    - Access Secret
    echo.
    echo Press any key when done...
    pause >nul
)
echo ✅ Browser Automation MCP created!
pause

:CONFIG_BROWSER_ENV
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 10/15: CONFIGURE BROWSER MCP .ENV FILE
echo ════════════════════════════════════════════════════════════════
echo.
if not exist "mcp-servers\browser-automation\.env" (
    echo Creating .env file...
    (
        echo MCP_ENDPOINT=https://mcp-in.iotbing.com
        echo MCP_ACCESS_ID=PUT_YOUR_ACCESS_ID_HERE
        echo MCP_ACCESS_SECRET=PUT_YOUR_ACCESS_SECRET_HERE
        echo CLOUD_BRIDGE_URL=https://your-project.vercel.app
        echo MCP_API_KEY=same_as_vercel_mcp_api_key
    ) > mcp-servers\browser-automation\.env
    echo.
    echo ✅ .env file created!
    echo.
    echo NOW EDIT THIS FILE:
    echo mcp-servers\browser-automation\.env
    echo.
    echo Add your actual credentials from Tuya Platform!
) else (
    echo ✅ .env file already exists!
)
echo.
pause

:EXTENSION_BUILD
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 11/15: BUILD CHROME EXTENSION
echo ════════════════════════════════════════════════════════════════
echo.
echo Have you built the Chrome extension? (Y/N)
set /p EXTENSION_DONE=Your answer: 

if /i "%EXTENSION_DONE%"=="N" (
    echo.
    echo Building extension...
    cd extension-raw
    call pnpm install
    call pnpm build
    cd ..
    echo.
    echo ✅ Extension built!
    echo.
    echo NOW LOAD IT IN CHROME:
    echo 1. Open Chrome
    echo 2. Go to chrome://extensions/
    echo 3. Enable "Developer mode"
    echo 4. Click "Load unpacked"
    echo 5. Select: extension-raw\build\chrome-mv3-prod
    echo.
    pause
) else (
    echo ✅ Extension already built!
)
pause

:RUN_SERVERS
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 12/15: START MCP SERVERS
echo ════════════════════════════════════════════════════════════════
echo.
echo I will now start the MCP servers in new windows!
echo.
echo Terminal 1: FastMCP Server (Browser Automation)
echo Terminal 2: Tuya SDK Client (Browser Automation)
echo.
pause

start "FastMCP - Browser" cmd /k "cd /d %CD%\mcp-servers\browser-automation && python server.py"
timeout /t 3 >nul
start "Tuya Client - Browser" cmd /k "cd /d %CD%\mcp-servers\browser-automation && python tuya_client.py"

echo.
echo ✅ Servers started in new windows!
echo.
pause

:VERIFY_CONNECTION
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 13/15: VERIFY TUYA CONNECTION
echo ════════════════════════════════════════════════════════════════
echo.
echo Please check the Tuya SDK Client window.
echo.
echo You should see:
echo ✅ Connected to Tuya Platform!
echo ✅ MCP Server is now ONLINE!
echo.
echo Did you see these messages? (Y/N)
set /p CONNECTED=Your answer: 

if /i "%CONNECTED%"=="N" (
    echo.
    echo ❌ Connection failed!
    echo.
    echo Please check:
    echo 1. .env file has correct credentials
    echo 2. Internet connection is working
    echo 3. Tuya Platform MCP is configured
    echo.
    pause
    exit
)
echo ✅ Connected successfully!
pause

:CHECK_PLATFORM
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  STEP 14/15: VERIFY ON TUYA PLATFORM
echo ════════════════════════════════════════════════════════════════
echo.
echo Opening Tuya Platform in browser...
start https://platform.tuya.com/exp/ai/mcp
echo.
echo Please check:
echo 1. Browser Automation → Status: Online ✅
echo 2. Tool tab → Shows: execute_browser_command
echo.
echo Is everything showing Online? (Y/N)
set /p PLATFORM_OK=Your answer: 

if /i "%PLATFORM_OK%"=="N" (
    echo.
    echo ❌ Not showing online!
    echo.
    echo Please:
    echo 1. Refresh the Tuya Platform page
    echo 2. Check MCP servers are running
    echo 3. Check .env credentials are correct
    echo.
    pause
    exit
)
echo ✅ Platform shows Online!
pause

:COMPLETE
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║                  🎉 SETUP COMPLETE! 🎉                          ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ✅ ALL STEPS COMPLETED!
echo.
echo WHAT'S RUNNING:
echo ├─ FastMCP Server (Browser Automation)
echo ├─ Tuya SDK Client (Connected to Tuya Platform)
echo ├─ Cloud Bridge (Deployed on Vercel)
echo └─ Chrome Extension (Loaded in browser)
echo.
echo NEXT STEPS:
echo.
echo 1. Configure extension settings:
echo    - Open extension options
echo    - Set Bridge URL to your Vercel URL
echo    - Click "Test Connection"
echo.
echo 2. Test with Tuya AI:
echo    - Open SmartLife app
echo    - Talk to AI: "Open Google in browser"
echo    - OR create a workflow in Tuya Platform
echo.
echo 3. Read the guides:
echo    - docs\mcp\SETUP-GUIDE.md
echo    - SUCCESS-GUIDE.md
echo.
echo KEEP THE SERVER WINDOWS OPEN!
echo They must run while you use the system.
echo.
pause
exit
