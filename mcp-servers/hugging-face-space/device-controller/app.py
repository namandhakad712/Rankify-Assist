"""
Device Controller - Retro Pixel UI
Black & white terminal aesthetic
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

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize session state
if 'status_log' not in st.session_state:
    st.session_state.status_log = deque(maxlen=200)
if 'mcp_server_running' not in st.session_state:
    st.session_state.mcp_server_running = False
if 'tuya_client_connected' not in st.session_state:
    st.session_state.tuya_client_connected = False
if 'tuya_connection_time' not in st.session_state:
    st.session_state.tuya_connection_time = None
if 'initialized' not in st.session_state:
    st.session_state.initialized = False

def log_message(message, component="SYSTEM"):
    """Add timestamped message to log"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_entry = f"[{timestamp}] [{component}] {message}"
    st.session_state.status_log.append(log_entry)
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
    log_message(f"CMD: {command}", "MCP")
    
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
                log_message(f"OK ID:{command_id}", "MCP")
                return f"OK: {command} (ID:{command_id})"
            else:
                log_message(f"ERR {response.status_code}", "MCP")
                return f"ERROR: {response.text}"
    except Exception as e:
        log_message(f"ERR: {e}", "MCP")
        return f"ERROR: {str(e)}"

@mcp.tool
async def health_check() -> str:
    log_message("HEALTH CHECK", "MCP")
    return "OK: Device Controller MCP Online"

# ============================================================================
# TUYA CLIENT
# ============================================================================

async def start_tuya_client():
    """Start Tuya client"""
    
    try:
        log_message("INIT TUYA CLIENT", "TUYA")
        
        from mcp_sdk import MCPSdkClient
        log_message("SDK LOADED", "TUYA")
        
        TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT')
        TUYA_ACCESS_ID_SDK = os.getenv('MCP_ACCESS_ID')
        TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
        MCP_SERVER_URL = "http://localhost:7860/mcp"
        
        log_message(f"EP: {TUYA_ENDPOINT}", "TUYA")
        log_message(f"ID: {TUYA_ACCESS_ID_SDK[:20]}..." if TUYA_ACCESS_ID_SDK else "ID: NULL", "TUYA")
        
        if not all([TUYA_ENDPOINT, TUYA_ACCESS_ID_SDK, TUYA_ACCESS_SECRET]):
            log_message("ERR: MISSING CREDS", "TUYA")
            return
        
        log_message("CREATING CLIENT...", "TUYA")
        tuya_client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID_SDK,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=MCP_SERVER_URL
        )
        
        log_message("CONNECTING...", "TUYA")
        await tuya_client.connect()
        
        # Update session state
        st.session_state.tuya_client_connected = True
        st.session_state.tuya_connection_time = datetime.now()
        
        log_message("CONNECTED!", "TUYA")
        log_message("LISTENING...", "TUYA")
        
        await tuya_client.start_listening()
        
    except Exception as e:
        log_message(f"ERR: {e}", "TUYA")
        st.session_state.tuya_client_connected = False

def start_tuya_client_background():
    """Background thread"""
    log_message("START THREAD", "TUYA")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_tuya_client())

# Initialize once
if not st.session_state.initialized:
    log_message("=" * 40, "SYS")
    log_message("DEVICE CONTROLLER MCP", "SYS")
    log_message("=" * 40, "SYS")
    st.session_state.mcp_server_running = True
    
    tuya_thread = threading.Thread(target=start_tuya_client_background, daemon=True)
    tuya_thread.start()
    
    st.session_state.initialized = True
    log_message("INIT COMPLETE", "SYS")

# ============================================================================
# RETRO PIXEL UI
# ============================================================================

st.set_page_config(
    page_title="[ DEVICE MCP ]",
    page_icon="█",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Retro Terminal CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    
    * {
        font-family: 'VT323', monospace !important;
    }
    
    #MainMenu, footer, header {visibility: hidden;}
    
    .stApp {
        background: #000000;
        color: #ffffff;
    }
    
    /* Scanline effect */
    .stApp::before {
        content: " ";
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        z-index: 2;
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
    }
    
    h1 {
        color: #ffffff !important;
        font-size: 3.5rem !important;
        letter-spacing: 0.1em !important;
        text-shadow: 0 0 10px #fff, 0 0 20px #fff;
        font-weight: normal !important;
    }
    
    .subtitle {
        color: #aaa;
        font-size: 1.5rem;
        letter-spacing: 0.05em;
        margin-bottom: 30px;
    }
    
    .pixel-box {
        border: 3px solid #ffffff;
        padding: 20px;
        margin: 15px 0;
        background: #000;
        box-shadow: 0 0 20px rgba(255,255,255,0.3);
    }
    
    .status-line {
        font-size: 1.4rem;
        padding: 8px 0;
        letter-spacing: 0.05em;
        border-bottom: 1px dashed #333;
    }
    
    .status-line:last-child {
        border-bottom: none;
    }
    
    .label {
        color: #888;
        display: inline-block;
        width: 180px;
    }
    
    .value {
        color: #fff;
    }
    
    .ok {
        color: #0f0;
        text-shadow: 0 0 5px #0f0;
    }
    
    .err {
        color: #f00;
        text-shadow: 0 0 5px #f00;
    }
    
    .stTextArea textarea {
        background: #000 !important;
        color: #0f0 !important;
        border: 3px solid #0f0 !important;
        font-size: 1.2rem !important;
        letter-spacing: 0.05em !important;
        line-height: 1.4 !important;
        box-shadow: 0 0 20px rgba(0,255,0,0.3) !important;
    }
    
    .stButton > button {
        background: #000;
        color: #fff;
        border: 3px solid #fff;
        font-size: 1.5rem;
        letter-spacing: 0.1em;
        padding: 15px 30px;
        transition: all 0.2s;
    }
    
    .stButton > button:hover {
        background: #fff;
        color: #000;
        box-shadow: 0 0 20px #fff;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("<h1>[ DEVICE MCP ]</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>// TUYA BRIDGE v1.0 //</p>", unsafe_allow_html=True)

# Status
col1, col2 = st.columns(2)

with col1:
    st.markdown("<div class='pixel-box'>", unsafe_allow_html=True)
    
    mcp_status = '<span class="ok">[ ONLINE ]</span>' if st.session_state.mcp_server_running else '<span class="err">[ OFFLINE ]</span>'
    
    if st.session_state.tuya_client_connected and st.session_state.tuya_connection_time:
        uptime = datetime.now() - st.session_state.tuya_connection_time
        uptime_str = str(uptime).split('.')[0]
        tuya_status = f'<span class="ok">[ ONLINE ] {uptime_str}</span>'
    else:
        tuya_status = '<span class="err">[ OFFLINE ]</span>'
    
    st.markdown(f"""
    <div class='status-line'>
        <span class='label'>MCP_SERVER:</span>
        <span class='value'>{mcp_status}</span>
    </div>
    <div class='status-line'>
        <span class='label'>TUYA_CLIENT:</span>
        <span class='value'>{tuya_status}</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown("<div class='pixel-box'>", unsafe_allow_html=True)
    
    cloud_ok = '<span class="ok">[OK]</span>' if CLOUD_BRIDGE_URL else '<span class="err">[ERR]</span>'
    api_ok = '<span class="ok">[OK]</span>' if MCP_API_KEY else '<span class="err">[ERR]</span>'
    ep_ok = '<span class="ok">[OK]</span>' if os.getenv('MCP_ENDPOINT') else '<span class="err">[ERR]</span>'
    creds_ok = '<span class="ok">[OK]</span>' if os.getenv('MCP_ACCESS_ID') and os.getenv('MCP_ACCESS_SECRET') else '<span class="err">[ERR]</span>'
    
    st.markdown(f"""
    <div class='status-line'>
        <span class='label'>CLOUD_BRIDGE:</span>
        <span class='value'>{cloud_ok}</span>
    </div>
    <div class='status-line'>
        <span class='label'>API_KEY:</span>
        <span class='value'>{api_ok}</span>
    </div>
    <div class='status-line'>
        <span class='label'>TUYA_ENDPOINT:</span>
        <span class='value'>{ep_ok}</span>
    </div>
    <div class='status-line'>
        <span class='label'>CREDENTIALS:</span>
        <span class='value'>{creds_ok}</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

# Logs
st.markdown("<div class='pixel-box'>", unsafe_allow_html=True)
logs_text = "\n".join(list(st.session_state.status_log))
st.text_area("[ SYSTEM LOG ]", logs_text, height=350, label_visibility="visible")
st.markdown("</div>", unsafe_allow_html=True)

# Refresh
if st.button("[ REFRESH ]", use_container_width=True):
    st.rerun()

# Auto-refresh
import time
time.sleep(5)
st.rerun()
