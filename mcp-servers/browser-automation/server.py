"""
Browser Automation MCP Server  
Uses official Tuya MCP SDK - NO OpenAPI credentials needed!
The MCP SDK connects to Tuya Platform and receives browser commands.
"""

import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

# Import Tuya MCP SDK
try:
    from mcp_sdk import create_mcpsdk
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

# ONLY MCP Credentials Needed (from Tuya Platform MCP Management)
MCP_ENDPOINT = os.getenv('MCP_ENDPOINT')
MCP_ACCESS_ID = os.getenv('MCP_ACCESS_ID')
MCP_ACCESS_SECRET = os.getenv('MCP_ACCESS_SECRET')

print("🌐 Browser Automation MCP Server")
print("=" * 50)
print(f"MCP Endpoint: {MCP_ENDPOINT or 'NOT SET'}")
print(f"Access ID: {MCP_ACCESS_ID[:20] + '...' if MCP_ACCESS_ID else 'NOT SET'}")
print("=" * 50)


# MCP Tool Definitions
TOOLS = [
    {
        "name": "navigate_to_url",
        "description": "Navigate browser to a specific URL",
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The URL to navigate to"
                }
            },
            "required": ["url"]
        }
    },
    {
        "name": "click_element",
        "description": "Click on an element using CSS selector",
        "inputSchema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector of the element to click"
                }
            },
            "required": ["selector"]
        }
    },
    {
        "name": "type_text",
        "description": "Type text into an input field",
        "inputSchema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "CSS selector of the input field"
                },
                "text": {
                    "type": "string",
                    "description": "Text to type"
                }
            },
            "required": ["selector", "text"]
        }
    },
    {
        "name": "get_page_content",
        "description": "Get the text content of the current page",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "take_screenshot",
        "description": "Take a screenshot of the current page",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
]


def handle_tool_call(tool_name: str, arguments: dict):
    """
    Handle incoming tool calls from Tuya AI Workflow
    
    NOTE: The actual browser control happens in the Chrome extension!
    This MCP server forwards commands to the cloud bridge,
    which then sends them to the browser extension.
    """
    print(f"\n🔧 Tool Call Received: {tool_name}")
    print(f"   Arguments: {arguments}")
    
    # Return the arguments - these will be forwarded to the browser
    return {
        "success": True,
        "tool": tool_name,
        "arguments": arguments,
        "message": f"Browser command {tool_name} queued"
    }


async def main():
    """Main entry point - Connect to Tuya MCP Gateway"""
    
    print("\n🚀 Starting Browser Automation MCP Server...")
    print("This server connects to Tuya MCP Gateway via WebSocket\n")
    
    if not all([MCP_ENDPOINT, MCP_ACCESS_ID, MCP_ACCESS_SECRET]):
        print("❌ Missing required environment variables!")
        print("\nRequired in .env:")
        print("- MCP_ENDPOINT     (from Tuya Platform → MCP Management)")
        print("- MCP_ACCESS_ID    (from Tuya Platform → MCP Management)")
        print("- MCP_ACCESS_SECRET (from Tuya Platform → MCP Management)")
        print("\n📚 Guide: https://developer.tuya.com/en/docs/iot/custom-mcp")
        print("\nNOTE: NO user ID or OpenAPI credentials needed!")
        return
    
    try:
        print("🔌 Connecting to Tuya MCP Gateway...")
        
        # Initialize Tuya MCP SDK
        async with create_mcpsdk(
            endpoint=MCP_ENDPOINT,
            access_id=MCP_ACCESS_ID,
            access_secret=MCP_ACCESS_SECRET,
            tools=TOOLS,
            tool_handler=handle_tool_call
        ) as sdk:
            print("✅ Connected to Tuya MCP Platform!")
            print("🎧 Listening for browser automation commands from Tuya AI...")
            print("\nMCP Server is running. Press Ctrl+C to stop.\n")
            print("=" * 50)
            
            # Run forever
            await sdk.run()
            
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
