# 🚀 MCP Deployment Guide

Choose your deployment method: **OFFLINE** (local) or **ONLINE** (cloud)

---

## 📁 New Clean Structure

```
mcp-servers/
├── offline/    ← Local development (PC required)
└── online/     ← Cloud deployment (always online)
```

**That's it! No more confusion!** 🎉

---

## 💻 OFFLINE Deployment

### When to Use:
- Testing and development
- Learning how it works
- Don't want cloud setup

### What You Need:
- PC running 24/7
- 2 terminals per service

### Quick Start:
```bash
# Browser Automation
cd mcp-servers/offline/browser-automation
pip install -r requirements.txt
python server.py           # Terminal 1
python tuya_client.py      # Terminal 2

# Device Controller
cd mcp-servers/offline/device-controller
pip install -r requirements.txt
python server.py           # Terminal 3
python tuya_client.py      # Terminal 4
```

---

## ☁️ ONLINE Deployment

### When to Use:
- Production deployment
- Want 24/7 uptime
- PC can be off

### What You Need:
- FastMCP Cloud account (free tier!)
- GitHub repository
- 10 minutes setup time

### Quick Start:

#### 1. Push to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy on FastMCP:

**Go to:** https://fastmcp.cloud/dashboard

**Deploy 4 servers:**

| Server | File | Requirements | Name |
|--------|------|--------------|------|
| Browser MCP | `online/browser-automation/mcp_server.py` | `online/browser-automation/requirements.txt` | `assist` |
| Browser Client | `online/browser-automation/tuya_client.py` | `online/browser-automation/requirements-client.txt` | `tuya-browser-bridge` |
| Device MCP | `online/device-controller/mcp_server.py` | `online/device-controller/requirements.txt` | `device-control` |
| Device Client | `online/device-controller/tuya_client.py` | `online/device-controller/requirements-client.txt` | `tuya-device-bridge` |

#### 3. Set Environment Variables:

**For MCP Servers:**
```env
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_api_key
TUYA_ACCESS_ID=your_access_id
```

**For Tuya Clients:**
```env
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_access_id
MCP_ACCESS_SECRET=your_access_secret
FASTMCP_CLOUD_MCP_URL=https://assist.fastmcp.app/mcp
```

#### 4. Done! Turn off your PC! 🎉

---

## 🔍 Comparison

| Feature | Off line | Online |
|---------|---------|--------|
| **Setup Time** | 5 min | 15 min (one-time) |
| **PC Required** | Yes (24/7) | No |
| **Cost** | Power bill | $0 (free tier) |
| **Uptime** | When PC on | 24/7 |
| **Maintenance** | Manual | Automatic |
| **Best For** | Testing | Production |

---

## 📚 Detailed Guides

- **Offline Setup:** See `offline/` folders for README
- **Online Deployment:** See `docs/mcp/ONLINE_DEPLOYMENT.md`
- **Troubleshooting:** See `docs/mcp/TROUBLESHOOTING.md`

---

## ✅ Quick Checklist

### Offline:
- [ ] Installed Python 3.11+
- [ ] Ran `pip install -r requirements.txt`
- [ ] Copied `.env.example` to `.env`
- [ ] Filled in credentials
- [ ] Running both `server.py` and `tuya_client.py`

### Online:
- [ ] Pushed code to GitHub
- [ ] Created FastMCP account
- [ ] Deployed 4 servers
- [ ] Set environment variables
- [ ] Checked logs (all connected)
- [ ] Turned off PC and tested!

---

**Last Updated:** 2025-12-22  
**Choose your path and deploy!** 🚀
