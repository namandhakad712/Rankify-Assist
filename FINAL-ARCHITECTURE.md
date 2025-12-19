# 🚀 Rankify Assist - Final Architecture

## ✅ **CORRECT Implementation**

### **Architecture:**

```
┌────────────────────────────────────────────┐
│  YOU (SmartLife App)                       │
└────────────────┬───────────────────────────┘
                 │ Voice input
                 ↓
┌────────────────────────────────────────────┐
│  Tuya AI Workflow (Cloud)                  │
│  - Intent Recognition                      │
│  - Browser Planner → Ask → Executor        │
│  - IoT Controller                          │
│  - Chat                                    │
└────────┬──────────────────┬────────────────┘
         │                  │
         ↓                  ↓
┌────────────────┐  ┌──────────────────┐
│ MCP Servers    │  │ MCP Servers      │
│ (LOCAL - PC!)  │  │ (LOCAL - PC!)    │
│                │  │                  │
│ Browser MCP    │  │ Device MCP       │
│ - Python       │  │ - Python         │
│ - tuya-mcp-sdk │  │ - tuya-mcp-sdk   │
│ - WebSocket    │  │ - WebSocket      │
│   to Tuya      │  │   to Tuya        │
└────────┬───────┘  └────────┬─────────┘
         │                   │
         ↓                   ↓
┌────────────────┐  ┌─────────────────┐
│ Vercel Cloud   │  │ Tuya OpenAPI    │
│ Bridge         │  │ (Cloud)         │
│ - Supabase DB  │  │                 │
│ - Google OAuth │  │                 │
│ - APIs         │  │                 │
└────────┬───────┘  └─────────────────┘
         │
         ↓
┌────────────────┐
│ Chrome Ext     │
│ - Google login │
│ - Polls API    │
│ - Executes     │
└────────────────┘
```

---

## **Components:**

### **1. Tuya AI Workflow** (Cloud - Already Done ✅)
- Runs on Tuya Platform
- Has browser confirmation flow
- Calls MCP servers via Tuya Gateway

### **2. MCP Servers** (LOCAL - Your PC)
- **Location:** `mcp-servers/`
- **Runtime:** Python (persistent processes)
- **SDK:** Official tuya-mcp-sdk
- **Connection:** WebSocket to Tuya MCP Gateway
- **When to run:** When you want to use the system
- **How to stop:** Ctrl+C

**Browser MCP:**
- Receives browser commands from workflow
- Sends to Vercel API
- Returns results to Tuya

**Device MCP:**
- Receives device commands
- Calls Tuya OpenAPI directly
- Returns results

### **3. Vercel Cloud Bridge** (Cloud - Deploy Once)
- **Location:** `cloud-bridge/`
- **Purpose:** Queue for browser commands
- **Database:** Supabase (PostgreSQL)
- **Auth:** Google OAuth
- **APIs:**
  - `/api/auth/google` - Login
  - `/api/execute` - MCP sends commands
  - `/api/poll` - Extension polls
  - `/api/result` - Extension sends results
  - `/admin` - Config UI

### **4. Chrome Extension** (Local Browser)
- **Location:** `extension-raw/`
- **Build:** Once with `pnpm build`
- **Load:** Load unpacked in Chrome
- **Login:** Google OAuth
- **Runs:** Always when Chrome is open
- **Polls:** Vercel every 3 seconds

---

## **Setup Flow:**

### **One-Time Setup:**

**1. Deploy Supabase** (5 mins)
```bash
1. Go to supabase.com
2. Create project
3. Run supabase-schema.sql
4. Copy URL + Key
```

**2. Deploy Vercel** (10 mins)
```bash
cd cloud-bridge
npm install
vercel login
vercel --prod

# Set env vars in Vercel dashboard:
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
GOOGLE_CLIENT_ID=... (get from Google Cloud Console)
```

**3. Build Extension** (5 mins)
```bash
cd c:\TUYA\RankifyAssist
pnpm install
pnpm build
# Load dist/chrome-mv3-prod in Chrome
```

**4. Install Tuya MCP SDK** (5 mins)
```bash
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

**5. Configure MCPs in Tuya Platform** (10 mins)
```
1. Go to platform.tuya.com/exp/ai/mcp
2. Create 2 custom MCPs (Browser, Device)
3. Copy credentials for each
4. Save to .env files
```

---

### **Daily Usage:**

**When you want to use the system:**

```bash
# Terminal 1 - Browser MCP
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation
python server.py

# Terminal 2 - Device MCP  
cd c:\TUYA\RankifyAssist\mcp-servers\device-controller
python server.py

# Now use SmartLife app!
# Say: "check my gmail"
# System asks for confirmation
# Say: "yes"
# Browser opens, executes, returns result!
```

**When done:**
- Press Ctrl+C in both terminals
- MCP servers stop
- System offline until you start them again

---

## **Costs:**

| Component | Cost |
|-----------|------|
| Supabase | $0 (free tier) |
| Vercel | $0 (free tier) |
| Tuya AI | $0 (free quota) |
| MCP Servers | $0 (runs on your PC) |
| Chrome Extension | $0 |
| **Total** | **$0/month** |

---

## **Later: 24/7 Deployment**

If you want it always-on:

**Option 1: VPS** ($5-10/month)
```bash
# Rent DigitalOcean/Linode droplet
# Install Python + SDK
# Run both MCP servers with PM2
# Always on!
```

**Option 2: Cloud Functions**
```
NOT POSSIBLE with Tuya MCP SDK
(needs persistent WebSocket)
```

---

## **File Structure:**

```
RankifyAssist/
├── cloud-bridge/          (Deploy to Vercel - ONE TIME)
│   ├── api/
│   ├── lib/
│   ├── public/admin.html
│   ├── supabase-schema.sql
│   └── package.json
│
├── mcp-servers/           (Run on YOUR PC - WHEN USING)
│   ├── browser-automation/
│   │   ├── server.py
│   │   ├── .env
│   │   └── requirements.txt
│   └── device-controller/
│       ├── server.py
│       ├── .env
│       └── requirements.txt
│
├── extension-raw/         (Build ONCE, load in Chrome)
│   └── (Chrome extension code)
│
└── docs/
    └── (All documentation)
```

---

## **What's Ready:**

- ✅ Vercel cloud bridge code (with Google OAuth)
- ✅ Supabase schema (with Google auth)
- ✅ MCP server code (using real SDK)
- ✅ Extension code (ready to build)
- ✅ Admin UI for config management
- ✅ Complete documentation

---

## **What You Need to Do:**

1. ✅ Deploy Supabase
2. ✅ Deploy Vercel
3. ✅ Build extension
4. ✅ Install tuya-mcp-sdk
5. ✅ Configure .env files
6. ✅ Run MCP servers when using
7. ✅ Enjoy voice-controlled browser + IoT!

---

**This is the REAL, CORRECT architecture!** 🎯

MCP servers run locally, cloud bridge handles message queue, extension executes browser tasks!

Ready to finalize? 🚀
