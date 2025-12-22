"""
Browser Automation UI - With Live Request Flow Animation
"""

import streamlit as st
import os
import json
from datetime import datetime

STATUS_FILE = '/tmp/tuya_status.json'
LOG_FILE = '/tmp/tuya_client.log'
REQUESTS_FILE = '/tmp/mcp_requests.json'

def read_tuya_status():
    try:
        with open(STATUS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {'connected': False, 'message': 'INITIALIZING...'}

def read_logs():
    try:
        with open(LOG_FILE, 'r') as f:
            lines = f.readlines()
            return ''.join(lines[-30:])
    except:
        return "No logs..."

def read_requests():
    """Read recent MCP requests"""
    try:
        with open(REQUESTS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')

st.set_page_config(
    page_title="[ BROWSER MCP ]",
    page_icon="█",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Retro CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    
    * { font-family: 'VT323', monospace !important; }
    #MainMenu, footer, header {visibility: hidden;}
    .stApp { background: #000; color: #fff; }
    
    .stApp::before {
        content: " ";
        display: block;
        position: fixed;
        top: 0; left: 0; bottom: 0; right: 0;
        background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%);
        background-size: 100% 2px;
        z-index: 2;
        pointer-events: none;
    }
    
    h1 {
        color: #fff !important;
        font-size: 3rem !important;
        letter-spacing: 0.1em !important;
        text-shadow: 0 0 10px #fff;
    }
    
    .subtitle { color: #aaa; font-size: 1.3rem; margin-bottom: 20px; }
    
    .pixel-box {
        border: 3px solid #fff;
        padding: 15px;
        margin: 10px 0;
        background: #000;
        box-shadow: 0 0 20px rgba(255,255,255,0.3);
    }
    
    .status-line {
        font-size: 1.3rem;
        padding: 6px 0;
        border-bottom: 1px dashed #333;
    }
    .status-line:last-child { border-bottom: none; }
    
    .label { color: #888; display: inline-block; width: 150px; }
    .value { color: #fff; }
    .ok { color: #0f0; text-shadow: 0 0 5px #0f0; }
    .err { color: #f00; text-shadow: 0 0 5px #f00; }
    
    /* LIVE REQUEST FLOW ANIMATION */
    .flow-box {
        border: 3px solid #0f0;
        padding: 15px;
        margin: 10px 0;
        background: #000;
        box-shadow: 0 0 20px rgba(0,255,0,0.3);
    }
    
    .flow-arrow {
        color: #0f0;
        font-size: 2rem;
        text-align: center;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
    
    .request-item {
        font-size: 1.1rem;
        padding: 5px;
        border-bottom: 1px solid #333;
        color: #0f0;
    }
    
    .stTextArea textarea {
        background: #000 !important;
        color: #0f0 !important;
        border: 3px solid #0f0 !important;
        font-size: 1.1rem !important;
    }
    
    .stButton > button {
        background: #000;
        color: #fff;
        border: 3px solid #fff;
        font-size: 1.4rem;
        padding: 12px 24px;
    }
    .stButton > button:hover {
        background: #fff;
        color: #000;
    }
</style>
""", unsafe_allow_html=True)

st.markdown("<h1>[ BROWSER MCP ]</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>// TUYA BRIDGE v1.0 //</p>", unsafe_allow_html=True)

tuya_status = read_tuya_status()
requests = read_requests()

# Status
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
        <span class='label'>CREDENTIALS:</span>
        <span class='value'>{creds_ok}</span>
    </div>
    <div class='status-line'>
        <span class='label'>REQUESTS:</span>
        <span class='value'><span class="ok">{len(requests)}</span></span>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# LIVE REQUEST FLOW ANIMATION
st.markdown("<div class='flow-box'>", unsafe_allow_html=True)
st.markdown("<h2 style='color:#0f0; font-size:1.8rem;'>[ LIVE REQUEST FLOW ]</h2>", unsafe_allow_html=True)

if requests:
    latest = requests[-1]
    st.markdown(f"""
    <div class='flow-arrow'>
    TUYA ↓
    </div>
    <div class='request-item'>
    TOOL: {latest['tool']}<br>
    ARGS: {latest['args']}
    </div>
    <div class='flow-arrow'>
    ↓ MCP ↓
    </div>
    <div class='request-item'>
    PROCESSING...
    </div>
    <div class='flow-arrow'>
    ↓ BRIDGE ↓
    </div>
    <div class='request-item'>
    RESULT: {latest['result']}
    </div>
    <div class='flow-arrow'>
    ↓ EXT ↓
    </div>
    """, unsafe_allow_html=True)
    
    # Recent requests
    st.markdown("<h3 style='color:#0f0; font-size:1.5rem; margin-top:20px;'>Recent Requests:</h3>", unsafe_allow_html=True)
    for req in reversed(requests[-5:]):
        timestamp = req['timestamp'].split('T')[1][:8]
        st.markdown(f"<div class='request-item'>[{timestamp}] {req['tool']} → {req['result'][:50]}</div>", unsafe_allow_html=True)
else:
    st.markdown("<div style='color:#888; text-align:center; padding:20px;'>WAITING FOR REQUESTS...</div>", unsafe_allow_html=True)

st.markdown("</div>", unsafe_allow_html=True)

# Logs
st.markdown("<div class='pixel-box'>", unsafe_allow_html=True)
logs_text = read_logs()
st.text_area("[ SYSTEM LOG ]", logs_text, height=250, label_visibility="visible")
st.markdown("</div>", unsafe_allow_html=True)

if st.button("[ REFRESH ]", use_container_width=True):
    st.rerun()

import time
time.sleep(5)
st.rerun()
