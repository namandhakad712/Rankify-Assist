# 🎯 COMPLETE SETUP GUIDE - Visual Walkthrough

**Everything you need to get Rankify Assist running!**

---

## 📊 **VERCEL

 DASHBOARD SETUP (Step-by-Step)**

### **Step 1: Add Environment Variable - MCP_API_KEY**

```
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
```

**Generate MCP_API_KEY:**
```powershell
# Run this in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Output example: YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui
# Copy generated one! ✅
```

---

### **Step 2: Verify All Environment Variables**

**You should have 4 variables:**

```
┌──────────────────────┬──────────────────────────┬─────────────────┐
│ NAME                 │ VALUE (preview)          │ ENVIRONMENTS    │
├──────────────────────┼──────────────────────────┼─────────────────┤
│ SUPABASE_URL         │ https://xxxxx.supabase.. │ Prod, Preview   │
│ SUPABASE_ANON_KEY    │ eyJhbGciOiJIUzI1NiIs..   │ Prod, Preview   │
│ GOOGLE_CLIENT_ID     │ 123456-abc.apps.google.. │ Prod, Preview   │
│ MCP_API_KEY          │ YfV5qoR6FaBH39AZ...      │ Prod, Preview   │
└──────────────────────┴──────────────────────────┴─────────────────┘
```

**If any missing, add them!**

---

### **Step 3: Redeploy**

```
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
```

---

### **Step 4: Test Deployment**

```
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
```

**✅ If you see this → Cloud bridge is working!**

---

## 🧩 **EXTENSION SETUP**

### **Step 1: Update Bridge URL**

```
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
```

---

### **Step 2: Start Polling**

```
After successful test:

1. Click "▶ Start Polling"

2. Status updates to:
┌────────────────────────────────────────┐
│  Status:  ✓ Connected                  │
│  Polling: ▶ Active                     │
└────────────────────────────────────────┘

3. Extension is now listening for commands! ✅
```

---

## 🐍 **MCP SERVERS SETUP**

### **Step 1: Install Tuya MCP SDK**

```powershell
# Clone SDK
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python

# Install
pip install -e .

# Verify
python -c "from mcp_sdk import create_mcpsdk; print('✅ SDK installed!')"
```

---

### **Step 2: Configure Browser MCP**

```powershell
# Navigate to folder
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation

# Copy template
copy .env.example .env

# Edit .env file
notepad .env
```

**Fill in .env:**
```env
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
```

**Where to get credentials:**

```
MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET:
1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Click "+ Add custom MCP"
3. Name: "Browser Automation"
4. Click "Create"
5. Click your MCP → Configuration tab
6. Copy all 3 values ✅
```

---

### **Step 3: Run Browser MCP**

```powershell
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation
python server.py
```

**Expected output:**
```
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
```

**✅ Leave this terminal open!**

---

### **Step 4: Configure Device MCP** (Same process)

```powershell
cd c:\TUYA\RankifyAssist\mcp-servers\device-controller
copy .env.example .env
notepad .env
```

**Fill in .env:**
```env
# From Tuya MCP page (DIFFERENT MCP than browser!)
MCP_ENDPOINT=wss://mcp-us.tuya-inc.com:8443
MCP_ACCESS_ID=p17389999999999xyz
MCP_ACCESS_SECRET=9999999999xyz9999999999xyz9999

# From iot.tuya.com → Your Project
TUYA_CLIENT_ID=abcdefg1234567
TUYA_CLIENT_SECRET=1234567890abcdefg1234567890abcd
TUYA_API_URL=https://openapi.tuyain.com
```

**Run it:**
```powershell
python server.py
```

**Expected output:**
```
🏠 Device Controller MCP Server
✅ Connected to Tuya Cloud!
🎧 Listening for device control calls...
```

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
```
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
```

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
1. Check URL doesn't have trailing `/`
2. Verify URL matches Vercel deployment
3. Edit URL → Press TAB → Test Connection
4. Start Polling

---

**COMPLETE SETUP TIME: ~30 minutes**

**COST: $0/month**

**YOU'RE READY TO GO!** 🚀
