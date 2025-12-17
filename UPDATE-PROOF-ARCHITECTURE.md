# 🏗️ UPDATE-PROOF ARCHITECTURE - FINAL

## ✅ Architecture Overview

```
c:\TUYA\
├── nanobrowser/                          # OFFICIAL SOURCE (DON'T TOUCH)
│   ├── .git/                             # Git repo
│   └── [Official nanobrowser files]      # Updated via: git pull
│
└── RankifyAssist/
    ├── nanobrowser-working/              # YOUR EXTENSION
    │   ├── [Official built files]        # Copied from dist/
    │   └── extensions/                   # 🔒 UPDATE-PROOF ZONE
    │       └── tuya-integration/
    │           ├── tuya-controller.js    # IoT device control
    │           ├── tuya-background.js    # Keyboard shortcuts & menu
    │           ├── tuya-settings.html    # Settings UI
    │           ├── tuya-settings.js      # Settings logic
    │           └── README.md             # Documentation
    └── update-nanobrowser.ps1            # Auto-update script
```

## 🔑 Key Principles

### ✅ DO:
- **Modify files in:** `RankifyAssist/nanobrowser-working/extensions/`
- **Add files in:** `extensions/tuya-integration/`
- **Edit:** `manifest.json` (backed up automatically)

### ❌ DON'T:
- **Modify:** `c:\TUYA\nanobrowser/` (official source)
- **Edit:** Any `.tsx` or `.ts` files in source
- **Touch:** Any file outside `extensions/` folder

## 🔄 Update Process

### When Nanobrowser Updates:

**Option 1: Manual (Safest)**
```powershell
# 1. Pull latest source
cd c:\TUYA\nanobrowser
git pull

# 2. Rebuild
pnpm install
pnpm build

# 3. Update working copy (preserves extensions/)
Get-ChildItem "dist\*" | Where-Object { $_.Name -ne "extensions" } | 
  Copy-Item -Destination "c:\TUYA\RankifyAssist\nanobrowser-working\" -Recurse -Force

# 4. Reload extension in Chrome
```

**Option 2: Automated (Use Provided Script)**
```powershell
c:\TUYA\RankifyAssist\update-nanobrowser.ps1
```

### What Gets Updated:
- ✅ Nanobrowser official files
- ✅ Bug fixes and new features
- ✅ Security patches

### What Stays Safe:
- 🔒 `extensions/tuya-integration/` (your custom code)
- 🔒 Tuya controller logic
- 🔒 Tuya settings UI
- 🔒 All your customizations

## 📁 File Manifest

### Official Files (Auto-Updated):
```
background.iife.js         # Nanobrowser core
content/index.iife.js      # Page interaction
options/index.html         # Settings UI
side-panel/index.html      # Main UI
manifest.json              # Extension config
```

### Your Files (Protected):
```
extensions/tuya-integration/tuya-controller.js    # Device control
extensions/tuya-integration/tuya-background.js    # Shortcuts
extensions/tuya-integration/tuya-settings.html    # UI
extensions/tuya-integration/tuya-settings.js      # Logic
extensions/tuya-integration/README.md             # Docs
```

## 🎯 How It Works

### 1. Tuya Controller (Content Script)
- **File:** `tuya-controller.js`
- **Loads:** On every webpage
- **Purpose:** Receives commands from AI agent
- **Storage:** Reads from `chrome.storage.local.tuya_config`

### 2. Tuya Background (Service Worker)
- **File:** `tuya-background.js`
- **Purpose:** Keyboard shortcuts, context menu
- **Shortcut:** `Ctrl+Shift+T` → Opens Tuya settings
- **Menu:** Right-click extension icon → "🏠 Tuya Smart Home Settings"

### 3. Tuya Settings (Standalone Page)
- **File:** `tuya-settings.html`
- **Access:** Via shortcut or context menu
- **Saves To:** `chrome.storage.local.tuya_config`
- **Format:**
  ```json
  {
    "enabled": true,
    "clientId": "...",
    "clientSecret": "...",
    "baseUrl": "https://openapi.tuyaus.com"
  }
  ```

## 🛡️ Why This Works

1. **No Source Modifications**
   - Official `nanobrowser/` repo stays clean
   - `git pull` never conflicts
   - No merge issues

2. **Isolated Extensions**
   - All custom code in `extensions/`
   - Update script excludes this folder
   - Your code survives updates

3. **Manifest Patching**
   - `manifest.json` edited in working copy only
   - Source manifest untouched
   - Easy to re-apply changes

## 🚀 Access Tuya Settings

### Method 1: Keyboard Shortcut
Press `Ctrl+Shift+T`

### Method 2: Context Menu
1. Right-click Nanobrowser extension icon
2. Click "🏠 Tuya Smart Home Settings"

### Method 3: Direct URL
Navigate to: `chrome-extension://[YOUR-ID]/extensions/tuya-integration/tuya-settings.html`

## 📝 Adding More Extensions

Want to add more custom modules? Follow this pattern:

```
extensions/
└── your-custom-module/
    ├── controller.js         # Content script logic
    ├── background.js         # Service worker logic
    ├── settings.html         # Settings UI
    ├── settings.js           # Settings logic
    └── README.md             # Documentation
```

Then update `manifest.json`:
```json
"content_scripts": [{
  "js": [
    "extensions/your-custom-module/controller.js",
    "extensions/tuya-integration/tuya-controller.js",
    "content/index.iife.js"
  ]
}]
```

## ✅ Verification Checklist

After updates, verify:
- [ ] Extensions folder still exists
- [ ] Tuya settings page loads (`Ctrl+Shift+T`)
- [ ] Settings save correctly
- [ ] Controller loads on webpages (check console: "🏠 [TUYA] Controller loaded")
- [ ] Nanobrowser features work normally

---

**Updated:** 2025-12-17  
**Architecture:** v2.0 (Truly Update-Proof)  
**Status:** ✅ Production Ready
