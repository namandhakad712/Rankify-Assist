<div align="center">

# 🎯 Rankify Assist

<img src="logo.png" alt="Rankify Assist Logo" width="200" height="200" />

### *Voice-Controlled AI Browser Automation*
**Powered by Tuya IoT & Eko Agent**

<p align="center">
  <img src="https://img.shields.io/badge/🎙️_Voice-Activated-4CAF50?style=for-the-badge&labelColor=1a1a1a" alt="Voice Activated"/>
  <img src="https://img.shields.io/badge/🤖_AI-Powered-2196F3?style=for-the-badge&labelColor=1a1a1a" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/🌐_Browser-Automation-FF9800?style=for-the-badge&labelColor=1a1a1a" alt="Browser Automation"/>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-✨-9C27B0?style=flat-square" alt="Features"/></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-🚀-00BCD4?style=flat-square" alt="Quick Start"/></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-🏗️-FF5722?style=flat-square" alt="Architecture"/></a>
  <a href="#-documentation"><img src="https://img.shields.io/badge/Docs-📚-673AB7?style=flat-square" alt="Documentation"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome"/>
  <img src="https://img.shields.io/badge/Tuya-IoT_Platform-FF6B00?style=flat-square&logo=smart-home&logoColor=white" alt="Tuya"/>
  <img src="https://img.shields.io/badge/Hardware-T5--E1-E91E63?style=flat-square&logo=raspberry-pi&logoColor=white" alt="T5-E1"/>
  <img src="https://img.shields.io/badge/License-MIT-03A9F4?style=flat-square" alt="MIT License"/>
</p>

---

### 💬 *"Check my Gmail"* → 🤖 AI Classification → ✅ Safety Check → 🌐 Browser Opens → 📧 *"You have 3 unread emails"*

</div>

<br/>

## ✨ Features

<table>
<tr>
<td width="33%" align="center">

### 🎙️ **Voice-First**
Natural language commands via<br/>Tuya T5-E1 AI Core

<img src="https://img.shields.io/badge/STT-Speech_to_Text-4CAF50?style=for-the-badge&logo=google-assistant&logoColor=white"/>

</td>
<td width="33%" align="center">

### 🧠 **AI-Powered**
Smart intent classification<br/>Browser • IoT • Chat

<img src="https://img.shields.io/badge/LLM-GPT_•_Claude-2196F3?style=for-the-badge&logo=openai&logoColor=white"/>

</td>
<td width="33%" align="center">

### 🛡️ **Safety First**
Confirmation protocol for<br/>critical actions

<img src="https://img.shields.io/badge/TTS-Text_to_Speech-FF9800?style=for-the-badge&logo=google-home&logoColor=white"/>

</td>
</tr>
</table>

<br/>

## 🎯 Multi-Intent Processing

<div align="center">

| 🌐 **Browser Tasks** | 🏠 **IoT Control** | 💬 **Knowledge Chat** |
|:---:|:---:|:---:|
| Web automation via Eko | Smart device commands | Q&A and calculations |
| *"Check my Gmail"* | *"Turn on lights"* | *"What's 2+2?"* |
| *"Search Wikipedia"* | *"Set AC to 22°C"* | *"Capital of France?"* |

</div>

<br/>

## 🔄 5-Phase Workflow

<div align="center">

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  🎙️ PHASE 1 │ ───▶ │  🤖 PHASE 2 │ ───▶ │  ✅ PHASE 3 │ ───▶ │  ⚡ PHASE 4 │ ───▶ │  🔊 PHASE 5 │
│             │      │             │      │             │      │             │      │             │
│    Voice    │      │     AI      │      │   Safety    │      │  Execute    │      │     TTS     │
│    Input    │      │  Classify   │      │    Check    │      │   Action    │      │  Feedback   │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
  T5-E1 Board       Tuya Workflow        Confirmation         Browser/IoT         Spoken Result
```

</div>

<details>
<summary><b>📊 Detailed Phase Breakdown</b></summary>

| Phase | Component | Input | Output | Duration |
|:---:|-----------|-------|--------|----------|
| **1️⃣** | T5-E1 Board | Voice audio | Text command | ~1s |
| **2️⃣** | Tuya Workflow | Text | Intent + Plan | ~2s |
| **3️⃣** | T5-E1 + User | Plan | Confirmation | ~3-5s |
| **4️⃣** | Extension/IoT | Command | Result | ~2-10s |
| **5️⃣** | T5-E1 Board | Result text | Voice output | ~1s |

</details>

<br/>

## 🚀 Quick Start

<div align="center">

### 📦 Installation in 3 Steps

</div>

<table>
<tr>
<td width="33%" align="center" valign="top">

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/rankify-assist.git
cd rankify-assist
```

</td>
<td width="33%" align="center" valign="top">

#### 2️⃣ Load Extension

```bash
chrome://extensions/
→ Developer mode: ON
→ Load unpacked
→ Select: extension-ready/
```

</td>
<td width="33%" align="center" valign="top">

#### 3️⃣ Configure

```bash
Right-click extension
→ Options
→ Enter credentials
→ Save
```

</td>
</tr>
</table>

<div align="center">

### 🔑 Required Credentials

| Service | Required | Get From |
|---------|----------|----------|
| **Tuya Cloud** | Access ID + Secret | [Tuya Console](https://platform.tuya.com) |
| **LLM Provider** | API Key | OpenAI / Anthropic / Cerebras |
| **T5-E1 Device** | Device ID | Tuya Smart App (after pairing) |

</div>

<br/>

## 🏗️ Architecture

<div align="center">

### 🔗 Component Flow

</div>

```
                    ┌─────────────────────────────────┐
                    │     👤 USER SPEAKS              │
                    │   "Check my Gmail"              │
                    └────────────┬────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────────┐
        │         🎙️ T5-E1 AI CORE BOARD                │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
        │  │  Voice   │─▶│ Cloud    │─▶│   TTS    │    │
        │  │ Capture  │  │   STT    │  │ Playback │    │
        │  └──────────┘  └──────────┘  └──────────┘    │
        └────────────────────┬───────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────────┐
        │         ☁️ TUYA CLOUD PLATFORM                 │
        │  ┌─────────────────────────────────────┐      │
        │  │  🔄 VISUAL WORKFLOW                  │      │
        │  │                                      │      │
        │  │  Intent Recognition                  │      │
        │  │     ├─▶ 🌐 Browser → LLM → DP 104   │      │
        │  │     ├─▶ 🏠 IoT     → Agent → CMD    │      │
        │  │     └─▶ 💬 Chat    → LLM → Answer   │      │
        │  └─────────────────────────────────────┘      │
        └────────────────────┬───────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────────┐
        │       🌐 CHROME EXTENSION (EKO)                │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
        │  │ Poll DP  │─▶│  Parse   │─▶│ Execute  │    │
        │  │   104    │  │   JSON   │  │ Browser  │    │
        │  └──────────┘  └──────────┘  └──────────┘    │
        │                     │                          │
        │                     └─▶ Report DP 105         │
        └────────────────────────────────────────────────┘
```

<br/>

## 🛠️ Tech Stack

<div align="center">

<table>
<tr>
<td align="center" width="20%">

**Hardware**

<img src="https://img.shields.io/badge/Tuya-T5--E1-E91E63?style=for-the-badge&logo=raspberry-pi&logoColor=white"/>

</td>
<td align="center" width="20%">

**Cloud**

<img src="https://img.shields.io/badge/Tuya-Platform-FF6B00?style=for-the-badge&logo=icloud&logoColor=white"/>

</td>
<td align="center" width="20%">

**Frontend**

<img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white"/>

</td>
<td align="center" width="20%">

**AI/ML**

<img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white"/>

</td>
<td align="center" width="20%">

**Automation**

<img src="https://img.shields.io/badge/Eko-Agent-9C27B0?style=for-the-badge&logo=robot&logoColor=white"/>

</td>
</tr>
</table>

</div>

<br/>

## 📚 Documentation

<div align="center">

<table>
<tr>
<td width="50%" align="center">

### 📖 **Core Guides**

📘 [Complete Setup Guide](docs/SETUP.md)<br/>
🎯 [Platform Configuration](docs/PLATFORM_CONFIG.md)<br/>
🔄 [Workflow Builder](docs/WORKFLOW_GUIDE.md)<br/>
🔧 [Extension Development](docs/EXTENSION_DEV.md)<br/>
💻 [Firmware Guide](docs/FIRMWARE_GUIDE.md)

</td>
<td width="50%" align="center">

### 🎓 **Resources**

🔐 Security & Privacy Best Practices<br/>
🧪 Testing Without Hardware<br/>
🐛 Troubleshooting Common Issues<br/>
🤝 Contributing Guidelines<br/>
📜 MIT License

</td>
</tr>
</table>

</div>

<br/>

## 📂 Project Structure

<details>
<summary><b>🗂️ Click to expand directory tree</b></summary>

```
rankify-assist/
│
├── 📁 extension-ready/         ⭐ Main Chrome Extension
│   ├── manifest.json
│   ├── options.html
│   ├── options.js
│   └── js/
│       ├── background.js       # Eko agent
│       └── tuya_integration.js # DP polling
│
├── 📁 firmware/                 🔧 T5-E1 Board Firmware
│   ├── src/
│   │   ├── tuya_main.c
│   │   └── app_chat_bot.c
│   ├── include/
│   │   └── tuya_config.h
│   └── project_build.ini
│
├── 📁 docs/                     📚 Documentation
│   ├── SETUP.md
│   ├── PLATFORM_CONFIG.md
│   ├── WORKFLOW_GUIDE.md
│   └── images/
│
├── README.md                    📄 This file
├── LICENSE                      ⚖️ MIT License
└── .gitignore
```

</details>

<br/>

## 🔐 Security & Privacy

<div align="center">

| Feature | Implementation | Status |
|:---:|---|:---:|
| 🔒 | API keys stored locally (Chrome sync storage) | ✅ |
| 🛡️ | No telemetry - your data stays private | ✅ |
| ✅ | Safety confirmation for critical actions | ✅ |
| 🔑 | Credentials never exposed in code | ✅ |

</div>

<br/>

## 🤝 Contributing

<div align="center">

Contributions are **welcome**! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

<img src="https://img.shields.io/badge/PRs-Welcome-4CAF50?style=for-the-badge&logo=github" alt="PRs Welcome"/>

</div>

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

<br/>

## 📜 License

<div align="center">

This project is licensed under the **MIT License**

See [LICENSE](LICENSE) file for details

</div>

<br/>

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ using**

<p>
  <img src="https://img.shields.io/badge/Tuya-IoT_Platform-FF6B00?style=for-the-badge&logo=iot&logoColor=white" alt="Tuya"/>
  <img src="https://img.shields.io/badge/Eko-Browser_Agent-9C27B0?style=for-the-badge&logo=robot&logoColor=white" alt="Eko"/>
  <img src="https://img.shields.io/badge/TuyaOpen-SDK-00BCD4?style=for-the-badge&logo=c&logoColor=white" alt="TuyaOpen"/>
</p>

Thanks to:
- [Tuya IoT Platform](https://platform.tuya.com) - Cloud infrastructure & AI Agent framework
- [Eko Browser Agent](https://github.com/EkoLabs/eko) - Browser automation engine
- [TuyaOpen SDK](https://github.com/tuya/tuya-open-sdk-for-device) - Firmware development tools

</div>

<br/>

## 📧 Contact & Support

<div align="center">

**Need Help?**

<p>
  <a href="https://github.com/YOUR_USERNAME/rankify-assist/issues">
    <img src="https://img.shields.io/badge/Issues-Report_Bug-E91E63?style=for-the-badge&logo=github" alt="Issues"/>
  </a>
  <a href="https://github.com/YOUR_USERNAME/rankify-assist/discussions">
    <img src="https://img.shields.io/badge/Discussions-Ask_Question-2196F3?style=for-the-badge&logo=github" alt="Discussions"/>
  </a>
</p>

**Pull Requests Contributions Welcome!**

</div>

<br/>

---

<div align="center">

### ⭐ **Star this repo if you find it helpful!**

<sub>Made with 💜 by the community | Powered by Tuya IoT | Licensed under MIT</sub>

</div>
