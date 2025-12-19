"""
Browser Automation - Full MCP Server Implementation

This runs TWO components:
1. Local MCP server that receives commands from Tuya AI
2. HTTP client that forwards commands to Vercel cloud bridge

The flow:
Tuya AI → Tuya Platform → MCP SDK → Local MCP Server → Vercel Cloud Bridge → Chrome Extension → Browser
"""

import os
import asyncio
import logging
import httpx
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
    print("1. pip install mcp httpx")
    print("2. git clone https://github.com/tuya/tuya-mcp-sdk.git")
    print("3. cd tuya-mcp-sdk/mcp-python")
    print("4. pip install -e .")
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

# Create the local MCP server
app = Server("browser-automation")

async def send_to_cloud_bridge(command: dict) -> dict:
    """Send command to Vercel cloud bridge"""
    try:
        logger.info(f"📤 Sending to cloud bridge: {command}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/commands/create",
                json=command,
                headers={
                    "Authorization": f"Bearer {MCP_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Command sent! ID: {result.get('command_id')}")
                return result
            else:
                logger.error(f"❌ Cloud bridge error: {response.status_code} - {response.text}")
                return {"error": f"HTTP {response.status_code}"}
                
    except Exception as e:
        logger.error(f"❌ Failed to send to cloud bridge: {e}")
        return {"error": str(e)}


# Define browser automation tools
@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available browser automation tools"""
    return [
        Tool(
            name="navigate_to_url",
            description="Navigate browser to a specific URL",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "The URL to navigate to"
                    }
                },
                "required": ["url"]
            }
        ),
        Tool(
            name="click_element",
            description="Click on an element using CSS selector",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {
                        "type": "string",
                        "description": "CSS selector of element to click"
                    }
                },
                "required": ["selector"]
            }
        ),
        Tool(
            name="type_text",
            description="Type text into an input field",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {
                        "type": "string",
                        "description": "CSS selector of input field"
                    },
                    "text": {
                        "type": "string",
                        "description": "Text to type"
                    }
                },
                "required": ["selector", "text"]
            }
        ),
        Tool(
            name="get_page_content",
            description="Get the text content of the current page",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        Tool(
            name="take_screenshot",
            description="Take a screenshot of the current page",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls - forward to cloud bridge"""
    logger.info(f"🔧 Tool called: {name}")
    logger.info(f"   Arguments: {arguments}")
    
    # Create command for cloud bridge
    command = {
        "type": name,
        "params": arguments,
        "user_id": "tuya_ai_user",  # From Tuya AI
        "source": "tuya_mcp"
    }
    
    # Send to cloud bridge
    result = await send_to_cloud_bridge(command)
    
    if "error" in result:
        return [TextContent(
            type="text",
            text=f"❌ Error: {result['error']}"
        )]
    else:
        return [TextContent(
            type="text", 
            text=f"✅ Command queued! ID: {result.get('command_id', 'unknown')}\nThe browser extension will execute this shortly."
        )]


async def run_local_mcp_server():
    """Run the local MCP server using stdio"""
    logger.info("🚀 Starting local MCP server...")
    logger.info("📡 Commands will be forwarded to cloud bridge")
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


async def main():
    """Main entry point"""
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT")
        print("- MCP_ACCESS_ID")
        print("- MCP_ACCESS_SECRET")
        print("- CLOUD_BRIDGE_URL (optional, has default)")
        print("- MCP_API_KEY (for cloud bridge auth)")
        return
    
    try:
        logger.info("🔌 Starting Browser Automation MCP Server...")
        
        # Run local MCP server (receives from Tuya, sends to cloud bridge)
        await run_local_mcp_server()
        
    except KeyboardInterrupt:
        logger.info("\n⏹️  Server stopped")
    except Exception as e:
        logger.error(f"❌ Error: {e}", exc_info=True)


if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
