"""
Device Controller MCP Server
Uses official Tuya MCP SDK - NO OpenAPI credentials needed!
The MCP SDK connects to Tuya Platform and handles all device control.
"""

import os
import asyncio
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

# ONLY MCP Credentials Needed (from Tuya Platform MCP Management)
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

print("🏠 Device Controller MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT or 'NOT SET'}")
print(f"Access ID: {MCP_ACCESS_ID[:20] + '...' if MCP_ACCESS_ID else 'NOT SET'}")
print("=" * 50)


# MCP Tool Definitions
# The Tuya Platform handles the actual device communication!
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
    """
    Handle incoming tool calls from Tuya AI Workflow
    
    NOTE: You don't implement the actual device control here!
    The Tuya Platform MCP service handles device communication.
    This just returns the parameters back to the platform.
    """
    print(f"\n🔧 Tool Call Received: {tool_name}")
    print(f"   Arguments: {arguments}")
    
    # Return the arguments - Tuya Platform will handle the actual device control
    return {
        "success": True,
        "tool": tool_name,
        "arguments": arguments,
        "message": f"Tool {tool_name} called successfully"
    }


async def main():
    """Main entry point - Connect to Tuya MCP Gateway"""
    
    print("\n🚀 Starting Device Controller MCP Server...")
    print("This server connects to Tuya MCP Gateway via WebSocket\n")
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT     (from Tuya Platform → MCP Management)")
        print("- MCP_ACCESS_ID    (from Tuya Platform → MCP Management)")
        print("- MCP_ACCESS_SECRET (from Tuya Platform → MCP Management)")
        print("\n📚 Guide: https://developer.tuya.com/en/docs/iot/custom-mcp")
        print("\nNOTE: NO OpenAPI credentials needed! MCP SDK handles everything!")
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
            print("✅ Connected to Tuya MCP Platform!")
            print("🎧 Listening for device control calls from Tuya AI...")
            print("\nMCP Server is running. Press Ctrl+C to stop.\n")
            print("=" * 50)
            
            # Run forever
            await sdk.run()
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
        print("Goodbye! 👋\n")
    except Exception as e:
        print(f"\n❌ Fatal Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check MCP credentials in .env")
        print("2. Verify data center selection")
        print("3. Ensure MCP server is created on Tuya Platform")
        print("\n📚 Guide: https://developer.tuya.com/en/docs/iot/custom-mcp\n")


if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
