# 🤗 Hugging Face Space Deployments

Two separate Spaces for complete functionality!

---

## 📁 Folder Structure

```
hugging-face-space/
├── browser-automation/      ← Space #1: Browser control
│   ├── app.py              (Deploy this to HF)
│   ├── requirements.txt
│   └── README.md
├── device-controller/       ← Space #2: Device control
│   ├── app.py              (Deploy this to HF)
│   ├── requirements.txt
│   └── README.md
├── README.md               ← You are here!
└── DEPLOYMENT_GUIDE.md     ← Full instructions
```

---

## 🚀 How to Deploy

### Create Two Spaces:

**Space 1: Browser Automation**
1. Go to https://huggingface.co/spaces
2. Create new Space: `tuya-browser-automation`
3. Upload files from `browser-automation/` folder
4. Set environment variables
5. Done! ✅

**Space 2: Device Controller**
1. Create another Space: `tuya-device-controller`
2. Upload files from `device-controller/` folder
3. Set environment variables
4. Done! ✅

---

## 📝 Required Environment Variables

**For BOTH Spaces, set these secrets:**

```env
# MCP Server (for controlling devices/browser)
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_api_key

# Tuya Client (for connecting to Tuya Platform)
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_tuya_access_id
MCP_ACCESS_SECRET=your_tuya_secret
```

---

## ✅ After Deployment

**You'll have:**
- 🌐 Browser Automation Space (24/7 online)
- 🏠 Device Controller Space (24/7 online)
- 💰 Both FREE!
- 📊 Both with live monitoring UI

---

## 📚 Full Guide

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete step-by-step instructions!

---

**Last Updated:** 2025-12-22  
**Deployments:** 2 separate Spaces  
**Cost:** FREE! 🎉
