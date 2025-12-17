# 🏗️ NANOBROWSER + TUYA INTEGRATION

**Architecture:** Update-proof modular design

## 📁 Directory Structure

```
nanobrowser-working/
├── [OFFICIAL NANOBROWSER FILES]  # Don't modify these
├── extensions/                    # Custom extensions (update-proof)
│   └── tuya-integration/          # Tuya smart home integration
│       ├── tuya-controller.js     # Tuya device control logic
│       ├── tuya-tools.json        # Tool definitions for LLM
│       └── README.md              # Tuya integration docs
└── custom-manifest.json           # Extended manifest (merged on build)
```

## 🔄 Update Process

When nanobrowser updates:

1. **Rebuild official nanobrowser:**
   ```bash
   cd c:\TUYA\nanobrowser
   git pull
   pnpm install
   pnpm build
   ```

2. **Copy new build:**
   ```bash
   Copy-Item -Path "c:\TUYA\nanobrowser\dist\*" -Destination "c:\TUYA\RankifyAssist\nanobrowser-working\" -Recurse -Force -Exclude "extensions"
   ```

3. **Your Tuya integration stays intact!**
   The `extensions/` folder is excluded from updates.

## 🚀 Installation

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: `c:\TUYA\RankifyAssist\nanobrowser-working`

## 🔧 Tuya Integration

See `extensions/tuya-integration/README.md` for setup instructions.

---

**Built:** 2025-12-17  
**Nanobrowser Version:** Latest (cloned from GitHub)  
**Status:** Production-ready with modular Tuya extension
