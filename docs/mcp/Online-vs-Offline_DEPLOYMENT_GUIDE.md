# 🚀 Complete Deployment Guide - Offline vs Online

Choose your deployment method based on your needs!

---

## 📊 Deployment Options

### **Option 1: OFFLINE (Local PC)** 💻

**When to use:**
- Testing/development
- Don't want to setup cloud accounts
- Temporary usage
- Learning the system

**What runs:**
- Everything on your PC
- Requires PC to be on 24/7

### **Option 2: ONLINE (100% Cloud)** ☁️

**When to use:**
- Production deployment
- Want always-on service
- Don't want PC running 24/7
- Professional setup

**What runs:**
- Everything on FastMCP Cloud
- FREE tier available!
- PC can be off

---

## 💻 OFFLINE Deployment (Local)

### **Files to Run:**

#### Browser Automation:
```bash
# Terminal 1: MCP Server
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation
python server.py

# Terminal 2: Tuya Client
python tuya_client.py
```

#### Device Controller:
```bash
# Terminal 1: MCP Server  
cd c:\TUYA\RankifyAssist\mcp-servers\device-controller
python server.py

# Terminal 2: Tuya Client
python tuya_client.py
```

### **Requirements:**
```bash
# Same for both
pip install -r requirements.txt
```

### **Environment Variables (.env):**
```env
# Tuya IoT Platform
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_access_id
MCP_ACCESS_SECRET=your_secret

# Cloud Bridge
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_api_key
```

### **Pros:**
- ✅ Simple setup
- ✅ Full control
- ✅ Easy debugging

### **Cons:**
- ❌ PC must be on 24/7
- ❌ Connection drops if PC sleeps
- ❌ Multiple terminals to manage

---

## ☁️ ONLINE Deployment (FastMCP Cloud)

### **Files to Deploy:**

#### **Server 1: Browser Automation MCP**
```
File: ONLINE-fastmcp.cloud_server.py
Requirements: requirements.txt
Name: assist
URL: https://assist.fastmcp.app/mcp 
Does: Handles browser commands
```
/GET URL AS PER YOUR SERVER

#### **Server 2: Browser Automation Tuya Client**
```
File: ONLINE-fastmcp.cloud_tuya_client.py
Requirements: requirements.txt (same file!)
Name: tuya-browser-bridge
URL: https://tuya-browser-bridge.fastmcp.app
Does: Connects Tuya → Browser MCP
```
/GET URL AS PER YOUR SERVER

#### **Server 3: Device Control MCP**
```
File: ONLINE-fastmcp.cloud_server.py
Requirements: requirements.txt
Name: device-control
URL: https://device-control.fastmcp.app/mcp
Does: Handles device commands
```
/GET URL AS PER YOUR SERVER

#### **Server 4: Device Control Tuya Client**
```
File: ONLINE-fastmcp.cloud_tuya_client.py
Requirements: requirements.txt (same file!)
Name: tuya-device-bridge
URL: https://tuya-device-bridge.fastmcp.app
Does: Connects Tuya → Device MCP
```
/GET URL AS PER YOUR SERVER

### **Deployment Steps:**

#### **Step 1: Deploy Browser Automation (2 servers)**

**Server 1 - MCP:**
```bash
FastMCP Dashboard:
1. New Deployment
2. Repository: namandhakad712/Rankify-Assist
3. Entrypoint: mcp-servers/browser-automation/ONLINE-fastmcp.cloud_server.py
4. Requirements: mcp-servers/browser-automation/requirements.txt
5. Name: assist
6. Environment Variables:
   CLOUD_BRIDGE_URL=https://your-cloud-server.vercel.app
   MCP_API_KEY=your_key
   TUYA_ACCESS_ID=your_id
7. Deploy!
```

**Server 2 - Tuya Client:**
```bash
FastMCP Dashboard:
1. New Deployment
2. Repository: namandhakad712/Rankify-Assist
3. Entrypoint: mcp-servers/browser-automation/ONLINE-fastmcp.cloud_tuya_client.py
4. Requirements: mcp-servers/browser-automation/requirements.txt
5. Name: tuya-browser-bridge
6. Environment Variables:
   MCP_ENDPOINT=https://mcp-in.iotbing.com
   MCP_ACCESS_ID=your_id
   MCP_ACCESS_SECRET=your_secret
   FASTMCP_CLOUD_MCP_URL=https://assist.fastmcp.app/mcp
7. Deploy!
```

#### **Step 2: Deploy Device Controller (2 servers)**

**Server 3 - MCP:**
```bash
FastMCP Dashboard:
1. New Deployment
2. Repository: namandhakad712/Rankify-Assist
3. Entrypoint: mcp-servers/device-controller/ONLINE-fastmcp.cloud_server.py
4. Requirements: mcp-servers/device-controller/requirements.txt
5. Name: device-control
6. Environment Variables:
   CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
   MCP_API_KEY=your_key
   TUYA_ACCESS_ID=your_id
7. Deploy!
```

**Server 4 - Tuya Client:**
```bash
FastMCP Dashboard:
1. New Deployment
2. Repository: namandhakad712/Rankify-Assist
3. Entrypoint: mcp-servers/device-controller/ONLINE-fastmcp.cloud_tuya_client.py
4. Requirements: mcp-servers/device-controller/requirements.txt
5. Name: tuya-device-bridge
6. Environment Variables:
   MCP_ENDPOINT=https://mcp-in.iotbing.com
   MCP_ACCESS_ID=your_id
   MCP_ACCESS_SECRET=your_secret
   FASTMCP_CLOUD_MCP_URL=https://device-control.fastmcp.app/mcp
7. Deploy!
```

### **Pros:**
- ✅ 100% cloud-based
- ✅ Always online (24/7)
- ✅ No PC needed
- ✅ Auto-scaling
- ✅ Professional setup
- ✅ FREE tier! 1-million per month

### **Cons:**
- ⚠️ Requires FastMCP account
- ⚠️ More initial setup (one-time)

---

## 📋 Quick Reference

### **Offline Files:**
```
browser-automation/
├── server.py ← Run locally
├── tuya_client.py ← Run locally
└── requirements.txt

device-controller/
├── server.py ← Run locally
├── tuya_client.py ← Run locally
└── requirements.txt
```

### **Online Files:**
```
browser-automation/
├── ONLINE-fastmcp.cloud_server.py ← Deploy to FastMCP
├── ONLINE-fastmcp.cloud_tuya_client.py ← Deploy to FastMCP
└── requirements.txt ← Use for both!

device-controller/
├── ONLINE-fastmcp.cloud_server.py ← Deploy to FastMCP
├── ONLINE-fastmcp.cloud_tuya_client.py ← Deploy to FastMCP
└── requirements.txt ← Use for both!
```

---

## 🎯 Key Points

### **Requirements.txt:**
✅ **SAME FILE** for offline and online!
✅ Works for all deployments
✅ Just use `requirements.txt` for everything

### **Online Deployment:**
✅ Each ONLINE-* file = Separate FastMCP server
✅ 4 servers total for full functionality:
  1. Browser MCP Server
  2. Browser Tuya Client
  3. Device MCP Server
  4. Device Tuya Client

### **Environment Variables:**
⚠️ Must set in FastMCP dashboard for each server
⚠️ Different URLs for different servers (see above)

---

## 💰 Cost Comparison

| Component | Offline | Online |
|-----------|---------|--------|
| **Hosting** | Free (your PC) | Free (FastMCP tier) |
| **Electricity** | ~$10/month | $0 |
| **Internet** | Existing | Existing |
| **Maintenance** | Manual | Automatic |
| **Uptime** | When PC on | 24/7 |
| **Total** | ~$10/month + PC wear | **$0/month** |

---

## 🚀 Recommended Path

### **For Learning:**
Start with **OFFLINE** → Test everything → Then move to **ONLINE**

### **For Production:**
Go straight to **ONLINE** → Setup once → Forget about it!

---

## ✅ Success Checklist

### Offline:
- [ ] Both server.py files running
- [ ] Both tuya_client.py files running
- [ ] PC stays on
- [ ] Commands work

### Online:
- [ ] 4 servers deployed on FastMCP
- [ ] All environment variables set
- [ ] Logs show connections
- [ ] Commands work
- [ ] PC can be turned off!

---

## 🎊 Summary

**Offline:**
- Run: `server.py` + `tuya_client.py`
- 2 terminals per feature (4 total)
- Use: `requirements.txt`

**Online:**
- Deploy: `ONLINE-*.py` files (4 servers)
- Each as separate FastMCP deployment
- Use: Same `requirements.txt` for all!

**Both work perfectly! Choose based on your needs!** 🎉

---

**Last Updated:** 2025-12-22  
**Quick Start:** See specific sections above  
**Need Help:** Check logs in FastMCP dashboard or terminal
