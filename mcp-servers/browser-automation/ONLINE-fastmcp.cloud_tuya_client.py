"""
Tuya MCP Client - FastMCP Cloud Version (Always Online)
Connects Tuya IoT Platform to your MCP Server running on FastMCP Cloud

Deploy this as a SECOND server on FastMCP Cloud to have 100% cloud architecture!
"""

import asyncio
import logging
import os
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

# Create a FastMCP app (so it can be deployed to FastMCP Cloud)
mcp = FastMCP("Tuya Client Bridge")

async def connect_to_tuya_and_forward():
    """
    Background task that connects to Tuya Platform and forwards requests to FastMCP Cloud MCP server
    """
    try:
        from mcp_sdk import MCPSdkClient
    except ImportError:
        logger.error("MCP SDK not installed! Add 'tuya-mcp-sdk' to requirements.txt")
        return
    
    logger.info("=" * 60)
    logger.info("Tuya MCP Client Bridge - Cloud Version")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"Access ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NOT SET")
    logger.info(f"FastMCP Cloud MCP: {FASTMCP_CLOUD_MCP_URL}")
    logger.info("=" * 60)
    
    if not all([TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
        logger.error("Missing credentials! Set MCP_ACCESS_ID and MCP_ACCESS_SECRET in FastMCP dashboard")
        return
    
    try:
        # Create SDK client pointing to FastMCP Cloud MCP server
        logger.info("Creating SDK client...")
        client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=FASTMCP_CLOUD_MCP_URL  # Points to your MCP server!
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

# Start background task when server starts
@mcp.lifespan
async def lifespan():
    """Runs when the server starts and keeps running"""
    # Start Tuya client in background
    task = asyncio.create_task(connect_to_tuya_and_forward())
    
    yield  # Server is running
    
    # Cleanup on shutdown
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

# Note: No .run() call - FastMCP Cloud handles startup
# This will run as a FastMCP server AND maintain Tuya connection!
