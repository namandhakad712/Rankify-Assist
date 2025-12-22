"""
MCP Server - HTTP endpoint for Tuya SDK
Implements full MCP protocol
"""

import logging
import os
import httpx
import json
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

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
            'result': str(result)[:100]
        })
        
        with open(REQUESTS_FILE, 'w') as f:
            json.dump(requests[-50:], f)
    except:
        pass

CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID', 'tuya_mcp_user')

app = FastAPI()

async def execute_browser_command_impl(command: str) -> str:
    logger.info(f"TOOL: execute_browser_command('{command}')")
    
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
                logger.info(f"SUCCESS: ID {command_id}")
                
                result_msg = f"OK: {command} (ID:{command_id})"
                log_request('execute_browser_command', {'command': command}, result_msg)
                return result_msg
            else:
                logger.error(f"FAILED: {response.status_code}")
                error_msg = f"ERROR: {response.text}"
                log_request('execute_browser_command', {'command': command}, error_msg)
                return error_msg
                
    except Exception as e:
        logger.error(f"EXCEPTION: {e}")
        error_msg = f"ERROR: {str(e)}"
        log_request('execute_browser_command', {'command': command}, error_msg)
        return error_msg

@app.post("/mcp")
async def mcp_endpoint(request: Request):
    """Handle MCP protocol requests"""
    try:
        data = await request.json()
        method = data.get('method')
        request_id = data.get('id')
        
        logger.info(f"MCP REQUEST: {method}")
        
        # Handle initialize
        if method == 'initialize':
            return JSONResponse({
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "protocolVersion": "2025-11-25",
                    "capabilities": {
                        "tools": {}
                    },
                    "serverInfo": {
                        "name": "Browser Automation",
                        "version": "1.0.0"
                    }
                }
            })
        
        # Handle tools/list
        elif method == 'tools/list':
            return JSONResponse({
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "tools": [
                        {
                            "name": "execute_browser_command",
                            "description": "Execute browser command",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "command": {"type": "string", "description": "Command to execute"}
                                },
                                "required": ["command"]
                            }
                        },
                        {
                            "name": "health_check",
                            "description": "Health check",
                            "inputSchema": {"type": "object", "properties": {}}
                        }
                    ]
                }
            })
        
        # Handle tools/call
        elif method == 'tools/call':
            tool_name = data.get('params', {}).get('name')
            arguments = data.get('params', {}).get('arguments', {})
            
            if tool_name == 'execute_browser_command':
                command = arguments.get('command', '')
                result = await execute_browser_command_impl(command)
                return JSONResponse({
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "content": [{"type": "text", "text": result}]
                    }
                })
            
            elif tool_name == 'health_check':
                return JSONResponse({
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "content": [{"type": "text", "text": "OK: Browser MCP Server is healthy!"}]
                    }
                })
        
        logger.warning(f"Unknown method: {method}")
        return JSONResponse({
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"}
        })
        
    except Exception as e:
        logger.error(f"ERROR: {e}")
        return JSONResponse({
            "jsonrpc": "2.0",
            "id": data.get('id') if 'data' in locals() else None,
            "error": {"code": -32603, "message": str(e)}
        })

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("STARTING MCP HTTP SERVER")
    logger.info("=" * 60)
    logger.info(f"CLOUD_BRIDGE: {CLOUD_BRIDGE_URL}")
    logger.info(f"API_KEY: {'SET' if MCP_API_KEY else 'NOT SET'}")
    logger.info("Listening on http://0.0.0.0:7860/mcp")
    logger.info("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=7860, log_level="error")
