"""
Device Controller MCP Server
Uses official Tuya MCP SDK to connect to Tuya Platform
Controls Tuya smart devices via Tuya OpenAPI
"""

import os
import asyncio
import hashlib
import hmac
import time
import requests
from dotenv import load_dotenv

load_dotenv()

# Import Tuya MCP SDK
try:
    from mcp_sdk import create_mcpsdk
    SDK_AVAILABLE = True
except ImportError:
    SDK_AVAILABLE = False
    print("\n❌ ERROR: tuya-mcp-sdk not installed!")
    print("\nInstall steps:")
    print("1. git clone https://github.com/tuya/tuya-mcp-sdk.git")
    print("2. cd tuya-mcp-sdk/mcp-python")
    print("3. pip install -e .")
    print("4. Return here and run: python server.py\n")
    exit(1)

# Tuya Platform MCP Credentials
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

# Tuya OpenAPI Credentials
TUYA_CLIENT_ID = os.getenv('TUYA_CLIENT_ID')
TUYA_CLIENT_SECRET = os.getenv('TUYA_CLIENT_SECRET')
TUYA_API_URL = os.getenv('TUYA_API_URL', 'https://openapi.tuyain.com')

print("🏠 Device Controller MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT}")
print(f"Tuya API: {TUYA_API_URL}")
print("=" * 50)

# Tuya OpenAPI Client
class TuyaAPI:
    def __init__(self):
        self.token = None
        self.token_expires = 0
    
    def get_token(self):
        """Get Tuya API access token"""
        if self.token and time.time() < self.token_expires:
            return self.token
        
        timestamp = str(int(time.time() * 1000))
        
        # Create signature
        string_to_sign = TUYA_CLIENT_ID + timestamp
        signature = hmac.new(
            TUYA_CLIENT_SECRET.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).hexdigest().upper()
        
        response = requests.get(
            f"{TUYA_API_URL}/v1.0/token?grant_type=1",
            headers={
                'client_id': TUYA_CLIENT_ID,
                'sign': signature,
                'sign_method': 'HMAC-SHA256',
                't': timestamp,
            }
        )
        
        data = response.json()
        
        if data.get('success'):
            self.token = data['result']['access_token']
            self.token_expires = time.time() + data['result']['expire_time'] - 60
            return self.token
        else:
            raise Exception(f"Failed to get token: {data.get('msg')}")
    
    def request(self, method, path, body=None):
        """Make authenticated Tuya API request"""
        token = self.get_token()
        timestamp = str(int(time.time() * 1000))
        
        headers = {
            'client_id': TUYA_CLIENT_ID,
            'access_token': token,
            't': timestamp,
            'sign_method': 'HMAC-SHA256',
            'Content-Type': 'application/json',
        }
        
        # Create signature for protected endpoints
        string_to_sign = f"{TUYA_CLIENT_ID}{token}{timestamp}"
        if body:
            string_to_sign += hashlib.sha256(body.encode('utf-8')).hexdigest()
        
        signature = hmac.new(
            TUYA_CLIENT_SECRET.encode('utf-8'),
            f"{method}\n{hashlib.sha256(''.encode('utf-8')).hexdigest()}\n\n{path}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest().upper()
        
        headers['sign'] = signature
        
        kwargs = {'headers': headers}
        if body:
            kwargs['data'] = body
        
        response = requests.request(method, f"{TUYA_API_URL}{path}", **kwargs)
        return response.json()


tuya_api = TuyaAPI()


def list_user_devices():
    """List all user devices"""
    print("\n📱 [list_user_devices] Fetching devices...")
    
    try:
        result = tuya_api.request('GET', '/v1.0/users/{uid}/devices')
        
        if result.get('success'):
            devices = result['result']
            device_list = [{
                'name': d['name'],
                'id': d['id'],
                'online': d['online'],
                'product_name': d.get('product_name', ''),
            } for d in devices]
            
            print(f"✅ Found {len(device_list)} devices")
            return {
                "success": True,
                "devices": device_list,
                "count": len(device_list)
            }
        else:
            print(f"❌ API error: {result.get('msg')}")
            return {
                "success": False,
                "error": result.get('msg', 'Unknown error')
            }
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def query_device_status(device_id: str):
    """Query device status"""
    print(f"\n📊 [query_device_status] Device: {device_id}")
    
    try:
        result = tuya_api.request('GET', f'/v1.0/devices/{device_id}/status')
        
        if result.get('success'):
            status = result['result']
            print(f"✅ Status retrieved")
            return {
                "success": True,
                "status": status
            }
        else:
            print(f"❌ API error: {result.get('msg')}")
            return {
                "success": False,
                "error": result.get('msg', 'Unknown error')
            }
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def control_device(device_id: str, command_code: str, command_value):
    """Control device"""
    print(f"\n🎛️  [control_device] Device: {device_id}")
    print(f"   Command: {command_code} = {command_value}")
    
    try:
        import json
        body = json.dumps({
            'commands': [{
                'code': command_code,
                'value': command_value
            }]
        })
        
        result = tuya_api.request('POST', f'/v1.0/devices/{device_id}/commands', body)
        
        if result.get('success'):
            print(f"✅ Device controlled successfully")
            return {
                "success": True,
                "message": "Device controlled successfully"
            }
        else:
            print(f"❌ API error: {result.get('msg')}")
            return {
                "success": False,
                "error": result.get('msg', 'Unknown error')
            }
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


# MCP Tool Definitions
TOOLS = [
    {
        "name": "list_user_devices",
        "description": "List all smart devices in user's Tuya account",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "query_device_status",
        "description": "Query the current status of a device",
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
        "name": "control_device",
        "description": "Control a device. Common commands: switch_led (true/false for lights), temp_set (16-30 for AC), lock_motor_state (true/false for locks)",
        "inputSchema": {
            "type": "object",
            "properties": {
                "device_id": {
                    "type": "string",
                    "description": "The device ID to control"
                },
                "command_code": {
                    "type": "string",
                    "description": "Command code (e.g., 'switch_led', 'temp_set', 'lock_motor_state')"
                },
                "command_value": {
                    "description": "Command value (boolean for switches, number for temperature, etc.)"
                }
            },
            "required": ["device_id", "command_code", "command_value"]
        }
    }
]


def handle_tool_call(tool_name: str, arguments: dict):
    """Handle incoming tool calls from Tuya AI Workflow"""
    print(f"\n🔧 Tool Call: {tool_name}")
    print(f"   Arguments: {arguments}")
    
    if tool_name == "list_user_devices":
        return list_user_devices()
    elif tool_name == "query_device_status":
        return query_device_status(**arguments)
    elif tool_name == "control_device":
        return control_device(**arguments)
    else:
        return {"error": f"Unknown tool: {tool_name}"}


async def main():
    """Main entry point - Connect to Tuya MCP Gateway"""
    
    print("\n🚀 Starting Device Controller MCP Server...")
    print("This server connects to Tuya Cloud via WebSocket")
    print("and controls your smart devices.\n")
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET, TUYA_CLIENT_ID, TUYA_CLIENT_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT")
        print("- MCP_ACCESS_ID")
        print("- MCP_ACCESS_SECRET")
        print("- TUYA_CLIENT_ID")
        print("- TUYA_CLIENT_SECRET")
        return
    
    try:
        print("🔌 Connecting to Tuya MCP Gateway...")
        
        # Initialize Tuya MCP SDK
        async with create_mcpsdk(
            endpoint=MCP_ENDPOINT,
            access_id=MCP_ACCESS_ID,
            access_secret=MCP_ACCESS_SECRET,
            tools=TOOLS,
            tool_handler=handle_tool_call
        ) as sdk:
            print("✅ Connected to Tuya Cloud!")
            print("🎧 Listening for device control calls...")
            print("\nMCP Server is running. Press Ctrl+C to stop.\n")
            print("=" * 50)
            
            # Run forever
            await sdk.run()
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
        print("Goodbye! 👋\n")
    except Exception as e:
        print(f"\n❌ Fatal Error: {e}")
        print("\nCheck your .env configuration!\n")


if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
