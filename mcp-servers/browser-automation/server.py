"""
Browser Automation MCP Server - HTTP/SSE Mode
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
    import httpx
    from starlette.applications import Starlette
    from starlette.routing import Route
    SDK_AVAILABLE = True
except ImportError as e:
    SDK_AVAILABLE = False
    print(f"❌ ERROR: {e}")
    print("\nInstall: pip install mcp httpx starlette uvicorn")
    exit(1)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL', 'https://tuya-cloud-bridge.vercel.app')
MCP_API_KEY = os.getenv('MCP_API_KEY')

print("🌐 Browser Automation MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT or 'NOT SET'}")
print(f"Cloud Bridge: {CLOUD_BRIDGE_URL}")
print("=" * 50)

# Create MCP server
app_mcp = Server("browser-automation")

# Tools and handlers (same as before)
@app_mcp.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="navigate_to_url", description="Navigate browser to URL",
             inputSchema={"type": "object", "properties": {"url": {"type": "string"}}, "required": ["url"]}),
        Tool(name="click_element", description="Click element by selector",
             inputSchema={"type": "object", "properties": {"selector": {"type": "string"}}, "required": ["selector"]}),
        Tool(name="type_text", description="Type text into input",
             inputSchema={"type": "object", "properties": {"selector": {"type": "string"}, "text": {"type": "string"}}, "required": ["selector", "text"]}),
        Tool(name="get_page_content", description="Get page content",
             inputSchema={"type": "object", "properties": {}}),
        Tool(name="take_screenshot", description="Take screenshot",
             inputSchema={"type": "object", "properties": {}})
    ]

@app_mcp.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    logger.info(f"🔧 Tool: {name}, Args: {arguments}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/commands/create",
                json={"type": name, "params": arguments, "user_id": "tuya_ai", "source": "tuya_mcp"},
                headers={"Authorization": f"Bearer {MCP_API_KEY}"},
                timeout=10.0
            )
            
            if response.status_code == 200:
                result = response.json()
                return [TextContent(type="text", text=f"✅ Queued! ID: {result.get('command_id')}")]
            else:
                return [TextContent(type="text", text=f"❌ Error: {response.status_code}")]
    except Exception as e:
        return [TextContent(type="text", text=f"❌ Error: {str(e)}")]

# HTTP endpoints for SSE
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
        custom_mcp_server_endpoint="http://localhost:8765/sse"
    )
    
    logger.info("✅ Connected to Tuya Platform!")
    logger.info("🎧 MCP Server is ONLINE")
    
    while True:
        await asyncio.sleep(1)

async def main():
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing env vars! Check .env file")
        return
    
    # Run HTTP server and SDK connection concurrently
    import uvicorn
    
    config = uvicorn.Config(app_http, host="127.0.0.1", port=8765, log_level="info")
    server = uvicorn.Server(config)
    
    await asyncio.gather(
        server.serve(),
        run_tuya_sdk()
    )

if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
