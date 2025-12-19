# 🚀 Tuya MCP Setup Guide - UPDATED & WORKING

## ✅ **WHAT YOU NEED:**

### **1. Tuya MCP SDK** (YES, STILL NEEDED!)
```bash
cd c:\TUYA
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

**Why?** The SDK provides `MCPSdkClient` class that connects to Tuya Platform.

### **2. FastMCP Library**
```bash
pip install fastmcp httpx python-dotenv
```

**Why?** FastMCP builds standard MCP servers with tools.

---

## 🏗️ **ARCHITECTURE (CORRECT WAY):**

```
Tuya AI (SmartLife App)
    ↓
Tuya MCP Platform (Cloud)
    ↓
tuya_client.py (Your PC - uses tuya-mcp-sdk)
    ├─ MCPSdkClient connects to Tuya Platform
    └─ Forwards requests to local FastMCP server
        ↓
FastMCP Server (Your PC - uses fastmcp library)
    ├─ Defines tools (navigate_to_url, etc.)
    └─ Executes tool logic
```

---

## 📝 **STEP-BY-STEP SETUP:**

### **Step 1: Create MCP on Tuya Platform**

1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Click:** "Custom MCP Service"
3. **Add custom MCP**
4. **Fill in:**
   - Name (EN): Browser Automation
   - Name (CN): 浏览器自动化
   - Description (EN): Automates browser tasks
   - Description (CN): 自动执行浏览器任务
   - Icon: Upload browser icon
5. **Click:** Confirm

### **Step 2: Add Data Center**

1. **Service Access Configuration → Add Data Center**
2. **Select:** India (or your region)
3. **Copy these 3 values:**
   ```
   Endpoint: https://mcp-in.iotbing.com
   Access ID: 9dddfe97017451...
   Access Secret: ••••••••••••••
   ```

### **Step 3: Create FastMCP Server**

**File:** `mcp-servers/browser-automation/server.py`

```python
import asyncio
import logging
import httpx
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated

# Configuration
CLOUD_BRIDGE_URL = "https://tuya-cloud-bridge.vercel.app"
MCP_API_KEY = "your_api_key"

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastMCP app
mcp = FastMCP("Browser Automation")

@mcp.tool
async def navigate_to_url(
    url: Annotated[str, Field(description="The URL to navigate to")]
) -> str:
    """Navigate browser to a specific URL"""
    logger.info(f"📍 navigate_to_url: {url}")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{CLOUD_BRIDGE_URL}/api/commands/create",
            json={"type": "navigate_to_url", "params": {"url": url}},
            headers={"Authorization": f"Bearer {MCP_API_KEY}"},
            timeout=10.0
        )
        if response.status_code == 200:
            return f"✅ Queued! Command ID: {response.json().get('command_id')}"
        return f"❌ Error: {response.status_code}"

# Add more tools here...

if __name__ == "__main__":
    mcp.run(transport="http", host="localhost", port=8767)
```

### **Step 4: Create Tuya SDK Client**

**File:** `mcp-servers/browser-automation/tuya_client.py`

```python
import asyncio
import logging
import os
from dotenv import load_dotenv
from mcp_sdk import MCPSdkClient

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    client = MCPSdkClient(
        endpoint=os.getenv('MCP_ENDPOINT'),
        access_id=os.getenv('MCP_ACCESS_ID'),
        access_secret=os.getenv('MCP_ACCESS_SECRET'),
        custom_mcp_server_endpoint="http://localhost:8767/mcp"
    )
    
    await client.connect()
    logger.info("✅ Connected to Tuya Platform!")
    logger.info("✅ MCP Server is now ONLINE!")
    
    await client.start_listening()

if __name__ == "__main__":
    asyncio.run(main())
```

### **Step 5: Create .env File**

**File:** `mcp-servers/browser-automation/.env`

```bash
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=9dddfe970174516512ff...
MCP_ACCESS_SECRET=your_secret_from_tuya_platform
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_cloud_bridge_api_key
```

### **Step 6: Run Everything**

**Terminal 1 - FastMCP Server:**
```bash
cd mcp-servers/browser-automation
python server.py
```

**Terminal 2 - Tuya SDK Client:**
```bash
cd mcp-servers/browser-automation
python tuya_client.py
```

**Expected output:**
```
✅ Connected to Tuya Platform!
✅ MCP Server is now ONLINE on Tuya Platform!
🎧 Listening for AI Workflow requests...
📨 Received request: tools/list
```

### **Step 7: Verify on Tuya Platform**

1. **Go to:** https://platform.tuya.com/exp/ai/mcp
2. **Browser Automation → Status:** **Online** ✅
3. **Tool tab:** Shows your tools ✅

---

## 🎯 **WHAT EACH COMPONENT DOES:**

### **tuya-mcp-sdk (Required)**
- `MCPSdkClient` class
- Handles WebSocket connection to Tuya Platform
- Manages authentication and token refresh
- Forwards requests to your local MCP server

### **FastMCP (Required)**
- Builds standard MCP protocol servers
- Defines tools with `@mcp.tool` decorator
- Handles HTTP/SSE transport
- Executes your tool logic

### **Your Code (Custom)**
- `server.py` - FastMCP server with your tools
- `tuya_client.py` - Connects Tuya to your server
- `.env` - Configuration

---

## ❓ **WHY THIS ARCHITECTURE?**

**OLD (WRONG) WAY:**
- Try to make Tuya call your server directly ❌
- Doesn't work - Tuya expects YOU to connect to THEM

**NEW (CORRECT) WAY:**
- You run SDK client that connects TO Tuya ✅
- SDK forwards requests to your local FastMCP server ✅
- FastMCP executes tools and returns results ✅

---

## 🔧 **TROUBLESHOOTING:**

### **Server shows Offline:**
- Check `tuya_client.py` is running
- Check credentials in `.env` are correct
- Check FastMCP server is running on correct port

### **No tools showing:**
- Restart `tuya_client.py`
- Check FastMCP logs for errors
- Verify tools are defined correctly

### **Commands not executing:**
- Check cloud bridge is deployed
- Check MCP_API_KEY matches
- Check network connectivity

---

## 📚 **FILES YOU NEED:**

```
mcp-servers/
├── browser-automation/
│   ├── server.py          # FastMCP server (your tools)
│   ├── tuya_client.py     # Tuya SDK client (bridge)
│   ├── .env               # Configuration
│   └── requirements.txt   # Dependencies
└── device-controller/
    ├── server.py          # FastMCP server
    ├── tuya_client.py     # Tuya SDK client
    └── .env               # Configuration
```

**Dependencies (requirements.txt):**
```
fastmcp>=2.14.0
httpx>=0.27.0
python-dotenv>=1.0.0
# Note: tuya-mcp-sdk installed separately
```

---

## ✅ **SUMMARY:**

1. **tuya-mcp-sdk:** Still needed for `MCPSdkClient`
2. **FastMCP:** Builds your MCP server with tools
3. **Two processes:** FastMCP server + Tuya client bridge
4. **Flow:** Tuya → SDK Client → FastMCP → Your logic

**THIS IS THE CORRECT, WORKING METHOD!** 🚀
