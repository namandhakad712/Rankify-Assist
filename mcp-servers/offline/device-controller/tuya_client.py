"""
Simple Tuya MCP SDK Client - Device Controller
Connects Tuya Platform to your local FastMCP server
"""

import asyncio
import logging
import os
from dotenv import load_dotenv

load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Connect Tuya to FastMCP Server"""
    
    # Import SDK
    try:
        from mcp_sdk import MCPSdkClient
    except ImportError:
        logger.error("MCP SDK not installed!")
        return
    
    # Your credentials from Tuya Platform
    TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT', 'https://mcp-in.iotbing.com')
    TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
    TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
    
    # Your local FastMCP server
    LOCAL_MCP_SERVER = "http://localhost:8768/mcp"
    
    logger.info("=" * 60)
    logger.info("Tuya MCP SDK Client - Device Controller")
    logger.info("=" * 60)
    logger.info(f"Tuya Endpoint: {TUYA_ENDPOINT}")
    logger.info(f"Access ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NOT SET")
    logger.info(f"Local MCP Server: {LOCAL_MCP_SERVER}")
    logger.info("=" * 60)
    
    if not all([TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
        logger.error("Missing credentials! Set MCP_ACCESS_ID and MCP_ACCESS_SECRET in .env")
        return
    
    try:
        # Create SDK client
        logger.info("Creating SDK client...")
        client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=LOCAL_MCP_SERVER
        )
        
        # Connect to Tuya Platform
        logger.info("Connecting to Tuya Platform...")
        await client.connect()
        logger.info("✅ Connected to Tuya Platform!")
        
        # Start listening for requests
        logger.info("✅ MCP Server is now ONLINE on Tuya Platform!")
        logger.info("🎧 Listening for device control requests...")
        logger.info("Press Ctrl+C to stop")
        logger.info("")
        
        # Keep running
        await client.start_listening()
        
    except KeyboardInterrupt:
        logger.info("\n👋 Shutting down...")
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'client' in locals():
            try:
                await client.shutdown()
                logger.info("✅ Shutdown complete")
            except:
                pass

if __name__ == "__main__":
    print("\n🚀 Starting Tuya MCP Client for Device Controller...")
    print("Make sure FastMCP server is running on http://localhost:8768\n")
    asyncio.run(main())
