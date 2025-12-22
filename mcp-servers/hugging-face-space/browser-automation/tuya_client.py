"""
Tuya Client - Persistent Background Process
Runs SEPARATELY from Streamlit UI
"""

import asyncio
import logging
import os
import json
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [TUYA] - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/tuya_client.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Status file for UI to read
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

async def main():
    """Run Tuya client persistently"""
    
    try:
        logger.info("=" * 60)
        logger.info("TUYA MCP CLIENT - PERSISTENT MODE")
        logger.info("=" * 60)
        
        # Import SDK
        from mcp_sdk import MCPSdkClient
        logger.info("SDK LOADED")
        
        # Get credentials
        TUYA_ENDPOINT = os.getenv('MCP_ENDPOINT')
        TUYA_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
        TUYA_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')
        MCP_SERVER_URL = "http://localhost:7860/mcp"
        
        logger.info(f"ENDPOINT: {TUYA_ENDPOINT}")
        logger.info(f"ACCESS_ID: {TUYA_ACCESS_ID[:20]}..." if TUYA_ACCESS_ID else "NULL")
        logger.info(f"MCP_URL: {MCP_SERVER_URL}")
        
        if not all([TUYA_ENDPOINT, TUYA_ACCESS_ID, TUYA_ACCESS_SECRET]):
            logger.error("MISSING CREDENTIALS!")
            update_status(False, "MISSING CREDENTIALS")
            return
        
        # Create client
        logger.info("CREATING CLIENT...")
        client = MCPSdkClient(
            endpoint=TUYA_ENDPOINT,
            access_id=TUYA_ACCESS_ID,
            access_secret=TUYA_ACCESS_SECRET,
            custom_mcp_server_endpoint=MCP_SERVER_URL
        )
        
        # Connect
        logger.info("CONNECTING TO TUYA PLATFORM...")
        await client.connect()
        
        logger.info("CONNECTED!")
        update_status(True, "CONNECTED TO TUYA PLATFORM")
        
        # Listen forever
        logger.info("LISTENING FOR REQUESTS...")
        await client.start_listening()
        
    except Exception as e:
        logger.error(f"ERROR: {e}")
        update_status(False, f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Initialize status
    update_status(False, "STARTING...")
    
    # Run forever
    asyncio.run(main())
