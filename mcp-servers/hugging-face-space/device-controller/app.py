"""
Device Controller - Streamlit UI
Simple, clean monitoring interface
"""

import streamlit as st
import asyncio
import logging
import os
import threading
import httpx
from datetime import datetime
from collections import deque
from typing import Annotated
from pydantic import Field
import time

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

# Environment
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')
TUYA_ACCESS_ID = os.getenv('TUYA_ACCESS_ID', 'tuya_mcp_user')

# ============================================================================
# MCP SERVER
# ============================================================================

from fastmcp import FastMCP

mcp = FastMCP("Device Controller")

@mcp.tool
async def control_device(
    command: Annotated[str, Field(description="Device control command")]
) -> str:
    """Control smart devices"""
    log_message(f"control_device('{command}')", "MCP-SERVER")
    
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
                log_message(f"✅ Device command sent! ID: {command_id}", "MCP-SERVER")
                return f"✅ '{command}' sent! (ID: {command_id})"
            else:
                log_message(f"❌ Failed: {response.status_code}", "MCP-SERVER")
                return f"❌ Failed: {response.text}"
    except Exception as e:
        log_message(f"❌ Error: {e}", "MCP-SERVER")
        return f"❌ Error: {str(e)}"

@mcp.tool
async def health_check() -> str:
    """Health check"""
    log_message("Health check", "MCP-SERVER")
    return "✅ Device Controller MCP Server is healthy!"

# ============================================================================
# TUYA CLIENT
# ============================================================================

tuya_client = None

async def start_tuya_client():
    """Start Tuya client"""
    global tuya_client, tuya_client_connected, tuya_connection_time
    
    try:
        log_message("🚀 Starting Tuya Client...", "TUYA-CLIENT")
        
        from mcp_sdk import MCPSdkClient
        log_message("✅ MCP SDK imported", "TUYA-CLIENT")
        
        TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT')
        TUYA_ACCESS_ID_SDK = os.getenv('MCP_ACCESS_ID')
        TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
        MCP_SERVER_URL = "http://localhost:7860/mcp"
        
        log_message(f"Endpoint: {TUYA_ENDPOINT}", "TUYA-CLIENT")
        log_message(f"Access ID: {TUYA_ACCESS_ID_SDK[:20] + '...' if TUYA_ACCESS_ID_SDK else 'NOT SET'}", "TUYA-CLIENT")
        
        if not all([TUYA_ENDPOINT, TUYA_ACCESS_ID_SDK, TUYA_ACCESS_SECRET]):
            log_message("❌ Missing credentials!", "TUYA-CLIENT")
            return
        
        log_message("📡 Creating SDK client...", "TUYA-CLIENT")
        tuya_client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID_SDK,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=MCP_SERVER_URL
        )
        
        log_message("🔌 Connecting...", "TUYA-CLIENT")
        await tuya_client.connect()
        
        tuya_client_connected = True
        tuya_connection_time = datetime.now()
        
        log_message("✅ Connected to Tuya Platform!", "TUYA-CLIENT")
        log_message("🎧 Listening for device commands...", "TUYA-CLIENT")
        
        await tuya_client.start_listening()
        
    except Exception as e:
        log_message(f"❌ Error: {e}", "TUYA-CLIENT")
        tuya_client_connected = False

def start_tuya_client_background():
    """Background thread for Tuya client"""
    log_message("🌟 Starting background thread...", "TUYA-CLIENT")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_tuya_client())

# Start everything
log_message("🎬 Starting Device Controller Bridge...", "SYSTEM")
mcp_server_running = True

tuya_thread = threading.Thread(target=start_tuya_client_background, daemon=True)
tuya_thread.start()

log_message("✅ Both components initialized!", "SYSTEM")

# ============================================================================
# STREAMLIT UI
# ============================================================================

st.set_page_config(
    page_title="Device Controller MCP Bridge",
    page_icon="🏠",
    layout="wide"
)

st.title("🏠 Device Controller - Tuya MCP Bridge")
st.markdown("**All-in-One:** Tuya Client + MCP Server in Docker container")

# Status
col1, col2 = st.columns(2)

with col1:
    st.subheader("📊 Status")
    
    mcp_status = "✅ Running" if mcp_server_running else "❌ Not Running"
    st.write(f"**MCP Server:** {mcp_status}")
    
    if tuya_client_connected and tuya_connection_time:
        uptime = datetime.now() - tuya_connection_time
        uptime_str = str(uptime).split('.')[0]
        st.write(f"**Tuya Client:** ✅ Connected (Uptime: {uptime_str})")
    else:
        st.write("**Tuya Client:** ❌ Disconnected")

with col2:
    st.subheader("⚙️ Configuration")
    st.write(f"**CLOUD_BRIDGE_URL:** {'✅' if CLOUD_BRIDGE_URL else '❌'}")
    st.write(f"**MCP_API_KEY:** {'✅' if MCP_API_KEY else '❌'}")
    st.write(f"**MCP_ENDPOINT:** {'✅' if os.getenv('MCP_ENDPOINT') else '❌'}")
    st.write(f"**MCP_ACCESS_ID:** {'✅' if os.getenv('MCP_ACCESS_ID') else '❌'}")
    st.write(f"**MCP_ACCESS_SECRET:** {'✅' if os.getenv('MCP_ACCESS_SECRET') else '❌'}")

# Logs
st.subheader("📋 Live Logs")
logs_text = "\n".join(list(status_log))
st.text_area("Logs", logs_text, height=400, key="logs")

# Auto-refresh
if st.button("🔄 Refresh"):
    st.rerun()

# Auto-refresh every 5 seconds
placeholder = st.empty()
time.sleep(5)
st.rerun()
