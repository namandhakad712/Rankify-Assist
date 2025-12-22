#!/bin/bash
# Entrypoint - ALL on same port 7860!

# 1. Start MCP server on port 8860 (different port!)
echo "Starting MCP server on port 8860..."
sed -i 's/port=7860/port=8860/g' /app/mcp_server.py
python /app/mcp_server.py &
sleep 3

# 2. Start Tuya client (connects to localhost:8860)
echo "Starting Tuya client..."
sed -i 's/:7860\/mcp/:8860\/mcp/g' /app/tuya_client.py
python /app/tuya_client.py &
sleep 2

# 3. Start UI on port 7860 (HF default)
echo "Starting UI on port 7860..."
streamlit run /app/app.py --server.port=7860 --server.address=0.0.0.0
