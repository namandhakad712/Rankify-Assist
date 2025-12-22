# 🤗 Hugging Face Spaces - Complete Deployment Guide

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

✅ **Easy Deployment**
- Just upload 3 files
- No complex configuration
- Auto-builds and deploys

✅ **Perfect for Python**
- Native Python support
- Gradio integration
- Great documentation

---

## 📁 Files Location

All files ready in:
```
mcp-servers/hugging-face-space/
├── app.py                  ← Gradio web interface
├── requirements.txt        ← Dependencies
├── README.md              ← Space description
├── .env.example           ← Environment variables template
└── DEPLOYMENT_GUIDE.md    ← Detailed instructions
```

---

## 🚀 Quick Deployment (5 Steps)

### **Step 1: Create Space**

1. Go to: https://huggingface.co/spaces
2. Click: "Create new Space"
3. Fill in:
   - **Name**: `tuya-mcp-client-bridge`
   - **License**: Apache 2.0
   - **SDK**: Gradio
   - **Hardware**: CPUbasic (FREE)
4. Click: "Create Space"

---

### **Step 2: Upload Files**

**Upload these 3 files to your Space:**
1. `app.py`
2. `requirements.txt`
3. `README.md`

**How:**
- Click "Files" tab
- "Add file" → "Upload files"
- Select the 3 files
- Click "Commit"

---

### **Step 3: Set Environment Variables**

Go to **Settings** → **Variables and secrets**

**Add 4 secrets:**

```env
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_tuya_access_id
MCP_ACCESS_SECRET=your_tuya_secret
FASTMCP_CLOUD_MCP_URL=https://assist.fastmcp.app/mcp
```

**Where to get values:**
- Tuya credentials: From Tuya IoT Platform MCP service
- FASTMCP URL: Your deployed FastMCP server

---

### **Step 4: Wait for Build**

- Space auto-builds (2-3 minutes)
- Watch in "Logs" tab
- Wait for: "Running on local URL"

---

### **Step 5: Verify**

Click **"App"** tab:

**You should see:**
```
🔌 Connection Status: ✅ Connected
⚙️ Configuration: All ✅ Set
📋 Live Logs: Connection activity
```

**Check Tuya Platform:**
- Your MCP service → **Online** ✅

---

## 🎨 Web Interface Features

### **Connection Status**
Shows current state:
- `✅ Connected (Uptime: HH:MM:SS)` - Working!
- `❌ Disconnected` - Configuration issue

### **Configuration Panel**
Environment variables check:
```
• MCP_ENDPOINT: ✅ Set
• MCP_ACCESS_ID: ✅ Set
• MCP_ACCESS_SECRET: ✅ Set
• FASTMCP_CLOUD_MCP_URL: ✅ Set
```

### **Live Logs**
Real-time activity:
```
[20:30:15] 🚀 Starting Tuya MCP Client Bridge...
[20:30:18] ✅ Successfully connected!
[20:30:18] 🎧 Listening for requests...
[20:35:42] 📨 Received request from Tuya
```

### **Auto-Refresh**
- Updates every 5 seconds
- Manual refresh button available
- No page reload needed

---

## 📊 Architecture

```
Tuya AI Platform
      ↓
Hugging Face Space
  - app.py (Gradio UI)
  - Background thread (Tuya client)
  - Persistent connection
      ↓
FastMCP Cloud MCP Server
  - assist or device-control
      ↓
Cloud Bridge (Vercel)
      ↓
Browser Extension / Devices
```

---

## 🧪 Testing

### **Test 1: UI Check**
- Open Space URL
- Status: `✅ Connected`
- Logs show connection messages

### **Test 2: Tuya Platform**
- Go to Tuya IoT Platform
- Your MCP service shows: **Online**

### **Test 3: Voice Command**
Say: "Open Google"

**Expected:**
- Space logs show request received
- Browser opens Google
- Logs show completion

---

## 🔧 Troubleshooting

### **Build Failed**

**Error**: `Could not install requirements`

**Fix**:
1. Check `requirements.txt` syntax
2. Rebuild Space
3. Check logs for specific error

### **❌ Disconnected**

**Causes**:
- Missing environment variables
- Wrong credentials
- Typo in values

**Fix**:
1. Check all 4 secrets are set
2. Verify values are correct
3. Restart Space

### **No Logs**

**Fix**:
1. Click "🔄 Refresh Status"
2. Wait 5-10 seconds
3. Check Space running (green dot)

### **Connection Drops**

**Hugging Face is persistent!**

If drops:
1. Check Space logs for errors
2. Verify credentials still valid
3. Restart Space (Settings → Restart)

---

## 💰 Cost

**$0/month!** ✅

Hugging Face provides:
- Free CPU instances
- Unlimited runtime
- No credit card needed
- No hidden costs

---

## 📈 For Multiple Services

### **Deploy Two Spaces:**

**Space 1: Browser Automation**
```env
FASTMCP_CLOUD_MCP_URL=https://assist.fastmcp.app/mcp
```

**Space 2: Device Control**
```env
FASTMCP_CLOUD_MCP_URL=https://device-control.fastmcp.app/mcp
```

**Both use same Tuya credentials!**

---

## 🎯 Best Practices

### **Security**
✅ Use secrets (not variables) for credentials  
✅ Don't hardcode sensitive data  
✅ Keep Space private if needed  

### **Monitoring**
✅ Bookmark Space URL for easy access  
✅ Check logs regularly  
✅ Monitor uptime in UI  

### **Maintenance**
✅ Update requirements periodically  
✅ Restart Space if issues  
✅ Check Tuya Platform status  

---

## ✅ Success Checklist

- [ ] Space created on Hugging Face
- [ ] 3 files uploaded
- [ ] 4 environment secrets set
- [ ] Space built successfully
- [ ] App shows "✅ Connected"
- [ ] Tuya Platform shows "Online"
- [ ] Test command works
- [ ] Logs show activity

**All checked? You're live!** 🎉

---

## 📚 Resources

- **Hugging Face Docs**: https://huggingface.co/docs/hub/spaces
- **Gradio Guide**: https://gradio.app/guides
- **Tuya MCP SDK**: https://github.com/tuya/tuya-mcp-sdk
- **Example Space**: https://huggingface.co/spaces/gradio/chatbot

---

## 🎊 Next Steps

After successful deployment:

1. **Test thoroughly** - Try different commands
2. **Monitor regularly** - Check Space UI
3. **Deploy second Space** - For device control
4. **Share** - Your Space is public (or make private!)

---

**Deployment Time:** 10 minutes  
**Difficulty:** ⭐⭐ Easy  
**Cost:** FREE  
**Uptime:** 24/7  

**Perfect for Tuya MCP integration!** 🎯
