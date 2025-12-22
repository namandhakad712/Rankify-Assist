"""
Tuya MCP Client - FastMCP Cloud Version (Device Controller)
Connects Tuya IoT Platform to Device Controller MCP Server

Deploy this as a server on FastMCP Cloud for 100% cloud device control!
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
FASTMCP_CLOUD_MCP_URL = os.getenv('FASTMCP_CLOUD_MCP_URL', 'https://device-control.fastmcp.app/mcp')

# Create FastMCP app
mcp = FastMCP("Tuya Device Client Bridge")

async def connect_to_tuya():
    """
    Connect to Tuya Platform and forward device control requests
    """
    try:
        from mcp_sdk import MCPSdkClient
    except ImportError:
        logger.error("MCP SDK not installed!")
        return
    
    logger.info("=" * 60)
    logger.info("Tuya Device Client Bridge - Cloud Version")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"Access ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NOT SET")
    logger.info(f"Device Control MCP: {FASTMCP_CLOUD_MCP_URL}")
    logger.info("=" * 60)
    
    if not all([TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
        logger.error("Missing credentials!")
        return
    
    try:
        # Create SDK client pointing to Device Controller MCP server
        logger.info("Creating SDK client for device control...")
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
        logger.info(f"✅ Forwarding device commands to: {FASTMCP_CLOUD_MCP_URL}")
        logger.info("✅ 100% CLOUD DEVICE CONTROL!")
        logger.info("🎧 Listening for device control requests...")
        
        # Keep running
        await client.start_listening()
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

@mcp.tool
async def get_bridge_status() -> str:
    """Get status of the Tuya Device Client Bridge"""
    status = f"""
📊 Tuya Device Client Bridge Status:
✅ Running on FastMCP Cloud
🌐 Tuya Endpoint: {TUYA_ENDPOINT}
🔗 Device MCP Server: {FASTMCP_CLOUD_MCP_URL}
🔑 Access ID: {'Configured' if TUYA_ACCESS_ID else 'NOT SET'}

This bridge connects Tuya IoT Platform to Device Controller MCP Server.
Controls lights, AC, fans, and all smart devices!
    """.strip()
    return status

# Start Tuya client in background thread (compatible with FastMCP 2.12.3)
def start_tuya_client_background():
    """Start Tuya client in a separate thread"""
    logger.info("🚀 Starting device control bridge in background...")
    
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
logger.info("📡 Initializing device control bridge...")
tuya_thread = threading.Thread(target=start_tuya_client_background, daemon=True)
tuya_thread.start()
logger.info("✅ Background thread started")

# FastMCP Cloud will run this as HTTP server
