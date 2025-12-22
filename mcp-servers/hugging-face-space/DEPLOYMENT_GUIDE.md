# 🤗 Hugging Face Space Deployment Guide

Complete guide to deploy Tuya MCP Client to Hugging Face Spaces.

---

## 🎯 Why Hugging Face Spaces?

✅ **Free Forever** - No credit card needed  
✅ **Persistent** - Runs 24/7, no sleep  
✅ **Live UI** - Monitor connection in browser  
✅ **Easy Deploy** - Just upload files  
✅ **Auto-restart** - Handles failures  
✅ **Good Logs** - See everything  

**Perfect for Tuya MCP Client!**

---

## 📋 Prerequisites

1. **Hugging Face Account**: Sign up at https://huggingface.co
2. **Tuya Credentials**: From Tuya IoT Platform
3. **FastMCP Server**: Deployed and running

---

## 🚀 Step-by-Step Deployment

### **Step 1: Create New Space**

1. Go to: https://huggingface.co/spaces
2. Click: **"Create new Space"**
3. Configure:
   ```
   Owner: your-username
   Space name: tuya-mcp-client-bridge
   License: Apache 2.0
   Select SDK: Gradio
   Space hardware: CPU basic - 2 vCPU - 16 GB - FREE
   ```
4. Click: **"Create Space"**

---

### **Step 2: Upload Files**

**Option A: Web Interface**

1. In your Space, click **"Files"** tab
2. Click **"Add file" → "Upload files"**
3. Upload these 3 files:
   - `app.py`
   - `requirements.txt`
   - `README.md`
4. Click **"Commit"**

**Option B: Git**

```bash
# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/tuya-mcp-client-bridge
cd tuya-mcp-client-bridge

# Copy files
cp /path/to/mcp-servers/hugging-face-space/* .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

---

### **Step 3: Set Environment Variables**

1. Go to: **Settings** tab
2. Scroll to: **"Variables and secrets"**
3. Click: **"New secret"**

**Add these 4 secrets:**

| Name | Value | Example |
|------|-------|---------|
| `MCP_ENDPOINT` | Your Tuya endpoint | `https://mcp-in.iotbing.com` |
| `MCP_ACCESS_ID` | Your Tuya Access ID | `9dddfe970174516512ff...` |
| `MCP_ACCESS_SECRET` | Your Tuya Secret | `your_secret_key` |
| `FASTMCP_CLOUD_MCP_URL` | Your MCP server URL | `https://assist.fastmcp.app/mcp` |

**Where to get Tuya credentials:**
1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Find your MCP service
3. Click: Service Access Configuration → Data Center
4. Copy: Endpoint, Access ID, Access Secret

---

### **Step 4: Wait for Build**

1. Space will auto-build (2-3 minutes)
2. Watch build logs in **"Logs"** tab
3. Wait for: `Running on local URL: http://0.0.0.0:7860`

---

### **Step 5: Open & Verify**

1. Click **"App"** tab to see your Space
2. Should see:
   ```
   🔌 Connection Status: ✅ Connected
   📋 Live Logs: Shows connection activity
   ```

3. Check Tuya IoT Platform:
   - Your MCP service should show: **Online** ✅

---

## 📊 Understanding the UI

### **Connection Status**
- `✅ Connected (Uptime: 00:05:23)` - Working!
- `❌ Disconnected` - Check env vars

### **Configuration**
Shows which environment variables are set:
- ✅ = Variable is configured
- ❌ = Variable missing (add it!)

### **Live Logs**
Real-time activity:
```
[20:30:15] 🚀 Starting Tuya MCP Client Bridge...
[20:30:16] ✅ MCP SDK imported successfully
[20:30:17] 🔌 Connecting to Tuya Platform...
[20:30:18] ✅ Successfully connected to Tuya Platform!
[20:30:18] 🎧 Listening for AI Workflow requests...
```

---

## 🧪 Testing

### **Test 1: Check Status**

In Space UI:
- Status should be: `✅ Connected`
- Uptime counter increasing

### **Test 2: Tuya Platform**

On Tuya IoT:
- MCP service shows: **Online**
- Tools visible in Tool tab

### **Test 3: Voice Command**

Say to Tuya AI: **"Open Google"**

Check Space logs:
```
[20:35:42] 📨 Received request from Tuya
[20:35:42] 🔧 Tool: execute_browser_command
[20:35:43] ✅ Request forwarded to MCP server
```

---

## 🔧 Troubleshooting

### **Build Failed**

**Error:** `Could not install git+https://github.com/tuya/tuya-mcp-sdk.git`

**Fix:**
1. Check `requirements.txt` syntax
2. Ensure Git URL correct
3. Restart build

### **❌ Disconnected**

**Check:**
1. All 4 secrets set correctly
2. No typos in values
3. Secrets are **secrets**, not variables
4. Restart Space

### **No Logs Appearing**

**Solution:**
1. Click **"🔄 Refresh Status"**
2. Wait a few seconds
3. Check browser console for errors

### **Connection Drops**

**Hugging Face Spaces are persistent!** 

If it drops:
1. Check Space logs for errors
2. Verify Tuya credentials still valid
3. Restart Space

---

## 🎯 Space URL

Your Space will be accessible at:
```
https://huggingface.co/spaces/YOUR_USERNAME/tuya-mcp-client-bridge
```

Share this URL to monitor your bridge from anywhere!

---

## 💰 Cost

**FREE!** ✅

Hugging Face provides:
- Free CPU instances
- Unlimited uptime
- No credit card required
- Community tier forever

---

## 📈 Scaling

### **For Production:**

1. **Upgrade Hardware** (if needed):
   - Settings → Hardware
   - Choose: CPU basic ($0/month)
   - Or: CPU upgrade (if you need more power)

2. **Set to Private** (optional):
   - Settings → Visibility
   - Choose: Private
   - Only you can access

3. **Add Collaborators**:
   - Settings → Collaborators
   - Add team members

---

## 🎊 Benefits Over Other Platforms

| Feature | Hugging Face | FastMCP Cloud | Railway |
|---------|--------------|---------------|---------|
| **Persistent** | ✅ YES | ❌ Serverless | ✅ YES |
| **Free Tier** | ✅ Unlimited | ✅ YES | ⚠️ Limited |
| **Live UI** | ✅ Built-in | ✅ YES | ❌ NO |
| **Easy Deploy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Logs** | ✅ Excellent | ✅ Good | ✅ Good |
| **Auto-restart** | ✅ YES | N/A | ✅ YES |

---

## ✅ Success Checklist

After deployment:

- [ ] Space built successfully
- [ ] All 4 secrets configured
- [ ] App tab shows connected status
- [ ] Logs show "Successfully connected"
- [ ] Tuya Platform shows MCP as Online
- [ ] Voice command test works
- [ ] Logs show activity

**All ✅? You're set!** 🎉

---

## 📚 Additional Resources

- **Hugging Face Docs**: https://huggingface.co/docs/hub/spaces
- **Gradio Docs**: https://gradio.app/docs
- **Tuya MCP SDK**: https://github.com/tuya/tuya-mcp-sdk
- **FastMCP Docs**: https://fastmcp.cloud/docs

---

## 🎯 Next Steps

After successful deployment:

1. **Bookmark your Space** - Easy access to monitor
2. **Test thoroughly** - Try different voice commands
3. **Deploy device-controller** - Create second Space for devices
4. **Share** - Show others you deployment!

---

**Last Updated:** 2025-12-22  
**Status:** Production ready! 🚀  
**Deployment Time:** ~10 minutes  
**Difficulty:** ⭐⭐ (Easy!)
