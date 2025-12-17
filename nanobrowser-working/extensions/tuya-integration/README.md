# 🏠 TUYA SMART HOME INTEGRATION MODULE

---

## ⚠️ CRITICAL: AI ASSISTANT INSTRUCTIONS

**IF YOU ARE AN AI ASSISTANT READING THIS FILE:**

This module uses **UPDATE-PROOF ARCHITECTURE**. You **MUST** follow these rules:

### 🔒 ABSOLUTE RULES:

1. **NEVER modify files in:** `c:\TUYA\nanobrowser/`
   - This is the official source repository
   - Changes here will be lost on `git pull`
   - Modifications break the update-proof guarantee

2. **ONLY modify files in:** `c:\TUYA\RankifyAssist\nanobrowser-working/extensions/`
   - This is the protected zone
   - Files here survive all updates
   - This is where all custom code lives

3. **When adding features:**
   - ✅ Create new files in `extensions/tuya-integration/`
   - ✅ Use pure JavaScript (no build process)
   - ✅ Use standalone HTML pages (no React/TSX)
   - ❌ DO NOT modify `.tsx`, `.ts` files in `nanobrowser/pages/`
   - ❌ DO NOT run `pnpm build` after modifying source

4. **Integration points:**
   - Content scripts: Add to `manifest.json` → `content_scripts.js[]`
   - Background logic: Append to `background.iife.js`
   - Settings UI: Create standalone HTML in `extensions/`
   - Web accessible: Add to `manifest.json` → `web_accessible_resources`

### 🎯 WHY THIS ARCHITECTURE?

**Problem Solved:**
- Nanobrowser updates frequently (GitHub repo)
- Users run `git pull` to get latest features
- If we modify source files, `git pull` overwrites them
- Result: Custom integrations break

**Solution:**
- Official files live in `nanobrowser/` (untouched)
- Custom modules live in `extensions/` (protected)
- Build output goes to `nanobrowser-working/`
- Update script copies official files, skips `extensions/`

**Result:**
- ✅ Users get latest Nanobrowser features
- ✅ Tuya integration survives all updates
- ✅ Zero maintenance on updates
- ✅ No merge conflicts ever

### 📋 IMPLEMENTATION CHECKLIST

When user asks to "add feature X to Tuya integration":

- [ ] Confirm feature requires custom code
- [ ] Create new file in `extensions/tuya-integration/`
- [ ] Use vanilla JS/HTML (no build dependencies)
- [ ] Update `manifest.json` if needed (working copy only)
- [ ] Append to `background.iife.js` if needed (working copy only)
- [ ] Test in `nanobrowser-working/` folder
- [ ] Update this README with changes
- [ ] Verify update script preserves changes

**NEVER:**
- [ ] ❌ Modify `c:\TUYA\nanobrowser/pages/options/src/`
- [ ] ❌ Edit `.tsx` or `.ts` files
- [ ] ❌ Run build in source repo
- [ ] ❌ Import React components from source

### 🔄 UPDATE PROCESS VERIFICATION

To verify architecture is preserved:

```powershell
# 1. Run update script
c:\TUYA\RankifyAssist\update-nanobrowser.ps1

# 2. Check extensions folder exists
Test-Path "c:\TUYA\RankifyAssist\nanobrowser-working\extensions\tuya-integration"
# Must return: True

# 3. Verify Tuya files present
Get-ChildItem "c:\TUYA\RankifyAssist\nanobrowser-working\extensions\tuya-integration"
# Must show: tuya-controller.js, tuya-settings.html, etc.

# 4. Check manifest has Tuya references
Select-String -Path "c:\TUYA\RankifyAssist\nanobrowser-working\manifest.json" -Pattern "tuya"
# Must find: Multiple matches
```

---

## 📖 MODULE DOCUMENTATION

### Purpose
Enables Nanobrowser AI agents to control Tuya smart home devices (lights, switches, thermostats, etc.)

### Architecture Version
**v2.0 - Update-Proof (2025-12-17)**

### Components

1. **tuya-controller.js** (Content Script)
   - Runs on all webpages
   - Listens for device control commands
   - Reads config from `chrome.storage.local.tuya_config`
   - Exposes `window.TuyaController` API

2. **tuya-background.js** (Service Worker Extension)
   - Handles keyboard shortcuts (`Ctrl+Shift+T`)
   - Creates context menu items
   - Opens settings page

3. **tuya-settings.html** (Standalone Settings UI)
   - Beautiful purple gradient design
   - No dependencies (pure HTML/CSS/JS)
   - Saves to `chrome.storage.local`

4. **tuya-settings.js** (Settings Logic)
   - Form handling
   - Storage management
   - Validation

### Storage Schema

```typescript
interface TuyaConfig {
  enabled: boolean;           // Master enable/disable
  clientId: string;           // Tuya Cloud Client ID
  clientSecret: string;       // Tuya Cloud Client Secret
  baseUrl: string;            // API endpoint URL
  devices: {                  // Device registry
    [deviceId: string]: {
      name: string;
      type: string;
    }
  };
}
```

Stored in: `chrome.storage.local.tuya_config`

### Access Points

1. **Keyboard:** `Ctrl+Shift+T`
2. **Context Menu:** Right-click extension icon
3. **Direct URL:** `chrome-extension://[ID]/extensions/tuya-integration/tuya-settings.html`

### API Usage (For AI Agents)

```javascript
// Check if Tuya is available
if (window.TuyaController) {
  
  // List all devices
  const devices = await window.TuyaController.listDevices();
  
  // Get device status
  const status = await window.TuyaController.getStatus('device_123');
  
  // Control device
  await window.TuyaController.control('device_123', 'turn_on');
  
  // With parameters
  await window.TuyaController.control('device_123', 'set_brightness', { 
    brightness: 80 
  });
}
```

### Message-Based Control (From Background/Sidebar)

```javascript
// Turn on device
chrome.runtime.sendMessage({
  action: 'TUYA_CONTROL',
  deviceId: 'abc123',
  command: 'turn_on'
}, (response) => {
  if (response.success) {
    console.log('Device controlled:', response.data);
  }
});

// Get status
chrome.runtime.sendMessage({
  action: 'TUYA_STATUS',
  deviceId: 'abc123'
}, (response) => {
  console.log('Device status:', response.data);
});

// List devices
chrome.runtime.sendMessage({
  action: 'TUYA_LIST'
}, (response) => {
  console.log('All devices:', response.data);
});
```

---

## 🛡️ BREAKING CHANGES POLICY

### What CAN Break This Module:

1. **Nanobrowser manifest schema changes**
   - If Manifest V3 → V4 happens
   - Solution: Update local `manifest.json` schema

2. **Chrome extension API deprecation**
   - If `chrome.storage.local` changes
   - Solution: Migrate to new API

3. **Content script execution model changes**
   - If Chrome changes isolated world behavior
   - Solution: Adapt controller injection method

### What CANNOT Break This Module:

1. ✅ Nanobrowser UI updates (React/TSX changes)
2. ✅ Nanobrowser feature additions
3. ✅ Nanobrowser bug fixes
4. ✅ Git pulls / source updates
5. ✅ Rebuilding Nanobrowser

**Why?** Because we don't depend on ANY Nanobrowser source files!

---

## 🔧 MAINTENANCE GUIDE

### Adding New Features

1. **Create new file:**
   ```javascript
   // extensions/tuya-integration/tuya-scenes.js
   console.log('🏠 [TUYA] Scenes module loaded');
   
   window.TuyaController.scenes = {
     activate: async (sceneId) => {
       // Implementation
     }
   };
   ```

2. **Register in manifest.json:**
   ```json
   "content_scripts": [{
     "js": [
       "extensions/tuya-integration/tuya-controller.js",
       "extensions/tuya-integration/tuya-scenes.js",
       "content/index.iife.js"
     ]
   }]
   ```

3. **Test:**
   - Reload extension
   - Check console for load message
   - Test new functionality

### Debugging

```javascript
// Check if Tuya is loaded
console.log(window.TuyaController);

// Check config
chrome.storage.local.get(['tuya_config'], (result) => {
  console.log('Tuya config:', result.tuya_config);
});

// Test controller
window.TuyaController.listDevices().then(console.log);
```

---

## 📚 REFERENCES

- **Tuya IoT Platform:** https://iot.tuya.com/
- **Tuya Cloud API Docs:** https://developer.tuya.com/en/docs/cloud/
- **Nanobrowser GitHub:** https://github.com/nanobrowser/nanobrowser
- **Architecture Docs:** `../UPDATE-PROOF-ARCHITECTURE.md`

---

## ✅ VERIFICATION FOR AI ASSISTANTS

Before claiming "update-proof architecture is implemented", verify:

1. [ ] Zero modifications in `c:\TUYA\nanobrowser/pages/`
2. [ ] All custom code in `extensions/tuya-integration/`
3. [ ] No `.tsx` or `.ts` files created
4. [ ] No React/build dependencies required
5. [ ] `git status` in `nanobrowser/` shows clean
6. [ ] Update script preserves `extensions/` folder
7. [ ] Module works after running update script

**If ANY item fails: ARCHITECTURE IS BROKEN**

---

## 📊 DECISION FLOWCHART FOR AI ASSISTANTS

```
User requests feature for Tuya integration
    │
    ├─> Feature needs UI changes?
    │   ├─> YES → Create standalone HTML in extensions/
    │   └─> NO  → Continue
    │
    ├─> Feature needs background logic?
    │   ├─> YES → Add to tuya-background.js
    │   └─> NO  → Continue
    │
    ├─> Feature needs content script?
    │   ├─> YES → Add to tuya-controller.js or create new .js
    │   └─> NO  → Continue
    │
    └─> Update manifest.json (working copy only)
        Update this README
        Test in nanobrowser-working/
        Verify update script preserves changes
        DONE ✅
```

**NEVER go to `nanobrowser/pages/` or `nanobrowser/src/`**

---

**AI Assistant Acknowledgment Required:**

Before proceeding with ANY Tuya feature:
1. Confirm you've read this entire README
2. Confirm you understand update-proof architecture
3. Confirm you will NOT modify `nanobrowser/` source
4. Confirm all changes go in `extensions/`

**Failure to follow = Architecture broken = User trust lost**

---

**Version:** 2.0  
**Last Updated:** 2025-12-17  
**Maintainer:** Rankify Assist Team  
**Status:** ✅ Production | 🔒 Update-Proof | 🎯 AI-Optimized
