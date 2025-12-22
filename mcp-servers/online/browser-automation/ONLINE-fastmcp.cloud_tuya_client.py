"""
Tuya MCP Client - FastMCP Cloud Version (Always Online)
Connects Tuya IoT Platform to your MCP Server running on FastMCP Cloud

Compatible with FastMCP 2.12.3 - Uses tool-based initialization
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

# Create FastMCP app
mcp = FastMCP("Tuya Client Bridge")

# Global client instance
tuya_client = None
connection_task = None

async def ensure_tuya_connection():
    """Ensure Tuya client is connected"""
    global tuya_client, connection_task
    
    if tuya_client is not None:
        return "Already connected"
    
    try:
        from mcp_sdk import MCPSdkClient
    except ImportError:
        error_msg = "❌ MCP SDK not installed!"
        logger.error(error_msg)
        return error_msg
    
    logger.info("=" * 60)
    logger.info("Tuya MCP Client Bridge - Cloud Version")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"Access ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NOT SET")
    logger.info(f"FastMCP Cloud MCP: {FASTMCP_CLOUD_MCP_URL}")
    logger.info("=" * 60)
    
    if not all([TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
        error_msg = "❌ Missing credentials! Set MCP_ACCESS_ID and MCP_ACCESS_SECRET"
        logger.error(error_msg)
        return error_msg
    
    try:
        # Create SDK client
        logger.info("Creating SDK client...")
        tuya_client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=FASTMCP_CLOUD_MCP_URL
        )
        
        # Connect to Tuya Platform
        logger.info("Connecting to Tuya Platform...")
        await tuya_client.connect()
        logger.info("✅ Connected to Tuya Platform!")
        logger.info(f"✅ Forwarding to MCP Server: {FASTMCP_CLOUD_MCP_URL}")
        logger.info("✅ 100% CLOUD ARCHITECTURE!")
        
        # Start listening in background
        async def listen():
            try:
                logger.info("🎧 Starting listener...")
                await tuya_client.start_listening()
            except Exception as e:
                logger.error(f"Listener error: {e}")
        
        connection_task = asyncio.create_task(listen())
        
        return "✅ Connected and listening!"
        
    except Exception as e:
        error_msg = f"❌ Connection error: {e}"
        logger.error(error_msg)
        import traceback
        traceback.print_exc()
        return error_msg

@mcp.tool
async def start_tuya_bridge() -> str:
    """
    Start the Tuya bridge connection.
    Call this first to connect to Tuya Platform!
    """
    logger.info("🚀 Starting Tuya bridge...")
    return await ensure_tuya_connection()

@mcp.tool
async def get_bridge_status() -> str:
    """Get status of the Tuya-to-MCP bridge"""
    
    # Try to connect if not already
    if tuya_client is None:
        await ensure_tuya_connection()
    
    connected = tuya_client is not None
    
    status = f"""
📊 Tuya MCP Client Bridge Status:
{'✅ Connected' if connected else '❌ Not Connected'}
🌐 Tuya Endpoint: {TUYA_ENDPOINT}
🔗 MCP Server: {FASTMCP_CLOUD_MCP_URL}
🔑 Access ID: {'Configured' if TUYA_ACCESS_ID else 'NOT SET'}
🔐 Access Secret: {'Configured' if TUYA_ACCESS_SECRET else 'NOT SET'}

This bridge connects Tuya IoT Platform to your MCP Server.
100% cloud-based - no local components needed!

Call 'start_tuya_bridge' tool to connect if not already connected.
    """.strip()
    return status

# Log server startup
logger.info("📡 Tuya Client Bridge server initialized")
logger.info("⚠️ Call 'start_tuya_bridge' tool to connect to Tuya Platform")

# FastMCP Cloud will run this as HTTP server
