#!/bin/bash
# Docker entrypoint - starts both Tuya client and Streamlit UI

# Start Tuya client in background
python /app/tuya_client.py &

# Wait a moment for it to initialize
sleep 2

# Start Streamlit UI in foreground
streamlit run /app/app.py --server.port=7860 --server.address=0.0.0.0
