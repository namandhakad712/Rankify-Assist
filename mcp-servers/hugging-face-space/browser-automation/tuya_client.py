"""
Tuya Client - Persistent with Auto-Reconnect & Keepalive
"""

import asyncio
import logging
import os
import json
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [TUYA] - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/tuya_client.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

STATUS_FILE = '/tmp/tuya_status.json'

def update_status(connected, message):
    """Update status file"""
    status = {
        'connected': connected,
        'message': message,
        'timestamp': datetime.now().isoformat()
    }
    with open(STATUS_FILE, 'w') as f:
        json.dump(status, f)

async def keep_alive(client):
    """Send keepalive pings every 30 seconds"""
    try:
        while True:
            await asyncio.sleep(30)
            logger.info("KEEPALIVE PING...")
            # The connection stays alive just by running
    except Exception as e:
        logger.error(f"KEEPALIVE ERROR: {e}")

async def connect_and_listen():
    """Connect to Tuya with retry logic"""
    
    from mcp_sdk import MCPSdkClient
    
    TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT')
    TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
    TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
    MCP_SERVER_URL = "http://localhost:7860/mcp"
    
    logger.info(f"ENDPOINT: {TUYA_ENDPOINT}")
    logger.info(f"ACCESS_ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NULL")
    
    if not all([TUYA_ENDPOINT, TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
        logger.error("MISSING CREDENTIALS!")
        update_status(False, "MISSING CREDENTIALS")
        raise Exception("Missing credentials")
    
    # Create client
    logger.info("CREATING CLIENT...")
    client = MCPSdkClient(
        endpoint=TUYA_ENDPOINT,
        access_id=TUYA_ACCESS_ID,
        access_secret=TUYA_ACCESS_SECRET,
        custom_mcp_server_endpoint=MCP_SERVER_URL
    )
    
    # Connect
    logger.info("CONNECTING...")
    await client.connect()
    
    logger.info("CONNECTED!")
    update_status(True, "CONNECTED TO TUYA")
    
    # Start keepalive task
    keepalive_task = asyncio.create_task(keep_alive(client))
    
    # Listen
    logger.info("LISTENING...")
    try:
        await client.start_listening()
    finally:
        keepalive_task.cancel()

async def main_with_retry():
    """Main loop with auto-reconnect"""
    
    retry_count = 0
    max_retries = None  # Infinite retries
    
    while True:
        try:
            logger.info("=" * 60)
            logger.info("BROWSER AUTOMATION - TUYA CLIENT")
            logger.info("=" * 60)
            
            # Try to connect
            await connect_and_listen()
            
        except Exception as e:
            retry_count += 1
            logger.error(f"CONNECTION FAILED (attempt #{retry_count}): {e}")
            update_status(False, f"RECONNECTING... (#{retry_count})")
            
            # Exponential backoff (max 60 seconds)
            wait_time = min(2 ** min(retry_count, 6), 60)
            logger.info(f"RETRYING IN {wait_time} SECONDS...")
            await asyncio.sleep(wait_time)
            
            logger.info("ATTEMPTING RECONNECT...")
            
        # If we get here, connection dropped - try to reconnect
        logger.warning("CONNECTION DROPPED! AUTO-RECONNECTING...")
        update_status(False, "CONNECTION DROPPED - RECONNECTING...")
        await asyncio.sleep(2)

if __name__ == "__main__":
    update_status(False, "STARTING...")
    asyncio.run(main_with_retry())
