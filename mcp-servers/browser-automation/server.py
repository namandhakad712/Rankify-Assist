"""
Browser Automation MCP Server - CORRECT VERSION
Just forwards commands from Tuya to Cloud Bridge
The Extension AI Agent does the actual work!
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

print("🌐 Browser Automation MCP Server (Command Forwarder)")
print("=" * 50)
print(f"Cloud Bridge: {CLOUD_BRIDGE_URL}")
print("=" * 50)

# Create FastMCP app
mcp = FastMCP("Browser Automation")

# Single tool - just forward the command!
@mcp.tool
async def execute_browser_command(
    command: Annotated[str, Field(description="Natural language command to execute in browser (e.g., 'open google', 'check my email')")]
) -> str:
    """
    Execute a browser command via Rankify extension.
    The extension's AI agent will interpret and execute the command.
    """
    logger.info(f"📨 Received command from Tuya: {command}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/execute",  # ← FIXED: Correct endpoint
                json={
                    "userId": "tuya_ai",  # Legacy field, not used anymore
                    "apiKey": MCP_API_KEY,  # ← FIXED: Send in body, not header
                    "accessId": TUYA_ACCESS_ID,  # Send the Access ID!
                    "command": command
                },
                timeout=15.0  # Shorter timeout since we're not waiting for execution
            )
            
            if response.status_code == 200:
                result = response.json()
                command_id = result.get('commandId')
                logger.info(f"✅ Command queued! ID: {command_id}")
                return f"✅ Command sent! The browser extension will execute it shortly. (ID: {command_id})"
            else:
                error_msg = response.text
                logger.error(f"❌ Cloud Bridge error {response.status_code}: {error_msg}")
                return f"❌ Failed: {error_msg}"
                
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        return f"❌ Error: {str(e)}"

# Main entry point
if __name__ == "__main__":
    logger.info("🚀 Starting Browser Automation MCP Server (Command Forwarder)...")
    logger.info("📡 Commands will be forwarded to cloud bridge")
    logger.info("🤖 Extension AI Agent will execute commands")
    logger.info("🌐 Server will run on http://localhost:8767")
    
    # Run HTTP server
    mcp.run(transport="http", host="localhost", port=8767)
