# 🚀 MCP Servers Deployment Guide

**Simple Choice:** Offline (PC) or Hugging Face Spaces (Cloud)

---

## 📊 Deployment Options

| Method | Where | Pros | Cons | Best For |
|--------|-------|------|------|----------|
| **Hugging Face Spaces** | Cloud | ✅ FREE<br>✅ 24/7<br>✅ Web UI | Needs account | **Production** ✅ |
| **Offline** | Your PC | ✅ No account<br>✅ Full control | PC must run 24/7 | Testing, Dev |

---

## 🤗 Hugging Face Spaces (RECOMMENDED!)

### Why Choose This:
- ✅ **100% FREE** - No credit card
- ✅ **Persistent** - Never sleeps
- ✅ **Web UI** - Monitor in browser
- ✅ **All-in-one** - Tuya client + MCP server together
- ✅ **Easy** - Just upload 3 files

### Quick Start:
```
1. Create 2 Spaces on huggingface.co
2. Upload files from mcp-servers/hugging-face-space/
3. Set environment variables
4. Done! ✅
```

### Full Guide:
📚 **[Hugging Face Deployment Guide](HUGGINGFACE_DEPLOYMENT.md)**

---

## 💻 Offline (Your PC)

### When to Use:
- Testing and development
- Learning how it works
- Don't want cloud accounts

### Quick Start:
```bash
cd mcp-servers/offline/browser-automation
pip install -r requirements.txt
python server.py           # Terminal 1
python tuya_client.py      # Terminal 2
```

### Full Guide:
📚 **[Offline Setup Guide](OFFLINE-SETUP-GUIDE.md)**

---

## 🎯 Recommended Setup

### Production (Recommended):

```
Hugging Face Space #1: Browser Automation
  - Deploy: hugging-face-space/browser-automation/
  - Runs 24/7, FREE
  
Hugging Face Space #2: Device Controller
  - Deploy: hugging-face-space/device-controller/
  - Runs 24/7, FREE
```

**Total Cost: $0/month!** 🎉

---

## 📁 Folder Structure

```
mcp-servers/
├── offline/                    ← For local development
│   ├── browser-automation/
│   └── device-controller/
└── hugging-face-space/         ← For cloud deployment
    ├── browser-automation/
    │   ├── app.py
    │   ├── requirements.txt
    │   └── README.md
    └── device-controller/
        ├── app.py
        ├── requirements.txt
        └── README.md
```

---

## 🚀 Getting Started

### Option 1: Hugging Face (Production)

**Deploy to cloud, 100% free:**

1. Create HF Space for browser automation
2. Upload files from `hugging-face-space/browser-automation/`
3. Set environment variables
4. Repeat for device-controller

**Result:** Both running 24/7, free, monitored!

---

### Option 2: Offline (Development)

**Run locally for testing:**

```bash
# Browser automation
cd mcp-servers/offline/browser-automation
python server.py &
python tuya_client.py &

# Device controller  
cd mcp-servers/offline/device-controller
python server.py &
python tuya_client.py &
```

**Result:** Full control, works offline

---

## 📚 Documentation

- **[Hugging Face Guide](HUGGINGFACE_DEPLOYMENT.md)** - Cloud deployment ⭐
- **[Offline Setup](OFFLINE-SETUP-GUIDE.md)** - Local development
- **[SDK Usage](OFFLINE-SDK-USAGE.md)** - Tuya SDK details
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues

---

## ✅ Quick Comparison

### For Production:
```
✅ Hugging Face Spaces (BEST!)
   - FREE
   - 24/7 uptime
   - Web monitoring
   - All-in-one deployment
```

### For Development:
```
✅ Offline (Local PC)
   - No account needed
   - Full control
   - Easy debugging
```

---

**Last Updated:** 2025-12-22  
**Recommendation:** Hugging Face Spaces for production! 🤗  
**Status:** Ready to deploy! 🚀
