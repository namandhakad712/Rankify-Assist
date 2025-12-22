"""
Device Controller - Combined Tuya MCP Bridge
All-in-one Hugging Face Space deployment

Runs BOTH:
1. Tuya Client - Connects to Tuya Platform
2. MCP Server - Handles device control tools

In a SINGLE deployment! No FastMCP Cloud needed!
"""

import gradio as gr
import asyncio
import logging
import os
import threading
import httpx
from datetime import datetime
from collections import deque
from typing import Annotated
from pydantic import Field

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Logs storage
status_log = deque(maxlen=200)
mcp_server_running = False
tuya_client_connected = False
tuya_connection_time = None

def log_message(message, component="SYSTEM"):
    """Add timestamped message to log"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_entry = f"[{timestamp}] [{component}] {message}"
    status_log.append(log_entry)
    logger.info(f"[{component}] {message}")

# ============================================================================
# MCP SERVER - Device Control Tools
# ============================================================================

from fastmcp import FastMCP

CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID', 'tuya_mcp_user')

mcp = FastMCP("Device Controller")

@mcp.tool
async def control_device(
    command: Annotated[str, Field(description="Natural language command to control smart devices")]
) -> str:
    """Control smart devices (lights, AC, fans, etc.)"""
    log_message(f"Tool called: control_device('{command}')", "MCP-SERVER")
    
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
                log_message(f"✅ Command sent! ID: {command_id}", "MCP-SERVER")
                return f"✅ Device command '{command}' sent! (ID: {command_id})"
            else:
                log_message(f"❌ Failed: {response.status_code}", "MCP-SERVER")
                return f"❌ Failed: {response.text}"
                
    except Exception as e:
        log_message(f"❌ Error: {e}", "MCP-SERVER")
        return f"❌ Error: {str(e)}"

@mcp.tool
async def health_check() -> str:
    """Check if MCP server is healthy"""
    log_message("Health check called", "MCP-SERVER")
    return "✅ Device Controller MCP Server is online!"

@mcp.tool
async def get_status() -> str:
    """Get current status of the device controller system"""
    log_message("Status check called", "MCP-SERVER")
    status = f"""
📊 Device Controller MCP Server Status:
✅ Server: Online
🌐 Cloud Bridge: {CLOUD_BRIDGE_URL or 'NOT SET'}
🔑 API Key: {'Configured' if MCP_API_KEY else 'NOT SET'}

Ready to control smart devices!
    """.strip()
    return status

# ============================================================================
# TUYA CLIENT - Connects to Tuya Platform
# ============================================================================

tuya_client = None

async def start_tuya_client():
    """Start Tuya MCP client"""
    global tuya_client, tuya_client_connected, tuya_connection_time
    
    try:
        log_message("🚀 Starting Tuya Client...", "TUYA-CLIENT")
        
        # Import SDK
        try:
            from mcp_sdk import MCPSdkClient
            log_message("✅ MCP SDK imported", "TUYA-CLIENT")
        except ImportError:
            log_message("❌ MCP SDK not installed!", "TUYA-CLIENT")
            return
        
        # Get credentials
        TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT')
        TUYA_ACCESS_ID_SDK = os.getenv('MCP_ACCESS_ID')
        TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
        MCP_SERVER_URL = "http://localhost:7860/mcp"
        
        log_message(f"Tuya Endpoint: {TUYA_ENDPOINT or 'NOT SET'}", "TUYA-CLIENT")
        log_message(f"Access ID: {TUYA_ACCESS_ID_SDK[:20] + '...' if TUYA_ACCESS_ID_SDK else 'NOT SET'}", "TUYA-CLIENT")
        log_message(f"MCP Server: {MCP_SERVER_URL}", "TUYA-CLIENT")
        
        if not all([TUYA_ENDPOINT, TUYA_ACCESS_ID_SDK, TUYA_ACCESS_SECRET]):
            log_message("❌ Missing Tuya credentials!", "TUYA-CLIENT")
            return
        
        # Create SDK client
        log_message("📡 Creating SDK client...", "TUYA-CLIENT")
        tuya_client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID_SDK,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=MCP_SERVER_URL
        )
        
        # Connect
        log_message("🔌 Connecting to Tuya Platform...", "TUYA-CLIENT")
        await tuya_client.connect()
        
        tuya_client_connected = True
        tuya_connection_time = datetime.now()
        
        log_message("✅ Connected to Tuya Platform!", "TUYA-CLIENT")
        log_message("✅ Forwarding to local MCP server", "TUYA-CLIENT")
        log_message("🎧 Listening for device control requests...", "TUYA-CLIENT")
        
        # Keep listening
        await tuya_client.start_listening()
        
    except Exception as e:
        log_message(f"❌ Error: {e}", "TUYA-CLIENT")
        tuya_client_connected = False
        import traceback
        log_message(f"Traceback: {traceback.format_exc()}", "TUYA-CLIENT")

def start_tuya_client_background():
    """Start Tuya client in background"""
    log_message("🌟 Starting Tuya client thread...", "TUYA-CLIENT")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_tuya_client())

# ============================================================================
# INITIALIZATION
# ============================================================================

log_message("=" * 60, "SYSTEM")
log_message("🎬 Device Controller MCP Bridge Starting...", "SYSTEM")
log_message("=" * 60, "SYSTEM")

mcp_server_running = True
log_message("✅ MCP server initialized", "SYSTEM")

tuya_thread = threading.Thread(target=start_tuya_client_background, daemon=True)
tuya_thread.start()
log_message("✅ Tuya client thread started", "SYSTEM")

log_message("=" * 60, "SYSTEM")
log_message("🎉 Both components running!", "SYSTEM")
log_message("=" * 60, "SYSTEM")

# ============================================================================
# GRADIO WEB UI
# ============================================================================

def get_status():
    """Get current status"""
    
    mcp_status = "✅ Running" if mcp_server_running else "❌ Not Running"
    
    if tuya_client_connected and tuya_connection_time:
        uptime = datetime.now() - tuya_connection_time
        uptime_str = str(uptime).split('.')[0]
        tuya_status = f"✅ Connected (Uptime: {uptime_str})"
    else:
        tuya_status = "❌ Disconnected"
    
    overall = f"""
🔧 MCP Server (Devices): {mcp_status}
🔌 Tuya Client: {tuya_status}
    """.strip()
    
    logs = "\n".join(list(status_log))
    
    config = f"""
MCP Server:
• CLOUD_BRIDGE_URL: {'✅' if CLOUD_BRIDGE_URL else '❌'}
• MCP_API_KEY: {'✅' if MCP_API_KEY else '❌'}

Tuya Client:
• MCP_ENDPOINT: {'✅' if os.getenv('MCP_ENDPOINT') else '❌'}
• MCP_ACCESS_ID: {'✅' if os.getenv('MCP_ACCESS_ID') else '❌'}
• MCP_ACCESS_SECRET: {'✅' if os.getenv('MCP_ACCESS_SECRET') else '❌'}
    """.strip()
    
    return overall, logs, config

with gr.Blocks(title="Device Controller MCP Bridge", theme=gr.themes.Soft(primary_hue="green")) as demo:
    
    gr.Markdown("# 🏠 Device Controller - Tuya MCP Bridge")
    gr.Markdown("**All-in-One:** Tuya Client + Device Control MCP Server")
    
    with gr.Row():
        status_box = gr.Textbox(label="📊 Status", lines=3, interactive=False)
        config_box = gr.Textbox(label="⚙️ Configuration", lines=8, interactive=False)
    
    with gr.Row():
        logs_box = gr.Textbox(label="📋 Live Logs", lines=25, interactive=False)
    
    refresh_btn = gr.Button("🔄 Refresh Status", variant="primary")
    
    gr.Markdown("""
    ### 🎯 This Space Does:
    - ✅ Connects to Tuya Platform (24/7)
    - ✅ Handles device control tools
    - ✅ Controls lights, AC, fans, etc.
    - ✅ Real-time monitoring
    
    ### 📝 Required Environment Variables:
    Set in **Settings → Variables and secrets**:
    - `CLOUD_BRIDGE_URL`
    - `MCP_API_KEY`
    - `MCP_ENDPOINT`
    - `MCP_ACCESS_ID`
    - `MCP_ACCESS_SECRET`
    """)
    
    refresh_btn.click(fn=get_status, outputs=[status_box, logs_box, config_box])
    demo.load(fn=get_status, outputs=[status_box, logs_box, config_box], every=5)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, show_error=True)
