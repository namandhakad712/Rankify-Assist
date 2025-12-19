# 🎯 Rankify Brain - Phase 3 & 4: Workflow Integration & Testing

---

# PHASE 3: Integrate MCPs into AI Workflow

## 3.1 Workflow Architecture

Based on the actual Tuya node configurations:

```
START (USER_TEXT)
   ↓
Event Memory LOAD (query → data)
   ↓
Intent Recognition (USER_TEXT → classificationId)
   ├─ 0: browser → Browser LLM (with MCP tools)
   ├─ 1: iot → IoT LLM (with MCP tools)
   ├─ 2: chat → Chat LLM
   └─ -1: other → Fallback Output
   ↓
Event Memory SAVE (query → data)
   ↓
END (output)
```

---

## 3.2 Node-by-Node Configuration

### **Node 1: START**
- **Type:** Start Node
- **Output Variable:** `USER_TEXT` (String)
- No configuration needed

---

### **Node 2: Event Memory LOAD**
**Type:** Event Memory
**Configuration:**
- **Input:**
  - Variable name: `query`
  - Variable type: `string`
  - Input value: `conversation_context`
- **Output:**
  - Variable name: `data`
  - Variable type: `string`

**Purpose:** Load previous conversation context

---

### **Node 3: Intent Recognition**
**Type:** Intent Recognition
**Configuration:**
- **Model:** Gemini 2.5 Flash
- **Input:**
  - Variable name: `query`
  - Input value: `${USER_TEXT}`
- **Output:**
  - Variable name: `classificationId`
  - Variable type: `int.integer`
- **Intents:**
  - 0 = browser
  - 1 = iot
  - 2 = chat

**System Prompt:**
```
STRICT INTENT CLASSIFIER

Analyze the user query and output ONLY a number:

IF query contains keywords: gmail, email, youtube, facebook, website, google, search, browse, open, check, .com, online, internet, web
→ Output: 0

IF query contains keywords: light, lights, turn on, turn off, switch, lock, unlock, temperature, temp, AC, air conditioner, fan, curtain, device, smart home, control
→ Output: 1

OTHERWISE (general questions, conversation):
→ Output: 2

Query: ${query}

Output:
```

---

### **Node 4: Large Model - Browser Task Handler**
**Connected from Intent Recognition (0 = browser)**

**Type:** Large Model
**Configuration:**
- **Model:** Gemini 2.0 Flash (or GPT-4o)
- **Input:**
  - Variable name: `input`
  - Input value: `${USER_TEXT}`
- **User Profile Memory:** OFF
- **Session History:** OFF

**System Prompt:**
```
You are a browser automation assistant with access to a Chrome extension tool.

When the user asks for browser tasks, use the 'execute_browser_task' tool.

Examples:
- "check my gmail" → execute_browser_task("open gmail.com, login, count unread emails")
- "search for AI news" → execute_browser_task("search Google for 'AI news'")
- "go to youtube" → execute_browser_task("navigate to youtube.com")

IMPORTANT:
1. First acknowledge what you'll do
2. Then call the execute_browser_task tool
3. Wait for the result
4. Report back to the user

Always be clear about what actions you're taking.
```

**User Prompt:**
```
${input}
```

**Toolset:** (Click "+ Add Tool")
- Select: **MCP** tab
- Select: **Custom MCP Service**
- Check: **Browser Automation**
- Tool: **execute_browser_task**

**Output:**
- Variable name: `output`
- Variable type: `string`

---

### **Node 5: Large Model - IoT Device Handler**
**Connected from Intent Recognition (1 = iot)**

**Type:** Large Model
**Configuration:**
- **Model:** Gemini 2.0 Flash (or GPT-4o)
- **Input:**
  - Variable name: `input`
  - Input value: `${USER_TEXT}`

**System Prompt:**
```
You are a smart home assistant with access to Tuya device control tools.

Available tools:
1. list_user_devices - Get all available devices
2. query_device_status - Check device current status
3. control_device - Control a device

When user asks to control a device:
1. First use list_user_devices to find the device
2. Determine the correct command code:
   - Lights: switch_led (value: true/false)
   - AC: temp_set (value: 16-30)
   - Locks: lock_motor_state (value: true/false)
3. Use control_device with the device_id, command_code, and value
4. Confirm the action

When user asks about device status:
1. Use list_user_devices to find device_id
2. Use query_device_status with the device_id
3. Report the status in natural language

Examples:
- "turn on living room light" → list_devices → control_device(device_id, "switch_led", true)
- "set AC to 22" → list_devices → control_device(device_id, "temp_set", 22)
- "what's the status of my lights?" → query_device_status(device_id)

ALWAYS confirm actions before and after execution.
```

**User Prompt:**
```
${input}
```

**Toolset:**
- Select: **MCP** tab
- Select: **Custom MCP Service**  
- Check: **Tuya Device Controller**
- Tools: 
  - ✓ control_device
  - ✓ query_device_status
  - ✓ list_user_devices

**Output:**
- Variable name: `output`
- Variable type: `string`

---

### **Node 6: Large Model - Chat Handler**
**Connected from Intent Recognition (2 = chat)**

**Type:** Large Model
**Configuration:**
- **Model:** Gemini 2.0 Flash
- **Input:**
  - Variable name: `input`
  - Input value: `${USER_TEXT}`
  - Variable name: `context`
  - Input value: `${data}` (from Event Memory LOAD)

**System Prompt:**
```
You are Rankify Brain, a helpful AI assistant.

Previous Conversation Context:
${context}

Guidelines:
- If the user refers to previous messages, use the context above
- Answer questions clearly and concisely
- Be friendly and helpful
- If you don't know something, admit it
- Keep responses brief but informative

User question: ${input}
```

**User Prompt:**
```
${input}
```

**Toolset:** None (pure chat, no tools needed)

**Output:**
- Variable name: `output`
- Variable type: `string`

---

### **Node 7: Output - Fallback**
**Connected from Intent Recognition (-1 = other)**

**Type:** Output
**Configuration:**
- **Output Variable:** `output` (String)

**Content:**
```
I didn't quite understand that. I can help you with:

🌐 **Browser tasks:**
- "check my gmail"
- "search for AI news"
- "open youtube"

🏠 **Smart home control:**
- "turn on living room light"
- "set AC to 22 degrees"
- "lock the front door"
- "what's the status of my devices?"

💬 **General chat:**
- "what is 2+2"
- "tell me a joke"
- "what's the weather"

Please try again!
```

---

### **Node 8: Event Memory SAVE**
**Connected from ALL output nodes**

**Type:** Event Memory
**Configuration:**
- **Input:**
  - Variable name: `query`
  - Input value (use text processing node to combine):
    ```
    User: ${USER_TEXT}
    Assistant: ${output}
    Time: ${CURRENT_TIME}
    ```

**Purpose:** Save the conversation for context in next interaction

---

### **Node 9: END**
**Type:** End Node
**Output:** `${output}`

---

## 3.3 Connection Map

```
START
  ↓
  └─→ [Event Memory LOAD]
       ↓
       └─→ [Intent Recognition]
            ├─ (0) → [Browser LLM with MCP] → [Event Memory SAVE] ─┐
            ├─ (1) → [IoT LLM with MCP] → [Event Memory SAVE] ─────┤
            ├─ (2) → [Chat LLM] → [Event Memory SAVE] ─────────────┤
            └─ (-1) → [Fallback Output] → [Event Memory SAVE] ─────┘
                                                    ↓
                                                  [END]
```

---

## 3.4 Adding MCPs to Large Model Nodes

### **How to Add MCP Tools (Step-by-Step):**

1. **In Large Model Node:**
   - Scroll to **"Toolset"** section
   - Click **"+"** button

2. **On the "Add Tool" popup:**
   - Click **"MCP"** tab (not "Plugin")
   - Click **"Custom MCP Service"**

3. **Select your MCP:**
   - For Browser node: Check **"Browser Automation"**
   - For IoT node: Check **"Tuya Device Controller"**

4. **Select tools:**
   - Check the specific tools you want
   - For Browser: `execute_browser_task`
   - For IoT: All three tools (`control_device`, `query_device_status`, `list_user_devices`)

5. **Click "Confirm"**

6. **Verify:**
   - Tools should appear in the Toolset section
   - Each tool shows its name and description

---

# PHASE 4: Testing & Refinement

## 4.1 Pre-Flight Checklist

**Before testing, verify:**

- [ ] MCP servers are running:
  - [ ] Device Controller MCP: `python server.py` (running, no errors)
  - [ ] Browser Automation MCP: `python server.py` (running, no errors)

- [ ] Bridge server is running (for browser automation):
  - [ ] Local server: `node server.js` (port 3000)
  - [ ] ngrok tunnel: `ngrok http 3000` (HTTPS URL active)

- [ ] MCPs registered in Tuya platform:
  - [ ] Device Controller shows "Service Online" status
  - [ ] Browser Automation shows "Service Online" status

- [ ] MCPs added to workflow nodes:
  - [ ] Browser LLM has Browser Automation MCP
  - [ ] IoT LLM has Device Controller MCP
  - [ ] Tools visible in Toolset section

- [ ] Workflow saved and published

---

## 4.2 Testing Procedure

### **Test 1: Basic Intent Recognition**

1. Scan QR code with SmartLife app
2. Test inputs:
   - "turn on lights" → Should route to IoT (1)
   - "check gmail" → Should route to Browser (0)
   - "what is 2+2" → Should route to Chat (2)
   - "blah blah" → Should route to Fallback (-1)

**Expected:** Correct routing without MCP calls yet

---

### **Test 2: Device List** (IoT MCP)

**Input:** "show me all my devices"

**Expected Flow:**
1. Routes to IoT LLM (intent = 1)
2. LLM calls `list_user_devices` MCP tool
3. Returns device list
4. LLM formats and responds: "You have 3 devices: Living Room Light (online), Bedroom AC (offline), Front Door Lock (online)"

**Verify:**
- Check MCP server logs for incoming request
- Check workflow execution logs
- Verify response matches your actual devices

---

### **Test 3: Device Control** (IoT MCP)

**Input:** "turn on living room light"

**Expected Flow:**
1. Routes to IoT LLM
2. LLM calls `list_user_devices` to find device_id
3. LLM calls `control_device(device_id="dev_xxx", command_code="switch_led", command_value=true)`
4. MCP executes Tuya API call
5. Device turns on
6. LLM responds: "Living room light is now on"

**Verify:**
- Physical device turns on
- MCP logs show API call
- Response confirms action

---

### **Test 4: Device Status Query** (IoT MCP)

**Input:** "what's the status of the AC?"

**Expected Flow:**
1. Routes to IoT LLM
2. LLM calls `list_user_devices` to find AC
3. LLM calls `query_device_status(device_id="dev_yyy")`
4. Returns current status (temp, power, mode)
5. LLM responds in natural language

---

### **Test 5: Browser Automation** (Browser MCP)

**Input:** "check my gmail"

**Expected Flow:**
1. Routes to Browser LLM
2. LLM calls `execute_browser_task("open gmail.com, login, check unread count")`
3. MCP sends to bridge server
4. Bridge sends to Chrome extension
5. Extension executes
6. Result returns: "5 unread emails"
7. LLM responds: "You have 5 unread emails"

**Verify:**
- Browser opens Gmail
- Extension performs actions
- Result returned to user

---

### **Test 6: Conversational Memory**

**Interaction 1:**
- Input: "turn on the lights"
- Response: "Living room light is now on"

**Interaction 2:**
- Input: "now turn them off"
- Response: "Living room light is now off"

**Expected:** Second command uses context from first

---

### **Test 7: Complex Multi-Turn**

**Turn 1:** "what devices do I have?"
**Expected:** Lists devices

**Turn 2:** "turn on the first one"
**Expected:** Uses previous device list, turns on the first device

**Turn 3:** "what's its status now?"
**Expected:** Checks status of the device from context

---

## 4.3 Troubleshooting

### **Issue: MCP not being called**

**Symptoms:**
- LLM responds but doesn't use tools
- No logs in MCP server

**Solutions:**
1. Verify MCP tools added to Toolset in LLM node
2. Check MCP server is "Online" status
3. Verify system prompt instructs to use tools
4. Check if LLM model supports tool calling (Gemini 2.0, GPT-4o do)

---

### **Issue: MCP call fails**

**Symptoms:**
- LLM tries to call tool
- Error returned
- MCP server shows error

**Solutions:**
1. Check MCP server logs for error details
2. Verify Tuya API credentials in .env
3. Check device IDs are correct
4. Verify access token is valid
5. Check network connectivity

---

### **Issue: Browser automation not working**

**Symptoms:**
- MCP called successfully
- No browser action

**Solutions:**
1. Verify bridge server running
2. Check ngrok URL is correct in MCP .env
3. Verify Chrome extension polling
4. Check extension console for errors
5. Test bridge server directly with curl

---

### **Issue: Context not preserved**

**Symptoms:**
- Follow-up questions fail
- No memory of previous interactions

**Solutions:**
1. Verify Event Memory nodes connected
2. Check `data` variable passed to Chat LLM
3. Verify Event Memory SAVE receives `output`
4. Check memory key is consistent

---

## 4.4 Optimization

### **Improve Response Speed:**

1. **Cache device list:**
   - Store device list in memory
   - Refresh only when needed
   - Reduces API calls

2. **Parallel tool calls:**
   - Some LLMs support parallel tool execution
   - Enable if available

3. **Reduce latency:**
   - Deploy MCP servers closer to Tuya API
   - Use faster LLM models for simple tasks

---

### **Improve Accuracy:**

1. **Better prompts:**
   - Add more examples
   - Be more specific about tool usage
   - Include error handling instructions

2. **Device name mapping:**
   - Create friendly name → device_id map
   - Store in Knowledge Base
   - Use KB Retrieve before MCP call

3. **Command validation:**
   - Add validation layer before MCP call
   - Confirm device supports command
   - Check device is online

---

## 4.5 Production Deployment

### **For continuous operation:**

1. **Deploy MCP servers to cloud:**
   ```bash
   # Use a service like:
   - AWS EC2
   - Google Cloud Compute
   - DigitalOcean Droplet
   - Heroku
   ```

2. **Use process manager:**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Run MCP servers
   pm2 start device-controller/server.py --name device-mcp
   pm2 start browser-automation/server.py --name browser-mcp
   
   # Auto-restart on boot
   pm2 startup
   pm2 save
   ```

3. **Set up monitoring:**
   - Log MCP requests/responses
   - Monitor uptime
   - Alert on failures

4. **Secure credentials:**
   - Use environment variables
   - Rotate tokens regularly
   - Enable API rate limiting

---

## 4.6 Success Metrics

**After successful implementation:**

- ✅ Voice commands control devices (95%+ success rate)
- ✅ Browser automation works via voice
- ✅ Multi-turn conversations maintain context
- ✅ Response time < 3 seconds
- ✅ No manual intervention needed
- ✅ Handles errors gracefully
- ✅ Works across all device types

---

**🎉 COMPLETE!** You now have a fully functional AI-powered smart home assistant with browser automation!

---

## Next Steps

1. **Expand device support:** Add more device types
2. **Create scenes:** Combine multiple device actions
3. **Add schedules:** Time-based automation
4. **Voice training:** Optimize for your speech patterns
5. **Analytics:** Track usage patterns

**You did it!** 🚀
