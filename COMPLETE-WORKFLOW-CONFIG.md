# Rankify Workflow - Complete Node Configuration Guide

## 🎯 Current Workflow Visual

```
┌─────────┐
│  Start  │
│ USER_   │
│  TEXT   │
└────┬────┘
     │
     ▼
┌──────────────────┐
│ Intent Recognition│
│   - browser      │
│   - iot          │
│   - chat         │
└─┬─────┬─────┬───┘
  │     │     │
Browser IoT  Chat
  │     │     │
  ▼     ▼     ▼
```

---

## Node 1: Start (Already Done ✅)

**No configuration needed** - Just has `USER_TEXT` input variable.

---

## Node 2: Intent Recognition (Already Done ✅)

**Configuration:**
- Model: Gemini 2.5 Flash
- Input: `USER_TEXT`
- Output Variable: `classificationId` (Integer)
- Intents:
  - `browser`
  - `iot`
  - [chat](file:///c:/TUYA/TuyaOpen/apps/tuya.ai/your_chat_bot/src/app_chat_bot.c#514-548)

**This node has 3 OUTPUTS** (one for each intent)

---

## Node 3: Large Model (Browser Command Generator)

### Configuration:

**After Intent Recognition → "browser" output**

#### Fields:

**Input:**
- Variable name: `input`
- Variable type: `String`
- Click dropdown → Select: **"Start" → USER_TEXT**

**Model:** Select any (Gemini, GPT, Claude)

**Session History:** OFF

**System Prompt:**
```
You are a browser automation command generator.
Convert the user's request into a clear, executable browser command.
Be specific about actions.
Output ONLY the command, no explanations.

Example:
User: "check my gmail"
Output: "open gmail.com, login if needed, count unread emails"
```

**User Prompt:**
```
${USER_TEXT}
```

**Output:**
- Variable name: `browser_command`
- Variable type: `String`

**Save this node**

---

## Node 4: Output (Browser Confirmation)

### Configuration:

**After the Browser LLM node**

#### Fields:

**output variable section:**
- Variable name: [output](file:///c:/TUYA/RankifyAssist/firmware/src/tuya_main.c#21-25)
- Variable type: Click dropdown → Select **"String"**

**Output Content:**
```
I plan to ${browser_command}. Proceed?
```

**Streamed Output:** OFF (toggle to left)

**Save and connect to End node**

---

## Node 5: Output (IoT Placeholder)

### Configuration:

**After Intent Recognition → "iot" output**

#### Fields:

**output variable section:**
- Variable name: [output](file:///c:/TUYA/RankifyAssist/firmware/src/tuya_main.c#21-25)
- Variable type: `String`

**Output Content:**
```
IoT control requested: ${USER_TEXT}
```

**Streamed Output:** OFF

**Save and connect to End node**

---

## Node 6: Large Model (Chat Answer)

### Configuration:

**After Intent Recognition → "chat" output**

#### Fields:

**Input:**
- Variable name: `input`
- Variable type: `String`
- Click dropdown → Select: **"Start" → USER_TEXT**

**Model:** Same as browser LLM

**Session History:** OFF

**System Prompt:**
```
You are a helpful AI assistant.
Answer clearly and concisely.
Keep responses brief but accurate.
```

**User Prompt:**
```
${USER_TEXT}
```

**Output:**
- Variable name: `chat_answer`
- Variable type: `String`

**Save this node**

---

## Node 7: Output (Other Intentions - Fallback)

### Configuration:

**After Intent Recognition → "Other intentions" output**

#### Fields:

**output variable section:**
- Variable name: output
- Variable type: `String`

**Output Content:**
```
I didn't understand that. Please try browser commands, IoT control, or ask me a question.
```

**Streamed Output:** OFF

**Save and connect to End node**

---

## Node 8: Output (Chat Answer)

### Configuration:

**After the Chat LLM node**

#### Fields:

**output variable section:**
- Variable name: [output](file:///c:/TUYA/RankifyAssist/firmware/src/tuya_main.c#21-25)
- Variable type: `String`

**Output Content:**
```
${chat_answer}
```

**Streamed Output:** OFF

**Save and connect to End node**

---

## Node 9: End (Already There ✅)

**Output variable section:**
- Variable name: [output](file:///c:/TUYA/RankifyAssist/firmware/src/tuya_main.c#21-25)
- Variable type: `String`

**Output Content:**
```
${output}
```

---

## 🔌 Critical: Connecting Intent Recognition Outputs

This is the MOST IMPORTANT part!

### How to Connect Each Intent:

After saving Intent Recognition node, you'll see **3 small dots** on the right side:

```
┌─────────────────┐
│ Intent Recog... │
│                 │● ← browser output (top)
│                 │● ← iot output (middle)  
│                 │● ← chat output (bottom)
└─────────────────┘
```

**Connect them:**
1. **Top dot (browser)** → Drag to Browser LLM node
2. **2nd dot (iot)** → Drag to IoT Output node
3. **3rd dot (chat)** → Drag to Chat LLM node
4. **Bottom dot (Other intentions)** → Drag to Other Intentions Output node

---

## 📊 Complete Flow with Variables

```
USER_TEXT (from device voice)
    ↓
Intent Recognition
    ├─ browser → LLM (input: USER_TEXT) → browser_command
    │                → Output: "I plan to ${browser_command}. Proceed?"
    │
    ├─ iot → Output: "IoT control: ${USER_TEXT}"
    │
    ├─ chat → LLM (input: USER_TEXT) → chat_answer
    │              → Output: "${chat_answer}"
    │
    └─ Other intentions → Output: "I didn't understand that..."
```

---

## ✅ Checklist Before Testing

- [ ] All 3 LLM system prompts filled
- [ ] All Output nodes have variable type = String
- [ ] Intent Recognition has 3 separate connections
- [ ] All paths connect to End node
- [ ] No red error nodes

---

## 🧪 Test Cases

**Test 1: Browser**
- Input: `check my gmail`
- Expected Output: "I plan to open gmail.com and check unread emails. Proceed?"

**Test 2: IoT**
- Input: `turn on lights`
- Expected Output: "IoT control requested: turn on lights"

**Test 3: Chat**
- Input: `what is 2+2`
- Expected Output: "The answer is 4" (or similar)

---

## 🎯 Quick Reference: Output Node Template

**EVERY Output node needs:**

```
output variable:
  ├─ Variable name: output
  ├─ Variable type: String (select from dropdown)
  
Output Content:
  └─ ${variable_name_from_previous_node}
  
Streamed Output: OFF
```

---

## 🔧 Troubleshooting

**Error: "Variable type cannot be empty"**
→ Click the dropdown next to variable type, select "String"

**Error: "Intent not connected"**
→ Use the small dots on Intent Recognition, not the main connector

**Node shows red border**
→ Click node, fill all required fields, save again

---

**Once all nodes configured and connected → Click "Test Run"!** 🚀
