# 🚀 Offline MCP Setup Guide

Complete guide for running MCP servers locally on your PC.

---

## 📁 New Structure

```
mcp-servers/
└── offline/              ← You are here!
    ├── browser-automation/
    └── device-controller/
```

---

## ✅ **WHAT YOU NEED:**

### **1. Tuya MCP SDK** (Required for offline)
```bash
cd c:\TUYA
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

**Why?** The SDK provides `MCPSdkClient` class that connects to Tuya Platform.

### **2. FastMCP Library**
```bash
pip install fastmcp httpx python-dotenv
```

**Why?** FastMCP builds standard MCP servers with tools.

---

## 🏗️ **ARCHITECTURE:**

```
Tuya AI (SmartLife App)
    ↓
Tuya MCP Platform (Cloud)
    ↓
tuya_client.py (offline/browser-automation/)
    ├─ MCPSdkClient connects to Tuya Platform
    └─ Forwards requests to local FastMCP server
        ↓
server.py (offline/browser-automation/)
    ├─ Defines tools (navigate_to_url, etc.)
    └─ Executes tool logic
```

---

## 📝 **STEP-BY-STEP SETUP:**

### **Step 1: Install Tuya MCP SDK**

```bash
# Clone SDK
cd c:\TUYA
git clone https://github.com/tuya/tuya-mcp-sdk.git

# Install SDK
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

### **Step 2: Install Project Requirements**

```bash
# Browser Automation
cd c:\TUYA\RankifyAssist\mcp-servers\offline\browser-automation
pip install -r requirements.txt

# Device Controller
cd c:\TUYA\RankifyAssist\mcp-servers\offline\device-controller
pip install -r requirements.txt
```

### **Step 3: Create MCP on Tuya Platform**

1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Click:** "Custom MCP Service"
3. **Add custom MCP**
4. **Fill in:**
   - Name (EN): Browser Automation
   - Name (CN): 浏览器自动化
   - Description: Automates browser tasks
5. **Click:** Confirm

### **Step 4: Add Data Center**

1. **Service Access Configuration → Add Data Center**
2. **Select:** Your region (India/Singapore/etc.)
3. **Copy these credentials:**
   ```
   Endpoint: https://mcp-in.iotbing.com
   Access ID: 9dddfe97017451...
   Access Secret: ••••••••••••••
   ```

### **Step 5: Configure Environment Variables**

**Create:** `offline/browser-automation/.env`

```env
# Tuya MCP Platform credentials
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_access_id_from_tuya
MCP_ACCESS_SECRET=your_secret_from_tuya

# Cloud Bridge (already deployed on Vercel)
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_cloud_bridge_api_key
```

**Copy for device controller:**
```bash
copy offline\browser-automation\.env offline\device-controller\.env
```

### **Step 6: Run Browser Automation**

**Terminal 1 - FastMCP Server:**
```bash
cd c:\TUYA\RankifyAssist\mcp-servers\offline\browser-automation
python server.py
```

**Expected output:**
```
🌐 Browser Automation MCP Server
==================================================
Cloud Bridge: https://tuya-cloud-bridge.vercel.app
==================================================
🚀 Starting Browser Automation MCP Server...
🌐 Server will run on http://localhost:8767
```

**Terminal 2 - Tuya Client:**
```bash
cd c:\TUYA\RankifyAssist\mcp-servers\offline\browser-automation
python tuya_client.py
```

**Expected output:**
```
============================================================
Tuya MCP SDK Client - Simple Version
============================================================
Tuya Endpoint: https://mcp-in.iotbing.com
Access ID: 9dddfe970174516512ff...
Local MCP Server: http://localhost:8767/mcp
============================================================
✅ Connected to Tuya Platform!
✅ MCP Server is now ONLINE on Tuya Platform!
🎧 Listening for AI Workflow requests...
```

### **Step 7: Run Device Controller** (Optional)

**Terminal 3 - FastMCP Server:**
```bash
cd c:\TUYA\RankifyAssist\mcp-servers\offline\device-controller
python server.py
```

**Terminal 4 - Tuya Client:**
```bash
cd c:\TUYA\RankifyAssist\mcp-servers\offline\device-controller
python tuya_client.py
```

### **Step 8: Verify on Tuya Platform**

1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Browser Automation → Status:** **Online** ✅
3. **Tool tab:** Shows your tools ✅

---

## 🎯 **FILE STRUCTURE:**

```
mcp-servers/offline/
├── browser-automation/
│   ├── server.py          ← FastMCP server (run this)
│   ├── tuya_client.py     ← Tuya connector (run this)
│   ├── requirements.txt   ← pip install -r requirements.txt
│   ├── .env               ← Your credentials
│   └── .env.example       ← Template
└── device-controller/
    ├── server.py          ← FastMCP server
    ├── tuya_client.py     ← Tuya connector
    ├── requirements.txt   ← Dependencies
    └── .env               ← Your credentials
```

---

## 🔧 **TROUBLESHOOTING:**

### **Server shows Offline:**
- ✅ Check `tuya_client.py` is running
- ✅ Check credentials in `.env` are correct
- ✅ Check `server.py` is running on port 8767
- ✅ Check no firewall blocking connections

### **No tools showing:**
- Restart `tuya_client.py`
- Check FastMCP server logs for errors
- Verify tools are defined with `@mcp.tool`

### **Commands not executing:**
- Check cloud bridge is deployed on Vercel
- Check `MCP_API_KEY` matches
- Check network connectivity

### **Import errors:**
- Make sure Tuya SDK installed: `pip install -e tuya-mcp-sdk/mcp-python`
- Make sure requirements installed: `pip install -r requirements.txt`

---

## 📚 **Requirements:**

**In `requirements.txt`:**
```txt
fastmcp>=2.12.3
httpx>=0.25.0
python-dotenv>=1.0.0
pydantic>=2.0.0
requests>=2.31.0

# Note: tuya-mcp-sdk installed separately from GitHub
```

---

## ✅ **SUMMARY:**

1. **tuya-mcp-sdk:** Install from GitHub for `MCPSdkClient`
2. **FastMCP:** Builds your MCP server with tools
3. **Two processes per feature:** server.py + tuya_client.py
4. **Flow:** Tuya → tuya_client.py → server.py → Your logic
5. **Location:** Everything in **`offline/`** folder

**Keep your PC on 24/7 or use online deployment!** 🚀

---

**Last Updated:** 2025-12-22  
**Structure:** offline/browser-automation and offline/device-controller  
**Status:** Complete and working! ✨
