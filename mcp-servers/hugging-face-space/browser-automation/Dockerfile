FROM python:3.11-slim

WORKDIR /app

# Install git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies (includes uvicorn for FastMCP)
RUN pip install --no-cache-dir -r requirements.txt

# Copy ALL application files
COPY mcp_server.py .
COPY tuya_client.py .
COPY app.py .
COPY entrypoint.sh .

# Make executable
RUN chmod +x entrypoint.sh

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Set environment - run Streamlit on 7860
ENV STREAMLIT_SERVER_PORT=7860
ENV STREAMLIT_SERVER_ADDRESS=0.0.0.0
ENV STREAMLIT_BROWSER_GATHER_USAGE_STATS=false

# Run entrypoint (starts all 3!)
CMD ["/app/entrypoint.sh"]
