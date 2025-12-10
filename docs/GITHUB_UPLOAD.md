# 🚀 Publishing to GitHub

Quick guide to upload Rankify Assist to your GitHub account.

---

## 📋 Prerequisites

- Git installed locally
- GitHub account (https://github.com/namandhakad712)
- Repository created on GitHub named `rankify-assist`

---

## 🎯 Step-by-Step Upload

### 1. Initialize Git Repository

```bash
cd c:\TUYA\RankifyAssist

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit - Rankify Assist v1.0"
```

### 2. Create GitHub Repository

Either via GitHub website or CLI:

**Via Website:**
1. Go to https://github.com/new
2. Repository name: `rankify-assist`
3. Description: `🤖 Voice-Controlled AI Browser Automation powered by Tuya IoT & Eko Agent`
4. Public/Private: Your choice
5. **DON'T** initialize with README (we already have one)
6. Click **Create repository**

**Via GitHub CLI** (if installed):
```bash
gh repo create rankify-assist --public --description "Voice-Controlled AI Browser Automation"
```

### 3. Link to Remote

```bash
# Add GitHub as remote
git remote add origin https://github.com/namandhakad712/rankify-assist.git

# Verify remote
git remote -v
```

### 4. Push to GitHub

```bash
# Push to main branch
git push -u origin main
```

If you get branch name error, try:
```bash
git branch -M main
git push -u origin main
```

---

## 🎨 Optional: Add Topics & Description

On GitHub repo page:

**Topics**: Click ⚙️ next to About → Add:
- `chrome-extension`
- `tuya-iot`
- `voice-assistant`
- `ai-automation`
- `browser-automation`
- `eko-agent`
- `smart-home`

**Description**:
```
🤖 Voice-Controlled AI Browser Automation powered by Tuya IoT & Eko Agent
```

**Website**:  (add if you deploy docs)

---

## 📊 Verify Upload

Check that these files appear on GitHub:

- ✅ README.md (with nice formatting)
- ✅ LICENSE
- ✅ CONTRIBUTING.md
- ✅ .gitignore
- ✅ `extension-ready/` directory
- ✅ `firmware/` directory
- ✅ `docs/` directory

---

## 🔄 Future Updates

```bash
# Make changes to files
# ...

# Stage changes
git add .

# Commit with message
git commit -m "✨ Add new feature"

# Push to GitHub
git push
```

---

## 🎉 You're Done!

Your repo should now be live at:
**https://github.com/namandhakad712/rankify-assist**

Share it with the world! 🚀
