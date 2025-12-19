# 🎯 Rankify Brain - Complete Implementation Plan

## Phase Overview

**Phase 1:** Planning & Workflow Design (1 hour)
**Phase 2:** Create MCP Servers (2-3 hours)
**Phase 3:** Integrate MCPs into Workflow (1 hour)
**Phase 4:** Testing & Refinement (1 hour)

**Total Time:** 5-6 hours

---

# PHASE 1: Planning & Workflow Design

## 1.1 Understanding the Architecture

```
User Input (Voice/Text in SmartLife app)
        ↓
    Tuya AI Agent
        ↓
    AI Workflow Engine
        ↓
┌───────┴────────┬──────────┬──────────┐
│                │          │          │
Intent       Event      Large Model   Output
Recognition  Memory      (with MCPs)   
```

## 1.2 Required MCPs

### **MCP #1: Tuya Device Controller**
**Purpose:** Control smart home devices
**Tools:**
- `control_device` - Turn on/off, set temperature, etc.
- `query_device_status` - Check device current state
- `list_user_devices` - Get all available devices

### **MCP #2: Browser Automation**
**Purpose:** Execute browser tasks via Chrome extension
**Tools:**
- `execute_browser_task` - Send commands to extension

### **MCP #3: Knowledge Retrieval** (Optional)
**Purpose:** Search custom knowledge base
**Tools:**
- `search_knowledge` - Query stored information

---

# PHASE 2: Create MCP Servers

## 2.1 Setup Environment

```bash
# Create project structure
mkdir c:\TUYA\RankifyAssist\mcp-servers
cd c:\TUYA\RankifyAssist\mcp-servers

# Clone Tuya MCP SDK
git clone https://github.com/tuya/tuya-mcp-sdk.git
cd tuya-mcp-sdk

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

## 2.2 Create MCP #1: Device Controller

### **Step 1: Register MCP in Tuya Platform**

1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Click: **Custom MCP Service** tab
3. Click: **"Add custom MCP"**

**Fill in:**
- **Name (EN):** Tuya Device Controller
- **Name (CN):** 涂鸦设备控制器
- **Description (EN):** 
  ```
  Controls Tuya smart devices including lights, AC units, locks, and sensors.
  Provides device status queries and command execution capabilities.
  ```
- **Description (CN):**
  ```
  控制涂鸦智能设备，包括灯光、空调、门锁和传感器。
  提供设备状态查询和命令执行功能。
  ```
- **Icon:** Upload icon (home/device symbol)

4. Click: **Confirm**

### **Step 2: Configure Data Center**

1. Go to: **Service Access Configuration Management → Data Center**
2. Click: **Add Data Center**
3. Select: **India** (or your region)
4. Click: **OK**

5. **IMPORTANT: Copy these values:**
   - **Endpoint:** `wss://...`
   - **Access ID:** `xxxxxxxxxxxx`
   - **Access Secret:** `yyyyyyyyyyyy`

   Save to: `c:\TUYA\RankifyAssist\mcp-servers\device-controller\.env`

### **Step 3: Get Tuya API Credentials**

1. Go to: https://iot.tuya.com/
2. Navigate to: **Cloud → Your Projects → [Your Project]**
3. Go to: **Overview** tab
4. Copy:
   - **Client ID:** `aaaaaaaaaa`
   - **Client Secret:** `bbbbbbbbbb`

5. Go to: **Devices** tab
6. Copy device IDs for your devices

7. Generate Access Token:
   - Go to: **API** tab
   - Click: **Generate Token**
   - Copy: **Access Token**

### **Step 4: Create Device Controller Code**

Create: `c:\TUYA\RankifyAssist\mcp-servers\device-controller\server.py`

```python
import os
import json
import time
import hashlib
import hmac
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MCP Configuration
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

# Tuya API Configuration
TUYA_CLIENT_ID = os.getenv('TUYA_CLIENT_ID')
TUYA_CLIENT_SECRET = os.getenv('TUYA_CLIENT_SECRET')
TUYA_API_URL = os.getenv('TUYA_API_URL', 'https://openapi.tuyain.com')  # India

class TuyaDeviceController:
    def __init__(self):
        self.access_token = None
        self.token_expires = 0
    
    def get_access_token(self):
        """Get or refresh Tuya access token"""
        if self.access_token and time.time() < self.token_expires:
            return self.access_token
        
        timestamp = str(int(time.time() * 1000))
        string_to_sign = f"{TUYA_CLIENT_ID}{timestamp}"
        
        signature = hmac.new(
            TUYA_CLIENT_SECRET.encode(),
            string_to_sign.encode(),
            hashlib.sha256
        ).hexdigest().upper()
        
        headers = {
            "client_id": TUYA_CLIENT_ID,
            "sign": signature,
            "t": timestamp,
            "sign_method": "HMAC-SHA256"
        }
        
        response = requests.get(
            f"{TUYA_API_URL}/v1.0/token?grant_type=1", 
            headers=headers
        )
        
        result = response.json()
        if result.get('success'):
            self.access_token = result['result']['access_token']
            self.token_expires = time.time() + result['result']['expire_time']
            return self.access_token
        else:
            raise Exception(f"Failed to get access token: {result}")
    
    def _make_request(self, method, path, body=None):
        """Make authenticated request to Tuya API"""
        token = self.get_access_token()
        timestamp = str(int(time.time() * 1000))
        
        # Build signature
        string_to_sign = f"{TUYA_CLIENT_ID}{token}{timestamp}"
        if body:
            string_to_sign += json.dumps(body, separators=(',', ':'))
        
        signature = hmac.new(
            TUYA_CLIENT_SECRET.encode(),
            string_to_sign.encode(),
            hashlib.sha256
        ).hexdigest().upper()
        
        headers = {
            "client_id": TUYA_CLIENT_ID,
            "access_token": token,
            "sign": signature,
            "t": timestamp,
            "sign_method": "HMAC-SHA256",
            "Content-Type": "application/json"
        }
        
        url = f"{TUYA_API_URL}{path}"
        
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=body)
        
        return response.json()
    
    # Tool implementations
    def control_device(self, device_id: str, command_code: str, command_value):
        """Control a Tuya device"""
        body = {
            "commands": [{
                "code": command_code,
                "value": command_value
            }]
        }
        
        result = self._make_request('POST', f"/v1.0/devices/{device_id}/commands", body)
        
        if result.get('success'):
            return {
                "success": True,
                "message": f"Device {device_id} controlled: {command_code} = {command_value}"
            }
        else:
            return {
                "success": False,
                "message": f"Failed: {result.get('msg', 'Unknown error')}"
            }
    
    def query_device_status(self, device_id: str):
        """Get device current status"""
        result = self._make_request('GET', f"/v1.0/devices/{device_id}/status")
        
        if result.get('success'):
            return {
                "success": True,
                "status": result['result']
            }
        else:
            return {
                "success": False,
                "message": f"Failed: {result.get('msg', 'Unknown error')}"
            }
    
    def list_user_devices(self, user_id: str = None):
        """List all user devices"""
        path = f"/v1.0/users/{user_id}/devices" if user_id else "/v1.0/devices"
        result = self._make_request('GET', path)
        
        if result.get('success'):
            devices = [{
                "name": d['name'],
                "id": d['id'],
                "online": d['online'],
                "product_name": d.get('product_name', '')
            } for d in result['result']]
            
            return {
                "success": True,
                "devices": devices,
                "count": len(devices)
            }
        else:
            return {
                "success": False,
                "message": f"Failed: {result.get('msg', 'Unknown error')}"
            }

# Initialize controller
controller = TuyaDeviceController()

# MCP Tool Definitions
TOOL_DEFINITIONS = [
    {
        "name": "control_device",
        "description": "Control a Tuya smart device (turn on/off, set temperature, etc.)",
        "inputSchema": {
            "type": "object",
            "properties": {
                "device_id": {
                    "type": "string",
                    "description": "The unique device ID (get from list_user_devices)"
                },
                "command_code": {
                    "type": "string",
                    "description": "Command code (e.g., 'switch_led' for lights, 'temp_set' for AC)"
                },
                "command_value": {
                    "description": "Command value (true/false for switch, number for temperature)"
                }
            },
            "required": ["device_id", "command_code", "command_value"]
        }
    },
    {
        "name": "query_device_status",
        "description": "Get the current status of a device",
        "inputSchema": {
            "type": "object",
            "properties": {
                "device_id": {
                    "type": "string",
                    "description": "The device ID to query"
                }
            },
            "required": ["device_id"]
        }
    },
    {
        "name": "list_user_devices",
        "description": "Get a list of all available smart devices",
        "inputSchema": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Optional user ID (leave empty for all devices)"
                }
            }
        }
    }
]

# Tool dispatch
def handle_tool_call(tool_name: str, arguments: dict):
    """Handle MCP tool calls"""
    if tool_name == "control_device":
        return controller.control_device(**arguments)
    elif tool_name == "query_device_status":
        return controller.query_device_status(**arguments)
    elif tool_name == "list_user_devices":
        return controller.list_user_devices(**arguments)
    else:
        return {"error": f"Unknown tool: {tool_name}"}

# Start MCP Server
if __name__ == "__main__":
    from tuya_mcp_sdk import MCPServer
    
    server = MCPServer(
        endpoint=MCP_ENDPOINT,
        access_id=MCP_ACCESS_ID,
        access_secret=MCP_ACCESS_SECRET,
        tools=TOOL_DEFINITIONS,
        tool_handler=handle_tool_call
    )
    
    print("🚀 Tuya Device Controller MCP Server starting...")
    print(f"Endpoint: {MCP_ENDPOINT}")
    print(f"Tools: {len(TOOL_DEFINITIONS)}")
    
    server.run()
```

### **Step 5: Create .env file**

Create: `c:\TUYA\RankifyAssist\mcp-servers\device-controller\.env`

```env
# MCP Configuration (from Tuya MCP Management)
MCP_ENDPOINT=wss://...
MCP_ACCESS_ID=xxxxxxxxxxxx
MCP_ACCESS_SECRET=yyyyyyyyyyyy

# Tuya API Configuration
TUYA_CLIENT_ID=aaaaaaaaaa
TUYA_CLIENT_SECRET=bbbbbbbbbb
TUYA_API_URL=https://openapi.tuyain.com

# Device IDs (for reference)
LIVING_ROOM_LIGHT=dev_xxx
BEDROOM_AC=dev_yyy
FRONT_DOOR_LOCK=dev_zzz
```

### **Step 6: Create requirements.txt**

Create: `c:\TUYA\RankifyAssist\mcp-servers\device-controller\requirements.txt`

```
python-dotenv==1.0.0
requests==2.31.0
tuya-mcp-sdk
```

### **Step 7: Run Device Controller MCP**

```bash
cd c:\TUYA\RankifyAssist\mcp-servers\device-controller
pip install -r requirements.txt
python server.py
```

You should see:
```
🚀 Tuya Device Controller MCP Server starting...
Endpoint: wss://...
Tools: 3
[MCP] Server connected
[MCP] Ready to receive tool calls
```

---

## 2.3 Create MCP #2: Browser Automation

### **Step 1: Register MCP**

1. Go to: https://platform.tuya.com/exp/ai/mcp
2. Click: **"Add custom MCP"**

**Fill in:**
- **Name:** Browser Automation
- **Description:** 
  ```
  Executes browser automation tasks via Rankify Assist Chrome extension.
  Supports web navigation, data extraction, form filling, and more.
  ```
- **Icon:** Upload browser icon

### **Step 2: Configure Data Center** (same as Device Controller)

### **Step 3: Create Browser MCP Code**

Create: `c:\TUYA\RankifyAssist\mcp-servers\browser-automation\server.py`

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

# MCP Configuration
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

# Cloud Bridge Configuration
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')
DEFAULT_USER_ID = os.getenv('DEFAULT_USER_ID', 'default')

def execute_browser_task(command: str, user_id: str = None):
    """Execute browser automation command via cloud bridge"""
    try:
        # Use default user ID if not specified
        user_id = user_id or DEFAULT_USER_ID
        
        response = requests.post(
            f"{CLOUD_BRIDGE_URL}/api/execute",
            json={
                "userId": user_id,
                "apiKey": MCP_API_KEY,
                "command": command,
            },
            timeout=65  # Wait for extension to execute (cloud has 60s timeout)
        )
        
        if response.status_code == 200:
            result = response.json()
            return {
                "success": True,
                "result": result.get('result', 'Task executed successfully'),
                "executionTime": result.get('executionTime', 0)
            }
        elif response.status_code == 408:
            return {
                "success": False,
                "error": "Timeout - extension may not be connected"
            }
        else:
            return {
                "success": False,
                "error": f"Cloud bridge error: {response.status_code}"
            }
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Request timeout - extension may not be responding"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Tool definition
TOOL_DEFINITIONS = [
    {
        "name": "execute_browser_task",
        "description": "Execute a browser automation task (e.g., 'check gmail unread count', 'open youtube')",
        "inputSchema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "The browser task to execute in natural language"
                },
                "user_id": {
                    "type": "string",
                    "description": "Optional user ID (defaults to configured user)"
                }
            },
            "required": ["command"]
        }
    }
]

def handle_tool_call(tool_name: str, arguments: dict):
    if tool_name == "execute_browser_task":
        return execute_browser_task(**arguments)
    else:
        return {"error": f"Unknown tool: {tool_name}"}

if __name__ == "__main__":
    from tuya_mcp_sdk import MCPServer
    
    server = MCPServer(
        endpoint=MCP_ENDPOINT,
        access_id=MCP_ACCESS_ID,
        access_secret=MCP_ACCESS_SECRET,
        tools=TOOL_DEFINITIONS,
        tool_handler=handle_tool_call
    )
    
    print("🌐 Browser Automation MCP Server starting...")
    print(f"Cloud Bridge URL: {CLOUD_BRIDGE_URL}")
    print(f"Default User ID: {DEFAULT_USER_ID}")
    
    server.run()
```

Create `.env`:
```env
# MCP Configuration
MCP_ENDPOINT=wss://...
MCP_ACCESS_ID=xxxxxxxxxxxx
MCP_ACCESS_SECRET=yyyyyyyyyyyy

# Cloud Bridge Configuration
CLOUD_BRIDGE_URL=https://your-project.vercel.app
MCP_API_KEY=mcp_your_secret_key_here
DEFAULT_USER_ID=user_1234567890_xyz
```

---

## 2.4 Test MCPs in Tuya Platform

1. Go to: MCP Management → Your MCP
2. Click: **Tool** tab
3. Click: **Test Run** on each tool
4. Verify tools work

**For Device Controller:**
- Test `list_user_devices` first
- Then test `control_device` with a real device ID

**For Browser Automation:**
- Ensure bridge server running
- Ensure ngrok running
- Test with simple command like "open google.com"

---

**(Continued in next file...)**
