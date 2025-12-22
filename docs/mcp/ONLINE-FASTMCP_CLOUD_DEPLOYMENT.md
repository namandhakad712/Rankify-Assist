# Deploying MCP Server with FastMCP Cloud

Complete guide to make your MCP server online and accessible 24/7.

## 🎯 Current Situation

### What You Have (Local):
```
✅ Browser Automation MCP Server (server.py)
✅ Tuya Client Bridge (tuya_client.py)
✅ Cloud Bridge Integration (Vercel)
✅ Rankify Extension (Browser automation)

❌ Problem: Runs locally only
❌ Drops connection when PC sleeps
❌ Not accessible from anywhere
```

### What You Want (Online):
```
✅ MCP Server hosted 24/7
✅ No connection drops
✅ Always accessible to Tuya AI
✅ Automatic reconnection
✅ Scalable and reliable
```

---

## 🌐 Solution: FastMCP Cloud

**FastMCP Cloud** (https://fastmcp.cloud) is a hosted platform for MCP servers.

### Benefits:
- ✅ **Always Online** - No downtime
- ✅ **Automatic Scaling** - Handles any load  
- ✅ **Simple Deployment** - One command deploy
- ✅ **Free Tier** - Start at no cost
- ✅ **HTTPS by default** - Secure connections
- ✅ **Logs & Monitoring** - Built-in observability

---

## 📋 Migration Plan

### Option 1: FastMCP Cloud (Recommended) ✅
**Best for:** Production deployment, reliability

### Option 2: Self-Hosted (Advanced)
**Best for:** Full control, custom infrastructure

Let's go with **FastMCP Cloud** (easier and more reliable!)

---

## 🚀 Step-by-Step: Deploy to FastMCP Cloud

### **STEP 1: Refactor for FastMCP Cloud**

Your current `server.py` is almost ready! Just need small updates.

#### Create: `mcp_server_cloud.py`

```python
"""
Browser Automation MCP Server - FastMCP Cloud Version
Runs 24/7 in the cloud, accessible from anywhere
"""

import os
import httpx
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated

# Environment variables (set in FastMCP Cloud dashboard)
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL', 'https://tuya-cloud-bridge.vercel.app')
MCP_API_KEY = os.getenv('MCP_API_KEY')
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID')

# Create FastMCP app
mcp = FastMCP(
    "Browser Automation",
    description="Control browser automation via Tuya AI through Rankify Extension"
)

@mcp.tool
async def execute_browser_command(
    command: Annotated[str, Field(
        description="Natural language command to execute in browser (e.g., 'open google', 'check my email')"
    )]
) -> str:
    """
    Execute a browser command via Rankify extension.
    The extension's AI agent will interpret and execute the command.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/execute",
                json={
                    "userId": "tuya_ai",
                    "apiKey": MCP_API_KEY,
                    "accessId": TUYA_ACCESS_ID,
                    "command": command
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                result = response.json()
                command_id = result.get('commandId')
                return f"✅ Command sent! The browser extension will execute it shortly. (ID: {command_id})"
            else:
                return f"❌ Failed: {response.text}"
                
    except Exception as e:
        return f"❌ Error: {str(e)}"

# Health check endpoint
@mcp.tool
async def health_check() -> str:
    """Check if the MCP server is running and healthy."""
    return "✅ MCP Server is online and ready!"

# This is the key difference for cloud deployment!
# No .run() call here - FastMCP Cloud handles that
```

---

### **STEP 2: Create FastMCP Cloud Account**

1. **Go to:** https://fastmcp.cloud
2. **Click:** "Get Started" or "Sign Up"
3. **Sign in with:** GitHub (recommended)
4. **Verify email** if needed

---

### **STEP 3: Install FastMCP CLI**

```bash
# Install FastMCP CLI
pip install "fastmcp[cli]"

# Verify installation
fastmcp --version
```

---

### **STEP 4: Login to FastMCP Cloud**

```bash
# Login from terminal
fastmcp login

# Follow prompts:
# 1. Opens browser
# 2. Authorize CLI
# 3. Returns to terminal
# 4. Shows: "✅ Logged in successfully!"
```

---

### **STEP 5: Deploy Your Server**

#### Create `requirements.txt`:

```txt
fastmcp>=2.0.0
httpx>=0.25.0
pydantic>=2.0.0
```

#### Deploy Command:

```bash
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation

# Deploy to FastMCP Cloud
fastmcp deploy mcp_server_cloud.py

# Follow prompts:
# Name: browser-automation
# Description: Browser automation for Tuya AI
# Public: No (keep private)
```

**Output:**
```
🚀 Deploying browser-automation...
📦 Building deployment package...
☁️  Uploading to FastMCP Cloud...
✅ Deployed successfully!

Your server is live at:
https://browser-automation-xxxxx.fastmcp.cloud/mcp

Server ID: srv_abc123xyz
Status: Running ✅
```

---

### **STEP 6: Set Environment Variables**

**In FastMCP Cloud Dashboard:**

```
1. Go to: https://fastmcp.cloud/dashboard
2. Select: browser-automation server
3. Click: "Settings" → "Environment Variables"
4. Add:
   CLOUD_BRIDGE_URL = https://tuya-cloud-bridge.vercel.app
   MCP_API_KEY = your-api-key-from-env
   TUYA_ACCESS_ID = your-tuya-access-id
5. Save
6. Restart server (auto-restarts with new env vars)
```

---

### **STEP 7: Update Tuya Client**

Now your MCP server is online! Update Tuya client to connect to cloud URL:

#### Update `tuya_client.py`:

```python
"""
Tuya MCP SDK Client - Cloud Version
Connects Tuya Platform to FastMCP Cloud server
"""

import asyncio
import logging
import os
from dotenv import load_dotenv
from mcp_sdk import MCPSdkClient

load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Connect Tuya to FastMCP Cloud Server"""
    
    # Tuya credentials
    TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT', 'https://mcp-in.iotbing.com')
    TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
    TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
    
    # FastMCP Cloud URL (UPDATED!)
    CLOUD_MCP_SERVER = os.getenv('FASTMCP_CLOUD_URL', 
                                   'https://browser-automation-xxxxx.fastmcp.cloud/mcp')
    
    logger.info("=" * 60)
    logger.info("Tuya MCP SDK Client - Cloud Version")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"FastMCP Cloud: {CLOUD_MCP_SERVER}")
    logger.info("=" * 60)
    
    try:
        # Create SDK client
        client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=CLOUD_MCP_SERVER  # ← Cloud URL!
        )
        
        # Connect to Tuya Platform
        await client.connect()
        logger.info("✅ Connected to Tuya Platform!")
        logger.info("✅ MCP Server is now ONLINE 24/7 in the cloud!")
        logger.info("🎧 Listening for AI Workflow requests...")
        
        # Keep running
        await client.start_listening()
        
    except KeyboardInterrupt:
        logger.info("\n👋 Shutting down...")
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
```

---

### **STEP 8: Update .env**

Add FastMCP Cloud URL:

```env
# Existing variables
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_access_id
MCP_ACCESS_SECRET=your_secret
MCP_API_KEY=your_api_key
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app

# NEW: FastMCP Cloud URL (from deployment)
FASTMCP_CLOUD_URL=https://browser-automation-xxxxx.fastmcp.cloud/mcp
```

---

### **STEP 9: Test Everything**

#### Test 1: Health Check

```bash
# Test cloud server
curl https://browser-automation-xxxxx.fastmcp.cloud/mcp/health

# Should return: {"status": "ok"}
```

#### Test 2: Run Tuya Client

```bash
# Run updated client
python tuya_client.py

# Should see:
# ✅ Connected to Tuya Platform!
# ✅ MCP Server is now ONLINE 24/7 in the cloud!
```

#### Test 3: Full Flow

```
1. Say to Tuya AI: "Open Google"
2. Tuya → FastMCP Cloud → Cloud Bridge → Extension
3. Browser opens Google!
```

---

## 📊 Architecture (After Migration)

### Before (Local):
```
Tuya AI
  ↓
Tuya Client (Local PC) ← ❌ Drops when PC sleeps
  ↓
FastMCP Server (Local) ← ❌ Not accessible
  ↓
Cloud Bridge (Vercel) ← ✅ Always online
  ↓
Rankify Extension ← ✅ Always ready
```

### After (Cloud):
```
Tuya AI
  ↓
Tuya Client (Still local, but lightweight)
  ↓
FastMCP Server (FastMCP Cloud) ← ✅ Always online!
  ↓
Cloud Bridge (Vercel) ← ✅ Always online
  ↓
Rankify Extension ← ✅ Always ready
```

---

## 🎯 Alternative: Self-Hosted

If you want full control, host on your own server:

### Option A: VPS (Recommended)

**Services:** DigitalOcean, AWS, Google Cloud, Azure

```bash
# On VPS:
git clone your-repo
cd mcp-servers/browser-automation
pip install -r requirements.txt

# Run with supervisor/systemd
fastmcp run server.py --host 0.0.0.0 --port 8767

# Expose via nginx with HTTPS
```

### Option B: Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY mcp_server_cloud.py .
CMD ["fastmcp", "run", "mcp_server_cloud.py", "--host", "0.0.0.0", "--port", "8767"]
```

```bash
# Deploy to any cloud
docker build -t mcp-server .
docker run -p 8767:8767 -e MCP_API_KEY=xxx mcp-server
```

---

## 📝 Deployment Checklist

### Before Deployment:
- [ ] FastMCP Cloud account created
- [ ] CLI installed (`pip install fastmcp[cli]`)
- [ ] Logged in (`fastmcp login`)
- [ ] `mcp_server_cloud.py` created
- [ ] `requirements.txt` updated
- [ ] Environment variables ready

### During Deployment:
- [ ] `fastmcp deploy mcp_server_cloud.py` executed
- [ ] Deployment successful
- [ ] Server URL obtained
- [ ] Environment variables set in dashboard
- [ ] Server restarted with new env vars

### After Deployment:
- [ ] Health check passes
- [ ] `.env` updated with cloud URL
- [ ] Tuya client updated
- [ ] Full flow tested
- [ ] Logs monitored

---

## 🔍 Monitoring & Logs

### View Logs:

```bash
# From CLI
fastmcp logs browser-automation

# Or in dashboard
https://fastmcp.cloud/dashboard → Logs
```

### Check Status:

```bash
# List all deployments
fastmcp list

# Get server info
fastmcp info browser-automation
```

---

## 🎓 Key Differences: Local vs Cloud

| Aspect | Local | FastMCP Cloud |
|--------|-------|---------------|
| **Availability** | ❌ PC must be on | ✅ Always on 24/7 |
| **Reliability** | ❌ Drops on sleep | ✅ Auto-restart |
| **Scalability** | ❌ Limited | ✅ Auto-scales |
| **Monitoring** | ❌ Manual | ✅ Built-in |
| **HTTPS** | ❌ Need setup | ✅ Automatic |
| **Cost** | Free | Free tier available |
| **Setup Time** | 5 mins | 10 mins |
| **Maintenance** | Manual | Automatic |

---

## 🚀 Quick Start Commands

```bash
# 1. Install CLI
pip install "fastmcp[cli]"

# 2. Login
fastmcp login

# 3. Deploy
cd c:\TUYA\RankifyAssist\mcp-servers\browser-automation
fastmcp deploy mcp_server_cloud.py

# 4. Set env vars (in dashboard)
https://fastmcp.cloud/dashboard

# 5. Update .env with cloud URL
FASTMCP_CLOUD_URL=https://your-server.fastmcp.cloud/mcp

# 6. Run client
python tuya_client.py

# 7. Test!
# Say to Tuya AI: "Open Google"
```

---

## 🎊 Benefits After Migration

### For You:
```
✅ No more keeping PC on 24/7
✅ No connection dropouts
✅ Access from anywhere
✅ Professional deployment
✅ Scalable infrastructure
```

###For Users:
```
✅ Reliable service
✅ Faster response
✅ No downtime
✅ Better experience
```

---

## 📚 Resources

### Documentation:
- **FastMCP Docs:** https://gofastmcp.com
- **FastMCP Cloud:** https://fastmcp.cloud
- **GitHub:** https://github.com/jlowin/fastmcp

### Support:
- **Discord:** https://discord.gg/uu8dJCgttd
- **GitHub Issues:** https://github.com/jlowin/fastmcp/issues

---

## ✅ Summary

**Your MCP Server:**
- ✅ Currently: Working locally
- ✅ After migration: Running 24/7 in cloud
- ✅ Deployment: One command (`fastmcp deploy`)
- ✅ Cost: Free tier available
- ✅ Time: ~15 minutes total

**Next Steps:**
1. Create FastMCP Cloud account
2. Deploy server
3. Update Tuya client
4. Test full flow
5. **Enjoy always-online MCP!** 🎉

---

**Last Updated:** 2025-12-22  
**Status:** Ready for deployment  
**Deployment Target:** FastMCP Cloud  
**Est. Time:** 15 minutes

**Let's make your MCP server online!** 🚀
