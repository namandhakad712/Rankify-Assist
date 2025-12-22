"""
Device Controller MCP Server - CORRECT VERSION
Just forwards device control commands with Access ID
"""

import os
import asyncio
import logging
import httpx
from dotenv import load_dotenv
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated

load_dotenv()

# Configuration
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL', 'https://tuya-cloud-bridge.vercel.app')
MCP_API_KEY = os.getenv('MCP_API_KEY')
TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')  # Use the Tuya Access ID from .env

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("🏠 Device Controller MCP Server (Command Forwarder)")
print("=" * 50)
print(f"Cloud Bridge: {CLOUD_BRIDGE_URL}")
print("=" * 50)

# Create FastMCP app
mcp = FastMCP("Device Controller")

# Single tool - forward device control commands
@mcp.tool
async def control_device_command(
    command: Annotated[str, Field(description="Natural language device control command (e.g., 'turn on lights', 'set AC to 22 degrees')")]
) -> str:
    """
    Execute a device control command.
    Forwards the command to cloud bridge for processing.
    """
    logger.info(f"📨 Received device command from Tuya: {command}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/execute",
                json={
                    "userId": "tuya_ai",  # Legacy field
                    "apiKey": MCP_API_KEY,
                    "accessId": TUYA_ACCESS_ID,  # Send the Access ID!
                    "command": command
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                result = response.json()
                command_id = result.get('commandId')
                logger.info(f"✅ Command queued! ID: {command_id}")
                return f"✅ Device command sent! (ID: {command_id})"
            else:
                error_msg = response.text
                logger.error(f"❌ Cloud Bridge error {response.status_code}: {error_msg}")
                return f"❌ Failed: {error_msg}"
                
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        return f"❌ Error: {str(e)}"

# Main entry point
if __name__ == "__main__":
    logger.info("🚀 Starting Device Controller MCP Server...")
    logger.info("📡 Commands will be forwarded to cloud bridge")
    logger.info("🌐 Server will run on http://localhost:8768")
    
    # Run HTTP server
    mcp.run(transport="http", host="localhost", port=8768)
