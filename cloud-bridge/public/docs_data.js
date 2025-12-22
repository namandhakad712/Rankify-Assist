window.DOCS_DATA = {
  "Getting Started": {
    "Visual Setup": `# 🎯 COMPLETE SETUP GUIDE - Visual Walkthrough

**Everything you need to get Rankify Assist running!**

---

## 📊 **VERCEL DASHBOARD SETUP (Step-by-Step)**

### **Step 1: Add Environment Variable - MCP_API_KEY**

\`\`\`
1. Go to: https://vercel.com/namandhakad712s-projects/rankify-assist

2. Click "Settings" (top navigation bar)

3. Click "Environment Variables" (left sidebar)

4. You'll see a form like this:

┌────────────────────────────────────────────────────────┐
│  Add New Environment Variable                          │
├────────────────────────────────────────────────────────┤
│  KEY (Required)                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ MCP_API_KEY                                      │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  VALUE (Required)                                      │
│  ┌──────────────────────────────────────────────────┐ │
│  │ YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui                 │ │ ← Paste your generated key
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ENVIRONMENTS                                          │
│  ☑ Production                                          │
│  ☑ Preview                                             │
│  ☐ Development                                         │
│                                                        │
│  [Save]                                                │
└────────────────────────────────────────────────────────┘

5. Click "Save"
\`\`\`

**Generate MCP_API_KEY:**
\`\`\`powershell
# Run this in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Output example: YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui
# Copy generated one! ✅
\`\`\`

---

### **Step 2: Verify All Environment Variables**

**You should have 4 variables:**

\`\`\`
┌──────────────────────┬──────────────────────────┬─────────────────┐
│ NAME                 │ VALUE (preview)          │ ENVIRONMENTS    │
├──────────────────────┼──────────────────────────┼─────────────────┤
│ SUPABASE_URL         │ https://xxxxx.supabase.. │ Prod, Preview   │
│ SUPABASE_ANON_KEY    │ eyJhbGciOiJIUzI1NiIs..   │ Prod, Preview   │
│ GOOGLE_CLIENT_ID     │ 123456-abc.apps.google.. │ Prod, Preview   │
│ MCP_API_KEY          │ YfV5qoR6FaBH39AZ...      │ Prod, Preview   │
└──────────────────────┴──────────────────────────┴─────────────────┘
\`\`\`

**If any missing, add them!**

---

### **Step 3: Redeploy**

\`\`\`
1. Click "Deployments" tab (top navigation)

2. Find latest deployment (top of list)

3. Click "..." (three dots) on the right

4. Click "Redeploy"

5. Modal appears:
┌────────────────────────────────────────┐
│  Redeploy to Production?               │
│                                        │
│  This will create a new deployment     │
│  with current environment variables.   │
│                                        │
│  [Cancel]  [Redeploy]                  │
└────────────────────────────────────────┘

6. Click "Redeploy"

7. Wait 1-2 minutes ⏱️

8. Status changes to: ✅ Ready
\`\`\`

---

### **Step 4: Test Deployment**

\`\`\`
1. Copy your URL from Vercel:
   URL: https://rankify-assist-namandhakad712s-projects.vercel.app

2. Open in browser:
   https://YOUR_URL/api/ping

3. Should see:
{
  "status": "ok",
  "service": "Tuya Cloud Bridge",
  "version": "1.0.0"
}
\`\`\`

**✅ If you see this → Cloud bridge is working!**

---

## 🧩 **EXTENSION SETUP**

### **Step 1: Update Bridge URL**

\`\`\`
1. Open Chrome

2. Go to: chrome://extensions/

3. Find "Rankify Assist"

4. Click "Options"

5. Scroll to "🌉 Tuya AI Bridge" section

6. You'll see:

┌────────────────────────────────────────────────────────┐
│  🌉 Tuya AI Bridge Connection                          │
├────────────────────────────────────────────────────────┤
│  Status:     ✗ Disconnected                            │
│              Cloud bridge responded with status: 404   │
│                                                        │
│  Bridge URL: ┌──────────────────────────────────────┐ │
│              │ [EDIT THIS FIELD!]                   │ │ ← Type YOUR Vercel URL here!
│              │ https://rankify-assist-xyz.vercel.app │ │
│              └──────────────────────────────────────┘ │
│                                                        │
│  Polling:    ⏹ Stopped                                 │
└────────────────────────────────────────────────────────┘

7. EDIT the Bridge URL field:
   - Click in the input box
   - Clear old URL
   - Paste YOUR Vercel URL: https://YOUR_PROJECT.vercel.app
   - Press TAB or click outside (auto-saves!)

8. Click "🔄 Test Connection"

9. Should show: ✓ Connected
\`\`\`

---

### **Step 2: Start Polling**

\`\`\`
After successful test:

1. Click "▶ Start Polling"

2. Status updates to:
┌────────────────────────────────────────┐
│  Status:  ✓ Connected                  │
│  Polling: ▶ Active                     │
└────────────────────────────────────────┘

3. Extension is now listening for commands! ✅
\`\`\`

---

## 🐍 **MCP SERVERS SETUP**

### **Step 1: Install Tuya MCP SDK**

\`\`\`powershell
# Clone SDK
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python

# Install
pip install -e .

# Verify
python -c "from mcp_sdk import create_mcpsdk; print('✅ SDK installed!')"
\`\`\`

---

### **Step 2: Configure Browser MCP**

\`\`\`powershell
# Navigate to folder
cd c:\\TUYA\\RankifyAssist\\mcp-servers\\browser-automation

# Copy template
copy .env.example .env

# Edit .env file
notepad .env
\`\`\`

**Fill in .env:**
\`\`\`env
# From Tuya MCP Management page (platform.tuya.com/exp/ai/mcp)
MCP_ENDPOINT=wss://mcp-us.tuya-inc.com:8443
MCP_ACCESS_ID=p17381234567890abc
MCP_ACCESS_SECRET=1234567890abcdef1234567890abcdef

# From Vercel deployment
CLOUD_BRIDGE_URL=https://rankify-assist-xyz.vercel.app

# Same as Vercel env var
MCP_API_KEY=YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui

# Your Google email
DEFAULT_USER_ID=your@gmail.com
\`\`\`

**Where to get credentials:**

\`\`\`
MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET:
1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Click "+ Add custom MCP"
3. Name: "Browser Automation"
4. Click "Create"
5. Click your MCP → Configuration tab
6. Copy all 3 values ✅
\`\`\`

---

### **Step 3: Run Browser MCP**

\`\`\`powershell
cd c:\\TUYA\\RankifyAssist\\mcp-servers\\browser-automation
python server.py
\`\`\`

**Expected output:**
\`\`\`
🌐 Browser Automation MCP Server
==================================================
MCP Endpoint: wss://mcp-us.tuya-inc.com:8443
Cloud Bridge: https://rankify-assist-xyz.vercel.app
Default User: your@gmail.com
==================================================

🚀 Starting Browser Automation MCP Server...
🔌 Connecting to Tuya MCP Gateway...
✅ Connected to Tuya Cloud!
🎧 Listening for tool calls from AI Workflow...

MCP Server is running. Press Ctrl+C to stop.
\`\`\`

**✅ Leave this terminal open!**

---

### **Step 4: Configure Device MCP** (Same process)

\`\`\`powershell
cd c:\\TUYA\\RankifyAssist\\mcp-servers\\device-controller
copy .env.example .env
notepad .env
\`\`\`

**Fill in .env:**
\`\`\`env
# From Tuya MCP page (DIFFERENT MCP than browser!)
MCP_ENDPOINT=wss://mcp-us.tuya-inc.com:8443
MCP_ACCESS_ID=p17389999999999xyz
MCP_ACCESS_SECRET=9999999999xyz9999999999xyz9999

# From iot.tuya.com → Your Project
TUYA_CLIENT_ID=abcdefg1234567
TUYA_CLIENT_SECRET=1234567890abcdefg1234567890abcd
TUYA_API_URL=https://openapi.tuyain.com
\`\`\`

**Run it:**
\`\`\`powershell
python server.py
\`\`\`

**Expected output:**
\`\`\`
🏠 Device Controller MCP Server
✅ Connected to Tuya Cloud!
🎧 Listening for device control calls...
\`\`\`

**✅ Leave this terminal open too!**

---

## ✅ **FINAL CHECKLIST**

### **Cloud Bridge:**
- [ ] MCP_API_KEY added to Vercel
- [ ] All 4 env vars present
- [ ] Redeployed successfully
- [ ] /api/ping returns success

### **Extension:**
- [ ] Bridge URL updated to YOUR Vercel URL
- [ ] Test connection shows ✓ Connected
- [ ] Polling started (▶ Active)
- [ ] Chrome extension loaded

### **MCP Servers:**
- [ ] Tuya MCP SDK installed
- [ ] Browser MCP .env configured
- [ ] Browser MCP running (✅ Connected to Tuya Cloud!)
- [ ] Device MCP .env configured
- [ ] Device MCP running (✅ Connected to Tuya Cloud!)

### **Tuya Workflow:**
- [ ] MCPs added to workflow nodes
- [ ] Workflow published
- [ ] QR code saved

---

## 🧪 **TEST IT!**

**1. Open SmartLife app**

**2. Say: "check my gmail"**

**Expected flow:**
\`\`\`
YOU → "check my gmail"
  ↓
Tuya AI → Recognizes intent
  ↓
Workflow → Asks "I plan to open Gmail. Proceed?"
  ↓
YOU → "yes"
  ↓
Workflow → Calls Browser MCP
  ↓
MCP → Sends to Vercel /api/execute
  ↓
Vercel → Stores in Supabase
  ↓
Extension → Polls, gets command
  ↓
Extension → Opens Gmail, counts emails
  ↓
Extension → Sends result to Vercel
  ↓
Vercel → Returns to MCP
  ↓
MCP → Returns to Workflow
  ↓
Workflow → Says "You have 5 unread emails"
\`\`\`

**If this works → YOU'RE DONE!** 🎉

---

## 🆘 **TROUBLESHOOTING**

### **404 Error in Extension:**

**Problem:** Bridge URL not updated
**Solution:**
1. Extension Options → Tuya Bridge section
2. Edit Bridge URL field
3. Paste YOUR Vercel URL
4. Press TAB (auto-saves)
5. Test Connection

---

### **MCP_API_KEY Error:**

**Problem:** Variable not set in Vercel
**Solution:**
1. Vercel → Settings → Environment Variables
2. Add: MCP_API_KEY = (your generated key)
3. Check: Production ✅ Preview ✅
4. Save
5. Deployments → Redeploy

---

### **MCP Not Connecting:**

**Problem:** Wrong credentials
**Solution:**
1. Check .env file has correct values
2. Verify MCP created in platform.tuya.com
3. Copy credentials again
4. Restart python server.py

---

### **Extension Not Polling:**

**Problem:** Bridge URL wrong or not saved
**Solution:**
1. Check URL doesn't have trailing \`/\`
2. Verify URL matches Vercel deployment
3. Edit URL → Press TAB → Test Connection
4. Start Polling

---

**COMPLETE SETUP TIME: ~30 minutes**

**COST: $0/month**

**YOU'RE READY TO GO!** 🚀
`
  },
  "Cloud Bridge": {
    "Architecture": `# ☁️ Cloud Bridge Service - Always-On Architecture

## System Verification Logic

\`\`\`mermaid
sequenceDiagram
    participant User as 👤 User (T5AI Board)
    participant Cloud as ☁️ Tuya AI Workflow
    participant MCP_Browser as 🐳 Browser MCP (Docker/HF)
    participant MCP_Device as 🐳 Device MCP (Docker/HF)
    participant Vercel as 🚀 Cloud Bridge (Vercel)
    participant Supabase as 💾 Supabase DB
    participant Extension as 🧩 Chrome Extension (Local)
    participant Browser as 🌐 Browser / Local PC

    rect rgb(230, 240, 255)
        Note over User, Cloud: 📢 PHASE 1: TRIGGER
        User->>Cloud: Voice: "Open YouTube"
        Cloud->>Cloud: Speech-to-Text (STT) & Intent Analysis
    end

    rect rgb(230, 255, 240)
        Note over Cloud, Browser: ⚡ PHASE 2: BROWSER AUTOMATION (Direct Execution)
        Note right of Cloud: Intent: Browser
        Cloud->>MCP_Browser: execute_browser_command(...)
        
        Note right of MCP_Browser:  Docker Container<br/>Tuya Client → localhost:7860 → FastAPI
        
        MCP_Browser->>Vercel: POST /api/execute
        Vercel->>Supabase: INSERT command (status=pending)
        
        loop Extension Polling (Every 3s)
            Extension->>Vercel: GET /api/poll
            Vercel->>Supabase: SELECT pending commands
        end
        
        Vercel-->>Extension: Return Command
        Extension->>Browser: Execute Script / Action
        Browser-->>Extension: Result
        
        Extension->>Vercel: POST /api/result
        Vercel->>Supabase: UPDATE command (result)
        Vercel-->>MCP_Browser: Return JSON Result
        MCP_Browser-->>Cloud: Action Success
        Cloud->>User: TTS: "Opened YouTube"
    end

    rect rgb(240, 255, 240)
        Note over Cloud, Browser: 🏠 PHASE 3: DEVICE CONTROL (Via Extension/Bridge)
        Note right of Cloud: Intent: IoT Control
        Cloud->>MCP_Device: control_device(...)
        
        Note right of MCP_Device: 📦 Docker Container<br/>Tuya Client → localhost:7860 → FastAPI
        
        MCP_Device->>Vercel: POST /api/execute (type=device_control)
        Vercel->>Supabase: INSERT command
        
        Vercel-->>Extension: Return Command (via poll)
        Extension->>Browser: Local Device Control / API
        Browser-->>Extension: Success
        
        Extension->>Vercel: POST /api/result
        Vercel-->>MCP_Device: Result
        MCP_Device-->>Cloud: Action Success
        Cloud->>User: TTS: "Device turned on"
    end
\`\`\`

<div style="text-align: center; margin-top: 20px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/PROJECT_ARCHITECTURE_DIAGRAM.mmd" target="_blank" style="display: inline-block; padding: 10px 20px; background: rgba(255,255,255,0.1); color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; font-weight: 600;">
        View Diagram Source on GitHub ↗
    </a>
</div>

## Problem Solved

❌ **Old approach:**
- Laptop must be on
- Bridge server running locally
- ngrok tunnel needed
- Single user only

✅ **New approach:**
- Deploy to cloud (Vercel/Railway)
- Always on, no manual work
- Multi-user with authentication
- Works from anywhere

---

## Architecture

\`\`\`
Tuya AI MCP
    ↓
Cloud Bridge Service (Vercel)
    ↓
Database (commands queue)
    ↓
Extension (polls with credentials)
    ↓
Browser Automation
    ↓
Results back to Cloud
    ↓
MCP receives result
\`\`\`

---

## Technology Stack

### **Backend:**
- **Runtime:** Node.js (Next.js API routes)
- **Hosting:** Vercel (free tier!)
- **Database:** Vercel KV (Redis) or Supabase
- **Auth:** Username/Password stored in DB

### **Extension:**
- Polls cloud service instead of localhost
- Authenticates with credentials
- Long-polling or WebSocket

---

## Cloud Service Implementation

### **File Structure:**

\`\`\`
cloud-bridge/
├── package.json
├── vercel.json
├── api/
│   ├── execute.js         # MCP sends commands here
│   ├── poll.js            # Extension polls for commands
│   ├── result.js          # Extension sends results
│   ├── register.js        # User registration
│   └── auth.js            # Authentication
├── lib/
│   ├── db.js              # Database client
│   └── auth.js            # Auth helpers
└── README.md
\`\`\`

---

## API Endpoints

### **1. POST /api/execute** (MCP → Cloud)
**Purpose:** Tuya MCP sends browser command

**Request:**
\`\`\`json
{
  "userId": "user123",
  "apiKey": "mcp_secret_key",
  "command": "open gmail.com and check unread"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "commandId": "cmd_abc123",
  "status": "queued"
}
\`\`\`

**Process:**
1. Validate MCP API key
2. Store command in database (with userId)
3. Return command ID
4. Wait for result (or timeout after 60s)

---

### **2. GET /api/poll** (Extension → Cloud)
**Purpose:** Extension checks for new commands

**Headers:**
\`\`\`
Authorization: Basic base64(username:password)
\`\`\`

**Query:**
\`\`\`
?userId=user123
\`\`\`

**Response (when command exists):**
\`\`\`json
{
  "hasCommand": true,
  "commandId": "cmd_abc123",
  "command": "open gmail.com and check unread",
  "timestamp": 1703000000
}
\`\`\`

**Response (no command):**
\`\`\`json
{
  "hasCommand": false
}
\`\`\`

---

### **3. POST /api/result** (Extension → Cloud)
**Purpose:** Extension sends back execution result

**Headers:**
\`\`\`
Authorization: Basic base64(username:password)
\`\`\`

**Request:**
\`\`\`json
{
  "commandId": "cmd_abc123",
  "userId": "user123",
  "result": "5 unread emails found",
  "success": true,
  "executionTime": 3500
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Result stored"
}
\`\`\`

---

### **4. POST /api/register** (User → Cloud)
**Purpose:** Register new user

**Request:**
\`\`\`json
{
  "username": "john_doe",
  "password": "secure_password_123",
  "email": "john@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "userId": "user123",
  "message": "Registration successful"
}
\`\`\`

---

### **5. POST /api/auth/verify** (Extension → Cloud)
**Purpose:** Verify credentials

**Request:**
\`\`\`json
{
  "username": "john_doe",
  "password": "secure_password_123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "userId": "user123",
  "username": "john_doe"
}
\`\`\`
`,
    "Deployment": `# ☁️ Cloud Bridge Deployment Guide

**Deploy Vercel serverless API + Supabase database**

---

## 📋 Overview

The cloud bridge handles:
- ✅ Command queue for browser automation
- ✅ Google OAuth authentication
- ✅ Multi-user support via Supabase
- ✅ APIs for MCP ↔ Extension communication

**Time:** 15-20 minutes  
**Cost:** $0/month (FREE tier)

---

## 🎯 Two Deployment Methods

Choose one:
1. **[GitHub + Dashboard (RECOMMENDED)](#method-1-github--vercel-dashboard-recommended)** - Easier, auto-deploys on push
2. **[CLI Deployment](#method-2-cli-deployment)** - Quick one-time deploy

---

## 📦 **Prerequisites**

### **1. Supabase Account**
\`\`\`
✅ Sign up at: https://supabase.com
✅ Create new project
✅ Run database schema
\`\`\`

### **2. Vercel Account**
\`\`\`
✅ Sign up at: https://vercel.com
✅ Link GitHub account (for Method 1)
\`\`\`

### **3. Google OAuth Credentials**
\`\`\`
✅ Go to: console.cloud.google.com
✅ Create OAuth Client ID
✅ Add authorized origins
\`\`\`

---

## 🚀 **Method 1: GitHub + Vercel Dashboard (RECOMMENDED)**

**Why this method?**
- ✅ Auto-deploys on every \`git push\`
- ✅ Easy to manage environment variables
- ✅ Built-in CI/CD
- ✅ Preview deployments for testing
- ✅ No CLI needed

---

### **Step 1: Push to GitHub**

**1.1 Create GitHub Repository:**
\`\`\`bash
# If not already done:
cd c:\\TUYA\\RankifyAssist
git remote add origin https://github.com/YOUR_USERNAME/rankify-assist.git
git branch -M main
git push -u origin main
\`\`\`

**1.2 Verify Upload:**
- Go to: \`https://github.com/YOUR_USERNAME/rankify-assist\`
- Check \`cloud-bridge/\` folder exists ✅

---

### **Step 2: Connect to Vercel**

**2.1 Login to Vercel:**
\`\`\`
1. Go to: https://vercel.com
2. Click "Add New..." → "Project"
\`\`\`

**2.2 Import Repository:**
\`\`\`
1. Click "Import Git Repository"
2. Select your GitHub account
3. Find "rankify-assist" repo
4. Click "Import"
\`\`\`

**2.3 Configure Project:**

**Framework Preset:** \`Other\`

**Root Directory:**
\`\`\`
Click "Edit" next to Root Directory
Select: cloud-bridge
✅ This tells Vercel to deploy ONLY the cloud-bridge folder
\`\`\`

**Build Settings:**
\`\`\`
Build Command: (leave empty - not needed for serverless)
Output Directory: (leave empty)
Install Command: npm install
\`\`\`

**2.4 Add Environment Variables:**

Click "Environment Variables" section:

**Variable 1:**
\`\`\`
Name: SUPABASE_URL
Value: https://YOUR_PROJECT.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
\`\`\`

**Variable 2:**
\`\`\`
Name: SUPABASE_ANON_KEY
Value: eyJhbGc... (your anon key)
Environments: ✅ Production, ✅ Preview, ✅ Development
\`\`\`

**Variable 3:**
\`\`\`
Name: GOOGLE_CLIENT_ID
Value: YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
Environments: ✅ Production, ✅ Preview, ✅ Development
\`\`\`

**Variable 4 (Security Key):**
\`\`\`
Name: MCP_API_KEY
Value: (generate random 32 char string)
Environments: ✅ Production, ✅ Preview
⚠️ NOT Development (sensitive!)
\`\`\`

**🔐 Why is MCP_API_KEY random?**

This key authenticates MCP servers when they send commands to your cloud bridge:

\`\`\`
MCP Server → POST /api/execute { apiKey: "xxx" }
                ↓
Cloud Bridge → Validates: apiKey === process.env.MCP_API_KEY
                ↓
        ✅ Match → Accept     ❌ No match → Reject (401)
\`\`\`

**Generate MCP_API_KEY:**
\`\`\`powershell
# Run in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Example output: YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui
# Copy this value ✅
# You'll use it again in MCP server .env files
\`\`\`

**2.5 Deploy:**
\`\`\`
1. Click "Deploy"
2. Wait 1-2 minutes ⏱️
3. You'll get URL: https://YOUR_PROJECT.vercel.app
\`\`\`

**2.6 Test Deployment:**

Visit:
\`\`\`
https://YOUR_PROJECT.vercel.app/api/ping
\`\`\`

Should see:
\`\`\`json
{
  "status": "ok",
  "service": "Tuya Cloud Bridge",
  "version": "1.0.0"
}
\`\`\`

✅ **Success! Cloud bridge is live!**

---

### **Step 3: Auto-Deploy Setup**

**Now every time you push to GitHub:**
\`\`\`bash
git add .
git commit -m "Update cloud bridge"
git push
\`\`\`

**Vercel automatically:**
1. ✅ Detects changes
2. ✅ Builds project
3. ✅ Deploys to production
4. ✅ Updates URL (same link)

**View deployments:**
\`\`\`
https://vercel.com/YOUR_USERNAME/rankify-assist-bridge
→ Deployments tab
→ See all builds & logs
\`\`\`

---

## 🔧 **Method 2: CLI Deployment**

**For quick testing or one-time deploys**

---
`,
    "Google OAuth": `# 🔐 Google OAuth Setup with Supabase - COMPLETE GUIDE

## ✅ **THE CORRECT WAY:**

Supabase Auth uses **CLIENT-SIDE** authentication, not server-side redirects!

---

## 📋 **Step 1: Google Cloud Console Setup**

\`\`\`
1. Go to: https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth Client ID
\`\`\`

**Set THESE URLs:**

\`\`\`
Authorized JavaScript origins:
├─ https://your-server-site.vercel.app
├─ https://supabase-callback-url-from-supabase-dashboard.supabase.co
└─ http://localhost:3000 (for testing)

Authorized redirect URIs:
└─ https://supabase-callback-url-from-supabase-dashboard.supabase.co/auth/v1/callback
   ↑ ONLY THIS ONE!
\`\`\`

---
`
  },
  "Extension": {
    "Build Guide": `# 📦 Rankify Assist Extension Guide

## Directory Structure Overview

This project uses a split structure to separate the **Source Code** from the **Compiled Extension**.

### 1. \`extension-raw/\` (SOURCE 🛠️)
This is the **working directory**.
- Contains all React components, TypeScript code, and Vite configuration.
- **EDIT HERE**: Any changes to functionality, UI, or logic must happen in this folder.
- **BUILD**: Run \`pnpm build\` in this folder to compile changes.

### 2. \`extension/\` (COMPILED 🚀)
This is the **distribution directory**.
- Contains the build artifacts (HTML, JS, CSS) generated from \`extension-raw\`.
- **DO NOT EDIT**: Changes made here will be overwritten by the next build.
- **LOAD THIS**: In \`chrome://extensions\`, verify "Developer Mode" is ON and select "Load Unpacked", targeting this folder.

## 🔄 Development Workflow

1.  **Make Changes**: Edit files in \`extension-raw/\`.
2.  **Build**:
    \`\`\`bash
    cd extension-raw
    pnpm build
    \`\`\`
    *Note: The project is configured to automatically copy \`dist/\` contents to \`../extension/\` after build (check \`package.json\` scripts or manual copy commands).*
3.  **Test**: Go to Chrome, click "Reload" on the Rankify Assist extension.

## ⚠️ Important
- If you edit \`extension/\` {IT IS COMPILED EXTENSION} directly, your changes will be lost!
- Ensure \`pnpm install\` has been run in \`extension-raw\` before building.
`
  },
  "MCP Servers": {
    "Read Me": `# 📖 MCP Documentation Index

Complete guides for deploying Tuya MCP servers.

---

## 🎯 Start Here

**New to this?** → Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Want cloud deployment?** → [HUGGINGFACE_DEPLOYMENT.md](HUGGINGFACE_DEPLOYMENT.md)

**Want local testing?** → [OFFLINE-SETUP-GUIDE.md](OFFLINE-SETUP-GUIDE.md)

---

## 📚 All Guides

### Getting Started
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Choose your deployment method
- **[HUGGINGFACE_DEPLOYMENT.md](HUGGINGFACE_DEPLOYMENT.md)** - Cloud deployment (recommended!)
- **[OFFLINE-SETUP-GUIDE.md](OFFLINE-SETUP-GUIDE.md)** - Local development

### Technical Details
- **[OFFLINE-SDK-USAGE.md](OFFLINE-SDK-USAGE.md)** - Tuya MCP SDK guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & fixes

### Reference
- **[DEPLOYED_FLOW_DIAGRAM.md](DEPLOYED_FLOW_DIAGRAM.md)** - Architecture diagrams
- **[NO_HARDCODED_VALUES.md](NO_HARDCODED_VALUES.md)** - Environment variables

---
`,
    "Deployment Guide": `# 🚀 MCP Servers Deployment Guide

**Simple Choice:** Offline (PC) or Hugging Face Spaces (Cloud)

---

## 📊 Deployment Options

| Method | Where | Pros | Cons | Best For |
|--------|-------|------|------|----------|
| **Hugging Face Spaces** | Cloud | ✅ FREE<br>✅ 24/7<br>✅ Web UI | Needs account | **Production** ✅ |
| **Offline** | Your PC | ✅ No account<br>✅ Full control | PC must run 24/7 | Testing, Dev |

---
`,
    "Hugging Face": `# 🤗 Hugging Face Spaces - Complete Deployment Guide

Deploy Tuya MCP Client to Hugging Face Spaces for 100% free, persistent cloud hosting!

---

## 🌟 Why Hugging Face Spaces?

✅ **100% Free Forever**
- No credit card required
- Generous free tier
- Unlimited uptime

✅ **Persistent Connection**
- Never sleeps or spins down
- Perfect for Tuya MCP client
- 24/7 availability

✅ **Live Monitoring UI**
- Web interface to monitor status
- Real-time logs
- Connection uptime tracking
`,
    "Flow Diagram": `# 🎯 Complete Flow Diagram - assist vs assist-to-tuyaclient

## 📊 Your Exact Deployment:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ 1. Tuya AI Platform (Cloud)                                  │
│    - User says: "Open Google"                                │
│    - AI processes request                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    (WebSocket)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. assist-to-tuyaclient                                       │
│    URL: https://assist-to-tuyaclient.fastmcp.app/mcp         │
│    File: ONLINE-fastmcp.cloud_tuya_client.py                 │
│                                                               │
│    Environment Variables:                                    │
│    ✅ MCP_ENDPOINT=https://mcp-in.iotbing.com                │
│    ✅ MCP_ACCESS_ID=your_tuya_id                             │
│    ✅ MCP_ACCESS_SECRET=your_tuya_secret                     │
│    ✅ FASTMCP_CLOUD_MCP_URL=https://assist.fastmcp.app/mcp   │
│                                                               │
│    What it does:                                             │
│    - Connects TO Tuya Platform with credentials              │
│    - Listens for AI workflow requests                        │
│    - When request comes: "execute browser command"           │
│    - Forwards to: https://assist.fastmcp.app/mcp             │
└─────────────────────────────────────────────────────────────┘
                          ↓
                   (HTTP POST)
                calls tool:
          execute_browser_command("Open Google")
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. assist                                                     │
│    URL: https://assist.fastmcp.app/mcp                       │
│    File: ONLINE-fastmcp.cloud_server.py                      │
│                                                               │
│    Environment Variables:                                    │
│    ✅ CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app  │
│    ✅ MCP_API_KEY=your_api_key                               │
│    ✅ TUYA_ACCESS_ID=your_id (for bridge auth)               │
│                                                               │
│    What it does:                                             │
│    - Receives tool call: execute_browser_command             │
│    - Prepares command JSON                                   │
│    - Sends to Cloud Bridge                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
                   (HTTP POST)
    POST /api/execute with command
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Cloud Bridge (Vercel)                                     │
│    URL: https://tuya-cloud-bridge.vercel.app                 │
│                                                               │
│    What it does:                                             │
│    - Receives command from assist                            │
│    - Queues command in Firebase/database                     │
│    - Returns command ID                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    (Polling)
              GET /api/commands/poll
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Browser Extension (Rankify)                               │
│                                                               │
│    What it does:                                             │
│    - Polls Cloud Bridge for commands                         │
│    - Gets: "Open Google"                                     │
│    - Executes in browser                                     │
│    - Browser opens google.com!                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,
    "Offline Setup": `# 🚀 Offline MCP Setup Guide

Complete guide for running MCP servers locally on your PC.

---

## 📁 New Structure

\`\`\`
mcp-servers/
└── offline/              ← You are here!
    ├── browser-automation/
    └── device-controller/
\`\`\`

---

## ✅ **WHAT YOU NEED:**

### **1. Tuya MCP SDK** (Required for offline)
\`\`\`bash
cd c:\\TUYA
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python
pip install -e .
\`\`\`

**Why?** The SDK provides \`MCPSdkClient\` class that connects to Tuya Platform.

### **2. FastMCP Library**
\`\`\`bash
pip install fastmcp httpx python-dotenv
\`\`\`

**Why?** FastMCP builds standard MCP servers with tools.
`,
    "SDK Usage": `# 📖 Tuya MCP SDK Usage Guide

Understanding the Tuya MCP SDK for offline deployments.

---

## 📁 Relevant For:

\`\`\`
mcp-servers/offline/   ← SDK needed here!
                      (not needed for online/)
\`\`\`

---

## 🎯 **What is Tuya MCP SDK?**

The **Tuya MCP SDK** provides the \`MCPSdkClient\` class that connects your local MCP server to the Tuya IoT Platform.

**GitHub:** https://github.com/tuya/tuya-mcp-sdk
`
  }
};
