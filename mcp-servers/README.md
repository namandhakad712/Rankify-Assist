# 🎯 MCP Servers - Clean Structure

Simple, organized, and easy to understand!

---

## 📁 Folder Structure

```
mcp-servers/
├── offline/          ← Run locally on your PC
│   ├── browser-automation/
│   └── device-controller/
└── online/           ← Deploy to FastMCP Cloud
    ├── browser-automation/
    └── device-controller/
```

---

## 💻 OFFLINE (Local Development)

**Location:** `mcp-servers/offline/`

### Browser Automation:
```
offline/browser-automation/
├── server.py              ← MCP server (run this)
├── tuya_client.py         ← Tuya IoT connector (run this)
├── requirements.txt       ← pip install -r requirements.txt
└── .env.example          ← Copy to .env and fill
```

### Device Controller:
```
offline/device-controller/
├── server.py              ← MCP server (run this)
├── tuya_client.py         ← Tuya IoT connector (run this)  
├── requirements.txt       ← pip install -r requirements.txt
└── .env.example          ← Copy to .env and fill
```

### How to Run:
```bash
# Browser Automation
cd mcp-servers/offline/browser-automation
pip install -r requirements.txt
python server.py           # Terminal 1
python tuya_client.py      # Terminal 2

# Device Controller
cd mcp-servers/offline/device-controller
pip install -r requirements.txt
python server.py           # Terminal 1
python tuya_client.py      # Terminal 2
```

---

## ☁️ ONLINE (FastMCP Cloud)

**Location:** `mcp-servers/online/`

### Browser Automation:
```
online/browser-automation/
├── mcp_server.py          ← Deploy as "assist"
├── tuya_client.py         ← Deploy as "tuya-browser-bridge"
├── requirements.txt       ← Used by mcp_server.py
└── requirements-client.txt ← Used by tuya_client.py
```

### Device Controller:
```
online/device-controller/
├── mcp_server.py          ← Deploy as "device-control"
├── tuya_client.py         ← Deploy as "tuya-device-bridge"
├── requirements.txt       ← Used by mcp_server.py
└── requirements-client.txt ← Used by tuya_client.py
```

### How to Deploy:
```bash
# 1. Commit changes
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy each server on FastMCP Dashboard:

Server 1: Browser MCP
  File: mcp-servers/online/browser-automation/mcp_server.py
  Requirements: mcp-servers/online/browser-automation/requirements.txt
  Name: assist

Server 2: Browser Tuya Client
  File: mcp-servers/online/browser-automation/tuya_client.py
  Requirements: mcp-servers/online/browser-automation/requirements-client.txt
  Name: tuya-browser-bridge

Server 3: Device MCP
  File: mcp-servers/online/device-controller/mcp_server.py
  Requirements: mcp-servers/online/device-controller/requirements.txt
  Name: device-control

Server 4: Device Tuya Client
  File: mcp-servers/online/device-controller/tuya_client.py
  Requirements: mcp-servers/online/device-controller/requirements-client.txt
  Name: tuya-device-bridge
```

---

## 🔑 Key Differences

| Aspect | Offline | Online |
|--------|---------|--------|
| **Files** | `server.py` + `tuya_client.py` | `mcp_server.py` + `tuya_client.py` |
| **Run** | `python file.py` | Deploy to FastMCP |
| **Requirements** | 1 file per folder | 2 files (server + client) |
| **SDK** | Manual install | GitHub install |
| **PC Needed** | ✅ Yes (24/7) | ❌ No |

---

## 📝 Quick Start

### Want to test locally?
```bash
cd mcp-servers/offline/browser-automation
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python server.py
python tuya_client.py  # New terminal
```

### Ready for production?
```bash
# Just deploy files from online/ folder to FastMCP Cloud!
# See deployment guide in docs/mcp/
```

---

## 🎯 Summary

**OFFLINE folder** = Local testing
- Run with `python`
- Need PC on 24/7
- Easy debugging

**ONLINE folder** = Production deployment
- Deploy to FastMCP Cloud
- Always online
- Zero maintenance

**Pick one based on your needs!** 🚀

---

**Last Updated:** 2025-12-22  
**Status:** Clean and organized! ✨
