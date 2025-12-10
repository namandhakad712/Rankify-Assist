# 🤖 Rankify Assist

<div align="center">

![Rankify Assist Banner](https://img.shields.io/badge/Rankify-Assist-blue?style=for-the-badge&logo=google-chrome)

**Voice-Controlled AI Browser Automation powered by Tuya IoT & Eko Agent**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=flat-square&logo=googlechrome)](extension-ready/)
[![Tuya Platform](https://img.shields.io/badge/Tuya-IoT%20Platform-orange?style=flat-square&logo=smart-home)](https://platform.tuya.com)
[![T5-E1](https://img.shields.io/badge/Hardware-T5--E1-red?style=flat-square)](#hardware-requirements)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

## 🎯 What is Rankify Assist?

Rankify Assist is an **intelligent voice-controlled system** that bridges IoT devices with browser automation. Speak to your Tuya T5 AI Core board, and watch as it executes complex browser tasks, controls smart home devices, or answers questions — all through a sophisticated 5-phase AI workflow.

```
🗣️ "Check my Gmail" → 🤖 AI Classification → ✅ Safety Check → 🌐 Browser Opens → 📧 Result Spoken
```

### 🌟 Key Highlights

- 🎙️ **Voice-First Interface** - Natural language commands via Tuya T5-E1 board
- 🧠 **AI-Powered Intent Classification** - Smart routing for browser/IoT/chat tasks
- 🛡️ **Safety Confirmation Protocol** - Ask before executing critical actions
- 🌐 **Browser Automation** - Powered by Eko agent for web tasks
- 🏠 **Smart Home Control** - Seamless IoT device management
- ☁️ **Cloud-Orchestrated** - Tuya Cloud workflows handle all logic

---

## ✨ Features

### 🎯 Multi-Intent Processing

| Intent Type | Description | Example |
|------------|-------------|---------|
| 🌐 **Browser Tasks** | Web automation via Eko | "Check my Gmail", "Search Wikipedia for Python" |
| 🏠 **IoT Control** | Smart device commands | "Turn on living room lights", "Set AC to 22°C" |
| 💬 **Knowledge Chat** | Q&A and calculations | "What's the capital of France?", "Calculate 25 × 4" |

### 🔄 5-Phase Workflow

```mermaid
graph LR
    A[🎙️ Voice Input] --> B[🤖 AI Classification]
    B --> C[✅ Safety Check]
    C --> D[⚡ Execution]
    D --> E[🔊 TTS Feedback]
    
    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#FF9800
    style D fill:#9C27B0
    style E fill:#F44336
```

1. **Voice Input** - T5-E1 captures voice, sends to cloud STT
2. **AI Classification** - Cloud workflow analyzes intent and creates action plan
3. **Safety Check** - System asks for confirmation before executing
4. **Multi-Intent Execution** - Routes to browser (Eko), IoT, or direct chat response
5. **TTS Feedback** - Result spoken back to user

---

## 🚀 Quick Start

### Prerequisites

- ✅ **Chrome Browser** (v88+)
- ✅ **Tuya Developer Account** ([Sign up](https://platform.tuya.com))
- ✅ **Tuya T5-E1 AI Core Board** (optional for full workflow)
- ✅ **LLM API Key** (OpenAI, Anthropic, Cerebras, etc.)

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/namandhakad712/rankify-assist.git
cd rankify-assist
```

#### 2. Load Chrome Extension

```bash
# Navigate to extension directory
cd extension-ready

# Load in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the extension-ready folder
```

#### 3. Configure Extension

1. Right-click extension icon → **Options**
2. Fill in **Tuya Cloud Settings**:
   - Region: `IN` (or your datacenter)
   - Access ID: From [Tuya Console](https://platform.tuya.com)
   - Access Secret: From Tuya Console
   - Device ID: (after pairing T5-E1)

3. Fill in **LLM Configuration**:
   - Provider: `openai` / `anthropic` / `cerebras` / etc.
   - Model: `gpt-4o` / `claude-3-5-sonnet` / etc.
   - API Key: Your LLM provider API key

4. Click **Save Configuration**

---

## 🏗️ Architecture

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                        USER SPEAKS                           │
│                    "Check my Gmail"                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    T5-E1 AI Core Board                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Voice    │───▶│ To Cloud │───▶│ Play TTS │              │
│  │ Capture  │    │   STT    │    │ Response │              │
│  └──────────┘    └──────────┘    └──────────┘              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tuya Cloud Platform                       │
│  ┌───────────────────────────────────────────────────┐      │
│  │           Visual Workflow (RANKIFY WORKFLOW)       │      │
│  │                                                    │      │
│  │  Intent Recognition → Browser/IoT/Chat Routing    │      │
│  │        ↓                ↓              ↓           │      │
│  │    Browser LLM      IoT Agent      Chat LLM       │      │
│  │        ↓                ↓              ↓           │      │
│  │     DP 104          Device CMD      Direct Answer │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Chrome Extension (Eko)                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Poll DP  │───▶│  Parse   │───▶│ Execute  │              │
│  │   104    │    │ Command  │    │ Browser  │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                                              │
│                        Report Result                         │
│                        DP 105 ──────────────────────────────▶│
└─────────────────────────────────────────────────────────────┘
```

</div>

### 🔧 Component Breakdown

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **T5-E1 Firmware** | C (TuyaOpen SDK) | Voice I/O, TTS playback, DP updates |
| **Tuya Cloud** | Visual Workflow | Intent classification, AI orchestration |
| **Chrome Extension** | JavaScript (Eko) | Browser automation execution |
| **LLM Integration** | OpenAI/Claude/etc. | Command generation, Q&A |

---

## 📚 Documentation

### 📖 Core Guides

- 📘 [**Complete Setup Guide**](docs/SETUP.md) - Detailed installation & configuration
- 🎯 [**Platform Configuration**](docs/PLATFORM_CONFIG.md) - Tuya Console setup
- 🔄 [**Workflow Builder Guide**](docs/WORKFLOW_GUIDE.md) - Visual workflow creation
- 🔧 [**Extension Development**](docs/EXTENSION_DEV.md) - Code structure & API
- 💻 [**Firmware Guide**](docs/FIRMWARE_GUIDE.md) - T5-E1 programming

### 🎓 Tutorials

- 🚀 [Quick Start in 5 Minutes](docs/quickstart.md)
- 🧪 [Testing Without Hardware](docs/testing-no-hardware.md)
- 🐛 [Troubleshooting Guide](docs/troubleshooting.md)

---

## 🎬 Demo

> **Note:** Hardware demo coming soon! Device is in transit.

### Extension in Action

![Extension Options](docs/images/extension-options.png)
*Configuring Tuya credentials and LLM settings*

### Workflow Visualization

![Workflow Builder](docs/images/workflow-visual.png)
*Intent classification with 4-branch routing logic*

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Hardware** | ![T5-E1](https://img.shields.io/badge/T5--E1-AI%20Core-red?style=flat-square) |
| **Cloud** | ![Tuya](https://img.shields.io/badge/Tuya-Cloud-orange?style=flat-square) ![Workflow](https://img.shields.io/badge/Visual-Workflow-blue?style=flat-square) |
| **Frontend** | ![Chrome](https://img.shields.io/badge/Chrome-Extension-green?style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=flat-square) |
| **AI/ML** | ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square) ![Claude](https://img.shields.io/badge/Anthropic-Claude-8B4513?style=flat-square) |
| **Automation** | ![Eko](https://img.shields.io/badge/Eko-Agent-purple?style=flat-square) |
| **Firmware** | ![C](https://img.shields.io/badge/C-TuyaOpen%20SDK-00599C?style=flat-square) |

</div>

---

## 📂 Project Structure

```
rankify-assist/
├── 📁 extension-ready/         # ⭐ Main Chrome Extension (No Build Required)
│   ├── manifest.json          # Extension manifest
│   ├── options.html           # Configuration UI
│   ├── options.js             # Settings management
│   └── js/
│       ├── background.js      # Eko agent (precompiled)
│       └── tuya_integration.js # DP polling & execution
│
├── 📁 firmware/                # T5-E1 Board Firmware
│   ├── src/
│   │   ├── tuya_main.c        # Main entry point
│   │   └── app_chat_bot.c     # Voice & DP handling
│   ├── include/
│   │   └── tuya_config.h      # PID, UUID, AuthKey
│   └── project_build.ini      # Build configuration
│
├── 📁 docs/                    # Documentation
│   ├── SETUP.md
│   ├── PLATFORM_CONFIG.md
│   ├── WORKFLOW_GUIDE.md
│   └── images/
│
├── 📁 .github/                 # GitHub configs
│   └── workflows/
│       └── ci.yml
│
├── README.md                   # This file
├── LICENSE                     # MIT License
└── .gitignore
```

---

## 🔐 Security & Privacy

- 🔒 **API keys stored locally** in Chrome storage (sync)
- 🛡️ **No telemetry** - your data stays with you
- ✅ **Safety confirmation** required for critical actions
- 🔑 **Tuya credentials** never exposed in code

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

### Development Setup

```bash
# Fork & clone
git clone https://github.com/YOUR_USERNAME/rankify-assist.git
cd rankify-assist

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes, test, commit
git commit -m "Add amazing feature"

# Push & create PR
git push origin feature/amazing-feature
```

---

## 📜 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Tuya IoT Platform](https://platform.tuya.com) - Cloud infrastructure & AI Agent framework
- [Eko Browser Agent](https://github.com/EkoLabs/eko) - Browser automation engine
- [TuyaOpen SDK](https://github.com/tuya/tuya-open-sdk-for-device) - Firmware development tools

---

## 📧 Contact & Support

- **Creator**: [Naman Dhakad](https://github.com/namandhakad712)
- **Issues**: [GitHub Issues](https://github.com/namandhakad712/rankify-assist/issues)
- **Discussions**: [GitHub Discussions](https://github.com/namandhakad712/rankify-assist/discussions)

---

<div align="center">

**Built with ❤️ using Tuya IoT Platform**

[![Star this repo](https://img.shields.io/github/stars/namandhakad712/rankify-assist?style=social)](https://github.com/namandhakad712/rankify-assist)
[![Follow me](https://img.shields.io/github/followers/namandhakad712?style=social)](https://github.com/namandhakad712)

</div>
