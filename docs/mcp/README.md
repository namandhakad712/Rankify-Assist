# 📖 MCP Documentation Index

Complete guides for deploying Tuya MCP servers.

---

## 🎯 Start Here

**New to this?** → Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Want cloud deployment?** → [HUGGINGFACE_DEPLOYMENT.md](HUGGINGFACE_DEPLOYMENT.md)

**Want local testing?** → [OFFLINE-SETUP-GUIDE.md](OFFLINE-SETUP-GUIDE.md)

---

## 📚 All Guides

### Getting Started
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Choose your deployment method
- **[HUGGINGFACE_DEPLOYMENT.md](HUGGINGFACE_DEPLOYMENT.md)** - Cloud deployment (recommended!)
- **[OFFLINE-SETUP-GUIDE.md](OFFLINE-SETUP-GUIDE.md)** - Local development

### Technical Details
- **[OFFLINE-SDK-USAGE.md](OFFLINE-SDK-USAGE.md)** - Tuya MCP SDK guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & fixes

### Reference
- **[DEPLOYED_FLOW_DIAGRAM.md](DEPLOYED_FLOW_DIAGRAM.md)** - Architecture diagrams
- **[NO_HARDCODED_VALUES.md](NO_HARDCODED_VALUES.md)** - Environment variables

---

## 🗂️ Project Structure

```
RankifyAssist/
├── mcp-servers/
│   ├── offline/              ← Local development
│   │   ├── browser-automation/
│   │   └── device-controller/
│   └── hugging-face-space/   ← Cloud deployment ⭐
│       ├── browser-automation/
│       └── device-controller/
└── docs/mcp/                 ← You are here!
    ├── README.md
    ├── DEPLOYMENT_GUIDE.md
    ├── HUGGINGFACE_DEPLOYMENT.md
    └── (other guides)
```

---

## 🚀 Quick Decision Tree

**Want to deploy to cloud?**
→ YES: Use [Hugging Face Guide](HUGGINGFACE_DEPLOYMENT.md)
→ NO: Use [Offline Guide](OFFLINE-SETUP-GUIDE.md)

**Testing locally first?**
→ Start with [Offline Guide](OFFLINE-SETUP-GUIDE.md)
→ Then deploy with [Hugging Face Guide](HUGGINGFACE_DEPLOYMENT.md)

---

## ✅ All Docs Updated

All documentation reflects the new structure:
- ✅ Hugging Face Spaces (cloud)
- ✅ Offline (local)
- ✅ No complexity, no confusion
- ✅ Clear, simple paths

---

**Last Updated:** 2025-12-22  
**Structure:** Clean and simple! ✨  
**Status:** Ready to use! 🚀
