"""
Device Controller MCP Server - HTTP/SSE Mode
Runs a local HTTP server that Tuya SDK connects to
"""

import os
import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()

# Import libraries
try:
    from mcp_sdk import create_mcpsdk
    from mcp.server import Server
    from mcp.server.sse import SseServerTransport
    from mcp.types import Tool, TextContent
    from starlette.applications import Starlette
    from starlette.routing import Route
    SDK_AVAILABLE = True
except ImportError as e:
    SDK_AVAILABLE = False
    print(f"❌ ERROR: {e}")
    print("\nInstall: pip install mcp starlette uvicorn")
    exit(1)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

print("🏠 Device Controller MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT or 'NOT SET'}")
print("=" * 50)

# Create MCP server
app_mcp = Server("device-controller")

# Tools
@app_mcp.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="list_user_devices", description="List all user devices",
             inputSchema={"type": "object", "properties": {}}),
        Tool(name="query_device_status", description="Query device status",
             inputSchema={"type": "object", "properties": {"device_id": {"type": "string"}}, "required": ["device_id"]}),
        Tool(name="control_device", description="Control device",
             inputSchema={"type": "object", "properties": {
                 "device_id": {"type": "string"},
                 "command_code": {"type": "string"},
                 "command_value": {}
             }, "required": ["device_id", "command_code", "command_value"]})
    ]

@app_mcp.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    logger.info(f"🔧 Tool: {name}, Args: {arguments}")
    return [TextContent(type="text", text=f"✅ Tool {name} called - implement with Tuya OpenAPI")]

# HTTP endpoints
async def handle_sse(request):
    async with SseServerTransport("/messages") as transport:
        await app_mcp.run(transport.read_stream, transport.write_stream,
                         app_mcp.create_initialization_options())

async def handle_messages(request):
    return {"status": "ok"}

# Starlette app
app_http = Starlette(routes=[
    Route("/sse", handle_sse),
    Route("/messages", handle_messages, methods=["POST"])
])

async def run_tuya_sdk():
    """Connect to Tuya Platform"""
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        logger.error("❌ Missing MCP credentials!")
        return
    
    logger.info("🔌 Connecting to Tuya MCP Platform...")
    
    sdk = create_mcpsdk(
        endpoint=MCP_ENDPOINT,
        access_id=MCP_ACCESS_ID,
        access_secret=MCP_ACCESS_SECRET,
        custom_mcp_server_endpoint="http://localhost:8766/sse"
    )
    
    logger.info("✅ Connected to Tuya Platform!")
    logger.info("🎧 MCP Server is ONLINE")
    
    while True:
        await asyncio.sleep(1)

async def main():
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing env vars! Check .env file")
        return
    
    # Run HTTP server and SDK connection
    import uvicorn
    
    config = uvicorn.Config(app_http, host="127.0.0.1", port=8766, log_level="info")
    server = uvicorn.Server(config)
    
    await asyncio.gather(
        server.serve(),
        run_tuya_sdk()
    )

if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
