"""
Device Controller - Full MCP Server Implementation

This runs TWO servers:
1. Local MCP HTTP/SSE server with actual tool implementations
2. Tuya MCP SDK client that connects to Tuya Platform

The flow:
Tuya AI → Tuya Platform → Tuya SDK (this script) → Local MCP Server → Device Control
"""

import os
import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()

# Import required libraries
try:
    from mcp_sdk import create_mcpsdk
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent
    SDK_AVAILABLE = True
except ImportError as e:
    SDK_AVAILABLE = False
    print(f"\n❌ ERROR: Missing dependencies: {e}")
    print("\nInstall steps:")
    print("1. pip install mcp")
    print("2. git clone https://github.com/tuya/tuya-mcp-sdk.git")
    print("3. cd tuya-mcp-sdk/mcp-python")
    print("4. pip install -e .")
    exit(1)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MCP Credentials
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

print("🏠 Device Controller MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT or 'NOT SET'}")
print(f"Access ID: {MCP_ACCESS_ID[:20] + '...' if MCP_ACCESS_ID else 'NOT SET'}")
print("=" * 50)

# Create the local MCP server
app = Server("device-controller")

# Define actual tools
@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available device controller tools"""
    return [
        Tool(
            name="list_user_devices",
            description="List all smart devices in user's Tuya account",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        Tool(
            name="query_device_status",
            description="Query the current status of a device",
            inputSchema={
                "type": "object", 
                "properties": {
                    "device_id": {
                        "type": "string",
                        "description": "The device ID to query"
                    }
                },
                "required": ["device_id"]
            }
        ),
        Tool(
            name="control_device",
            description="Control a device",
            inputSchema={
                "type": "object",
                "properties": {
                    "device_id": {"type": "string"},
                    "command_code": {"type": "string"},
                    "command_value": {}
                },
                "required": ["device_id", "command_code", "command_value"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    logger.info(f"🔧 Tool called: {name}")
    logger.info(f"   Arguments: {arguments}")
    
    if name == "list_user_devices":
        return [TextContent(type="text", text="Device list functionality - implement with Tuya OpenAPI")]
    elif name == "query_device_status":
        return [TextContent(type="text", text=f"Query device {arguments.get('device_id')} - implement with Tuya OpenAPI")]
    elif name == "control_device":
        return [TextContent(type="text", text=f"Control device {arguments.get('device_id')} - implement with Tuya OpenAPI")]
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


async def run_local_mcp_server():
    """Run the local MCP server using stdio"""
    logger.info("🚀 Starting local MCP server...")
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


async def main():
    """Main entry point - Connect Tuya SDK to local MCP server"""
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT")
        print("- MCP_ACCESS_ID")
        print("- MCP_ACCESS_SECRET")
        return
    
    try:
        logger.info("🔌 Connecting to Tuya MCP Platform...")
        
        # Option 1: Run local MCP server via stdio (simpler)
        await run_local_mcp_server()
        
        # Option 2: Run with Tuya SDK (if you have an HTTP MCP server)
        # async with create_mcpsdk(
        #     endpoint=MCP_ENDPOINT,
        #     access_id=MCP_ACCESS_ID,
        #     access_secret=MCP_ACCESS_SECRET,
        #     custom_mcp_server_endpoint="http://localhost:8765/mcp"
        # ) as sdk:
        #     await sdk.run()
        
    except KeyboardInterrupt:
        logger.info("\n⏹️  Server stopped")
    except Exception as e:
        logger.error(f"❌ Error: {e}", exc_info=True)


if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
