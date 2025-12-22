#!/bin/bash
# Entrypoint - Starts all 3 processes!

# 1. Start MCP server (with tools) - CRITICAL!
python /app/mcp_server.py &
echo "MCP Server starting on port 7860..."
sleep 3

# 2. Start Tuya client (connects to MCP server)
python /app/tuya_client.py &
echo "Tuya client starting..."
sleep 2

# 3. Start Streamlit UI (foreground)
echo "Starting UI..."
streamlit run /app/app.py --server.port=8501 --server.address=0.0.0.0
