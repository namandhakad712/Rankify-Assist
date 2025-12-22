window.DOCS_DATA = {
    "Getting Started": {
        "Visual Setup": `# 🎯 Quick Start: Visual Setup

**Your Gateway to a Fully Agentic Future.**

This guide isn't just about setting variables; it's about initializing the neural pathways of your personal AI agent. Follow these steps to breathe life into Rankify Assist.

### 1. The Core: Vercel Configuration
These environment variables are the DNA of your cloud bridge. Without them, the system is just code; with them, it's alive.

| Variable | Importance | Value To Set |
|----------|------------|--------------|
| \`MCP_API_KEY\` | **CRITICAL** | A 32-char cryptographically secure key. This is the shield guarding your agent. |
| \`SUPABASE_URL\` | **High** | The address of your agent's long-term memory. |
| \`SUPABASE_ANON_KEY\` | **High** | The key to access that memory safely. |
| \`GOOGLE_CLIENT_ID\` | **Medium** | Enables secure, seamless identity verification. |

### 2. The Hands: Extension Configuration
Your browser extension is the literal "hands" of the agent. It needs to know exactly where the "brain" (Cloud Bridge) is located.

1.  **Navigate**: Open \`chrome://extensions\` and find Rankify Assist.
2.  **Connect**: Click **Options**. This is the control panel.
3.  **Target**: Enter your Vercel URL (e.g., \`https://your-app.vercel.app\`). This establishes the neural link.
4.  **Verify**: Click **Test Connection**. A green success message means the link is stable and ready for data transmission.

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/COMPLETE-VISUAL-SETUP.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full Visual Setup Guide on GitHub ↗
    </a>
</div>
`
    },
    "Cloud Bridge": {
        "Architecture": `# ☁️ Architecture & Data Flow

**The Blueprint of an Autonomous Agent.**

Rankify Assist isn't just a script; it's a distributed system designed for resilience, speed, and security. It decouples the *intent* (AI) from the *execution* (Browser), using a high-availability cloud bridge as the coordinator.

## System Diagram

\`\`\`mermaid
sequenceDiagram
    participant User as 👤 User
    participant Cloud as ☁️ Tuya AI
    participant MCP as 🐳 MCP Server
    participant Bridge as 🚀 Cloud Bridge
    participant Ext as 🧩 Extension
    participant Browser as 🌐 Browser

    User->>Cloud: "Open YouTube"
    Cloud->>MCP: execute_command()
    MCP->>Bridge: POST /api/execute
    
    loop Polling
        Ext->>Bridge: GET /api/poll
    end
    
    Bridge-->>Ext: Command Received
    Ext->>Browser: Opens YouTube
    Ext->>Bridge: POST /api/result
    Bridge-->>MCP: Result
    MCP-->>Cloud: Success
    Cloud->>User: "Opened YouTube"
\`\`\`

<div style="text-align: center; margin-top: 20px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/PROJECT_ARCHITECTURE_DIAGRAM.mmd" target="_blank" style="display: inline-block; padding: 10px 20px; background: rgba(255,255,255,0.1); color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; font-weight: 600;">
        View Diagram Source on GitHub ↗
    </a>
</div>

### The Holy Trinity of Components
1.  **Cloud Bridge (The Brain)**: Hosted on Vercel's edge network. It maintains the state of every command, ensuring no instruction is ever lost, even if your laptop is closed.
2.  **Extension (The Hands)**: living inside Chrome. It doesn't just "browse"; it *manipulates* the DOM, scrapes data, and interacts with complex web apps as if it were you.
3.  **MCP Server (The Translator)**: A Python-based interface that translates Tuya's AI commands into precise, executable directives for the bridge.

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/cloud-bridge/ARCHITECTURE.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full Architecture Guide on GitHub ↗
    </a>
</div>
`,
        "Deployment": `# 🚀 Deployment Quick Start

**From Local Code to Global Scale in Seconds.**

You are deploying a serverless, auto-scaling API that can handle thousands of requests without breaking a sweat. And the best part? It fits perfectly within Vercel's free tier.

### Option 1: Vercel CLI (The Speedster)
For those who live in the terminal. One command to rule them all.

\`\`\`bash
npm install -g vercel
cd cloud-bridge
vercel --prod
\`\`\`

### Option 2: GitHub Integration (The Professional)
**Recommended for long-term reliability.**
1.  **Push**: Commit your \`cloud-bridge\` folder to GitHub. This creates a secure version history.
2.  **Import**: In Vercel, import the repo. Vercel's build pipeline takes over.
3.  **Configure**: Set the Root Directory to \`cloud-bridge\`. This is crucial.
4.  **Environment**: Add your secrets. The system won't boot without fuel.

**Pro Tip**: Once linked, every \`git push\` triggers a seamless deployment, updating your live agent instantly without downtime.

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/cloud-bridge/DEPLOYMENT.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full Deployment Guide on GitHub ↗
    </a>
</div>
`,
        "Google OAuth": `# 🔐 Google OAuth Setup

**Enterprise-Grade Security, Simplified.**

We leverage Supabase's robust authentication layer to handle Google Sign-In. The magic logic happens completely Client-Side, ensuring a snappy, secure user experience without complex server-side redirects.

### 1. Google Cloud Console
*   **Authorized Origins**: Where is the request coming from?
    *   \`https://your-app.vercel.app\`
    *   \`https://your-supabase-url.supabase.co\`
*   **Authorized Redirect URIs**: Where should we send the user back to?
    *   \`https://your-supabase-url.supabase.co/auth/v1/callback\` (This is essentially the Supabase handshake handler).

### 2. Supabase Dashboard
*   **Provider**: Toggle Google ON.
*   **Credentials**: Paste your Client ID and Secret. These acts as the keys to the kingdom.
*   **Site URL**: Set this to your Vercel URL. It tells Supabase, "This is home."

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/cloud-bridge/GOOGLE-OAuth-SETUP.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full OAuth Setup Guide on GitHub ↗
    </a>
</div>
`
    },
    "Extension": {
        "Build Guide": `# 📦 Extension Compilation

**Forging the Tool.**

The extension source code resides in \`extension-raw\`. This is your workshop. The \`extension\` folder is the showroom—the polished, compiled product ready for Chrome.

### The Build Process
We use **Vite** to bundle react components, assets, and logic into tight, optimized JavaScript files.

\`\`\`bash
cd extension-raw
pnpm install  # Fetching the raw materials
pnpm build    # Forging the final artifact
\`\`\`

*Result: A pristine \`extension/\` folder, ready for deployment.*

### Loading the Weapon
1.  **Developer Mode**: This unlocks the ability to load unpacked extensions in Chrome.
2.  **Load Unpacked**: Select the \`extension/\` folder.
3.  **Done**: You now have a powerful AI assistant living in your browser toolbar.

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/extension/BUILD-GUIDE.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full Build Guide on GitHub ↗
    </a>
</div>
`
    },
    "MCP Servers": {
        "Cloud (Hugging Face)": `# 🤗 Hugging Face Deployment

**The Infinite Loop.**

Deploying your MCP Server to Hugging Face Spaces is the final piece of the "Always-On" puzzle. By running your Tuya Client here, you detach it from your local machine completely.

### Why This Matters
*   **24/7 Availability**: Your agent never sleeps, even if you do.
*   **Zero Cost**: Hugging Face's generous free tier handles this easily.
*   **Persistence**: The connection to Tuya's IoT cloud remains unbroken.

### Quick Deploy Checklist
1.  **Space**: Create a new Docker Space.
2.  **Upload**: Drag & Drop the \`mcp-servers/hugging-face-space/\` content.
3.  **Secrets**: This is vital. Set \`MCP_ENDPOINT\`, \`MCP_ACCESS_ID\`, and your other credentials in the Settings tab.

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/mcp/HUGGINGFACE_DEPLOYMENT.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full Cloud Deployment Guide on GitHub ↗
    </a>
</div>
`,
        "Local (Offline)": `# 💻 Local / Offline Setup

**The Developer's Sandbox.**

Prefer to keep things local? The Offline Setup gives you total control. Perfect for testing new features, debugging connection issues, or simply learning how the gears turn.

### The Stack
*   **Tuya MCP SDK**: A specialized library to talk to Tuya's IoT cloud.
*   **FastMCP**: The engine that drives your server capabilities.

### Running the Engine
\`\`\`bash
cd mcp-servers/offline/browser-automation
python server.py      # Starts the Tool Execution Engine
python tuya_client.py # Starts the Communication Bridge
\`\`\`

*Note: In this mode, if your PC sleeps, your agent sleeps. Great for dev, less so for prod.*

<div style="text-align: center; margin-top: 40px;">
    <a href="https://github.com/namandhakad712/Rankify-Assist/blob/main/docs/mcp/OFFLINE-SETUP-GUIDE.md" target="_blank" style="display: inline-block; padding: 12px 24px; background: rgba(112, 66, 248, 0.2); color: #fff; text-decoration: none; border: 1px solid rgba(112, 66, 248, 0.4); border-radius: 8px; font-weight: 600; transition: all 0.2s;">
        📚 Read Full Offline Setup Guide on GitHub ↗
    </a>
</div>
`
    },
    "Ecosystem & Resources": {
        "Useful Links": `# 🌐 Tuya Ecosystem & Resources
Explore the official resources and communities powering Rankify Assist.

## 🔗 Essential Links

### 1. [TuyaOpen OS](https://tuyaopen.ai/)
**The Foundation.** A powerful, open-source IoT operating system featuring industry-leading connectivity, security, and multimodal AI capabilities.
*   **Why Visit:** To access the core OS that powers intelligent devices and explore development tools.

### 2. [Tuya IoT Platform](https://platform.tuya.com/)
**The Command Center.** The official portal for developers to manage projects, devices, and cloud services.
*   **Why Visit:** To create projects, get API keys, and manage your IoT fleet.

### 3. [Developer Documentation](https://developer.tuya.com/docs/)
**The Knowledge Base.** The central hub for all official guides, API references, and SDK documentation.
*   **Why Visit:** For deep technical details on every aspect of the Tuya ecosystem.

### 4. [TuyaOpen GitHub](https://github.com/tuya/TuyaOpen)
**The Codebase.** The next-gen AI+IoT framework repository. Supports T2/T3/T5AI/ESP32 platforms for fast hardware integration.
*   **Why Visit:** To view the source code, contribute, and understand the framework's inner workings.

### 5. [TuyaOpen Serial Tools](https://tuyaopen.ai/tools/)
**The Toolbox.** A web-based utility for serial connection, firmware flashing, and device authorization.
*   **Why Visit:** To debug devices directly from your browser without installing native software.

### 6. [Smart Life Home Assistant](https://github.com/tuya/tuya-smart-life)
**The Integration.** The official beta integration for controlling Tuya devices within Home Assistant.
*   **Why Visit:** To bridge your Tuya devices with your local Home Assistant setup.

### 7. [TuyaOpen Wiki](https://deepwiki.com/tuya/TuyaOpen)
**The Deep Dive.** A comprehensive wiki covering the architecture, core components, and advanced concepts of TuyaOpen.
*   **Why Visit:** For a thorough understanding of the system architecture and theory.

## 🛠️ Other Linked to My Project

### 1. [Hugging Face Spaces](https://huggingface.co/spaces)
**The Cloud Runtime.** Where our persistent MCP Servers live.
*   **Role:** Hosts the always-on "brain" of the agent.

### 2. [FastMCP Cloud](https://fastmcp.cloud/)
**The Framework.** The specialized library powering our Model Context Protocol servers.
*   **Role:** Provides the infrastructure for our agent's tools.

### 3. [NanoBrowser Docs](https://nanobrowser.ai/docs)
**The Environment.** Documentation for the AI-native browser environment.
*   **Role:** Understanding the capabilities of the browser where the agent lives.

### 4. [Vercel](https://vercel.com/)
**The Hosting.** The platform serving this Cloud Bridge and Documentation.
*   **Role:** Ensures high-performance, global delivery of our web services.
`
    }
};
