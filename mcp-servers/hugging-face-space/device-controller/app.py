"""
Device Controller - Retro UI
READS status from persistent Tuya client process
"""

import streamlit as st
import os
import json
from datetime import datetime

STATUS_FILE = '/tmp/tuya_status.json'
LOG_FILE = '/tmp/tuya_client.log'

def read_tuya_status():
    """Read status from Tuya client"""
    try:
        with open(STATUS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {'connected': False, 'message': 'INITIALIZING...', 'timestamp': None}

def read_logs():
    """Read logs"""
    try:
        with open(LOG_FILE, 'r') as f:
            lines = f.readlines()
            return ''.join(lines[-50:])
    except:
        return "No logs yet..."

# Environment
CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')

# ============================================================================
# RETRO UI
# ============================================================================

st.set_page_config(
    page_title="[ DEVICE MCP ]",
    page_icon="█",
    layout="wide",
    initial_sidebar_state="collapsed"
)

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

st.markdown("<h1>[ DEVICE MCP ]</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>// TUYA BRIDGE v1.0 //</p>", unsafe_allow_html=True)

tuya_status = read_tuya_status()

col1, col2 = st.columns(2)

with col1:
    st.markdown("<div class='pixel-box'>", unsafe_allow_html=True)
    
    mcp_status = '<span class="ok">[ ONLINE ]</span>'
    
    if tuya_status['connected']:
        status_display = '<span class="ok">[ ONLINE ]</span>'
    else:
        status_display = f'<span class="err">[ OFFLINE ]</span><br><small>{tuya_status["message"]}</small>'
    
    st.markdown(f"""
    <div class='status-line'>
        <span class='label'>MCP_SERVER:</span>
        <span class='value'>{mcp_status}</span>
    </div>
    <div class='status-line'>
        <span class='label'>TUYA_CLIENT:</span>
        <span class='value'>{status_display}</span>
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

st.markdown("<div class='pixel-box'>", unsafe_allow_html=True)
logs_text = read_logs()
st.text_area("[ TUYA CLIENT LOG ]", logs_text, height=350, label_visibility="visible")
st.markdown("</div>", unsafe_allow_html=True)

if st.button("[ REFRESH ]", use_container_width=True):
    st.rerun()

import time
time.sleep(5)
st.rerun()
