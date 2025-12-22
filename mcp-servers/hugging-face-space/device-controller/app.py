"""
Device Controller - Beautiful Minimalist UI
Glassmorphism aesthetic with professional design
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
# STREAMLIT UI - MINIMALIST GLASS AESTHETIC
# ============================================================================

st.set_page_config(
    page_title="Device Controller",
    page_icon="🏠",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS - Glassmorphism & Minimalist Design
st.markdown("""
<style>
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Background with noise texture */
    .stApp {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        background-attachment: fixed;
    }
    
    /* Add noise overlay */
    .stApp::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 0;
    }
    
    /* Glass cards */
    .glass-card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 24px;
        margin: 12px 0;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    
    /* Text styling */
    h1 {
        color: white !important;
        font-weight: 300 !important;
        font-size: 2.5rem !important;
        letter-spacing: -0.02em !important;
        margin-bottom: 8px !important;
    }
    
    .subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.95rem;
        font-weight: 300;
        margin-bottom: 32px;
    }
    
    /* Status indicators */
    .status-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 0.9rem;
    }
    
    .status-item:last-child {
        border-bottom: none;
    }
    
    .status-label {
        opacity: 0.7;
        min-width: 140px;
    }
    
    .status-value {
        font-weight: 500;
    }
    
    /* Buttons */
    .stButton > button {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 12px 24px;
        font-weight: 400;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    .stButton > button:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
    }
    
    /* Text area (logs) */
    .stTextArea > div > div > textarea {
        background: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
        color: white !important;
        font-family: 'SF Mono', 'Monaco', 'Consolas', monospace !important;
        font-size: 0.85rem !important;
        line-height: 1.6 !important;
        backdrop-filter: blur(10px);
    }
    
    /* Columns */
    .stColumn {
        padding: 0 8px;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("<h1>🏠 Device Controller</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Tuya MCP Bridge • Docker Container</p>", unsafe_allow_html=True)

# Status Cards
col1, col2 = st.columns(2)

with col1:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    
    mcp_status = "✅ Running" if mcp_server_running else "❌ Not Running"
    
    if tuya_client_connected and tuya_connection_time:
        uptime = datetime.now() - tuya_connection_time
        uptime_str = str(uptime).split('.')[0]
        tuya_status = f"✅ Connected • {uptime_str}"
    else:
        tuya_status = "❌ Disconnected"
    
    st.markdown(f"""
    <div class='status-item'>
        <span class='status-label'>MCP Server</span>
        <span class='status-value'>{mcp_status}</span>
    </div>
    <div class='status-item'>
        <span class='status-label'>Tuya Client</span>
        <span class='status-value'>{tuya_status}</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    
    st.markdown(f"""
    <div class='status-item'>
        <span class='status-label'>Cloud Bridge</span>
        <span class='status-value'>{'✅' if CLOUD_BRIDGE_URL else '❌'}</span>
    </div>
    <div class='status-item'>
        <span class='status-label'>API Key</span>
        <span class='status-value'>{'✅' if MCP_API_KEY else '❌'}</span>
    </div>
    <div class='status-item'>
        <span class='status-label'>Tuya Endpoint</span>
        <span class='status-value'>{'✅' if os.getenv('MCP_ENDPOINT') else '❌'}</span>
    </div>
    <div class='status-item'>
        <span class='status-label'>Credentials</span>
        <span class='status-value'>{'✅' if os.getenv('MCP_ACCESS_ID') and os.getenv('MCP_ACCESS_SECRET') else '❌'}</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

# Logs
st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
logs_text = "\n".join(list(status_log))
st.text_area("Live Logs", logs_text, height=350, label_visibility="collapsed")
st.markdown("</div>", unsafe_allow_html=True)

# Refresh button - FIXED
if st.button("🔄 Refresh", use_container_width=True):
    st.rerun()

# Auto-refresh every 5 seconds
import time
time.sleep(5)
st.rerun()
