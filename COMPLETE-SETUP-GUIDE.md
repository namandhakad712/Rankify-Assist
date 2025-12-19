# 🚀 RANKIFY ASSIST - COMPLETE SETUP GUIDE FOR BEGINNERS

**Welcome!** This guide will help you set up the entire Rankify Assist system from scratch.

**What is this?**  
A voice-controlled browser automation system that works with Tuya AI (SmartLife app).

**What you'll get:**
- Control your browser with voice commands through Tuya AI
- "Hey Tuya, open Google" → Browser opens Google!
- "Check my email" → Browser opens Gmail!
- Works with SmartLife app via Tuya AI

---

## ⏱️ **TIME REQUIRED:** 45-60 minutes

## 📋 **WHAT YOU NEED:**

### **Accounts (Free)**
- [ ] Google Account
- [ ] Supabase Account (Database)
- [ ] Vercel Account (Hosting)
- [ ] Tuya Developer Account
- [ ] GitHub Account

### **Software**
- [ ] Windows 10/11
- [ ] Python 3.10 or higher
- [ ] Node.js 18 or higher
- [ ] Git
- [ ] Google Chrome
- [ ] Visual Studio Code (recommended)

---

## 📁 **PROJECT STRUCTURE:**

```
RankifyAssist/
├── cloud-bridge/          # Vercel cloud server
├── extension-raw/         # Chrome extension
├── mcp-servers/          # MCP servers
│   ├── browser-automation/
│   └── device-controller/
├── docs/                 # Documentation
├── setup-wizard.bat      # 👈 START HERE!
└── README.md
```

---

## 🎯 **SETUP STEPS:**

---

### **STEP 1: INSTALL REQUIRED SOFTWARE**

#### **1.1 Install Python**

1. **Go to:** https://www.python.org/downloads/
2. **Download:** Latest Python 3.10+ (Windows installer)
3. **Run installer**
4. **✅ CHECK:** "Add Python to PATH"
5. **Click:** Install Now
6. **Wait** for installation
7. **Verify:**
   ```bash
   python --version
   ```
   Should show: `Python 3.10.x` or higher

#### **1.2 Install Node.js**

1. **Go to:** https://nodejs.org/
2. **Download:** LTS version (recommended)
3. **Run installer**
4. **Click:** Next → Next → Install
5. **Verify:**
   ```bash
   node --version
   npm --version
   ```

#### **1.3 Install Git**

1. **Go to:** https://git-scm.com/download/win
2. **Download:** Latest Windows version
3. **Run installer**
4. **Settings:** Use all defaults (just keep clicking Next)
5. **Verify:**
   ```bash
   git --version
   ```

#### **1.4 Install pnpm** (Package Manager)

```bash
npm install -g pnpm
```

**Verify:**
```bash
pnpm --version
```

---

### **STEP 2: INSTALL TUYA MCP SDK**

#### **2.1 Open Terminal**
1. **Press:** `Win + R`
2. **Type:** `cmd`
3. **Press:** Enter

#### **2.2 Navigate to parent folder**
```bash
cd c:\TUYA
```

**If folder doesn't exist:**
```bash
mkdir c:\TUYA
cd c:\TUYA
```

#### **2.3 Clone SDK**
```bash
git clone https://github.com/tuya/tuya-mcp-sdk.git
```

**Wait** for download to complete.

#### **2.4 Install SDK**
```bash
cd tuya-mcp-sdk\mcp-python
pip install -e .
```

**Wait** for installation.

#### **2.5 Verify**
```bash
python -c "from mcp_sdk import MCPSdkClient; print('✅ SDK installed!')"
```

Should show: `✅ SDK installed!`

---

### **STEP 3: INSTALL PROJECT DEPENDENCIES**

#### **3.1 Navigate to project**
```bash
cd c:\TUYA\RankifyAssist
```

#### **3.2 Install Python packages**
```bash
pip install fastmcp httpx python-dotenv
```

#### **3.3 Install extension dependencies**
```bash
cd extension-raw
pnpm install
```

**This will take 2-5 minutes.** Wait patiently.

---

### **STEP 4: CREATE SUPABASE PROJECT**

#### **4.1 Sign Up**
1. **Go to:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign up** with GitHub or Google
4. **Verify email** if needed

#### **4.2 Create Project**
1. **Click:** "New Project"
2. **Organization:** Create or select one
3. **Project name:** `rankify-assist` (or your choice)
4. **Database Password:** Create a strong password **SAVE IT!**
5. **Region:** Choose closest to you
6. **Plan:** Free
7. **Click:** "Create new project"
8. **Wait 2-3 minutes** for project creation

#### **4.3 Run SQL Schema**
1. **Go to:** SQL Editor (left sidebar)
2. **Click:** "+ New query"
3. **Open file:** `c:\TUYA\RankifyAssist\cloud-bridge\supabase-schema.sql`
4. **Copy all contents**
5. **Paste** into Supabase SQL Editor
6. **Click:** Run (or press F5)
7. **Should see:** "Success. No rows returned"

#### **4.4 Get API Credentials**
1. **Go to:** Settings (gear icon) → API
2. **Copy these values:**
   - **Project URL** → Save as `SUPABASE_URL`
   - **anon public key** → Save as `SUPABASE_ANON_KEY`

**Save them in Notepad! You'll need them later!**

---

### **STEP 5: GOOGLE OAUTH SETUP**

#### **5.1 Create Google Cloud Project**
1. **Go to:** https://console.cloud.google.com
2. **Sign in** with Google account
3. **Click:** "Select a project" → "New Project"
4. **Project name:** `Rankify Assist`
5. **Click:** Create
6. **Wait** for project creation
7. **Select** your new project

#### **5.2 Enable Google+ API**
1. **Click:** "APIs & Services" → "Library"
2. **Search:** "Google+ API"
3. **Click:** on it
4. **Click:** Enable

#### **5.3 Create OAuth Credentials**
1. **Go to:** "APIs & Services" → "Credentials"
2. **Click:** "Create Credentials" → "OAuth client ID"
3. **If asked to configure consent screen:**
   - User Type: External
   - App name: Rankify Assist
   - User support email: Your email
   - Developer email: Your email
   - Click: Save and Continue → Save and Continue → Save and Continue
   - Click: Back to Dashboard
4. **Create Credentials again** → OAuth client ID
5. **Application type:** Web application
6. **Name:** Rankify Assist
7. **Authorized JavaScript origins:** (leave empty for now)
8. **Authorized redirect URIs:**
   - Your Supabase URL + `/auth/v1/callback`
   - Example: `https://pwtasnt...supabase.co/auth/v1/callback`
9. **Click:** Create
10. **Copy:**
    - **Client ID** → Save as `GOOGLE_CLIENT_ID`
    - **Client Secret** → Save as `GOOGLE_CLIENT_SECRET`

**Save in Notepad!**

---

### **STEP 6: DEPLOY CLOUD BRIDGE TO VERCEL**

#### **6.1 Push to GitHub**
1. **Create GitHub repository:**
   - Go to: https://github.com/new
   - Name: `rankify-assist`
   - Public or Private: Your choice
   - Click: Create repository

2. **Push code:**
```bash
cd c:\TUYA\RankifyAssist
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/rankify-assist.git
git push -u origin main
```

#### **6.2 Deploy to Vercel**
1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. **Click:** "New Project"
4. **Import** your repository
5. **Root Directory:** `cloud-bridge`
6. **Click:** Deploy
7. **Wait** for deployment

#### **6.3 Add Environment Variables**
1. **Go to:** Project Settings → Environment Variables
2. **Add these variables:**

```
SUPABASE_URL = (your Supabase URL from Step 4.4)
SUPABASE_ANON_KEY = (your Supabase key from Step 4.4)
GOOGLE_CLIENT_ID = (your Google ID from Step 5.3)
GOOGLE_CLIENT_SECRET = (your Google Secret from Step 5.3)
MCP_API_KEY = (make up any random string: e.g., mcp_12345_secret)
```

3. **Click:** Save
4. **Redeploy:**
   - Go to: Deployments
   - Latest deployment → ⋮ → Redeploy
   - Wait for completion

#### **6.4 Save Vercel URL**
Your project URL: `https://your-project-name.vercel.app`
**Save this! You'll need it!**

---

### **STEP 7: UPDATE GOOGLE OAUTH (PART 2)**

Now that you have Vercel URL:

1. **Go to:** https://console.cloud.google.com
2. **APIs & Services** → Credentials
3. **Click** on your OAuth client
4. **Authorized JavaScript origins:**
   - Add: `https://your-project-name.vercel.app`
   - Add: Your Supabase URL
5. **Authorized redirect URIs:**
   - Should still have: `https://xxx.supabase.co/auth/v1/callback`
6. **Click:** Save

---

### **STEP 8: CONFIGURE SUPABASE AUTH**

1. **Go to:** Supabase → Authentication → Providers
2. **Find:** Google
3. **Enable:** ✅
4. **Client ID:** (from Step 5.3)
5. **Client Secret:** (from Step 5.3)
6. **Click:** Save

7. **Go to:** Authentication → URL Configuration
8. **Site URL:** Your Vercel URL
9. **Redirect URLs:**
   - `https://your-project.vercel.app/**`
   - `https://your-project.vercel.app/callback.html`
10. **Click:** Save

---

### **STEP 9: CREATE TUYA MCPS**

#### **9.1 Create Tuya Account**
1. **Go to:** https://platform.tuya.com
2. **Sign up** (use email or Google)
3. **Verify email**
4. **Complete profile** (required)

#### **9.2 Create Browser Automation MCP**
1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Click:** "Custom MCP Service" tab
3. **Click:** "+ Add custom MCP"
4. **Fill in:**
   - **Service Name (Chinese):** 浏览器自动化
   - **Service Description (Chinese):** 通过扩展自动执行浏览器任务
   - **Service Name (English):** Browser Automation
   - **Service Description (English):** Automates browser tasks via extension
   - **Icon:** Upload any browser icon (PNG/JPG)
5. **Click:** Confirm

#### **9.3 Add Data Center**
1. **Service Access Configuration Management**
2. **Data Center** section
3. **Click:** "+ Add Data Center"
4. **Select:** India (or closest to you)
5. **Click:** OK

#### **9.4 Get Credentials**
1. **Click** on the data center you just added
2. **Copy these 3 values:**
   - **Endpoint:** `https://mcp-in.iotbing.com` (or your region)
   - **Access ID:** Long string
   - **Access Secret:** Click eye icon to view, then copy

**Save in Notepad!**

---

### **STEP 10: CONFIGURE MCP .ENV FILES**

#### **10.1 Browser Automation .env**

1. **Open file:** `mcp-servers\browser-automation\.env.TEMPLATE`
2. **Edit it** (or create new `.env` file)
3. **Fill in:**

```
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=(paste from Step 9.4)
MCP_ACCESS_SECRET=(paste from Step 9.4)
CLOUD_BRIDGE_URL=https://your-project.vercel.app
MCP_API_KEY=(same value you used in Vercel env vars)
```

4. **Save as:** `mcp-servers\browser-automation\.env`

---

### **STEP 11: BUILD CHROME EXTENSION**

```bash
cd c:\TUYA\RankifyAssist\extension-raw
pnpm build
```

**Wait 1-2 minutes for build to complete.**

---

### **STEP 12: LOAD EXTENSION IN CHROME**

1. **Open Chrome**
2. **Go to:** `chrome://extensions/`
3. **Enable:** "Developer mode" (top right)
4. **Click:** "Load unpacked"
5. **Select folder:** `c:\TUYA\RankifyAssist\extension-raw\build\chrome-mv3-prod`
6. **Extension should load!**

---

### **STEP 13: START MCP SERVERS**

#### **13.1 Terminal 1: FastMCP Server**
```bash
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation
python server.py
```

**Should see:**
```
🌐 Server will run on http://localhost:8767
```

**Leave this terminal open!**

#### **13.2 Terminal 2: Tuya SDK Client**
**Open NEW terminal:**
```bash
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation
python tuya_client.py
```

**Should see:**
```
✅ Connected to Tuya Platform!
✅ MCP Server is now ONLINE!
```

**Leave this terminal open too!**

---

### **STEP 14: VERIFY EVERYTHING**

#### **14.1 Check Tuya Platform**
1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Browser Automation** → Status: **Online** ✅
3. **Tool tab** → Show see: `execute_browser_command`

#### **14.2 Check Cloud Bridge**
1. **Open:** `https://your-project.vercel.app`
2. **Should show:**
   - Database: Connected ✅
   - API: Online ✅

#### **14.3 Configure Extension**
1. **Click extension icon** in Chrome
2. **Open** extension options
3. **Tuya Smart Home section**
4. **Bridge URL:** Paste your Vercel URL
5. **Click:** Test Connection
6. **Should show:** Connected ✅
7. **Click:** Start Polling

---

### **STEP 15: TEST IT!**

#### **Option 1: Test via Tuya Platform**
1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Browser Automation** → Tool tab
3. **Click:** "Test Run" on `execute_browser_command`
4. **Enter:** `{"command": "open google"}`
5. **Click:** Run
6. **Check:** Command should appear in Cloud Bridge
7. **Extension** should execute it!

#### **Option 2: Create Workflow**
1. **Go to:** https://platform.tuya.com/exp/ai
2. **Create/Edit** AI Agent
3. **Add MCP Service:** Browser Automation
4. **Create workflow** with voice trigger
5. **Test** with SmartLife app!

---

## ✅ **SUCCESS CHECKLIST:**

- [ ] All software installed
- [ ] Supabase project created
- [ ] Google OAuth configured
- [ ] Cloud Bridge deployed to Vercel
- [ ] Tuya MCP created
- [ ] .env files configured
- [ ] Extension built and loaded
- [ ] MCP servers running
- [ ] Connection verified online
- [ ] Test command works!

---

## 🎉 **CONGRATULATIONS!**

You now have a complete voice-controlled browser automation system!

**What's running:**
- ✅ FastMCP Server (localhost)
- ✅ Tuya SDK Client (connected to Tuya)
- ✅ Cloud Bridge (on Vercel)
- ✅ Chrome Extension (loaded)

**How it works:**
```
You speak → Tuya AI → MCP Server → Cloud Bridge → Extension → Browser executes!
```

---

## 📚 **NEXT STEPS:**

1. **Read:** `docs/mcp/SETUP-GUIDE.md`
2. **Try:** Different voice commands
3. **Customize:** Add more tools
4. **Build:** Device controller MCP

---

## 🆘 **TROUBLESHOOTING:**

### **MCP shows Offline**
- Check tuya_client.py is running
- Check .env credentials are correct
- Restart both servers

### **Extension not executing**
- Check Bridge URL in extension settings
- Check extension is polling
- Check Cloud Bridge is deployed

### **Database errors**
- Check Supabase SQL schema is run
- Check environment variables in Vercel
- Redeploy Vercel after adding env vars

---

## 📞 **NEED HELP?**

Check:
- `docs/` folder for more guides
- `SUCCESS-GUIDE.md` for quick reference
- Tuya Developer docs: https://developer.tuya.com

---

**YOU DID IT!** 🎉🎉🎉
