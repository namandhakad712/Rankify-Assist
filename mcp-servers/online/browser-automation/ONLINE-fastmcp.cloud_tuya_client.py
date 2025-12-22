"""
Tuya MCP Client - FastMCP Cloud Version (Always Online)
Connects Tuya IoT Platform to your MCP Server running on FastMCP Cloud

Deploy this as a server on FastMCP Cloud - it will run 24/7!
Compatible with FastMCP 2.12.3
"""

import asyncio
import logging
import os
import threading
from fastmcp import FastMCP

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Environment variables (set in FastMCP Cloud dashboard)
TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT', 'https://mcp-in.iotbing.com')
TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
FASTMCP_CLOUD_MCP_URL = os.getenv('FASTMCP_CLOUD_MCP_URL', 'https://assist.fastmcp.app/mcp')

# Create FastMCP app
mcp = FastMCP("Tuya Client Bridge")

async def connect_to_tuya():
    """
    Connect to Tuya Platform and forward requests to FastMCP Cloud MCP server
    """
    try:
        from mcp_sdk import MCPSdkClient
    except ImportError:
        logger.error("MCP SDK not installed!")
        return
    
    logger.info("=" * 60)
    logger.info("Tuya MCP Client Bridge - Cloud Version")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"Access ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NOT SET")
    logger.info(f"FastMCP Cloud MCP: {FASTMCP_CLOUD_MCP_URL}")
    logger.info("=" * 60)
    
    if not all([TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
        logger.error("Missing credentials! Set MCP_ACCESS_ID and MCP_ACCESS_SECRET")
        return
    
    try:
        # Create SDK client pointing to FastMCP Cloud MCP server
        logger.info("Creating SDK client...")
        client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=FASTMCP_CLOUD_MCP_URL
        )
        
        # Connect to Tuya Platform
        logger.info("Connecting to Tuya Platform...")
        await client.connect()
        logger.info("✅ Connected to Tuya Platform!")
        logger.info(f"✅ Forwarding to MCP Server: {FASTMCP_CLOUD_MCP_URL}")
        logger.info("✅ 100% CLOUD ARCHITECTURE - NO LOCAL COMPONENTS!")
        logger.info("🎧 Listening for AI Workflow requests...")
        
        # Keep running forever
        await client.start_listening()
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

@mcp.tool
async def get_bridge_status() -> str:
    """Get status of the Tuya-to-MCP bridge"""
    status = f"""
📊 Tuya MCP Client Bridge Status:
✅ Running on FastMCP Cloud
🌐 Tuya Endpoint: {TUYA_ENDPOINT}
🔗 MCP Server: {FASTMCP_CLOUD_MCP_URL}
🔑 Access ID: {'Configured' if TUYA_ACCESS_ID else 'NOT SET'}

This bridge connects Tuya IoT Platform to your MCP Server.
100% cloud-based - no local components needed!
    """.strip()
    return status

# Start Tuya client in background thread (compatible with FastMCP 2.12.3)
def start_tuya_client_background():
    """Start Tuya client in a separate thread"""
    logger.info("🚀 Starting Tuya client in background...")
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Run the Tuya client
    try:
        loop.run_until_complete(connect_to_tuya())
    except Exception as e:
        logger.error(f"Background client error: {e}")
    finally:
        loop.close()

# Start background thread when module loads
logger.info("📡 Initializing Tuya client bridge...")
tuya_thread = threading.Thread(target=start_tuya_client_background, daemon=True)
tuya_thread.start()
logger.info("✅ Background thread started")

# FastMCP Cloud will run this as HTTP server
# The Tuya client runs in background thread
