# 📖 Tuya MCP SDK Usage Guide

Understanding the Tuya MCP SDK for offline deployments.

---

## 📁 Relevant For:

```
mcp-servers/offline/   ← SDK needed here!
                      (not needed for online/)
```

---

## 🎯 **What is Tuya MCP SDK?**

The **Tuya MCP SDK** provides the `MCPSdkClient` class that connects your local MCP server to the Tuya IoT Platform.

**GitHub:** https://github.com/tuya/tuya-mcp-sdk

---

## 📥 **Installation:**

```bash
# Clone the repository
cd c:\TUYA
git clone https://github.com/tuya/tuya-mcp-sdk.git

# Install for Python
cd tuya-mcp-sdk/mcp-python
pip install -e .
```

**Why `-e` (editable mode)?**
- Allows you to modify SDK if needed
- Changes reflect immediately without reinstall

---

## 🏗️ **How It Works:**

```
├── Tuya IoT Platform (Cloud)
│   ↓ WebSocket connection
├── MCPSdkClient (tuya-mcp-sdk)
│   ├─ Authenticates with Access ID/Secret
│   ├─ Maintains persistent connection
│   └─ Forwards requests to your MCP server
│       ↓ HTTP requests
└── Your FastMCP Server (localhost:8767)
    └─ Executes tools and returns results
```

---

## 💻 **Usage in Your Code:**

### Basic Example:

**File:** `offline/browser-automation/tuya_client.py`

```python
import asyncio
from mcp_sdk import MCPSdkClient

async def main():
    # Create client
    client = MCPSdkClient(
        endpoint="https://mcp-in.iotbing.com",
        access_id="your_access_id",
        access_secret="your_access_secret",
        custom_mcp_server_endpoint="http://localhost:8767/mcp"
    )
    
    # Connect to Tuya Platform
    await client.connect()
    print("✅ Connected!")
    
    # Start listening for requests
    await client.start_listening()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 🔑 **Key Methods:**

### `MCPSdkClient()` - Initialize client

**Parameters:**
- `endpoint`: Tuya MCP endpoint URL (from platform)
- `access_id`: Your Access ID (from platform)
- `access_secret`: Your Access Secret (from platform)
- `custom_mcp_server_endpoint`: Your local FastMCP server URL

**Example:**
```python
client = MCPSdkClient(
    endpoint="https://mcp-in.iotbing.com",
    access_id="9dddfe970174516512ff...",
    access_secret="supersecret123",
    custom_mcp_server_endpoint="http://localhost:8767/mcp"
)
```

### `await client.connect()` - Connect to Tuya

**What it does:**
1. Establishes WebSocket connection
2. Authenticates with access credentials
3. Registers your MCP server

**Returns:** None (raises exception on failure)

### `await client.start_listening()` - Listen for requests

**What it does:**
1. Keeps connection alive
2. Receives tool call requests from Tuya
3. Forwards to your MCP server
4. Returns results to Tuya

**Blocks forever** - use in main async function

---

## 📂 **File Structure:**

### Where SDK is Used:

```
mcp-servers/
└── offline/
    ├── browser-automation/
    │   └── tuya_client.py    ← Uses SDK here!
    └── device-controller/
        └── tuya_client.py    ← And here!
```

### Where SDK is NOT Used:

```
mcp-servers/
├── offline/
│   ├── browser-automation/
│   │   └── server.py         ← No SDK needed
│   └── device-controller/
│       └── server.py         ← No SDK needed
└── online/                   ← No SDK needed (GitHub install)
```

---

## 🔍 **SDK vs FastMCP:**

| Component | Purpose | Location |
|-----------|---------|----------|
| **Tuya MCP SDK** | Connects TO Tuya Platform | `tuya_client.py` |
| **FastMCP** | Builds MCP server | `server.py` |

**They work together:**
1. FastMCP server defines and executes tools
2. Tuya SDK client connects server to Tuya Platform

---

## ⚙️ **Environment Configuration:**

**In `.env` file:**
```env
# For tuya_client.py (uses SDK)
MCP_ENDPOINT=https://mcp-in.iotbing.com
MCP_ACCESS_ID=your_access_id
MCP_ACCESS_SECRET=your_access_secret

# For server.py (no SDK)
CLOUD_BRIDGE_URL=https://tuya-cloud-bridge.vercel.app
MCP_API_KEY=your_api_key
```

---

## 🐛 **Troubleshooting:**

### Import Error: No module named 'mcp_sdk'

**Fix:**
```bash
cd c:\TUYA\tuya-mcp-sdk\mcp-python
pip install -e .
```

### Connection Failed

**Check:**
1. ✅ Endpoint URL correct
2. ✅ Access ID valid
3. ✅ Access Secret correct
4. ✅ Network allows WebSocket connections
5. ✅ FastMCP server running on specified port

### Server Shows Offline on Tuya Platform

**Solutions:**
1. Restart `tuya_client.py`
2. Check FastMCP server is running
3. Verify credentials in `.env`
4. Check firewall settings

---

## 📚 **Full Example:**

**File:** `offline/browser-automation/tuya_client.py`

```python
import asyncio
import logging
import os
from dotenv import load_dotenv
from mcp_sdk import MCPSdkClient

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Connect Tuya to FastMCP Server"""
    
    # Get credentials
    TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT')
    TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
    TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
    LOCAL_MCP_SERVER = "http://localhost:8767/mcp"
    
    logger.info("=" * 60)
    logger.info("Tuya MCP SDK Client")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"Local MCP Server: {LOCAL_MCP_SERVER}")
    logger.info("=" * 60)
    
    try:
        # Create SDK client
        client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=LOCAL_MCP_SERVER
        )
        
        # Connect to Tuya Platform
        await client.connect()
        logger.info("✅ Connected to Tuya Platform!")
        logger.info("✅ MCP Server is now ONLINE!")
        logger.info("🎧 Listening for AI Workflow requests...")
        
        # Keep running
        await client.start_listening()
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
```

---

## ✅ **Summary:**

**Tuya MCP SDK:**
- ✅ Required for **offline** deployments
- ✅ Installed from GitHub
- ✅ Used in `tuya_client.py` files
- ✅ Connects Tuya Platform → Your server
- ❌ Not needed for online deployments (installed automatically)

**Location:** `mcp-servers/offline/` folders only

---

**Last Updated:** 2025-12-22  
**SDK Version:** Latest from GitHub  
**Status:** Working perfectly! ✨
