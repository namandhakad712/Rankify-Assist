"""
Device Controller MCP Server - CORRECT VERSION
Just forwards device control commands
Extension or backend handles the actual Tuya OpenAPI calls
"""

import os
import logging
from dotenv import load_dotenv
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("🏠 Device Controller MCP Server (Command Forwarder)")
print("=" * 50)

# Create FastMCP app
mcp = FastMCP("Device Controller")

# Single tool - just forward the device command!
@mcp.tool
async def control_device_command(
    command: Annotated[str, Field(description="Natural language device control command (e.g., 'turn on living room light', 'set AC to 24 degrees')")]
) -> str:
    """
    Execute a device control command.
    The command will be forwarded to the Tuya device controller service.
    """
    logger.info(f"📨 Received device command from Tuya: {command}")
    
    # For now, just acknowledge
    # TODO: Forward to actual Tuya device control service
    return f"✅ Device command received: {command} (implement Tuya OpenAPI integration)"

# Main entry point
if __name__ == "__main__":
    logger.info("🚀 Starting Device Controller MCP Server (Command Forwarder)...")
    logger.info("📡 Commands will be forwarded to device controller")
    logger.info("🌐 Server will run on http://localhost:8768")
    
    # Run HTTP server
    mcp.run(transport="http", host="localhost", port=8768)
