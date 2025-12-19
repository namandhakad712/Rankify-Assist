"""
Browser Automation MCP Server
Uses official Tuya MCP SDK to connect to Tuya Platform
Sends browser commands to Vercel cloud bridge
"""

import os
import asyncio
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

# Tuya Platform MCP Credentials (from MCP Management page)
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')  # wss://...
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

# Vercel Cloud Bridge
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')  # https://your-project.vercel.app
MCP_API_KEY = os.getenv('MCP_API_KEY')
DEFAULT_USER_ID = os.getenv('DEFAULT_USER_ID', 'default')

print("🌐 Browser Automation MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT}")
print(f"Cloud Bridge: {CLOUD_BRIDGE_URL}")
print(f"Default User: {DEFAULT_USER_ID}")
print("=" * 50)

def execute_browser_task(command: str, user_id: str = None):
    """
    Execute browser automation command via cloud bridge
    
    Flow:
    1. MCP receives tool call from Tuya Workflow
    2. Send command to Vercel API (/api/execute)
    3. Extension polls Vercel, gets command
    4. Extension executes in browser
    5. Extension sends result to Vercel
    6. Vercel returns result to us
    7. We return to Tuya Workflow
    """
    user_id = user_id or DEFAULT_USER_ID
    
    print(f"\n📨 [execute_browser_task] Command: {command}")
    print(f"   User: {user_id}")
    
    try:
        # Send to cloud bridge
        response = requests.post(
            f"{CLOUD_BRIDGE_URL}/api/execute",
            json={
                "userId": user_id,
                "apiKey": MCP_API_KEY,
                "command": command,
            },
            timeout=65  # Wait for extension to execute (60s timeout + buffer)
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success: {result.get('result')}")
            return {
                "success": True,
                "result": result.get('result', 'Task completed'),
                "executionTime": result.get('executionTime', 0)
            }
        elif response.status_code == 408:
            print("⏱️  Timeout - extension may not be connected")
            return {
                "success": False,
                "error": "Extension timeout - is it running and polling?"
            }
        else:
            print(f"❌ Cloud bridge error: {response.status_code}")
            return {
                "success": False,
                "error": f"Cloud error: {response.status_code}"
            }
            
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
        return {
            "success": False,
            "error": "Request timeout - check extension and cloud bridge"
        }
    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "success": False,
            "error": str(e)
        }


# MCP Tool Definitions (Standard MCP format)
TOOLS = [
    {
        "name": "execute_browser_task",
        "description": "Execute a browser automation task. Examples: 'check gmail unread count', 'open youtube', 'search for AI news'",
        "inputSchema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "The browser task to execute in natural language"
                },
                "user_id": {
                    "type": "string",
                    "description": "Optional user ID (defaults to env configured user)"
                }
            },
            "required": ["command"]
        }
    }
]


def handle_tool_call(tool_name: str, arguments: dict):
    """Handle incoming tool calls from Tuya AI Workflow"""
    print(f"\n🔧 Tool Call: {tool_name}")
    print(f"   Arguments: {arguments}")
    
    if tool_name == "execute_browser_task":
        return execute_browser_task(**arguments)
    else:
        return {"error": f"Unknown tool: {tool_name}"}


async def main():
    """Main entry point - Connect to Tuya MCP Gateway"""
    
    print("\n🚀 Starting Browser Automation MCP Server...")
    print("This server connects to Tuya Cloud via WebSocket")
    print("and listens for browser automation tool calls.\n")
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT (from Tuya MCP Management)")
        print("- MCP_ACCESS_ID")
        print("- MCP_ACCESS_SECRET")
        print("- CLOUD_BRIDGE_URL (your Vercel URL)")
        print("- MCP_API_KEY")
        return
    
    try:
        print("🔌 Connecting to Tuya MCP Gateway...")
        
        # Initialize Tuya MCP SDK (persistent WebSocket connection)
        async with create_mcpsdk(
            endpoint=MCP_ENDPOINT,
            access_id=MCP_ACCESS_ID,
            access_secret=MCP_ACCESS_SECRET,
            tools=TOOLS,
            tool_handler=handle_tool_call
        ) as sdk:
            print("✅ Connected to Tuya Cloud!")
            print("🎧 Listening for tool calls from AI Workflow...")
            print("\nMCP Server is running. Press Ctrl+C to stop.\n")
            print("=" * 50)
            
            # Run forever (blocks until Ctrl+C)
            await sdk.run()
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
        print("Goodbye! 👋\n")
    except Exception as e:
        print(f"\n❌ Fatal Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check your .env file has correct values")
        print("2. Verify MCP credentials from Tuya Platform")
        print("3. Ensure Vercel cloud bridge is deployed")
        print("4. Check network connection\n")


if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
