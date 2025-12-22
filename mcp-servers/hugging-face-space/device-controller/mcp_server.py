"""
MCP Server - Device Controller Tools
Runs FastMCP HTTP server with device control tools
"""

import logging
import os
from typing import Annotated
from pydantic import Field
import httpx
import json
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [MCP-SERVER] - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/mcp_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

REQUESTS_FILE = '/tmp/mcp_requests.json'

def log_request(tool_name, args, result):
    """Log request for UI"""
    try:
        requests = []
        try:
            with open(REQUESTS_FILE, 'r') as f:
                requests = json.load(f)
        except:
            pass
        
        requests.append({
            'timestamp': datetime.now().isoformat(),
            'tool': tool_name,
            'args': str(args)[:100],
            'result': str(result)[:100],
            'flow': 'TUYA→MCP→BRIDGE→DEVICE'
        })
        
        requests = requests[-50:]
        
        with open(REQUESTS_FILE, 'w') as f:
            json.dump(requests, f)
    except Exception as e:
        logger.error(f"Failed to log: {e}")

CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID', 'tuya_mcp_user')

from fastmcp import FastMCP

mcp = FastMCP("Device Controller")

@mcp.tool
async def control_device(
    command: Annotated[str, Field(description="Device control command")]
) -> str:
    """Control smart devices"""
    logger.info(f"TOOL CALLED: control_device('{command}')")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CLOUD_BRIDGE_URL}/api/execute",
                json={
                    "userId": "tuya_ai",
                    "apiKey": MCP_API_KEY,
                    "accessId": TUYA_ACCESS_ID,
                    "command": command,
                    "type": "device_control"
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                result = response.json()
                command_id = result.get('commandId', 'unknown')
                logger.info(f"SUCCESS: ID: {command_id}")
                
                result_msg = f"OK: {command} (ID:{command_id})"
                log_request('control_device', {'command': command}, result_msg)
                return result_msg
            else:
                logger.error(f"FAILED: {response.status_code}")
                error_msg = f"ERROR: {response.text}"
                log_request('control_device', {'command': command}, error_msg)
                return error_msg
                
    except Exception as e:
        logger.error(f"EXCEPTION: {e}")
        error_msg = f"ERROR: {str(e)}"
        log_request('control_device', {'command': command}, error_msg)
        return error_msg

@mcp.tool
async def health_check() -> str:
    """Health check"""
    logger.info("TOOL CALLED: health_check()")
    return "OK: Device Controller is healthy!"

if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("STARTING DEVICE CONTROLLER MCP SERVER")
    logger.info("=" * 60)
    logger.info(f"CLOUD_BRIDGE_URL: {CLOUD_BRIDGE_URL}")
    logger.info(f"MCP_API_KEY: {'SET' if MCP_API_KEY else 'NOT SET'}")
    logger.info("=" * 60)
    
    import uvicorn
    uvicorn.run(mcp.app, host="0.0.0.0", port=7860)
