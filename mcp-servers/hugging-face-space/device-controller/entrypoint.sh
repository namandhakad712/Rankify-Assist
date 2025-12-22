#!/bin/bash
# Entrypoint - Device Controller

# 1. Start MCP server with tools
python /app/mcp_server.py &
echo "MCP Server starting..."
sleep 3

# 2. Start Tuya client
python /app/tuya_client.py &
echo "Tuya client starting..."
sleep 2

# 3. Start UI
echo "Starting UI..."
streamlit run /app/app.py --server.port=8501 --server.address=0.0.0.0
