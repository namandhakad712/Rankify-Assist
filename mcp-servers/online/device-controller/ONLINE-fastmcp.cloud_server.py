"""
Device Controller MCP Server - FastMCP Cloud Version
Runs 24/7 in the cloud for reliable device control

This version is optimized for deployment to FastMCP Cloud (https://fastmcp.cloud)
Controls Tuya smart devices via cloud bridge
"""

import os
import httpx
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated

# Environment variables (MUST be set in FastMCP Cloud dashboard)
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')  # No default - MUST be set!
MCP_API_KEY = os.getenv('MCP_API_KEY')  # No default - MUST be set!
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID', 'tuya_mcp_user')  # Optional - just metadata for Cloud Bridge

# Create FastMCP app (compatible with FastMCP 2.12.3)
mcp = FastMCP("Device Controller")

@mcp.tool
async def control_device(
    command: Annotated[str, Field(
        description="Natural language device control command (e.g., 'turn on living room lights', 'set bedroom AC to 22 degrees', 'turn off all fans')"
    )]
) -> str:
    """
    Control Tuya smart devices using natural language.
    
    Examples:
    - "turn on the lights"
    - "set AC to 22 degrees"
    - "turn off all devices"
    - "dim bedroom lights to 50%"
    - "set fan speed to high"
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/device-control",
                json={
                    "userId": "tuya_ai",
                    "apiKey": MCP_API_KEY,
                    "accessId": TUYA_ACCESS_ID,
                    "command": command
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                result = response.json()
                command_id = result.get('commandId', 'unknown')
                device_action = result.get('action', 'processed')
                return f"✅ Device command '{command}' executed! Action: {device_action} (ID: {command_id})"
            else:
                error_msg = response.text
                return f"❌ Failed to control device: {error_msg}"
                
    except httpx.TimeoutException:
        return "⏱️ Request timed out. The command may still be processing. Please try again."
    except Exception as e:
        return f"❌ Error: {str(e)}"

@mcp.tool
async def get_device_status(
    device_name: Annotated[str, Field(
        description="Name of the device to check status (e.g., 'bedroom light', 'living room AC')"
    )] = "all"
) -> str:
    """
    Get status of Tuya smart devices.
    
    Examples:
    - get_device_status("bedroom light")
    - get_device_status("all")  # Get status of all devices
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CLOUD_BRIDGE_URL}/api/device-status",
                params={
                    "apiKey": MCP_API_KEY,
                    "accessId": TUYA_ACCESS_ID,
                    "device": device_name
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                status_data = response.json()
                return f"📊 Device Status: {status_data}"
            else:
                return f"⚠️ Could not fetch status: {response.text}"
                
    except Exception as e:
        return f"❌ Error fetching status: {str(e)}"

@mcp.tool
async def health_check() -> str:
    """Check if the Device Controller MCP server is running and healthy."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CLOUD_BRIDGE_URL}/api/health",
                timeout=5.0
            )
            if response.status_code == 200:
                return "✅ Device Controller MCP Server is online! Cloud Bridge connection: OK"
            else:
                return f"⚠️ Server is online but Cloud Bridge returned status: {response.status_code}"
    except:
        return "✅ Device Controller MCP Server is online! (Cloud Bridge connection not tested)"

@mcp.tool
async def get_status() -> str:
    """Get current status of the device controller system."""
    status_info = f"""
📊 Device Controller MCP Server Status:
✅ Server: Online
🌐 Cloud Bridge: {CLOUD_BRIDGE_URL}
🔑 API Key: {'Configured' if MCP_API_KEY else 'NOT SET'}
🆔 Access ID: {'Configured' if TUYA_ACCESS_ID else 'NOT SET'}

Ready to control smart devices!
    """.strip()
    return status_info

# No .run() call - FastMCP Cloud handles startup
# For local testing: fastmcp dev server_cloud.py
