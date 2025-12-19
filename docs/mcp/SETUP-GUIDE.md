# 🎯 MCP Servers - Complete Setup Guide

## ✅ **WHAT ARE MCP SERVERS?**

MCP (Model Context Protocol) servers connect Tuya AI to custom functionality:
- **Device Controller** - Controls your Tuya smart devices
- **Browser Automation** - Automates browser tasks via Chrome extension

---

## 🏗️ **ARCHITECTURE:**

```
Tuya AI (SmartLife app)
    ↓
Tuya MCP Platform (Cloud)
    ↓
Your MCP Server (this code)
    ├─ Uses Tuya MCP SDK
    ├─ Defines tools with 'mcp' library
    └─ Handles tool calls
        ↓
    Device Controller → Tuya OpenAPI → Smart Devices
    Browser Automation → Cloud Bridge → Chrome Extension → Browser
```

---

## 📦 **INSTALLATION:**

### **1. Install Dependencies:**
```bash
# Python 3.10+ required
pip install mcp httpx python-dotenv

# Clone Tuya MCP SDK
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

### **2. Verify Installation:**
```bash
python -c "from mcp_sdk import create_mcpsdk; from mcp.server import Server; print('✅ All installed!')"
```

---

## 🔧 **SETUP DEVICE CONTROLLER:**

### **Step 1: Create MCP on Tuya Platform**

```
1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Click: "Add custom MCP"
3. Fill in:
   - Name: Device Controller
   - Description: Controls Tuya smart devices
   - Icon: Upload device icon
4. Click: Confirm
```

### **Step 2: Configure Data Center**

```
1. Service Access Configuration → Data Center
2. Click: "Add Data Center"
3. Select your region (e.g., India)
4. Copy these 3 values:
   ✅ Endpoint: https://mcp-in.iotbing.com
   ✅ Access ID: p17381234567890abc
   ✅ Access Secret: xxxxxxxxxxxxx
```

### **Step 3: Create .env File**

**File:** `mcp-servers/device-controller/.env`

```bash
# From Tuya Platform MCP Management
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=p17381234567890abc
MCP_ACCESS_SECRET=your_secret_here
```

**NOTE:** NO Tuya OpenAPI credentials needed! MCP SDK handles everything!

### **Step 4: Run Server**

```bash
cd mcp-servers/device-controller
python server.py
```

**Expected output:**
```
🏠 Device Controller MCP Server
==================================================
MCP Endpoint: https://mcp-in.iotbing.com
==================================================
🚀 Starting local MCP server...
🎧 Listening for device control commands from Tuya AI...
```

### **Step 5: Verify on Tuya Platform**

```
1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Your server → Check status: Should show "Online" ✅
3. Tool tab → You should see 3 tools:
   - list_user_devices
   - query_device_status
   - control_device
```

---

## 🌐 **SETUP BROWSER AUTOMATION:**

### **Step 1: Create MCP on Tuya Platform**

```
Same as Device Controller, but:
- Name: Browser Automation
- Description: Automates browser via Chrome extension
```

### **Step 2: Create .env File**

**File:** `mcp-servers/browser-automation/.env`

```bash
# From Tuya Platform
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=p17381234567890abc  # Different from device-controller!
MCP_ACCESS_SECRET=your_secret_here

# Cloud Bridge Configuration
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_random_api_key  # Same as in Vercel env vars
```

### **Step 3: Run Server**

```bash
cd mcp-servers/browser-automation
python server.py
```

### **Step 4: Verify Tools**

Tools should appear:
- navigate_to_url
- click_element
- type_text
- get_page_content
- take_screenshot

---

## 🎯 **HOW TO USE:**

### **1. Add MCP to Tuya Agent**

```
1. Go to: https://platform.tuya.com/exp/ai
2. Click: "Develop" on your agent
3. Model Configuration → Skills → Plugin → +
4. Select: "MCP" tab
5. Add: Your custom MCP servers
6. Save
```

### **2. Test Voice Commands**

**Device Control:**
```
"Hey Tuya, turn on the living room light"
"What's the temperature of my bedroom AC?"
"List all my smart devices"
```

**Browser Automation:**
```
"Hey Tuya, open Google"
"Check my Gmail"
"Take a screenshot"
```

---

## 🐛 **TROUBLESHOOTING:**

### **Server shows Offline:**
```
✅ Check .env file has correct credentials
✅ Ensure data center matches (e.g., India)
✅ Verify server is running (python server.py)
✅ Check firewall isn't blocking connection
```

### **Tools not appearing:**
```
✅ Install 'mcp' library: pip install mcp
✅ Restart server after changes
✅ Refresh Tuya Platform page
```

### **Browser commands not working:**
```
✅ Check CLOUD_BRIDGE_URL is correct
✅ Verify MCP_API_KEY matches Vercel env
✅ Ensure Chrome extension is running
✅ Extension should be polling cloud bridge
```

---

## 📚 **OFFICIAL DOCS:**

- Tuya MCP Guide: https://developer.tuya.com/en/docs/iot/custom-mcp
- Tuya MCP SDK: https://github.com/tuya/tuya-mcp-sdk
- MCP Protocol: https://modelcontextprotocol.io

---

## ✅ **CHECKLIST:**

**Device Controller:**
- [ ] MCP server created on Tuya Platform
- [ ] Data center configured
- [ ] Credentials copied to .env
- [ ] Dependencies installed (mcp, mcp-sdk)
- [ ] Server running
- [ ] Status shows "Online"
- [ ] Tools visible on Tuya Platform

**Browser Automation:**
- [ ] MCP server created on Tuya Platform
- [ ] Credentials copied to .env
- [ ] Cloud bridge URL configured
- [ ] API key matches Vercel
- [ ] Server running
- [ ] Status shows "Online"
- [ ] Tools visible

**Integration:**
- [ ] MCPs added to Tuya Agent
- [ ] Agent saved and deployed
- [ ] Voice commands tested
- [ ] Results verified

**DONE!** 🎉
