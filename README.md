# 🤖 Rankify Assist - Voice-Controlled AI Assistant

**Voice-controlled browser automation + smart home control with safety confirmation!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Features

✅ **Voice-Controlled Browser Automation** - with safety confirmation before execution  
✅ **Smart Home Control** - direct IoT device control via Tuya  
✅ **Conversational AI** - chat with memory and context  
✅ **Multi-User Support** - Google OAuth authentication  
✅ **Always-On Cloud** - FREE tier deployment  
✅ **100% Open Source** - all code included

---

## 🎯 What Can It Do?

### 🌐 Browser Tasks (With Safety Confirmation):
- **"Check my Gmail"** → Asks permission → Opens browser → "You have 5 unread emails"
- **"Search for AI news"** → Asks permission → Opens Google → Searches
- **"Open YouTube"** → Asks permission → Navigates to YouTube
- **User must approve before ANY browser action!** 🔒

### 🏠 Smart Home (Direct Execution):
- **"Turn on living room light"** → Executes immediately
- **"Set AC to 22 degrees"** → Adjusts temperature
- **"Lock the front door"** → Activates lock
- **"What's the status of my devices?"** → Reports device states

### 💬 General Chat:
- **"What is 2+2?"** → "4"
- **"Tell me a joke"** → Responds with humor
- **Remembers conversation context!**

---

## 🏗️ Architecture

```
SmartLife App (Voice)
    ↓
Tuya AI Workflow (Cloud - Always On)
    ├─ Intent Recognition
    ├─ Browser: Plan → Ask User → Execute (if approved) ✅
    ├─ IoT: Execute Directly (no ask)
    └─ Chat: Conversational
    ↓
MCP Servers (Python - Run on Your PC When Using)
    ├─ Browser MCP → Vercel Cloud Bridge → Chrome Extension
    └─ Device MCP → Tuya OpenAPI → Smart Devices
```

**See:** [FINAL-ARCHITECTURE.md](FINAL-ARCHITECTURE.md) for detailed architecture

---

## 🚀 Quick Start (30 minutes)

### **Prerequisites:**
- ✅ Python 3.10+
- ✅ Node.js & pnpm
- ✅ Chrome browser
- ✅ Accounts: Supabase, Vercel, Google Cloud, Tuya IoT (all FREE!)

### **Deploy in 4 Steps:**

**1. Deploy Cloud Bridge** (10 mins)
```bash
# Create Supabase project → Run cloud-bridge/supabase-schema.sql
# Deploy to Vercel:
cd cloud-bridge
npm install
vercel --prod
# Set env vars in Vercel dashboard
```

**2. Build Extension** (5 mins)
```bash
pnpm install
pnpm build
# Load dist/chrome-mv3-prod in Chrome
```

**3. Install MCP SDK** (5 mins)
```bash
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

**4. Configure & Run MCPs** (10 mins)
```bash
# Create MCPs in Tuya Platform → Get credentials
# Configure .env files
# Run both servers:
cd mcp-servers/browser-automation && python server.py
cd mcp-servers/device-controller && python server.py
```

**Done! Use SmartLife app to test!** 🎉

**Detailed Guide:** [docs/deployment/00-QUICK-START.md](docs/deployment/00-QUICK-START.md)

---

## 📂 Project Structure

```
RankifyAssist/
├── README.md                     # This file
├── FINAL-ARCHITECTURE.md         # Complete architecture
├── FINAL-CHECKLIST.md            # Pre-commit checklist
│
├── cloud-bridge/                 # Deploy to Vercel (once)
│   ├── api/                      # API endpoints
│   ├── public/admin.html         # Admin UI
│   ├── supabase-schema.sql       # Database schema
│   └── package.json
│
├── mcp-servers/                  # Run locally when using
│   ├── browser-automation/       # Browser MCP (Python)
│   └── device-controller/        # Device MCP (Python)
│
├── extension-raw/                # Build once, load in Chrome
│   └── (Chrome extension source)
│
├── docs/                         # Documentation
│   ├── deployment/               # Deployment guides
│   ├── cloud-bridge/             # Cloud bridge docs
│   ├── mcp/                      # MCP setup guides
│   ├── extension/                # Extension build guide
│   └── workflow/                 # Workflow configuration
│
└── firmware/                     # T5 AI Core firmware (optional)
```

---

## 🎨 Key Design Decisions

### **1. Browser Confirmation Flow** 🔒
**Safety First!** Users must approve before ANY browser action.

**Flow:**
```
User: "check gmail"
AI: "I plan to open Gmail. Proceed?" 
User: "yes"
AI: [Executes] "You have 5 unread emails"
```

### **2. IoT Direct Execution** ⚡
**Convenience!** No confirmation for device control.

**Flow:**
```
User: "turn on lights"
AI: [Executes immediately] "Light is now on"
```

### **3. Local MCP Servers + Cloud Bridge**
**Why:**
- ✅ MCP SDK requires persistent WebSocket → Must run locally
- ✅ Cloud bridge handles message queue → Always-on
- ✅ Extension executes in browser → Natural execution environment
- ✅ Zero cost! Runs on your PC when needed

### **4. Supabase vs Vercel KV**
**Why Supabase:**
- ❌ Vercel KV: 8KB limit (too small!)
- ✅ Supabase: 500MB database, unlimited requests, FREE!

---

## 📊 Technology Stack

**Backend:**
- Tuya AI Workflow (Gemini 2.0 Flash)
- Tuya MCP SDK (Python, WebSocket)
- Vercel (Serverless API)
- Supabase (PostgreSQL)

**Frontend:**
- Chrome Extension (TypeScript + React)
- Google OAuth

**APIs:**
- Tuya OpenAPI (IoT devices)
- Custom MCP (browser automation)

---

## 💰 Costs (FREE Tier)

| Service | Free Tier | Our Usage | Cost |
|---------|-----------|-----------|------|
| Supabase | 500MB DB, ∞ requests | ~10MB | $0 |
| Vercel | 100k requests/mo | ~1k/mo | $0 |
| Tuya IoT | 1000 calls/day | ~50/day | $0 |
| MCP Servers | Runs on PC | Local | $0 |
| **Total** | | | **$0/month** |

---

## 🧪 Testing

### **Browser Confirmation:**
```
Say: "check my gmail"
Expected: Asks permission → User says "yes" → Executes
```

### **Browser Decline:**
```
Say: "search AI news"
Expected: Asks permission → User says "no" → Cancels
```

### **IoT Direct:**
```
Say: "turn on lights"
Expected: Executes immediately (no confirmation)
```

### **Chat:**
```
Say: "what is 2+2"
Expected: "4"
```

---

## 📝 Documentation

- **[Quick Start](docs/deployment/00-QUICK-START.md)** - 30-minute deployment
- **[Architecture](FINAL-ARCHITECTURE.md)** - System design
- **[MCP Setup](docs/mcp/SETUP-GUIDE.md)** - Configure MCP servers
- **[Extension Guide](docs/extension/BUILD-GUIDE.md)** - Build extension
- **[Workflow Guide](docs/workflow/COMPLETE-GUIDE.md)** - Configure workflow
- **[Final Checklist](FINAL-CHECKLIST.md)** - Pre-commit checklist

---

## 🆘 Troubleshooting

**MCP server won't connect:**
- Check .env has correct Tuya MCP credentials
- Verify tuya-mcp-sdk is installed
- Ensure network allows WebSocket connections

**Extension can't connect:**
- Verify Google sign-in worked
- Check Vercel URL is correct
- Extension console (F12) should show polling logs

**Browser command times out:**
- Extension must be loaded and signed in
- Check Supabase commands table for queued commands
- Verify MCP server is running

**Device control fails:**
- Check Tuya API credentials correct
- Verify devices linked in iot.tuya.com
- Test device control in Tuya app first

---

## 🎯 Roadmap

- [x] Voice-controlled browser automation
- [x] Smart home device control
- [x] Google OAuth multi-user support
- [x] Browser safety confirmation
- [x] Cloud-based architecture
- [ ] Real-time updates (replace polling)
- [ ] Mobile app support
- [ ] Voice feedback (TTS)
- [ ] Analytics dashboard
- [ ] More smart home integrations

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **Tuya** - AI Platform & IoT Cloud
- **Supabase** - Database infrastructure
- **Vercel** - Cloud hosting
- **Google** - OAuth & Gemini LLM

---

## 📞 Support

**GitHub Issues:** [Report bugs or request features](https://github.com/your-username/rankify-assist/issues)

**Documentation:** See `docs/` folder

---

**Made with ❤️ by the Rankify Assist Team**

**⭐ Star this repo if you find it useful!**

**Deploy now:** [docs/deployment/00-QUICK-START.md](docs/deployment/00-QUICK-START.md) 🚀
