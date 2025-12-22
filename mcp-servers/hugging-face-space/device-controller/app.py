"""
Device Controller UI - Minimal Black & White Glass
"""

import streamlit as st
import os
import json

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
    try:
        with open(REQUESTS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL')
MCP_API_KEY = os.getenv('MCP_API_KEY')

st.set_page_config(
    page_title="Device Controller",
    page_icon="⬛",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Minimal Black & White Glass CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
    
    * {
        font-family: 'Inter', sans-serif !important;
    }
    
    #MainMenu, footer, header {visibility: hidden;}
    
    .stApp {
        background: #0a0a0a;
        color: #fff;
    }
    
    /* Noise grain overlay */
    .stApp::before {
        content: '';
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        opacity: 0.03;
        z-index: 0;
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E");
    }
    
    h1 {
        color: #fff !important;
        font-size: 2rem !important;
        font-weight: 300 !important;
        letter-spacing: -0.02em !important;
        margin-bottom: 8px !important;
    }
    
    .subtitle {
        color: rgba(255,255,255,0.5);
        font-size: 0.875rem;
        font-weight: 300;
        margin-bottom: 32px;
    }
    
    /* Glass cards */
    .glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin: 12px 0;
    }
    
    .status-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        font-size: 0.875rem;
    }
    .status-row:last-child { border-bottom: none; }
    
    .label {
        color: rgba(255,255,255,0.5);
        font-weight: 300;
    }
    
    .value { color: #fff; font-weight: 400; }
    .ok { color: #fff; }
    .err { color: rgba(255,255,255,0.3); }
    
    /* Request flow */
    .flow-item {
        font-size: 0.8rem;
        padding: 8px 12px;
        margin: 6px 0;
        background: rgba(255,255,255,0.02);
        border-left: 2px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.7);
    }
    
    .stTextArea textarea {
        background: rgba(0,0,0,0.4) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 8px !important;
        color: rgba(255,255,255,0.8) !important;
        font-size: 0.8rem !important;
        font-family: 'SF Mono', monospace !important;
        line-height: 1.6 !important;
    }
    
    .stButton > button {
        background: rgba(255,255,255,0.05);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        padding: 12px;
        font-weight: 400;
        font-size: 0.875rem;
        transition: all 0.2s;
    }
    
    .stButton > button:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.3);
    }
</style>
""", unsafe_allow_html=True)

st.markdown("<h1>Device Controller</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Tuya MCP Bridge</p>", unsafe_allow_html=True)

tuya_status = read_tuya_status()
requests = read_requests()

col1, col2 = st.columns(2)

with col1:
    st.markdown("<div class='glass'>", unsafe_allow_html=True)
    
    mcp_status = 'Online'
    
    if tuya_status['connected']:
        tuya_display = 'Connected'
    else:
        tuya_display = 'Disconnected'
    
    st.markdown(f"""
    <div class='status-row'>
        <span class='label'>MCP Server</span>
        <span class='value ok'>{mcp_status}</span>
    </div>
    <div class='status-row'>
        <span class='label'>Tuya Client</span>
        <span class='value {"ok" if tuya_status["connected"] else "err"}'>{tuya_display}</span>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown("<div class='glass'>", unsafe_allow_html=True)
    
    st.markdown(f"""
    <div class='status-row'>
        <span class='label'>Cloud Bridge</span>
        <span class='value {"ok" if CLOUD_BRIDGE_URL else "err"}'>{'Set' if CLOUD_BRIDGE_URL else 'Not Set'}</span>
    </div>
    <div class='status-row'>
        <span class='label'>Credentials</span>
        <span class='value {"ok" if os.getenv("MCP_ACCESS_ID") else "err"}'>{'Set' if os.getenv("MCP_ACCESS_ID") else 'Not Set'}</span>
    </div>
    <div class='status-row'>
        <span class='label'>Requests</span>
        <span class='value ok'>{len(requests)}</span>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# Request Flow
st.markdown("<div class='glass'>", unsafe_allow_html=True)
st.markdown("<h3 style='font-size:1rem; font-weight:400; margin-bottom:12px;'>Request Flow</h3>", unsafe_allow_html=True)

if requests:
    for req in reversed(requests[-5:]):
        timestamp = req['timestamp'].split('T')[1][:8]
        st.markdown(f"<div class='flow-item'>[{timestamp}] {req['tool']} → {req['result'][:60]}</div>", unsafe_allow_html=True)
else:
    st.markdown("<div style='color:rgba(255,255,255,0.3); text-align:center; padding:20px; font-size:0.875rem;'>Waiting for requests...</div>", unsafe_allow_html=True)

st.markdown("</div>", unsafe_allow_html=True)

# Logs
st.markdown("<div class='glass'>", unsafe_allow_html=True)
logs_text = read_logs()
st.text_area("System Log", logs_text, height=250, label_visibility="visible")
st.markdown("</div>", unsafe_allow_html=True)

if st.button("Refresh", use_container_width=True):
    st.rerun()

import time
time.sleep(5)
st.rerun()
