# 🌐 FastMCP Cloud Deployment Guide

Deploy to FastMCP Cloud for 24/7 always-on operation!

---

## 📁 New Structure

```
mcp-servers/
└── online/               ← Deploy these files!
    ├── browser-automation/
    │   ├── mcp_server.py
    │   ├── tuya_client.py
    │   ├── requirements.txt
    │   └── requirements-client.txt
    └── device-controller/
        ├── mcp_server.py
        ├── tuya_client.py
        ├── requirements.txt
        └── requirements-client.txt
```

---

## 🚀 **4 Servers to Deploy:**

| # | Name | File Path | Requirements | Purpose |
|---|------|-----------|--------------|---------|
| 1 | `assist` | `mcp-servers/online/browser-automation/mcp_server.py` | `online/browser-automation/requirements.txt` | Browser MCP Server |
| 2 | `tuya-browser-bridge` | `mcp-servers/online/browser-automation/tuya_client.py` | `online/browser-automation/requirements-client.txt` | Browser Tuya Client |
| 3 | `device-control` | `mcp-servers/online/device-controller/mcp_server.py` | `online/device-controller/requirements.txt` | Device MCP Server |
| 4 | `tuya-device-bridge` | `mcp-servers/online/device-controller/tuya_client.py` | `online/device-controller/requirements-client.txt` | Device Tuya Client |

---

## 📝 **STEP-BY-STEP DEPLOYMENT:**

### **Prerequisites:**

1. ✅ FastMCP Cloud account (free): https://fastmcp.cloud
2. ✅ Code pushed to GitHub
3. ✅ Tuya MCP credentials ready

---

### **Server 1: Browser MCP (assist)**

#### Deploy:
```
1. Go to: https://fastmcp.cloud/dashboard
2. Click: "New Deployment"
3. Configure:
   Repository: namandhakad712/Rankify-Assist
   Branch: main
   Entrypoint: mcp-servers/online/browser-automation/mcp_server.py
   Requirements: mcp-servers/online/browser-automation/requirements.txt
   Name: assist
```

#### Environment Variables:
```env
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_api_key
TUYA_ACCESS_ID=your_tuya_access_id
```

#### Expected URL:
```
https://assist.fastmcp.app/mcp
```

---

### **Server 2: Browser Tuya Client (tuya-browser-bridge)**

#### Deploy:
```
1. FastMCP Dashboard → New Deployment
2. Configure:
   Repository: namandhakad712/Rankify-Assist
   Branch: main
   Entrypoint: mcp-servers/online/browser-automation/tuya_client.py
   Requirements: mcp-servers/online/browser-automation/requirements-client.txt
   Name: tuya-browser-bridge
```

#### Environment Variables:
```env
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_tuya_access_id
MCP_ACCESS_SECRET=your_tuya_secret
FASTMCP_CLOUD_MCP_URL=https://assist.fastmcp.app/mcp
```

⚠️ **IMPORTANT:** `FASTMCP_CLOUD_MCP_URL` must point to Server 1's URL!

---

### **Server 3: Device MCP (device-control)**

#### Deploy:
```
1. FastMCP Dashboard → New Deployment
2. Configure:
   Repository: namandhakad712/Rankify-Assist
   Branch: main
   Entrypoint: mcp-servers/online/device-controller/mcp_server.py
   Requirements: mcp-servers/online/device-controller/requirements.txt
   Name: device-control
```

#### Environment Variables:
```env
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_api_key  
TUYA_ACCESS_ID=your_tuya_access_id
```

#### Expected URL:
```
https://device-control.fastmcp.app/mcp
```

---

### **Server 4: Device Tuya Client (tuya-device-bridge)**

#### Deploy:
```
1. FastMCP Dashboard → New Deployment
2. Configure:
   Repository: namandhakad712/Rankify-Assist
   Branch: main
   Entrypoint: mcp-servers/online/device-controller/tuya_client.py
   Requirements: mcp-servers/online/device-controller/requirements-client.txt
   Name: tuya-device-bridge
```

#### Environment Variables:
```env
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_tuya_access_id
MCP_ACCESS_SECRET=your_tuya_secret
FASTMCP_CLOUD_MCP_URL=https://device-control.fastmcp.app/mcp
```

⚠️ **IMPORTANT:** `FASTMCP_CLOUD_MCP_URL` must point to Server 3's URL!

---

## 🔍 **Verify Deployments:**

### Check Logs:

**For each server:**
1. Go to FastMCP Dashboard
2. Click on server name
3. Click "Logs"

**Expected Logs:**

**MCP Server (assist/device-control):**
```
✅ Server running
Listening on port 8080
```

**Tuya Client (tuya-browser-bridge/tuya-device-bridge):**
```
✅ Connected to Tuya Platform!
✅ Forwarding to MCP Server: https://assist.fastmcp.app/mcp
🎧 Listening for AI Workflow requests...
```

---

## 📊 **Architecture (After Deployment):**

```
Tuya AI (Cloud)
  ↓
Tuya Client Bridge (FastMCP Cloud) ← Server 2 & 4
  ↓
MCP Server (FastMCP Cloud) ← Server 1 & 3
  ↓
Cloud Bridge (Vercel)
  ↓
Browser Extension / Smart Devices
```

**Result: 100% CLOUD! No local PC needed!** 🎉

---

## 🔧 **Troubleshooting:**

### Deployment Failed with SDK Error:

**Error:** `tuya-mcp-sdk not found in package registry`

**Fix:** Use `requirements-client.txt` for Tuya clients (not `requirements.txt`)
- **MCP Server:** Use `requirements.txt` (no SDK needed)
- **Tuya Client:** Use `requirements-client.txt` (has GitHub SDK)

### Server Not Connecting:

1. Check environment variables are set
2. Check URLs point to correct servers
3. Check logs for specific errors
4. Restart deployment

### Tools Not Showing:

1. Check MCP server deployed successfully
2. Check Tuya client connected
3. Restart Tuya client deployment

---

## 📋 **Requirements Files Explained:**

### `requirements.txt` (for MCP servers):
```txt
fastmcp>=2.12.3
httpx>=0.25.0
python-dotenv>=1.0.0
pydantic>=2.0.0
requests>=2.31.0
# No Tuya SDK - not needed!
```

### `requirements-client.txt` (for Tuya clients):
```txt
fastmcp>=2.12.3
httpx>=0.25.0
python-dotenv>=1.0.0
pydantic>=2.0.0
# Tuya SDK from GitHub:
git+https://github.com/tuya/tuya-mcp-sdk.git@main#subdirectory=mcp-python
```

---

## ✅ **Success Checklist:**

After all 4 deployments:

- [ ] All 4 servers show "Running" status
- [ ] MCP server logs show "Listening on port 8080"
- [ ] Tuya client logs show "Connected to Tuya Platform"
- [ ] Tuya Platform shows your MCP as "Online"
- [ ] Can turn off your PC and test voice commands
- [ ] Commands execute successfully

---

## 💰 **Cost:**

**All 4 servers:** FREE tier!  
**Monthly cost:** $0  
**Uptime:** 24/7  

---

## 🎊 **After Deployment:**

1. **Turn off your PC**
2. **Test voice command:** "Open Google"
3. **Check logs** in FastMCP Dashboard
4. **Celebrate!** You're 100% cloud! 🎉

---

**Last Updated:** 2025-12-22  
**Files Location:** `mcp-servers/online/`  
**Status:** Production ready! 🚀
