# 📦 Rankify Assist Extension Guide

## Directory Structure Overview

This project uses a split structure to separate the **Source Code** from the **Compiled Extension**.

### 1. `extension-raw/` (SOURCE 🛠️)
This is the **working directory**.
- Contains all React components, TypeScript code, and Vite configuration.
- **EDIT HERE**: Any changes to functionality, UI, or logic must happen in this folder.
- **BUILD**: Run `pnpm build` in this folder to compile changes.

### 2. `extension/` (COMPILED 🚀)
This is the **distribution directory**.
- Contains the build artifacts (HTML, JS, CSS) generated from `extension-raw`.
- **DO NOT EDIT**: Changes made here will be overwritten by the next build.
- **LOAD THIS**: In `chrome://extensions`, verify "Developer Mode" is ON and select "Load Unpacked", targeting this folder.

## 🔄 Development Workflow

1.  **Make Changes**: Edit files in `extension-raw/`.
2.  **Build**:
    ```bash
    cd extension-raw
    pnpm build
    ```
    *Note: The project is configured to automatically copy `dist/` contents to `../extension/` after build (check `package.json` scripts or manual copy commands).*
3.  **Test**: Go to Chrome, click "Reload" on the Rankify Assist extension.

## ⚠️ Important
- If you edit `extension/` {IT IS COMPILED EXTENSION} directly, your changes will be lost!
- Ensure `pnpm install` has been run in `extension-raw` before building.
