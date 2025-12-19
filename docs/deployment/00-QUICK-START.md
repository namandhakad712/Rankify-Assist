# 🚀 COMPLETE DEPLOYMENT GUIDE - Beginner Friendly

**Everything you need to deploy Rankify Assist from scratch!**

---

## 📋 Pre-Deployment Checklist

### ✅ What's Already Done:

- [x] Tuya AI Workflow created and configured
- [x] Cloud bridge code ready (`cloud-bridge/`)
- [x] Chrome extension code ready (`extension-raw/`)
- [x] MCP server templates ready (`mcp-servers/`)
- [x] Database schema ready (`supabase-schema.sql`)
- [x] Complete documentation

### 🔧 What You Need:

**Accounts (All FREE):**
- [ ] Supabase account (database)
- [ ] Vercel account (cloud hosting)
- [ ] Tuya IoT account (smart devices)
- [ ] GitHub account (optional, for code storage)

**Tools:**
- [ ] Node.js installed
- [ ] Python installed
- [ ] Chrome browser
- [ ] Git (optional)

---

## 🎯 DEPLOYMENT STEPS

### **Step 1: Create Supabase Database** ⏱️ 10 mins

**1.1 Sign Up:**
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub

**1.2 Create Project:**
1. Click "+ New Project"
2. Choose organization or create new
3. Fill in:
   - **Name:** `rankify-assist-db`
   - **Database Password:** (Generate strong password - SAVE IT!)
   - **Region:** Choose closest to you (e.g., Mumbai for India)
4. Click "Create new project"
5. ⏳ Wait 2-3 minutes...

**1.3 Setup Database:**
1. Go to **SQL Editor** (left sidebar)
2. Click "+ New query"
3. Open file: `cloud-bridge/supabase-schema.sql`
4. Copy ALL contents
5. Paste into SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Should see: "Success. No rows returned" ✅

**1.4 Verify Tables:**
1. Go to **Table Editor** (left sidebar)
2. You should see 3 tables:
   - `users` ✅
   - `commands` ✅
   - `results` ✅

**1.5 Get Credentials:**
1. Go to **Settings** → **API** (left sidebar)
2. Copy and SAVE:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbG...` (long string)

✅ **Supabase Done!**

---

### **Step 2: Deploy Cloud Bridge to Vercel** ⏱️ 15 mins

**2.1 Prepare Code:**
1. Open terminal in `cloud-bridge/` folder
2. Run:
   ```bash
   npm install
   ```

**2.2 Login to Vercel:**
```bash
npm install -g vercel
vercel login
```
- Browser opens → Login with GitHub
- Return to terminal

**2.3 Deploy:**
```bash
vercel
```
Answer the prompts:
- **Setup and deploy?** → YES
- **Which scope?** → Your username
- **Link to existing?** → NO
- **Project name?** → `rankify-assist-bridge`
- **Directory?** → `./`
- **Want to modify settings?** → NO

Wait for deployment... ⏳

You'll get a URL like: `https://rankify-assist-bridge-xxx.vercel.app`
**SAVE THIS URL!**

**2.4 Add Environment Variables:**

Open Vercel dashboard: https://vercel.com/dashboard

1. Go to your project → **Settings** → **Environment Variables**

2. Add these variables (click "Add New"):

**Variable 1:**
- **Name:** `SUPABASE_URL`
- **Value:** Your Supabase URL (from Step 1.5)
- **Environments:** Production, Preview
- Click "Save"

**Variable 2:**
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon key (from Step 1.5)
- **Environments:** Production, Preview
- Click "Save"

**Variable 3:**
- **Name:** `MCP_API_KEY`
- **Value:** Generate random key:
  ```powershell
  # Run in PowerShell:
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
  ```
  Example: `YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui`
  **SAVE THIS KEY** - you'll need it for MCPs!
- **Environments:** Production, Preview
- Click "Save"

**2.5 Redeploy:**
1. Go to **Deployments** tab
2. Click latest deployment
3. Click **...** (three dots)
4. Click "Redeploy"
5. Wait...

**2.6 Test:**
Open in browser:
```
https://your-vercel-url.vercel.app/api/ping
```

Should see:
```json
{
  "status": "ok",
  "service": "Tuya Cloud Bridge",
  "version": "1.0.0"
}
```

✅ **Cloud Bridge Deployed!**

---

### **Step 3: Register Your First User** ⏱️ 5 mins

Use PowerShell or terminal:

```powershell
$body = @{
    username = "myusername"
    password = "MySecurePassword123!"
    email = "your@email.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-vercel-url.vercel.app/api/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

Response:
```json
{
  "success": true,
  "userId": "user_1703123456_abc123",
  "username": "myusername",
  "message": "Registration successful"
}
```

**SAVE THE `userId`!** You'll need it for MCP configuration!

✅ **User Registered!**

---

### **Step 4: Build Chrome Extension** ⏱️ 10 mins

**4.1 Install Dependencies:**
```bash
cd c:\TUYA\RankifyAssist
pnpm install
```

**4.2 Build Extension:**
```bash
pnpm build
```

Wait for build... ⏳

You should see:
```
✓ built in XXXms
```

**4.3 Load in Chrome:**
1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Navigate to: `c:\TUYA\RankifyAssist\dist\chrome-mv3-prod\`
6. Click "Select Folder"

Extension loaded! ✅

**4.4 Configure Extension:**
1. Click extension icon in toolbar
2. Click "Options"
3. Go to **Tuya** tab
4. Fill in:
   - **Bridge URL:** `https://your-vercel-url.vercel.app`
   - **Username:** `myusername` (from Step 3)
   - **Password:** `MySecurePassword123!` (from Step 3)
5. Click "Save Settings"
6. Click "Test Connection"
   - Should show: ✅ "Connected to cloud bridge"
7. Click "Start Polling"
   - Extension console (F12) should show polling logs

✅ **Extension Ready!**

---

### **Step 5: Setup Tuya IoT Cloud** ⏱️ 15 mins

**5.1 Create Cloud Project:**
1. Go to: https://iot.tuya.com/
2. Login (create account if needed)
3. Go to **Cloud** → **Development**
4. Click "+ Create Cloud Project"
5. Fill in:
   - **Project Name:** Rankify Assist
   - **Industry:** Smart Home
   - **Development Method:** Custom Development
   - **Data Center:** Choose your region
6. Click "Create"

**5.2 Link Devices:**
1. Go to **Devices** → **Link Tuya App Account**
2. Scan QR code with SmartLife app
3. Authorize
4. Your devices should appear!

**5.3 Get API Credentials:**
1. Go to your project
2. Click **Overview**
3. Copy and SAVE:
   - **Client ID:** `xxx`
   - **Client Secret:** `yyy`
   - **API URL:** `https://openapi.tuyain.com`

✅ **Tuya IoT Done!**

---

### **Step 6: Create MCP Servers in Tuya** ⏱️ 20 mins

**6.1 Register Browser Automation MCP:**
1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Click "+ Add custom MCP"
3. Fill in:
   - **Name:** Browser Automation
   - **Description:** Executes browser tasks via Chrome extension
   - **Icon:** Upload browser icon
4. Click "Create"
5. Go to **Configuration** tab
6. Copy and SAVE:
   - **MCP Endpoint:** `wss://...`
   - **Access ID:** `xxx`
   - **Access Secret:** `yyy`

**6.2 Register Device Controller MCP:**
1. Click "+ Add custom MCP"
2. Fill in:
   - **Name:** Tuya Device Controller
   - **Description:** Controls Tuya smart devices
3. Click "Create"
4. Copy credentials (Endpoint, ID, Secret)

✅ **MCPs Registered!**

---

### **Step 7: Configure & Run MCP Servers** ⏱️ 15 mins

**7.1 Install Tuya MCP SDK (REQUIRED!):**

**IMPORTANT:** You must install the official Tuya MCP SDK first!

```bash
# Clone the official Tuya MCP SDK repository
git clone https://github.com/tuya/tuya-mcp-sdk.git

# Navigate to Python SDK
cd tuya-mcp-sdk/mcp-python

# Install the SDK
pip install -e .

# Verify installation
python -c "from mcp_sdk import create_mcpsdk; print('✅ SDK installed!')"
```

**7.2 Browser Automation MCP:**

1. Go to: `mcp-servers/browser-automation/`
2. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
3. Edit `.env`:
   ```env
   MCP_ENDPOINT=wss://your-mcp-endpoint
   MCP_ACCESS_ID=your-access-id
   MCP_ACCESS_SECRET=your-access-secret
   
   CLOUD_BRIDGE_URL=https://your-vercel-url.vercel.app
   MCP_API_KEY=YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui  # From Step 2.4
   DEFAULT_USER_ID=user_1703123456_abc123  # From Step 3
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run:
   ```bash
   python server.py
   ```
   
   Should see:
   ```
   🌐 Browser Automation MCP Server
   Cloud Bridge URL: https://...
   Connecting to Tuya Cloud...
   ✅ Connected to Tuya Cloud!
   🔌 MCP Server is running...
   ```

**7.3 Device Controller MCP:**

1. Go to: `mcp-servers/device-controller/`
2. Create `.env` file (use template from `PHASE-1-2-MCP-SETUP.md`)
3. Fill in all values
4. Run:
   ```bash
   pip install -r requirements.txt
   python server.py
   ```

✅ **MCP Servers Running!**

---

### **Step 8: Connect MCPs to Workflow** ⏱️ 5 mins

**In Tuya AI Workflow Editor:**

1. Open your workflow
2. Go to **Browser Executor** node (Large Model with tools)
3. Click Toolset → "+ Add Tool"
4. Select **MCP** tab
5. Choose "Browser Automation"
6. Check `execute_browser_task`
7. Click "Confirm"

8. Go to **IoT Controller** node
9. Add tool → MCP → "Tuya Device Controller"
10. Check all 3 tools:
    - `list_user_devices`
    - `query_device_status`
    - `control_device`
11. Click "Confirm"

12. **Save workflow**
13. **Publish workflow**

✅ **Workflow Connected!**

---

### **Step 9: Final Test** ⏱️ 10 mins

**Test 1: Browser with Confirmation**
1. Open SmartLife app
2. Scan your AI workflow QR code
3. Say: **"check my gmail"**
4. Should respond: **"I plan to open Gmail and count emails. Should I proceed?"**
5. Say: **"yes"**
6. Browser should open Gmail
7. Should respond: **"You have X unread emails"**

**Test 2: Decline Browser Task**
1. Say: **"open youtube"**
2. Should ask for confirmation
3. Say: **"no"**
4. Should respond: **"Understood. Task cancelled."**

**Test 3: IoT Direct**
1. Say: **"turn on living room light"**
2. Should execute immediately (no confirmation)
3. Light turns on
4. Responds: **"Light is now on"**

**Test 4: Chat**
1. Say: **"what is 2 plus 2"**
2. Should respond: **"4"** (conversationally)

✅ **ALL TESTS PASSING! YOU'RE DONE!** 🎉

---

## 📊 FINAL CHECKLIST

### Infrastructure:
- [ ] Supabase database created & schema loaded
- [ ] Vercel cloud bridge deployed
- [ ] Environment variables set in Vercel
- [ ] Test user registered
- [ ] Ping endpoint works

### Extension:
- [ ] Built with pnpm build
- [ ] Loaded in Chrome
- [ ] Settings configured
- [ ] Connection test passes
- [ ] Polling started

### MCPs:
- [ ] Both MCPs registered in Tuya
- [ ] Browser MCP .env configured
- [ ] Device MCP .env configured
- [ ] Both servers running
- [ ] Show "Online" in Tuya platform

### Workflow:
- [ ] Browser confirmation flow complete
- [ ] MCPs added to nodes
- [ ] Workflow saved
- [ ] Workflow published
- [ ] QR code generated

### Testing:
- [ ] Browser confirmation works
- [ ] Browser decline works
- [ ] IoT direct execution works
- [ ] Chat works
- [ ] All 4 tests passing

---

## 🆘 Troubleshooting

**Extension not connecting:**
- Check bridge URL (no trailing slash!)
- Verify username/password
- Check Supabase users table

**MCP not being called:**
- Verify toolset added in workflow nodes
- Check MCP server logs
- Ensure "Online" status in Tuya

**Command timeout:**
- Extension must be running & polling
- Check extension console for errors
- Verify command appears in Supabase commands table

---

## 🎯 Next Steps

1. **Add more devices** to your Tuya account
2. **Create custom commands** in workflow
3. **Add more users** via `/api/register`
4. **Monitor usage** in Supabase dashboard
5. **Scale up** as needed (Supabase has plenty of capacity!)

---

**DEPLOYMENT COMPLETE!** 🚀

**Total Time:** ~2 hours

**Ongoing Cost:** $0 (FREE tier for everything!)

**Your smart home is now voice-controlled with AI!** 🎉
