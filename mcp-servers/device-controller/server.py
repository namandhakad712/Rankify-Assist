"""
Device Controller MCP Server - Using FastMCP (CORRECT WAY!)
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

print("🏠 Device Controller MCP Server (FastMCP)")
print("=" * 50)

# Create FastMCP app
mcp = FastMCP("Device Controller")

# Define tools
@mcp.tool
async def list_user_devices() -> str:
    """List all smart devices in user's Tuya account"""
    logger.info("📱 list_user_devices")
    return "✅ Device list: [Living Room Light, Bedroom AC, Front Door Lock] (implement with Tuya OpenAPI)"

@mcp.tool
async def query_device_status(
    device_id: Annotated[str, Field(description="The device ID to query")]
) -> str:
    """Query the current status of a device"""
    logger.info(f"📊 query_device_status: {device_id}")
    return f"✅ Device {device_id} status: Online, Power: On (implement with Tuya OpenAPI)"

@mcp.tool
async def control_device(
    device_id: Annotated[str, Field(description="The device ID to control")],
    command_code: Annotated[str, Field(description="Command code (e.g., 'switch_led', 'temp_set')")],
    command_value: Annotated[str, Field(description="Command value (true/false for switch, number for temp)")]
) -> str:
    """Control a Tuya smart device"""
    logger.info(f"🎛️ control_device: {device_id}, {command_code}={command_value}")
    return f"✅ Device {device_id} controlled: {command_code}={command_value} (implement with Tuya OpenAPI)"

# Main entry point
if __name__ == "__main__":
    logger.info("🚀 Starting Device Controller MCP Server...")
    logger.info("🌐 Server will run on http://localhost:8768")
    
    # Run HTTP server
    mcp.run(transport="http", host="localhost", port=8768)
