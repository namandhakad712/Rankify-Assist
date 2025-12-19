# ☁️ Cloud Bridge Deployment Guide

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
```
✅ Sign up at: https://supabase.com
✅ Create new project
✅ Run database schema
```

### **2. Vercel Account**
```
✅ Sign up at: https://vercel.com
✅ Link GitHub account (for Method 1)
```

### **3. Google OAuth Credentials**
```
✅ Go to: console.cloud.google.com
✅ Create OAuth Client ID
✅ Add authorized origins
```

---

## 🚀 **Method 1: GitHub + Vercel Dashboard (RECOMMENDED)**

**Why this method?**
- ✅ Auto-deploys on every `git push`
- ✅ Easy to manage environment variables
- ✅ Built-in CI/CD
- ✅ Preview deployments for testing
- ✅ No CLI needed

---

### **Step 1: Push to GitHub**

**1.1 Create GitHub Repository:**
```bash
# If not already done:
cd c:\TUYA\RankifyAssist
git remote add origin https://github.com/YOUR_USERNAME/rankify-assist.git
git branch -M main
git push -u origin main
```

**1.2 Verify Upload:**
- Go to: `https://github.com/YOUR_USERNAME/rankify-assist`
- Check `cloud-bridge/` folder exists ✅

---

### **Step 2: Connect to Vercel**

**2.1 Login to Vercel:**
```
1. Go to: https://vercel.com
2. Click "Add New..." → "Project"
```

**2.2 Import Repository:**
```
1. Click "Import Git Repository"
2. Select your GitHub account
3. Find "rankify-assist" repo
4. Click "Import"
```

**2.3 Configure Project:**

**Framework Preset:** `Other`

**Root Directory:**
```
Click "Edit" next to Root Directory
Select: cloud-bridge
✅ This tells Vercel to deploy ONLY the cloud-bridge folder
```

**Build Settings:**
```
Build Command: (leave empty - not needed for serverless)
Output Directory: (leave empty)
Install Command: npm install
```

**2.4 Add Environment Variables:**

Click "Environment Variables" section:

**Variable 1:**
```
Name: SUPABASE_URL
Value: https://YOUR_PROJECT.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Variable 2:**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGc... (your anon key)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Variable 3:**
```
Name: GOOGLE_CLIENT_ID
Value: YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Variable 4 (Security Key):**
```
Name: MCP_API_KEY
Value: (generate random 32 char string)
Environments: ✅ Production, ✅ Preview
⚠️ NOT Development (sensitive!)
```

**🔐 Why is MCP_API_KEY random?**

This key authenticates MCP servers when they send commands to your cloud bridge:

```
MCP Server → POST /api/execute { apiKey: "xxx" }
                ↓
Cloud Bridge → Validates: apiKey === process.env.MCP_API_KEY
                ↓
        ✅ Match → Accept     ❌ No match → Reject (401)
```

**Security Purpose:**
- Prevents unauthorized access to your command queue
- Only YOUR MCP servers can send browser commands
- Blocks random people from hijacking your browser
- Acts as a shared secret between MCP ↔ Vercel

**Generate MCP_API_KEY:**
```powershell
# Run in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Example output: YfV5qoR6FaBH39AZ1wtlEjXUzLmckgui
# Copy this value ✅
# You'll use it again in MCP server .env files
```

**2.5 Deploy:**
```
1. Click "Deploy"
2. Wait 1-2 minutes ⏱️
3. You'll get URL: https://YOUR_PROJECT.vercel.app
```

**2.6 Test Deployment:**

Visit:
```
https://YOUR_PROJECT.vercel.app/api/ping
```

Should see:
```json
{
  "status": "ok",
  "service": "Tuya Cloud Bridge",
  "version": "1.0.0"
}
```

✅ **Success! Cloud bridge is live!**

---

### **Step 3: Auto-Deploy Setup**

**Now every time you push to GitHub:**
```bash
git add .
git commit -m "Update cloud bridge"
git push
```

**Vercel automatically:**
1. ✅ Detects changes
2. ✅ Builds project
3. ✅ Deploys to production
4. ✅ Updates URL (same link)

**View deployments:**
```
https://vercel.com/YOUR_USERNAME/rankify-assist-bridge
→ Deployments tab
→ See all builds & logs
```

---

## 🔧 **Method 2: CLI Deployment**

**For quick testing or one-time deploys**

---

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

---

### **Step 2: Login**

```bash
vercel login
```

Opens browser → Login with GitHub/Email

---

### **Step 3: Set Environment Variables FIRST**

**⚠️ IMPORTANT: Set env vars BEFORE deploying!**

**3.1 Generate MCP API Key:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
# Copy the output
```

**3.2 Add to Vercel (via Dashboard):**
```
1. Go to: https://vercel.com/dashboard
2. Create new project (or use existing)
3. Settings → Environment Variables
4. Add all 4 variables (see Method 1, Step 2.4)
5. Save
```

**Alternative: CLI method:**
```bash
cd c:\TUYA\RankifyAssist\cloud-bridge

# Add each variable:
vercel env add SUPABASE_URL production
# Paste value when prompted

vercel env add SUPABASE_ANON_KEY production
vercel env add GOOGLE_CLIENT_ID production
vercel env add MCP_API_KEY production
```

---

### **Step 4: Deploy**

```bash
cd c:\TUYA\RankifyAssist\cloud-bridge
vercel
```

**Follow prompts:**
```
? Set up and deploy? → YES
? Which scope? → YOUR_USERNAME
? Link to existing project? → NO
? Project name? → rankify-assist-bridge
? In which directory? → ./ (current)
? Want to modify settings? → NO
```

**Wait for deployment...**

Output:
```
✅ Production: https://rankify-assist-bridge.vercel.app
```

---

### **Step 5: Test**

```bash
curl https://your-project.vercel.app/api/ping
```

Should return:
```json
{"status":"ok","service":"Tuya Cloud Bridge","version":"1.0.0"}
```

---

## 🔐 **Getting Required Credentials**

### **Supabase Credentials:**

**1. Create Project:**
```
1. Go to: https://supabase.com
2. Click "New Project"
3. Fill in:
   - Name: rankify-assist-db
   - Database Password: (generate strong password)
   - Region: (choose closest)
4. Click "Create"
5. Wait 2-3 minutes ⏱️
```

**2. Run Schema:**
```
1. Go to: SQL Editor (left sidebar)
2. Click "+ New query"
3. Open: cloud-bridge/supabase-schema.sql
4. Copy ALL contents
5. Paste into editor
6. Click "Run" (or Ctrl+Enter)
7. Success! ✅
```

**3. Get Credentials:**
```
1. Go to: Settings → API
2. Copy:
   - Project URL: https://xxxxx.supabase.co
   - anon public key: eyJhbGc...
```

---

### **Google OAuth Credentials:**

**1. Create Project:**
```
1. Go to: console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Name: Rankify Assist
4. Click "Create"
```

**2. Enable APIs:**
```
1. APIs & Services → Library
2. Search "Google+ API"
3. Click "Enable"
```

**3. Create OAuth Credentials:**
```
1. APIs & Services → Credentials
2. Click "+ Create Credentials" → "OAuth client ID"
3. Application type: Web application
4. Name: Rankify Assist Web
5. Authorized JavaScript origins:
   - https://your-project.vercel.app
6. Authorized redirect URIs:
   - https://your-project.vercel.app/api/auth/google
7. Click "Create"
```

**4. Copy Client ID:**
```
Modal shows:
- Client ID: xxxxx.apps.googleusercontent.com
- Client Secret: (not needed for our case)

Copy Client ID ✅
```

---

## 🧪 **Testing Your Deployment**

### **Test 1: Ping Endpoint**
```bash
curl https://your-project.vercel.app/api/ping
```

Expected:
```json
{"status":"ok","service":"Tuya Cloud Bridge","version":"1.0.0"}
```

---

### **Test 2: User Registration**
```powershell
$body = @{
    username = "testuser"
    password = "Test123!"
    email = "test@test.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-project.vercel.app/api/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

Expected:
```json
{
  "success": true,
  "userId": "user_1234567890_abc",
  "username": "testuser",
  "message": "Registration successful"
}
```

**Save the userId!** You need it for MCP configuration.

---

### **Test 3: Google Auth**
```
1. Go to: https://your-project.vercel.app/admin.html
2. Click "Sign in with Google"
3. Should redirect to Google
4. Authorize app
5. Should show dashboard ✅
```

---

## 🔄 **Updating Your Deployment**

### **Method 1 (GitHub):**
```bash
# Make changes to code
git add .
git commit -m "Update API endpoints"
git push

# Vercel automatically deploys! ✅
```

---

### **Method 2 (CLI):**
```bash
cd c:\TUYA\RankifyAssist\cloud-bridge
vercel --prod
```

---

## 📊 **Vercel Dashboard Features**

**Access:** `https://vercel.com/YOUR_USERNAME/rankify-assist-bridge`

### **Useful Sections:**

**1. Deployments:**
- See all deployments
- View build logs
- Rollback to previous version

**2. Environment Variables:**
- Add/edit/delete variables
- Copy values
- Different environments (prod/preview/dev)

**3. Settings:**
- Change root directory
- Configure build settings
- Custom domains
- Git integration

**4. Analytics (optional):**
- Request count
- Error rate
- Response times

**5. Logs:**
- Runtime logs
- Function invocations
- Error tracking

---

## 🆘 **Troubleshooting**

### **"MCP_API_KEY secret does not exist"**

**Solution:**
```
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add MCP_API_KEY with generated value
4. Redeploy: Deployments → Latest → ... → Redeploy
```

---

### **"SUPABASE_URL not found"**

**Solution:**
```
1. Check Environment Variables in Vercel
2. Ensure all 4 variables are set:
   ✅ SUPABASE_URL
   ✅ SUPABASE_ANON_KEY
   ✅ GOOGLE_CLIENT_ID
   ✅ MCP_API_KEY
3. Verify environments: Production + Preview checked
4. Redeploy
```

---

### **"404 - Not Found" on API endpoints**

**Solution:**
```
1. Check Root Directory is set to: cloud-bridge
2. Vercel Dashboard → Settings → General → Root Directory
3. If wrong, change it → Save → Redeploy
```

---

### **Build Fails**

**Solution:**
```
1. Check package.json exists in cloud-bridge/
2. Verify all dependencies listed
3. Deployments → Build Logs → Check errors
4. Fix code → Commit → Push
```

---

## ✅ **Deployment Checklist**

**Before deploying:**
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Supabase credentials copied
- [ ] Google OAuth configured
- [ ] MCP API key generated
- [ ] Code pushed to GitHub (Method 1) OR locally ready (Method 2)

**During deployment:**
- [ ] Vercel project created
- [ ] Root directory set to `cloud-bridge`
- [ ] All 4 environment variables added
- [ ] Deployment successful
- [ ] URL noted down

**After deployment:**
- [ ] `/api/ping` returns success
- [ ] User registration works
- [ ] Google OAuth login works
- [ ] Admin page loads

---

## 🎯 **Next Steps**

After cloud bridge is deployed:

1. ✅ **Build Chrome Extension** → [Extension Guide](../extension/BUILD-GUIDE.md)
2. ✅ **Setup MCP Servers** → [MCP Guide](../mcp/SETUP-GUIDE.md)
3. ✅ **Configure Workflow** → [Workflow Guide](../workflow/COMPLETE-GUIDE.md)
4. ✅ **Test End-to-End** → [Testing Guide](../workflow/TESTING.md)

---

**Your cloud bridge URL:** `https://your-project.vercel.app`

**Save this URL!** You'll need it for:
- Extension configuration
- MCP server configuration
- Admin panel access

---

**Deployment Complete! 🎉**

**Time Taken:** ~15 minutes  
**Cost:** $0/month  
**Status:** Production Ready ✅
