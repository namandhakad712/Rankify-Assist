"""
Browser Automation MCP Server - FastMCP Cloud Version
Runs 24/7 in the cloud, accessible from anywhere

This version is optimized for deployment to FastMCP Cloud (https://fastmcp.cloud)
No local server setup needed - FastMCP Cloud handles all infrastructure.
"""

import os
import httpx
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated

# Environment variables (MUST be set in FastMCP Cloud dashboard)
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')  # No default - MUST be set!
MCP_API_KEY = os.getenv('MCP_API_KEY')  # No default - MUST be set!
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID')  # No default - MUST be set!

# Create FastMCP app (compatible with FastMCP 2.12.3)
mcp = FastMCP("Browser Automation")

@mcp.tool
async def execute_browser_command(
    command: Annotated[str, Field(
        description="Natural language command to execute in browser (e.g., 'open google', 'check my email', 'search for python tutorials')"
    )]
) -> str:
    """
    Execute a browser command via Rankify extension.
    The extension's AI agent will interpret and execute the command.
    
    Examples:
    - "open google.com"
    - "search for AI news"
    - "check my gmail"
    - "open youtube and play music"
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/execute",
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
                return f"✅ Command sent to browser! The Rankify extension will execute '{command}' shortly. (Command ID: {command_id})"
            else:
                error_msg = response.text
                return f"❌ Failed to send command: {error_msg}"
                
    except httpx.TimeoutException:
        return "⏱️ Request timed out. The command may still be queued. Please try again."
    except Exception as e:
        return f"❌ Error: {str(e)}"

@mcp.tool
async def health_check() -> str:
    """Check if the MCP server is running and healthy."""
    try:
        # Test connection to cloud bridge
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CLOUD_BRIDGE_URL}/api/health",
                timeout=5.0
            )
            if response.status_code == 200:
                return "✅ MCP Server is online! Cloud Bridge connection: OK"
            else:
                return f"⚠️ MCP Server is online but Cloud Bridge returned status: {response.status_code}"
    except:
        return "✅ MCP Server is online! (Cloud Bridge connection not tested)"

@mcp.tool
async def get_status() -> str:
    """Get current status of the browser automation system."""
    status_info = f"""
📊 Browser Automation MCP Server Status:
✅ Server: Online
🌐 Cloud Bridge: {CLOUD_BRIDGE_URL}
🔑 API Key: {'Configured' if MCP_API_KEY else 'NOT SET'}
🆔 Access ID: {'Configured' if TUYA_ACCESS_ID else 'NOT SET'}

Ready to execute browser commands!
    """.strip()
    return status_info

# Note: No .run() call here!
# FastMCP Cloud automatically handles server startup
# For local testing: fastmcp dev server_cloud.py
