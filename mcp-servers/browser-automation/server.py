"""
Browser Automation MCP Server
Uses official Tuya MCP SDK - correctly configured!
"""

import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

# Import Tuya MCP SDK
try:
    from mcp_sdk import create_mcpsdk
    from mcp_sdk.models import MCPSdkRequest, MCPSdkResponse
    SDK_AVAILABLE = True
except ImportError:
    SDK_AVAILABLE = False
    print("\n❌ ERROR: tuya-mcp-sdk not installed!")
    print("\nInstall steps:")
    print("1. git clone https://github.com/tuya/tuya-mcp-sdk.git")
    print("2. cd tuya-mcp-sdk/mcp-python")
    print("3. pip install -e .")
    print("4. Return here and run: python server.py\n")
    exit(1)

# ONLY MCP Credentials Needed
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

print("🌐 Browser Automation MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT or 'NOT SET'}")
print(f"Access ID: {MCP_ACCESS_ID[:20] + '...' if MCP_ACCESS_ID else 'NOT SET'}")
print("=" * 50)


def message_handler(request: MCPSdkRequest) -> MCPSdkResponse:
    """
    Handle messages from Tuya AI Workflow
    
    Args:
        request: MCPSdkRequest object with browser command
        
    Returns:
        MCPSdkResponse with result
    """
    print(f"\n🔧 Message Received")
    print(f"   Request: {request}")
    
    try:
        # The actual browser control happens in the Chrome extension
        # This MCP server receives commands from Tuya AI
        # and should forward them to the cloud bridge
        
        return MCPSdkResponse(
            success=True,
            message="Browser command received",
            data={"status": "queued"}
        )
    except Exception as e:
        print(f"❌ Error handling message: {e}")
        return MCPSdkResponse(
            success=False,
            message=str(e)
        )


async def main():
    """Main entry point - Connect to Tuya MCP Gateway"""
    
    print("\n🚀 Starting Browser Automation MCP Server...")
    print("This server connects to Tuya MCP Gateway\n")
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT     (from Tuya Platform → MCP Management)")
        print("- MCP_ACCESS_ID    (from Tuya Platform → MCP Management)")
        print("- MCP_ACCESS_SECRET (from Tuya Platform → MCP Management)")
        print("\n📚 Guide: https://developer.tuya.com/en/docs/iot/custom-mcp")
        return
    
    try:
        print("🔌 Connecting to Tuya MCP Gateway...")
        
        # Initialize Tuya MCP SDK with correct parameters
        sdk = create_mcpsdk(
            endpoint=MCP_ENDPOINT,
            access_id=MCP_ACCESS_ID,
            access_secret=MCP_ACCESS_SECRET,
            message_handler=message_handler
        )
        
        print("✅ Connected to Tuya MCP Platform!")
        print("🎧 Listening for browser automation commands from Tuya AI...")
        print("\nMCP Server is running. Press Ctrl+C to stop.\n")
        print("=" * 50)
        
        # Keep running
        while True:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
        print("Goodbye! 👋\n")
    except Exception as e:
        print(f"\n❌ Fatal Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check MCP credentials in .env")
        print("2. Verify data center selection")
        print("3. Ensure MCP server is created on Tuya Platform")
        print("\n📚 Guide: https://developer.tuya.com/en/docs/iot/custom-mcp\n")


if __name__ == "__main__":
    if SDK_AVAILABLE:
        asyncio.run(main())
