# 📊 Tuya Platform Configuration Guide

Complete guide for setting up the Rankify Assist product on Tuya I oT Platform.

---

## ✅ What's Already Done

If you're using the pre-configured Rankify Assist:
- Product PID: `okqfzw6tkrabylcs`
- Custom DPs (101-106) defined
- AI Agent "Rankify Brain" created

**Skip to [Workflow Configuration](#workflow-configuration) if using pre-configured setup.**

---

## 🏗️ Creating From Scratch

### Step 1: Cloud Project Setup

1. **Login** to [Tuya IoT Platform](https://platform.tuya.com)
2. Navigate to **Cloud** → **Development**
3. Click **Create Cloud Project**
4. Configure:
   - Name: `Rankify Assist`
   - Industry: `Education/Campus`
   - Data Center: `India` (or your region)
   - Description: `Voice-controlled AI browser automation`
5. Click **Create**

### Step 2: Product Creation

1. Go to **Smart Home** → **Product Development**
2. Click **Create Product**
3. Select **Custom Solution**
4. Fill in:
   - Product Name: `Rankify Assist`
   - Category: `AI Speaker` or `Smart Home Hub`
5. Click **Create** and note the **PID**

---

## 🎛️ Data Points (DPs) Configuration

Navigate to your product → **Functions** tab

### Custom DPs to Create

| DP ID | Code | Name | Type | R/W Mode | Max Length |
|-------|------|------|------|----------|------------|
| 101 | `intent_type` | Intent Type | String | Report Only | 64 |
| 102 | `action_plan` | Action Plan | String | Report Only | 512 |
| 103 | `user_confirmation` | User Confirmation | Boolean | Send & Report | - |
| 104 | `exec_command` | Execution Command | String | Report Only | 512 |
| 105 | `exec_result` | Execution Result | String | Send & Report | 512 |
| 106 | `tts_text` | TTS Text | String | Report Only | 256 |

### Adding Each DP

1. Click **Add Function**
2. Select **Custom**
3. Fill in details from table above
4. Click **OK**
5. Repeat for all 6 DPs
6. Click **Publish** when done

---

## 🤖 AI Agent Configuration

### Step 1: Create AI Agent

1. Go to **AI Agent** → **Agent Management**
2. Click **Create Agent**
3. Configure:
   - **Name**: `Rankify Brain`
   - **Description**: `Voice AI for browser automation and smart home control`
   - **Data Center**: Same as your product
4. Click **Create**

### Step 2: Deploy to Product

1. In Agent details, find **Products** section
2. Click **Add Product**
3. Select your `Rankify Assist` product
4. Click **Deploy**

### Step 3: Voice Settings

Navigate to **Voice Interaction** section:

- **Input Language**: English
- **VAD Detection**: Graceful
- **Interruption**: Fast
- **Output Timbre**: (Optional) Configure custom voice

---

## 🔄 Workflow Configuration

### Step 1: Create Workflow

1. Go to **AI Agent** → **Workflow Management**
2. Click **Create Workflow**
3. Configure:
   - **Name**: `RANKIFY WORKFLOW`
   - **Description**: `5-phase voice automation workflow`
4. Click **Create**

### Step 2: Build Visual Workflow

**See detailed guide**: [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)

**Quick overview**:
```
Start (USER_TEXT)
  ↓
Intent Recognition (browser/iot/chat/other)
  ├─ browser → LLM → Output
  ├─ iot → Output
  ├─ chat → LLM → Output
  └─ other → Output
  ↓
End
```

### Step 3: Configure Nodes

**Intent Recognition:**
- Model: Gemini 2.5 Flash
- Intents: `browser`, `iot`, `chat`

**Browser LLM:**
- System Prompt: Command generator
- Output: `browser_command`

**Chat LLM:**
- System Prompt: Q&A assistant
- Output: `chat_answer`

**Outputs:**
- Browser: `"I plan to ${browser_command}. Proceed?"`
- IoT: `"IoT control: ${USER_TEXT}"`
- Chat: `"${chat_answer}"`
- Other: `"I didn't understand that..."`

### Step 4: Test & Publish

1. Click **Test Run**
2. Test inputs:
   - `"check my gmail"` → browser path
   - `"turn on lights"` → iot path
   - `"what is 2+2"` → chat path
3. If all pass → Click **Publish**

### Step 5: Link to Agent

1. Go back to **AI Agent** → **Rankify Brain**
2. Find **Dialogue Flow** section
3. Click **Add Workflow**
4. Select `RANKIFY WORKFLOW`
5. Click **Save**

---

## 🔌 API Access

### Getting API Credentials

1. In Cloud Project, go to **Overview**
2. Note:
   - **Access ID** (Client ID)
   - **Access Secret** (Client Secret)
3. Also find:
   - **Endpoint**: Based on datacenter (e.g., `https://openapi.tuyain.com`)

### API Rate Limits

- Standard: 1000 requests/day
- Upgrade to paid tier for higher limits

---

## ✅ Final Checklist

Before deploying:

- [ ] Cloud project created
- [ ] Product created with PID
- [ ] All 6 DPs defined and published
- [ ] AI Agent created and deployed to product
- [ ] Workflow built and published
- [ ] Workflow linked to AI Agent
- [ ] API credentials noted
- [ ] Device (if available) paired

---

**Next Steps**: [Set up Chrome Extension](SETUP.md#chrome-extension-setup)
