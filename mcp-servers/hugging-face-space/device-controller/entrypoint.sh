#!/bin/bash
# Docker entrypoint - Device Controller

# Start Tuya client in background
python /app/tuya_client.py &

# Wait for initialization
sleep 2

# Start Streamlit UI
streamlit run /app/app.py --server.port=7860 --server.address=0.0.0.0
