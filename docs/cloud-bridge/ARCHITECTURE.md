# ☁️ Cloud Bridge Service - Always-On Architecture

## Problem Solved

❌ **Old approach:**
- Laptop must be on
- Bridge server running locally
- ngrok tunnel needed
- Single user only

✅ **New approach:**
- Deploy to cloud (Vercel/Railway)
- Always on, no manual work
- Multi-user with authentication
- Works from anywhere

---

## Architecture

```
Tuya AI MCP
    ↓
Cloud Bridge Service (Vercel)
    ↓
Database (commands queue)
    ↓
Extension (polls with credentials)
    ↓
Browser Automation
    ↓
Results back to Cloud
    ↓
MCP receives result
```

---

## Technology Stack

### **Backend:**
- **Runtime:** Node.js (Next.js API routes)
- **Hosting:** Vercel (free tier!)
- **Database:** Vercel KV (Redis) or Supabase
- **Auth:** Username/Password stored in DB

### **Extension:**
- Polls cloud service instead of localhost
- Authenticates with credentials
- Long-polling or WebSocket

---

## Cloud Service Implementation

### **File Structure:**

```
cloud-bridge/
├── package.json
├── vercel.json
├── api/
│   ├── execute.js         # MCP sends commands here
│   ├── poll.js            # Extension polls for commands
│   ├── result.js          # Extension sends results
│   ├── register.js        # User registration
│   └── auth.js            # Authentication
├── lib/
│   ├── db.js              # Database client
│   └── auth.js            # Auth helpers
└── README.md
```

---

## API Endpoints

### **1. POST /api/execute** (MCP → Cloud)
**Purpose:** Tuya MCP sends browser command

**Request:**
```json
{
  "userId": "user123",
  "apiKey": "mcp_secret_key",
  "command": "open gmail.com and check unread"
}
```

**Response:**
```json
{
  "success": true,
  "commandId": "cmd_abc123",
  "status": "queued"
}
```

**Process:**
1. Validate MCP API key
2. Store command in database (with userId)
3. Return command ID
4. Wait for result (or timeout after 60s)

---

### **2. GET /api/poll** (Extension → Cloud)
**Purpose:** Extension checks for new commands

**Headers:**
```
Authorization: Basic base64(username:password)
```

**Query:**
```
?userId=user123
```

**Response (when command exists):**
```json
{
  "hasCommand": true,
  "commandId": "cmd_abc123",
  "command": "open gmail.com and check unread",
  "timestamp": 1703000000
}
```

**Response (no command):**
```json
{
  "hasCommand": false
}
```

---

### **3. POST /api/result** (Extension → Cloud)
**Purpose:** Extension sends back execution result

**Headers:**
```
Authorization: Basic base64(username:password)
```

**Request:**
```json
{
  "commandId": "cmd_abc123",
  "userId": "user123",
  "result": "5 unread emails found",
  "success": true,
  "executionTime": 3500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Result stored"
}
```

---

### **4. POST /api/register** (User → Cloud)
**Purpose:** Register new user

**Request:**
```json
{
  "username": "john_doe",
  "password": "secure_password_123",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user123",
  "message": "Registration successful"
}
```

---

### **5. POST /api/auth/verify** (Extension → Cloud)
**Purpose:** Verify credentials

**Request:**
```json
{
  "username": "john_doe",
  "password": "secure_password_123"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user123",
  "username": "john_doe"
}
```

---

## Database Schema (Vercel KV / Redis)

### **Users:**
```
users:{userId} = {
  userId: "user123",
  username: "john_doe",
  passwordHash: "bcrypt_hash",
  email: "john@example.com",
  createdAt: timestamp,
  apiKey: "user_api_key_xxx"
}
```

### **Commands Queue:**
```
commands:{userId}:pending = [
  {
    commandId: "cmd_abc123",
    command: "open gmail.com",
    createdAt: timestamp,
    status: "pending"
  }
]
```

### **Results:**
```
results:{commandId} = {
  commandId: "cmd_abc123",
  userId: "user123",
  result: "5 unread emails",
  success: true,
  executionTime: 3500,
  completedAt: timestamp
}
```

---

## Code Implementation

### **`api/execute.js`** (MCP sends commands)

```javascript
import { kv } from '@vercel/kv';
import crypto from 'crypto';

const MCP_API_KEY = process.env.MCP_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, apiKey, command } = req.body;

  // Validate MCP API key
  if (apiKey !== MCP_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Generate command ID
  const commandId = `cmd_${crypto.randomBytes(8).toString('hex')}`;

  // Store command in queue
  const commandData = {
    commandId,
    command,
    createdAt: Date.now(),
    status: 'pending',
  };

  await kv.lpush(`commands:${userId}:pending`, JSON.stringify(commandData));

  // Set command expiry (60 seconds)
  await kv.expire(`commands:${userId}:pending`, 60);

  // Wait for result (long-polling)
  const result = await waitForResult(commandId, 60000);

  if (result) {
    return res.json({
      success: true,
      commandId,
      result: result.result,
      executionTime: result.executionTime,
    });
  } else {
    return res.status(408).json({
      success: false,
      error: 'Command timeout - no response from extension',
    });
  }
}

async function waitForResult(commandId, timeout) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await kv.get(`results:${commandId}`);

    if (result) {
      return JSON.parse(result);
    }

    // Wait 500ms before checking again
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return null;
}
```

---

### **`api/poll.js`** (Extension polls for commands)

```javascript
import { kv } from '@vercel/kv';
import { verifyAuth } from '../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  const user = await verifyAuth(authHeader);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get pending command
  const commandStr = await kv.rpop(`commands:${user.userId}:pending`);

  if (!commandStr) {
    return res.json({ hasCommand: false });
  }

  const command = JSON.parse(commandStr);

  return res.json({
    hasCommand: true,
    commandId: command.commandId,
    command: command.command,
    timestamp: command.createdAt,
  });
}
```

---

### **`api/result.js`** (Extension sends results)

```javascript
import { kv } from '@vercel/kv';
import { verifyAuth } from '../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  const user = await verifyAuth(authHeader);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { commandId, result, success, executionTime } = req.body;

  // Store result
  const resultData = {
    commandId,
    userId: user.userId,
    result,
    success,
    executionTime,
    completedAt: Date.now(),
  };

  await kv.set(`results:${commandId}`, JSON.stringify(resultData), {
    ex: 120, // Expire after 2 minutes
  });

  return res.json({
    success: true,
    message: 'Result stored',
  });
}
```

---

### **`lib/auth.js`** (Authentication helper)

```javascript
import { kv } from '@vercel/kv';
import bcrypt from 'bcrypt';

export async function verifyAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  // Decode Base64 credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Get user from database
  const userKeys = await kv.keys('users:*');
  
  for (const key of userKeys) {
    const userData = await kv.get(key);
    const user = JSON.parse(userData);

    if (user.username === username) {
      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (isValid) {
        return user;
      }
    }
  }

  return null;
}
```

---

## Deployment Steps

### **1. Create Vercel Project:**

```bash
cd c:\TUYA\RankifyAssist\cloud-bridge

# Initialize project
npm init -y

# Install dependencies
npm install @vercel/kv bcrypt

# Login to Vercel
vercel login

# Deploy
vercel
```

---

### **2. Set Environment Variables:**

In Vercel dashboard:
```
MCP_API_KEY=your_secret_key_here
KV_REST_API_URL=auto_generated_by_vercel
KV_REST_API_TOKEN=auto_generated_by_vercel
```

---

### **3. Enable Vercel KV:**

1. Go to Vercel dashboard
2. Your project → Storage
3. Create KV Database
4. Auto-connects to your project

---

## Updated Extension Code

### **`tuyaBridge.ts`** (Updated for cloud)

```typescript
// Cloud bridge configuration
const CLOUD_BRIDGE_URL = 'https://your-project.vercel.app';
const POLL_INTERVAL = 3000; // 3 seconds

let credentials = {
  username: '',
  password: '',
};

// Load credentials from storage
chrome.storage.local.get(['bridge_credentials'], (result) => {
  if (result.bridge_credentials) {
    credentials = result.bridge_credentials;
  }
});

async function pollLoop() {
  while (isPolling) {
    if (isPaused || !credentials.username) {
      await sleep(POLL_INTERVAL);
      continue;
    }

    try {
      const response = await fetch(`${CLOUD_BRIDGE_URL}/api/poll`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.hasCommand) {
          console.log('[Cloud Bridge] Received command:', data.command);
          await executeCommand(data.commandId, data.command);
        }
      }
    } catch (error) {
      // Server error - continue polling
    }

    await sleep(POLL_INTERVAL);
  }
}

async function sendResultToCloud(commandId: string, result: string) {
  try {
    await fetch(`${CLOUD_BRIDGE_URL}/api/result`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commandId,
        result,
        success: true,
        executionTime: 0, // Track actual time
      }),
    });

    console.log('[Cloud Bridge] Result sent');
  } catch (error) {
    console.error('[Cloud Bridge] Failed to send result:', error);
  }
}
```

---

## Updated MCP Code

### **`browser_mcp.py`** (Updated for cloud)

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

CLOUD_BRIDGE_URL = os.getenv('CLOUD_BRIDGE_URL', 'https://your-project.vercel.app')
MCP_API_KEY = os.getenv('MCP_API_KEY')

def execute_browser_task(command: str, user_id: str = 'default'):
    """Execute browser automation command via cloud bridge"""
    try:
        response = requests.post(
            f"{CLOUD_BRIDGE_URL}/api/execute",
            json={
                "userId": user_id,
                "apiKey": MCP_API_KEY,
                "command": command,
            },
            timeout=65  # Wait for extension to execute
        )

        if response.status_code == 200:
            result = response.json()
            return {
                "success": True,
                "result": result.get('result', 'Task executed'),
                "executionTime": result.get('executionTime', 0),
            }
        else:
            return {
                "success": False,
                "error": f"Cloud bridge error: {response.status_code}",
            }
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Timeout - extension may not be connected",
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }
```

---

## Updated LLM Prompts (Force MCP Usage)

### **Browser LLM System Prompt:**

```
You are a browser automation assistant with MANDATORY tool usage.

CRITICAL RULE: You MUST use the execute_browser_task tool for EVERY browser-related request.
DO NOT provide manual instructions. ALWAYS call the tool.

When user asks for browser tasks:
1. Acknowledge what you'll do
2. IMMEDIATELY call execute_browser_task with the command
3. Wait for result
4. Report back

If tool call fails, inform user and ask to check connection.

NEVER skip calling the tool. ALWAYS use MCP.
```

### **IoT LLM System Prompt:**

```
You are a smart home assistant with MANDATORY tool usage.

CRITICAL RULE: You MUST use MCP tools for ALL device control requests.
DO NOT provide manual instructions. ALWAYS call appropriate tool.

Process:
1. For device control: ALWAYS use list_user_devices, then control_device
2. For status check: ALWAYS use query_device_status
3. NEVER respond without making tool calls

If tools fail, inform user about connection/configuration issues.

ALWAYS use MCP tools. This is not optional.
```

---

**(Continued in next file...)**
