# SpecForge Studio — Complete AI Agent Project Handoff Bundle

This single file contains the complete, untruncated source code, Electron main/preload/security layer, React 19 frontend, Vitest test suites, security & contribution policies, build configuration, Ubuntu 24.04 scripts, CI/CD workflows, and vector icon needed for another AI coding agent to understand, audit, modify, test, or reconstruct **SpecForge Studio** (`v1.2.1`).

---

## 1. Project Overview & Architecture

- **Product**: SpecForge Studio — offline-first Ubuntu 24.04 LTS desktop application that turns plain-English feature ideas into 15 Spec-Driven Development (SDD) artifacts (`FULL_BLUEPRINT_REPORT.md`, `TASK_PROMPT.md`, `AGENTS.md`, `apps/mobile/AGENTS.md`, `.agents/rules/*`, `.agents/skills/*`, `.github/copilot-instructions.md`, `.github/instructions/*`, `.github/agents/*`, `.github/workflows/copilot-setup-steps.yml`, `jules-setup.sh`, `bootstrap-agy.sh`, `.specify/memory/constitution.md`, `specs/001-feature/spec.md`, `specs/001-feature/tasks.md`).
- **Repository**: `https://github.com/defiqantcoder/SpecForge-Studio` (`main`, tag `v1.2.1`)
- **Tech Stack**:
  - Desktop Shell: **Electron `^45.2.3`**, **electron-builder `^26.18.0`** (Linux `.deb`, `.AppImage`, `dir`)
  - Frontend: **React `^19.1.0`**, **TypeScript `^5.8.3`**, **Vite `^6.4.6`**, **Tailwind CSS `^4.1.5`**, **lucide-react `^0.511.0`**
  - Testing: **Vitest `^4.1.12`**, **@testing-library/react `^16.3.0`**, **jsdom `^26.1.0`**, **marked `^18.2.0`**
- **Key Features in `v1.2.1`**:
  - **3-Way View Mode Selector**: `Simple` (No-Code 2-step wizard & 3 essential files), `Intermediate` (Pro-Light 4 tabs, Jargon Translation Cards, Plain-English Rule Checkboxes, Simplified `[HITL]`/`[AFK]` Task Slicer, and 6 core files), and `Pro` (All 6 tabs & all 15 generated artifacts).
  - **Field & Section AI Auto-Fill + Soft Amber Review Highlights**: Field-level `✨ Auto-Expand Options` and card-level `✨ Auto-Fill Section` buttons powered by Gemini (`generateGeminiStructured`) with deterministic offline fallback templates and dismissible `Accept All` amber review highlights.
  - **Plain-English Hover Tooltips & Human-Readable Diagnostics**: Context-aware `InfoTooltip` (`ℹ️`) badges across form headings/labels plus plain-language Rule Size, Prompt Length, and Memory Safety status cards.
  - **Saved Project Presets (`specforge_saved_presets_v1`)**: Header modal (`📂 Saved Projects`) to save, load, delete, and reset named presets in `localStorage` with recursive runtime schema validation (`matchesDefaults`, `isValidSavedPreset`), unsaved-changes confirmation guard, and keyboard focus trapping (`useModalFocusTrap`).
  - **Shareable Full Spec Report (`FULL_BLUEPRINT_REPORT.md`)**: Single-file master Markdown blueprint with 1-click Copy and Export (`.md`) actions in the Artifact Dock header.
  - **Prompt Readiness Scorecard**: Live 6-point readiness checklist in the Artifact Dock header with 1-click `Fix Now` buttons that automatically switch view mode/tabs and focus the target input.
- **Process & Security Architecture (3-Tier Isolation)**:
  1. **Main Process (`electron/main.ts`)**: `BrowserWindow` enforces `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`. `setWindowOpenHandler` and `will-navigate` parse URLs via `new URL()` and lock packaged navigation strictly to `DIST_INDEX_URL`. Every `ipcMain.handle` calls `assertTrustedIpcSender(event)` and validates payload types. Filesystem writes use `resolveSafeChildPath` (`electron/pathSecurity.ts`) with canonical `fs.realpathSync` / symlink escape & dangling symlink validation while preserving valid POSIX filenames. Gemini API keys use Electron `safeStorage` via atomic exclusive-temp writes (`atomicWriteFileSync`, `mode 0o600`), refusing plaintext disk persistence and falling back to session-only process memory when OS keychain encryption is unavailable; Gemini calls run in Main (`ai:generateStructured`).
  2. **Preload (`electron/preload.ts`)**: Exposes only the narrow `window.desktopAPI` contract defined in `electron/types.ts` via `contextBridge.exposeInMainWorld`.
  3. **Renderer (`src/SpecForgeStudio.tsx`)**: Strict CSP in `index.html`; `window.desktopAPI` integration with browser fallback, accessible focus trapping across all modals (`useModalFocusTrap`).
- **Ubuntu 24.04 Specifics**:
  - Ubuntu 24.04 sets `kernel.apparmor_restrict_unprivileged_userns=1`, so unpackaged/AppImage launches require `--no-sandbox` (handled in `electron/main.ts`, `scripts/launch-ubuntu.sh`, `scripts/install-desktop-entry.sh`, and `package.json` `electron:dev`/`electron:start`).
  - `npm run electron:build` passes `--publish never` so CI builds do not fail attempting implicit GitHub publishing without `GH_TOKEN`.

---

## 2. Commands & Verification

```bash
npm install
npm run typecheck
npm test
npm run build && npm run electron:compile
npm run electron:build
./scripts/launch-ubuntu.sh
npm audit
```

---

## 3. Binary Icon Regeneration (Not Embedded as Binary)

```bash
mkdir -p build/icons && python3 -c "
import gi
gi.require_version('Rsvg', '2.0')
from gi.repository import Rsvg
import cairo
handle = Rsvg.Handle.new_from_file('build/icon.svg')
for size in [48, 64, 128, 256, 512]:
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, size, size)
    ctx = cairo.Context(surface)
    ctx.scale(size / 512.0, size / 512.0)
    vp = Rsvg.Rectangle()
    vp.x, vp.y, vp.width, vp.height = 0, 0, 512, 512
    handle.render_document(ctx, vp)
    surface.write_to_png(f'build/icons/{size}x{size}.png')
    if size == 512:
        surface.write_to_png('build/icon.png')
"
```

---

## 4. Included Project Files

- `package.json`
- `tsconfig.json`
- `tsconfig.electron.json`
- `vite.config.ts`
- `index.html`
- `.gitignore`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `electron/types.ts`
- `electron/pathSecurity.ts`
- `electron/preload.ts`
- `electron/main.ts`
- `src/main.tsx`
- `src/index.css`
- `src/types/desktop.ts`
- `src/SpecForgeStudio.tsx`
- `src/__tests__/pathSecurity.test.ts`
- `src/__tests__/electronMainSecurity.test.ts`
- `src/__tests__/accessibilityContracts.test.tsx`
- `src/__tests__/artifactIntegrity.test.tsx`
- `src/__tests__/SpecForgeStudio.test.tsx`
- `scripts/launch-ubuntu.sh`
- `scripts/install-desktop-entry.sh`
- `build/icon.svg`

---

## 5. Complete File Contents

### `package.json`

~~~~~json
{
  "name": "specforge-studio",
  "version": "1.2.1",
  "description": "SpecForge Studio — AI Coding Agent Prompt & Context Architect for Ubuntu Desktop",
  "homepage": "https://github.com/defiqantcoder/specforge-studio",
  "repository": {
    "type": "git",
    "url": "https://github.com/defiqantcoder/specforge-studio.git"
  },
  "author": {
    "name": "defiqantcoder",
    "email": "starwarshellyeah69@pm.me"
  },
  "license": "MIT",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit && tsc -p tsconfig.electron.json --noEmit",
    "electron:compile": "tsc -p tsconfig.electron.json",
    "electron:dev": "concurrently -k \"vite\" \"wait-on http://localhost:5173 && npm run electron:compile && electron . --no-sandbox\"",
    "electron:start": "npm run build && npm run electron:compile && electron . --no-sandbox",
    "electron:build": "npm run build && npm run electron:compile && electron-builder --linux --publish never",
    "test": "vitest run"
  },
  "dependencies": {
    "lucide-react": "^0.511.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.5",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.3",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "concurrently": "^9.1.2",
    "electron": "^45.2.3",
    "electron-builder": "^26.0.12",
    "jsdom": "^26.1.0",
    "marked": "^18.2.0",
    "tailwindcss": "^4.1.5",
    "typescript": "^5.8.3",
    "vite": "^6.3.4",
    "vitest": "^4.1.12",
    "wait-on": "^8.0.3"
  },
  "overrides": {
    "app-builder-lib": {
      "minimatch": "^11.0.5"
    },
    "@electron/universal": {
      "minimatch": "^11.0.5"
    }
  },
  "build": {
    "appId": "com.specforge.studio",
    "productName": "SpecForge Studio",
    "asar": true,
    "directories": {
      "output": "release",
      "buildResources": "build"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*"
    ],
    "linux": {
      "target": [
        "deb",
        "AppImage",
        "dir"
      ],
      "executableName": "specforge-studio",
      "category": "Development",
      "icon": "build/icons",
      "synopsis": "AI Coding Agent Prompt & Context Architect",
      "description": "Turn plain-English ideas into spec-driven AI coding prompts, AGENTS.md, Copilot/Antigravity/Jules configs, and EARS vertical-slice plans.",
      "desktop": {
        "entry": {
          "Name": "SpecForge Studio",
          "Comment": "AI Coding Agent Prompt & Context Architect",
          "Categories": "Development;IDE;Utility;",
          "StartupWMClass": "specforge-studio"
        }
      }
    },
    "deb": {
      "depends": [
        "libgtk-3-0",
        "libnotify4",
        "libnss3",
        "libxss1",
        "libxtst6",
        "xdg-utils",
        "libatspi2.0-0",
        "libuuid1"
      ]
    }
  }
}
~~~~~

### `tsconfig.json`

~~~~~json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  },
  "include": ["src"]
}
~~~~~

### `tsconfig.electron.json`

~~~~~json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "dist-electron",
    "rootDir": "electron",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["electron/**/*.ts"]
}
~~~~~

### `vite.config.ts`

~~~~~ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});
~~~~~

### `index.html`

~~~~~html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' http://localhost:5173 ws://localhost:5173 https://generativelanguage.googleapis.com;"
    />
    <title>SpecForge Studio — AI Coding Agent Prompt & Context Architect</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
~~~~~

### `.gitignore`

~~~~~gitignore
node_modules/
dist/
dist-electron/
release/
*.deb
*.AppImage
*.log
.DS_Store
~~~~~

### `LICENSE`

~~~~~text
MIT License

Copyright (c) 2026 SpecForge Studio Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
~~~~~

### `README.md`

~~~~~markdown
# SpecForge Studio

[![CI Checks & Smoke Test](https://github.com/defiqantcoder/SpecForge-Studio/actions/workflows/ci.yml/badge.svg)](https://github.com/defiqantcoder/SpecForge-Studio/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/defiqantcoder/SpecForge-Studio)](https://github.com/defiqantcoder/SpecForge-Studio/releases/latest)
[![Platform](https://img.shields.io/badge/Ubuntu-24.04%20LTS-E95420?logo=ubuntu&logoColor=white)](https://github.com/defiqantcoder/SpecForge-Studio/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**SpecForge Studio** is an offline-first desktop application for **Ubuntu 24.04 LTS** that turns plain-English ideas into structured, production-ready instructions and configuration files for AI coding agents (**Google Antigravity**, **GitHub Copilot**, and **Google Jules**).

---

## Table of Contents

- [Features](#features)
- [Installation (Ubuntu 24.04)](#installation-ubuntu-2404)
- [How to Use](#how-to-use)
- [Generated Files](#generated-files)
- [Security & Architecture](#security--architecture)
- [Development & Testing](#development--testing)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- **Simple Mode (No-Code) & Pro Mode (All 14 Files)**:
  - **Simple Mode** presents 2 guided tabs (`1. Describe Your App` and `2. How to Use Your Files`), plain-English visual picker cards (app platform, AI tool, execution style), a decluttered 3-file preview dock, and a **Next Step Action Box** for instant copy-paste or 1-click folder export.
  - **Pro Mode** unlocks all 6 editor tabs: 5-Section Task Prompt Builder (primacy/recency contract), 10-Section `AGENTS.md`, Copilot/Antigravity/Jules configs, EARS requirements, vertical-slice task planners, and live token/byte-limit diagnostics.
- **Offline Smart-Template Fallback (No API Key Required)**:
  - Works 100% offline out of the box—clicking **Turn My Idea Into AI Instructions** populates `TASK_PROMPT.md`, `AGENTS.md`, and `spec.md` directly from your plain-English idea even without a Gemini API key.
- **Optional Gemini AI Integration**:
  - Add a Gemini API key in **AI Key** settings (encrypted locally via OS `safeStorage` when available, or via `GEMINI_API_KEY`) to enable full **AI Magic Auto-Architect** synthesis and live **`/grill-me`** Socratic ambiguity interviews.
- **1-Click Export to Repository Folder**:
  - Writes all 14 generated files (including executable `.sh` setup scripts) directly into any project folder on disk via Ubuntu's native folder picker.
- **Local Blueprint Storage & Auto-Save**:
  - Automatically persists your active draft and saves/loads/tags/imports/exports portable `.specforge.json` blueprints in `~/.config/SpecForge Studio/blueprints/`.

---

## Installation (Ubuntu 24.04)

Download the latest installers from the [GitHub Releases](https://github.com/defiqantcoder/SpecForge-Studio/releases/latest) page:

### Option 1: Debian / Ubuntu `.deb` Package (Recommended)

```bash
sudo apt install ./specforge-studio_1.0.2_amd64.deb
```

Once installed, launch **SpecForge Studio** from the Ubuntu Applications menu or run `specforge-studio`.

### Option 2: Portable AppImage

```bash
chmod +x ./SpecForge.Studio-1.0.2.AppImage
./SpecForge.Studio-1.0.2.AppImage --no-sandbox
```

> **Ubuntu 24.04 Note:** Ubuntu 24.04 enables `kernel.apparmor_restrict_unprivileged_userns=1` by default, so unprivileged AppImage and unpacked Electron launches require `--no-sandbox`. The `.deb` package installs `chrome-sandbox` with standard permissions and runs without flags.

### Option 3: Build & Run from Source

```bash
git clone https://github.com/defiqantcoder/SpecForge-Studio.git
cd SpecForge-Studio
npm install
npm run electron:build

# Launch immediately
./scripts/launch-ubuntu.sh

# Optional: add to Ubuntu Applications menu without sudo
./scripts/install-desktop-entry.sh
```

---

## How to Use

### Simple Mode (Recommended for Beginners)

1. **Describe Your App**: Enter what you want to build and who will use it in everyday language.
2. **Pick Your Setup**: Click the visual cards for your app type (**Website**, **Phone App**, or **Computer App**), target AI tool (**Google Antigravity**, **GitHub Copilot**, or **Google Jules**), and workflow style (**Step-by-Step** or **Background**).
3. **Generate Instructions**:
   - Click **✨ Step 1: Turn My Idea Into AI Instructions** (uses Gemini if configured, or Offline Smart Templates automatically).
   - *(Optional)* Click **❓ Step 2: Check My Idea for Missing Details (3 Quick Questions)** to resolve permission, offline, and error-recovery edge cases.
4. **Use Your Output** from the **Next Step Action Box** on the right:
   - **Option A (Easiest):** Click **📋 Copy Prompt to Paste into AI Chat** and paste directly into Antigravity, Copilot Chat, or Jules.
   - **Option B (Full Repo Setup):** Click **📁 Put All Files Into My Project Folder** and choose your project directory to write all 14 files automatically.

### Pro Mode

Click **Simple Mode (No-Code)** in the top bar to switch to **Pro Mode (All 14 Files)** and customize every section:
- **2. Task Prompt Builder**: Edit role persona, observable outcomes, architectural boundary invariants, ordered steps, 6 explicit UI states, and verification commands.
- **3. AGENTS.md**: Configure persistent repository structure, commands, testing, security, and database rules (including monorepo nested `AGENTS.md`).
- **4. Copilot, Antigravity & Jules Files**: Fine-tune `.agents/rules/*.md` (24KB limit checked), `SKILL.md`, `.github/instructions/*.instructions.md`, `.github/agents/*.agent.md`, and cloud VM setup scripts.
- **5. Spec & Task Slices**: Author tech-agnostic EARS (`When ... shall ...`) criteria and `[HITL]` / `[AFK]` vertical-slice tasks.

---

## Generated Files

All 14 files are generated live in memory and written cleanly on **Export to Repo**:

| File Path | Purpose |
| :--- | :--- |
| `TASK_PROMPT.md` | 5-section task prompt with primacy/recency anchors |
| `AGENTS.md` | 10-section repository contract read by coding agents |
| `<subproject>/AGENTS.md` | Nested monorepo `AGENTS.md` overrides |
| `bootstrap-agy.sh` | 1-click Antigravity workspace initialization script |
| `.agents/rules/<name>.md` | Antigravity always-on / glob architectural rules |
| `.agents/skills/<name>/SKILL.md` | Antigravity reusable verification skill |
| `.github/copilot-instructions.md` | Repository-wide GitHub Copilot instructions |
| `.github/instructions/<name>.instructions.md` | Path-scoped Copilot instructions |
| `.github/agents/<name>.agent.md` | Custom GitHub Copilot planner/implementer agent |
| `.github/workflows/copilot-setup-steps.yml` | Copilot Cloud Agent VM environment setup |
| `jules-setup.sh` | Google Jules VM snapshot setup script |
| `.specify/memory/constitution.md` | Non-negotiable Spec-Driven Development principles |
| `specs/001-feature/spec.md` | EARS (`When ... shall ...`) functional specification |
| `specs/001-feature/tasks.md` | End-to-end vertical-slice implementation plan |

---

## Security & Architecture

SpecForge Studio follows strict 3-tier Electron isolation:

- **Hardened `BrowserWindow`** ([`electron/main.ts`](electron/main.ts)): `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, `webSecurity: true`, strict CSP in [`index.html`](index.html), URL parsing on `setWindowOpenHandler`/`will-navigate`, and sender frame validation (`assertTrustedIpcSender`) on every IPC handler.
- **Narrow Preload Bridge** ([`electron/preload.ts`](electron/preload.ts)): Exposes only typed domain methods on `window.desktopAPI` via `contextBridge`.
- **Path-Traversal Guard** ([`electron/pathSecurity.ts`](electron/pathSecurity.ts)): `resolveSafeChildPath` validates every relative export path and rejects `..` traversal, absolute paths, null bytes, and root-equivalent `.` writes.
- **Encrypted Key Storage**: Gemini API keys are stored via Electron `safeStorage` and executed in the Main process.

---

## Development & Testing

**Prerequisites:** Node.js `>= 22.12` (recommended for Electron 45) and npm `>= 10`.

```bash
npm install              # Install dependencies
npm run typecheck        # Typecheck frontend + Electron main/preload
npm test                 # Run Vitest unit & React Testing Library suite
npm run build            # Build Vite production frontend
npm run electron:compile # Compile Electron TypeScript
npm run electron:dev     # Run Vite HMR + Electron in dev mode
npm run electron:start   # Build and launch Electron locally
npm run electron:build   # Package Ubuntu .deb, .AppImage, and linux-unpacked
npm audit                # Verify 0 known dependency vulnerabilities
```

---

## Project Structure

```text
├── electron/
│   ├── main.ts            # Electron Main process, dialogs, blueprints, safeStorage, IPC
│   ├── preload.ts         # contextBridge window.desktopAPI exposure
│   ├── pathSecurity.ts    # Path traversal protection & blueprint ID sanitization
│   └── types.ts           # Shared TypeScript IPC contract
├── src/
│   ├── SpecForgeStudio.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── types/desktop.ts
│   └── __tests__/
│       ├── pathSecurity.test.ts
│       └── SpecForgeStudio.test.tsx
├── build/                 # SVG + 48x48..512x512 PNG application icons
├── scripts/
│   ├── launch-ubuntu.sh
│   └── install-desktop-entry.sh
└── .github/workflows/
    ├── ci.yml             # PR/push typecheck, tests, .deb check & Xvfb smoke test
    └── release.yml        # Tag-triggered Ubuntu .deb & AppImage build
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
~~~~~

### `SECURITY.md`

~~~~~markdown
# Security Policy

## Security Model & Architecture

SpecForge Studio is built with an offline-first architecture designed to maximize user privacy and security on Ubuntu environments.

We adhere to a strict 3-tier Electron isolation model:

1.  **Hardened `BrowserWindow` (`electron/main.ts`)**:
    *   `contextIsolation: true`: Ensures scripts running in the renderer process do not have access to the Node.js environment or Electron's internal APIs.
    *   `nodeIntegration: false`: Prevents the renderer process from using Node.js features directly.


    *   `sandbox: true`: Requests the Chromium renderer sandbox, but does not guarantee it is enabled. `configureLinuxSandbox` in `electron/main.ts` adds `--no-sandbox` for Linux AppImage launches, when AppArmor restricts unprivileged user namespaces without a valid root-owned setuid sandbox, or if sandbox detection throws. The `npm run electron:dev` and `npm run electron:start` scripts also pass `--no-sandbox`, as do `scripts/launch-ubuntu.sh` and desktop entries generated by `scripts/install-desktop-entry.sh`. These launch setups disable the Chromium sandbox.

    *   Strict Content Security Policy (CSP) enforcement.
    *   URL parsing and validation on `setWindowOpenHandler` and `will-navigate`.
    *   Sender frame validation (`assertTrustedIpcSender`) on every IPC handler to prevent unauthorized IPC messages.
2.  **Narrow Preload Bridge (`electron/preload.ts`)**:
    *   Exposes only specific, typed domain methods via `window.desktopAPI` using `contextBridge`.
3.  **Path-Traversal Guard (`electron/pathSecurity.ts`)**:
    *   `resolveSafeChildPath` validates relative export paths both lexically and canonically (via `fs.realpathSync` / `fs.lstatSync` / `fs.readlinkSync`), rejecting paths that resolve outside the selected repository, absolute paths, null bytes, root-equivalent `.` writes, and symlink escapes (including intermediate directory symlinks and dangling symlinks).

## Data Storage & API Keys

*   **Offline-First**: By default, no network connection is required. Instructions and specifications are generated using offline smart templates.
*   **API Key Storage**: For the optional Gemini AI integration, `writeStoredGeminiKey` encrypts API keys via Electron's `safeStorage` into `settings.json` (mode `0600`) when `safeStorage.isEncryptionAvailable()` returns `true`. When OS keychain encryption is unavailable, unencrypted disk persistence is rejected with a warning and the API key is kept strictly in process memory for the active session only. Operations using these keys are executed solely within the isolated Main process.


## Reporting a Vulnerability

If you discover a security vulnerability in SpecForge Studio, please **do not** report it via public GitHub issues.

Instead, please send an email to `starwarshellyeah69@pm.me` with the subject `[SECURITY] Vulnerability Report`. We aim to review and respond to all vulnerability reports within 48 hours. Please include detailed steps to reproduce the issue.
~~~~~

### `CONTRIBUTING.md`

~~~~~markdown
# Contributing to SpecForge Studio

Thank you for your interest in contributing to SpecForge Studio! We appreciate your help in maintaining this offline-first desktop application.

## Local Development Setup

To set up the project locally on your Ubuntu 24.04 environment, please follow these steps.

**Prerequisites:** Node.js `>= 22.12` and npm `>= 10`.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/defiqantcoder/SpecForge-Studio.git
    cd SpecForge-Studio
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```


3.  **Choose one development workflow:**

    For frontend-only development, start the Vite dev server:
    ```bash
    npm run dev
    ```

    Alternatively, to run the desktop application, use:
    ```bash
    npm run electron:dev
    ```
    `npm run electron:dev` starts its own Vite server with Hot Module Replacement (HMR) and launches Electron. Do not run both workflows together.


### Other Helpful Commands

*   `npm run build`: Build the Vite production frontend.
*   `npm run electron:compile`: Compile the Electron TypeScript code.
*   `npm run electron:start`: Build the frontend, compile Electron, and launch the app locally.
*   `npm run electron:build`: Package the Ubuntu `.deb`, `.AppImage`, and `linux-unpacked` builds.

## Verification Commands

Before submitting a Pull Request, please ensure all checks pass by running the following commands:

```bash
npm run typecheck
npm test
```

This verifies the TypeScript types and runs the Vitest unit & React Testing Library suite. Your PR should not impact the build, meaning both commands must complete successfully without errors.

## Pull Request Guidelines

SpecForge Studio aims to remain a focused, efficient tool for generating AI coding agent instructions. To maintain this focus, we adhere to strict **no-feature-creep** guidelines:

1.  **Scope**: Ensure your PR directly addresses an existing issue or a clear, necessary bug fix. We are highly resistant to adding new features that expand the scope of the application beyond its core objective.
2.  **Architecture**: Maintain the strict 3-tier Electron isolation model (`contextIsolation`, `nodeIntegration`, `sandbox`) and offline-first design.
3.  **Verification**: As mentioned above, `npm run typecheck && npm test` must pass. Ensure any new logic is appropriately tested.
4.  **Simplicity**: Keep changes as simple and isolated as possible.

We look forward to your contributions!
~~~~~

### `.github/workflows/ci.yml`

~~~~~yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Set up Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run typecheck
        run: npm run typecheck

      - name: Run tests
        run: npm test

      - name: Run build
        run: npm run build
~~~~~

### `.github/workflows/release.yml`

~~~~~yaml
name: Build Ubuntu Desktop Release

on:
  push:
    tags: ["v*"]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build-linux:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Typecheck & Test
        run: |
          npm run typecheck
          npm test

      - name: Build Ubuntu .deb and AppImage
        run: npm run electron:build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: specforge-studio-ubuntu-x64
          path: |
            release/*.deb
            release/*.AppImage
~~~~~

### `electron/types.ts`

~~~~~ts
export interface SavedBlueprint {
  id: string;
  title: string;
  tag?: string;
  updatedAt: number;
  formState: string;
}

export interface ExportWorkspaceRequest {
  files: Array<{
    relativePath: string;
    content: string;
  }>;
}

export interface ExportWorkspaceResult {
  canceled: boolean;
  targetDir?: string;
  writtenCount?: number;
  writtenFiles?: string[];
  error?: string;
}

export interface SaveFileResult {
  canceled: boolean;
  filePath?: string;
  error?: string;
}

export interface ImportBlueprintResult {
  canceled: boolean;
  blueprint?: SavedBlueprint;
  error?: string;
}

export interface DesktopAppInfo {
  name: string;
  version: string;
  platform: string;
  arch: string;
  osRelease: string;
  userDataDir: string;
  blueprintsDir: string;
}

export interface GeminiSettingsInfo {
  hasKey: boolean;
  source: 'stored' | 'env' | 'memory' | 'none';
  maskedKey?: string;
  warning?: string;
}

export interface GeminiStructuredRequest {
  systemPrompt: string;
  userQuery: string;
  responseSchema: Record<string, unknown>;
}

export interface DesktopAPI {
  isDesktop: true;
  getAppInfo: () => Promise<DesktopAppInfo>;
  copyToClipboard: (text: string) => Promise<boolean>;
  saveFileDialog: (suggestedFilename: string, content: string) => Promise<SaveFileResult>;
  exportWorkspaceDialog: (req: ExportWorkspaceRequest) => Promise<ExportWorkspaceResult>;
  listBlueprints: () => Promise<SavedBlueprint[]>;
  saveBlueprint: (
    blueprint: Omit<SavedBlueprint, 'id' | 'updatedAt'> & { id?: string }
  ) => Promise<SavedBlueprint>;
  deleteBlueprint: (id: string) => Promise<boolean>;
  exportBlueprintFile: (blueprint: SavedBlueprint) => Promise<SaveFileResult>;
  importBlueprintFile: () => Promise<ImportBlueprintResult>;
  getGeminiSettings: () => Promise<GeminiSettingsInfo>;
  setGeminiApiKey: (apiKey: string) => Promise<GeminiSettingsInfo>;
  generateGeminiStructured: (req: GeminiStructuredRequest) => Promise<unknown>;
  openExternalUrl: (url: string) => Promise<boolean>;
}
~~~~~

### `electron/pathSecurity.ts`

~~~~~ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Checks whether `candidate` falls outside `realRoot` (or equals `realRoot` when `allowRoot` is false).
 */
function isOutsideRoot(realRoot: string, candidate: string, allowRoot: boolean): boolean {
  const rel = path.relative(realRoot, candidate);
  if (!allowRoot && !rel) return true;
  return rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel);
}

/**
 * Validates and resolves a relative artifact path inside a chosen root directory.
 * Rejects empty paths, absolute paths, null bytes, `..` traversal, trailing dots,
 * and symlink escapes (including dangling symlinks) outside rootDir.
 */
export function resolveSafeChildPath(rootDir: string, relativePath: string): string {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('Invalid relative path: empty');
  }
  if (relativePath.includes('\0')) {
    throw new Error('Invalid relative path: null byte');
  }

  const normalizedInput = relativePath.replace(/\\/g, '/').trim();
  if (path.isAbsolute(normalizedInput) || normalizedInput.startsWith('/')) {
    throw new Error(`Absolute paths are not permitted: ${relativePath}`);
  }

  // Canonicalize rootDir upfront when it exists on disk; fall back to path.resolve for non-existent roots.
  let realRoot: string;
  if (typeof fs.realpathSync === 'function') {
    try {
      realRoot = fs.realpathSync(rootDir);
    } catch (err: any) {
      if (err && err.code === 'ENOENT') {
        realRoot = path.resolve(rootDir);
      } else {
        throw err;
      }
    }
  } else {
    realRoot = path.resolve(rootDir);
  }

  const segments = normalizedInput.split('/');
  let currentPath = realRoot;

  for (const segment of segments) {
    if (segment === '' || segment === '.') continue;

    if (segment === '..') {
      currentPath = path.dirname(currentPath);
      if (isOutsideRoot(realRoot, currentPath, true)) {
        throw new Error(`Path traversal rejected: ${relativePath}`);
      }
      continue;
    }

    if (segment.endsWith('.')) {
      throw new Error(`Invalid path: trailing dots are not permitted in segment: ${segment}`);
    }

    // Preserve Windows reserved character restrictions while allowing valid POSIX characters (e.g., ':') on Linux/macOS.
    if (process.platform === 'win32' && /[<>:"|?*]/.test(segment)) {
      throw new Error(`Invalid characters in path segment: ${segment}`);
    }

    currentPath = path.join(currentPath, segment);

    if (typeof fs.realpathSync === 'function') {
      try {
        currentPath = fs.realpathSync(currentPath);
        if (isOutsideRoot(realRoot, currentPath, true)) {
          throw new Error(`Path traversal detected via symlink: ${relativePath}`);
        }
      } catch (err: any) {
        if (err && err.code === 'ENOENT') {
          if (typeof fs.lstatSync === 'function') {
            try {
              const stat = fs.lstatSync(currentPath);
              if (stat.isSymbolicLink()) {
                throw new Error(`Path traversal detected via dangling symlink: ${relativePath}`);
              }
            } catch (lstatErr: any) {
              if (!lstatErr || lstatErr.code !== 'ENOENT') {
                throw lstatErr;
              }
            }
          }
        } else {
          throw err;
        }
      }
    }
  }

  if (isOutsideRoot(realRoot, currentPath, false)) {
    throw new Error(`Path traversal rejected: ${relativePath}`);
  }

  return currentPath;
}

/**
 * Sanitizes a blueprint ID or filename slug so it can only reference a single safe JSON file.
 */
export function sanitizeBlueprintId(raw: string): string {
  const cleaned = String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return cleaned || `blueprint-${Date.now()}`;
}
~~~~~

### `electron/preload.ts`

~~~~~ts
import { contextBridge, ipcRenderer } from 'electron';
import type {
  DesktopAPI,
  ExportWorkspaceRequest,
  GeminiStructuredRequest,
  SavedBlueprint
} from './types';

const desktopAPI: DesktopAPI = {
  isDesktop: true,
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
  copyToClipboard: (text: string) => ipcRenderer.invoke('clipboard:writeText', text),
  saveFileDialog: (suggestedFilename: string, content: string) =>
    ipcRenderer.invoke('dialog:saveFile', { suggestedFilename, content }),
  exportWorkspaceDialog: (req: ExportWorkspaceRequest) =>
    ipcRenderer.invoke('dialog:exportWorkspace', req),
  listBlueprints: () => ipcRenderer.invoke('blueprints:list'),
  saveBlueprint: (blueprint: Omit<SavedBlueprint, 'id' | 'updatedAt'> & { id?: string }) =>
    ipcRenderer.invoke('blueprints:save', blueprint),
  deleteBlueprint: (id: string) => ipcRenderer.invoke('blueprints:delete', id),
  exportBlueprintFile: (blueprint: SavedBlueprint) =>
    ipcRenderer.invoke('blueprints:exportFile', blueprint),
  importBlueprintFile: () => ipcRenderer.invoke('blueprints:importFile'),
  getGeminiSettings: () => ipcRenderer.invoke('settings:getGeminiKey'),
  setGeminiApiKey: (apiKey: string) => ipcRenderer.invoke('settings:setGeminiKey', apiKey),
  generateGeminiStructured: (req: GeminiStructuredRequest) =>
    ipcRenderer.invoke('ai:generateStructured', req),
  openExternalUrl: (url: string) => ipcRenderer.invoke('shell:openExternal', url)
};

contextBridge.exposeInMainWorld('desktopAPI', desktopAPI);
~~~~~

### `electron/main.ts`

~~~~~ts
import { app, BrowserWindow, clipboard, dialog, ipcMain, safeStorage, shell } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { pathToFileURL } from 'url';
import type {
  DesktopAppInfo,
  ExportWorkspaceRequest,
  GeminiSettingsInfo,
  GeminiStructuredRequest,
  SavedBlueprint
} from './types';
import { resolveSafeChildPath, sanitizeBlueprintId } from './pathSecurity';

/**
 * Configures the Chromium Linux sandbox flag when Ubuntu 24.04 AppArmor
 * restricts unprivileged user namespaces and no root-owned setuid sandbox exists.
 */
function configureLinuxSandbox(): void {
  if (process.platform !== 'linux') return;

  try {
    const usernsPath = '/proc/sys/kernel/apparmor_restrict_unprivileged_userns';
    const restricted = fs.existsSync(usernsPath)
      ? fs.readFileSync(usernsPath, 'utf8').trim() === '1'
      : false;

    if (!restricted && !process.env.APPIMAGE) {
      return;
    }

    const sandboxBinary = path.join(path.dirname(process.execPath), 'chrome-sandbox');
    let hasValidSetuidSandbox = false;
    if (fs.existsSync(sandboxBinary)) {
      const stat = fs.statSync(sandboxBinary);
      const isRootOwned = stat.uid === 0;
      const isSetuid = (stat.mode & 0o4000) !== 0;
      hasValidSetuidSandbox = isRootOwned && isSetuid;
    }

    if (!hasValidSetuidSandbox || Boolean(process.env.APPIMAGE)) {
      app.commandLine.appendSwitch('no-sandbox');
    }
  } catch {
    app.commandLine.appendSwitch('no-sandbox');
  }
}

configureLinuxSandbox();

const isDev =
  !app.isPackaged &&
  Boolean(
    process.env.VITE_DEV_SERVER_URL ||
      process.argv.includes('--dev') ||
      process.env.npm_lifecycle_event === 'electron:dev'
  );

const DIST_INDEX_PATH = path.join(__dirname, '../dist/index.html');
const DIST_INDEX_URL = pathToFileURL(DIST_INDEX_PATH).href;

/**
 * Returns the directory where local SpecForge blueprints are stored, creating it if absent.
 */
function getBlueprintsDir(): string {
  const dir = path.join(app.getPath('userData'), 'blueprints');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Returns the path to the local desktop settings JSON file.
 */
function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

interface StoredSettings {
  geminiKeyEncrypted?: string;
}

/**
 * Process-memory-only fallback when OS keychain encryption (safeStorage) is unavailable.
 * Never persisted to disk in plaintext.
 */
let inMemoryGeminiKey = '';

/**
 * Reads the configured Gemini API key from OS-encrypted storage, in-memory session storage, or GEMINI_API_KEY env var.
 */
function readStoredGeminiKey(): { key: string; source: 'stored' | 'env' | 'memory' | 'none' } {
  try {
    const settingsPath = getSettingsPath();
    if (fs.existsSync(settingsPath)) {
      const raw = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as StoredSettings;
      if (raw.geminiKeyEncrypted && safeStorage.isEncryptionAvailable()) {
        const decrypted = safeStorage.decryptString(Buffer.from(raw.geminiKeyEncrypted, 'base64'));
        if (decrypted.trim()) return { key: decrypted.trim(), source: 'stored' };
      }
    }
  } catch (err) {
    console.warn('Failed to read stored Gemini key:', err);
  }

  if (inMemoryGeminiKey) {
    return { key: inMemoryGeminiKey, source: 'memory' };
  }

  const envKey = process.env.GEMINI_API_KEY?.trim() || '';
  if (envKey) {
    return { key: envKey, source: 'env' };
  }

  return { key: '', source: 'none' };
}

/**
 * Masks an API key for safe display in the UI.
 */
function maskKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

/**
 * Atomically writes a file using an exclusive collision-free temporary file with owner-only permissions.
 */
function atomicWriteFileSync(filePath: string, content: string, mode?: number): void {
  const tempPath = `${filePath}.tmp.${randomUUID()}`;
  let created = false;
  try {
    const fd = fs.openSync(tempPath, 'wx', mode);
    created = true;
    try {
      fs.writeFileSync(fd, content, 'utf8');
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    try {
      if (created) {
        fs.unlinkSync(tempPath);
      }
    } catch {
      // Preserve the original write failure
    }
    throw err;
  }
}

/**
 * Persists or clears the Gemini API key in userData using Electron safeStorage when available.
 * Refuses unencrypted plaintext disk persistence when OS keychain encryption is unavailable,
 * keeping the key in process memory only for the active session.
 */
function writeStoredGeminiKey(apiKey: string): GeminiSettingsInfo {
  const trimmed = apiKey.trim();
  const settingsPath = getSettingsPath();

  if (!trimmed) {
    inMemoryGeminiKey = '';
    if (fs.existsSync(settingsPath)) {
      atomicWriteFileSync(settingsPath, '{}', 0o600);
    }
    const envFallback = process.env.GEMINI_API_KEY?.trim() || '';
    return {
      hasKey: Boolean(envFallback),
      source: envFallback ? 'env' : 'none',
      maskedKey: envFallback ? maskKey(envFallback) : undefined
    };
  }

  if (!safeStorage.isEncryptionAvailable()) {
    console.warn(
      'OS keychain encryption (safeStorage) is unavailable. Refusing unencrypted disk persistence for Gemini API key; keeping key in process memory only.'
    );
    inMemoryGeminiKey = trimmed;
    return {
      hasKey: true,
      source: 'memory',
      maskedKey: maskKey(trimmed),
      warning:
        'OS keychain encryption is unavailable. API key was NOT written to disk and is kept in process memory for this session only.'
    };
  }

  inMemoryGeminiKey = '';
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  const payload: StoredSettings = {
    geminiKeyEncrypted: safeStorage.encryptString(trimmed).toString('base64')
  };

  atomicWriteFileSync(settingsPath, JSON.stringify(payload, null, 2), 0o600);
  return {
    hasKey: true,
    source: 'stored',
    maskedKey: maskKey(trimmed)
  };
}

let mainWindow: BrowserWindow | null = null;

/**
 * Resolves the application icon path for packaged or development builds.
 */
function resolveAppIcon(): string | undefined {
  const candidates = [
    path.join(__dirname, '../build/icons/512x512.png'),
    path.join(__dirname, '../build/icon.png'),
    path.join(process.resourcesPath || '', 'icons/512x512.png')
  ];
  return candidates.find((p) => p && fs.existsSync(p));
}

/**
 * Validates that an incoming IPC invocation originates from the trusted main application frame.
 */
function assertTrustedIpcSender(event: IpcMainInvokeEvent): void {
  const senderUrl = event.senderFrame?.url || '';
  if (!senderUrl) {
    throw new Error('Rejected IPC call from missing sender frame');
  }
  const parsed = new URL(senderUrl);
  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    if (parsed.origin !== new URL(devUrl).origin) {
      throw new Error(`Rejected IPC call from untrusted origin: ${parsed.origin}`);
    }
    return;
  }
  if (parsed.href !== DIST_INDEX_URL) {
    throw new Error('Rejected IPC call from untrusted document');
  }
}

/**
 * Creates the hardened primary BrowserWindow with strict 3-tier isolation and navigation guards.
 */
function createWindow(): void {
  const iconPath = resolveAppIcon();

  mainWindow = new BrowserWindow({
    width: 1460,
    height: 920,
    minWidth: 960,
    minHeight: 680,
    title: 'SpecForge Studio',
    backgroundColor: '#020617',
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        void shell.openExternal(url);
      }
    } catch {
      // Invalid URL
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    try {
      const parsedUrl = new URL(targetUrl);
      if (isDev) {
        const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
        const allowedOrigin = new URL(devUrl).origin;
        if (parsedUrl.origin !== allowedOrigin) {
          event.preventDefault();
        }
      } else if (parsedUrl.href !== DIST_INDEX_URL) {
        event.preventDefault();
      }
    } catch {
      event.preventDefault();
    }
  });

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    void mainWindow.loadURL(devUrl);
  } else {
    void mainWindow.loadFile(DIST_INDEX_PATH);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Registers all validated IPC handlers for desktop dialogs, blueprints, clipboard, and AI calls.
 */
function registerIpcHandlers(): void {
  ipcMain.handle('app:getInfo', (event): DesktopAppInfo => {
    assertTrustedIpcSender(event);
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      osRelease: `${os.type()} ${os.release()}`,
      userDataDir: app.getPath('userData'),
      blueprintsDir: getBlueprintsDir()
    };
  });

  ipcMain.handle('clipboard:writeText', (event, text: string): boolean => {
    assertTrustedIpcSender(event);
    if (typeof text !== 'string') return false;
    clipboard.writeText(text);
    return true;
  });

  ipcMain.handle(
    'dialog:saveFile',
    async (event, args: { suggestedFilename: string; content: string }) => {
      assertTrustedIpcSender(event);
      if (
        !args ||
        typeof args.content !== 'string' ||
        (args.suggestedFilename !== undefined && typeof args.suggestedFilename !== 'string')
      ) {
        return { canceled: true, error: 'Invalid file payload' };
      }
      const cleanName = path.basename(args.suggestedFilename || 'artifact.md');
      const result = await dialog.showSaveDialog(mainWindow ?? undefined!, {
        title: 'Save SpecForge Artifact',
        defaultPath: path.join(os.homedir(), cleanName),
        filters: [
          {
            name: 'Markdown / Config / Script',
            extensions: ['md', 'txt', 'yml', 'yaml', 'sh', 'json']
          },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled || !result.filePath) {
        return { canceled: true };
      }

      fs.writeFileSync(result.filePath, args.content, 'utf8');
      if (result.filePath.endsWith('.sh')) {
        fs.chmodSync(result.filePath, 0o755);
      }
      return { canceled: false, filePath: result.filePath };
    }
  );

  ipcMain.handle('dialog:exportWorkspace', async (event, req: ExportWorkspaceRequest) => {
    assertTrustedIpcSender(event);
    if (!req || !Array.isArray(req.files) || req.files.length === 0) {
      return { canceled: true, error: 'No artifact files provided' };
    }

    const result = await dialog.showOpenDialog(mainWindow ?? undefined!, {
      title: 'Choose Project Repository Folder to Export SpecForge Files',
      defaultPath: os.homedir(),
      properties: ['openDirectory', 'createDirectory']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const targetDir = path.resolve(result.filePaths[0]);
    const writtenFiles: string[] = [];

    for (const file of req.files) {
      if (typeof file.relativePath !== 'string' || typeof file.content !== 'string') {
        throw new Error('Malformed file entry in export request');
      }
      const resolvedFile = resolveSafeChildPath(targetDir, file.relativePath);
      fs.mkdirSync(path.dirname(resolvedFile), { recursive: true });
      fs.writeFileSync(resolvedFile, file.content, 'utf8');
      if (resolvedFile.endsWith('.sh')) {
        fs.chmodSync(resolvedFile, 0o755);
      }
      writtenFiles.push(file.relativePath);
    }

    return {
      canceled: false,
      targetDir,
      writtenCount: writtenFiles.length,
      writtenFiles
    };
  });

  ipcMain.handle('blueprints:list', (event): SavedBlueprint[] => {
    assertTrustedIpcSender(event);
    const dir = getBlueprintsDir();
    const entries = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const items: SavedBlueprint[] = [];

    for (const entry of entries) {
      try {
        const fullPath = resolveSafeChildPath(dir, entry);
        const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as SavedBlueprint;
        if (parsed && parsed.title && parsed.formState) {
          items.push(parsed);
        }
      } catch (err) {
        console.warn(`Skipping unreadable blueprint ${entry}:`, err);
      }
    }

    items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return items;
  });

  ipcMain.handle(
    'blueprints:save',
    (
      event,
      input: Omit<SavedBlueprint, 'id' | 'updatedAt'> & { id?: string }
    ): SavedBlueprint => {
      assertTrustedIpcSender(event);
      if (
        !input ||
        typeof input.formState !== 'string' ||
        (input.title !== undefined && typeof input.title !== 'string') ||
        (input.id !== undefined && typeof input.id !== 'string') ||
        (input.tag !== undefined && typeof input.tag !== 'string')
      ) {
        throw new Error('Invalid blueprint payload');
      }
      const dir = getBlueprintsDir();
      const id = sanitizeBlueprintId(input.id || input.title || 'blueprint');
      const record: SavedBlueprint = {
        id,
        title: input.title?.trim() || 'Untitled Blueprint',
        tag: input.tag ? input.tag.trim().toLowerCase() : '',
        updatedAt: Date.now(),
        formState: input.formState
      };

      const filePath = resolveSafeChildPath(dir, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
      return record;
    }
  );

  ipcMain.handle('blueprints:delete', (event, id: string): boolean => {
    assertTrustedIpcSender(event);
    if (typeof id !== 'string') throw new Error('Invalid id');
    const dir = getBlueprintsDir();
    const safeId = sanitizeBlueprintId(id);
    const filePath = resolveSafeChildPath(dir, `${safeId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  });

  ipcMain.handle('blueprints:exportFile', async (event, blueprint: SavedBlueprint) => {
    assertTrustedIpcSender(event);
    if (
      !blueprint ||
      typeof blueprint !== 'object' ||
      (blueprint.title !== undefined && typeof blueprint.title !== 'string')
    ) {
      return { canceled: true, error: 'Invalid blueprint payload' };
    }
    const safeSlug = sanitizeBlueprintId(blueprint.title || 'specforge-blueprint');
    const result = await dialog.showSaveDialog(mainWindow ?? undefined!, {
      title: 'Export SpecForge Blueprint (.specforge.json)',
      defaultPath: path.join(os.homedir(), `${safeSlug}.specforge.json`),
      filters: [{ name: 'SpecForge Blueprint', extensions: ['json'] }]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    fs.writeFileSync(result.filePath, JSON.stringify(blueprint, null, 2), 'utf8');
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle('blueprints:importFile', async (event) => {
    assertTrustedIpcSender(event);
    const result = await dialog.showOpenDialog(mainWindow ?? undefined!, {
      title: 'Import SpecForge Blueprint (.json)',
      defaultPath: os.homedir(),
      properties: ['openFile'],
      filters: [{ name: 'SpecForge Blueprint', extensions: ['json'] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    try {
      const raw = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8')) as SavedBlueprint;
      if (!raw || typeof raw.formState !== 'string') {
        return { canceled: false, error: 'File is not a valid SpecForge blueprint JSON.' };
      }
      return { canceled: false, blueprint: raw };
    } catch (err) {
      return { canceled: false, error: err instanceof Error ? err.message : 'Failed to parse JSON' };
    }
  });

  ipcMain.handle('settings:getGeminiKey', (event): GeminiSettingsInfo => {
    assertTrustedIpcSender(event);
    const { key, source } = readStoredGeminiKey();
    return {
      hasKey: Boolean(key),
      source,
      maskedKey: key ? maskKey(key) : undefined
    };
  });

  ipcMain.handle('settings:setGeminiKey', (event, apiKey: string): GeminiSettingsInfo => {
    assertTrustedIpcSender(event);
    if (typeof apiKey !== 'string') {
      throw new Error('API key must be a string');
    }
    return writeStoredGeminiKey(apiKey);
  });

  ipcMain.handle('ai:generateStructured', async (event, req: GeminiStructuredRequest) => {
    assertTrustedIpcSender(event);
    if (
      !req ||
      typeof req.userQuery !== 'string' ||
      typeof req.systemPrompt !== 'string' ||
      !req.responseSchema ||
      typeof req.responseSchema !== 'object'
    ) {
      throw new Error('Invalid request payload');
    }
    const { key } = readStoredGeminiKey();
    if (!key) {
      throw new Error(
        'No Gemini API key configured. Click "AI Settings" in the top bar to add your Gemini API key, or set GEMINI_API_KEY.'
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: req.userQuery }] }],
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: req.responseSchema
      }
    };

    const delays = [1000, 2000, 4000];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status}${errBody ? `: ${errBody.slice(0, 180)}` : ''}`);
        }
        const result = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty model response');
        return JSON.parse(text);
      } catch (err) {
        if (attempt === delays.length) throw err;
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  });

  ipcMain.handle('shell:openExternal', async (event, url: string): Promise<boolean> => {
    assertTrustedIpcSender(event);
    if (typeof url !== 'string') return false;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        await shell.openExternal(url);
        return true;
      }
    } catch {
      // Invalid URL
    }
    return false;
  });
}

app.whenReady().then(() => {
  app.setName('SpecForge Studio');
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
~~~~~

### `src/main.tsx`

~~~~~tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import SpecForgeStudio from './SpecForgeStudio';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpecForgeStudio />
  </React.StrictMode>
);
~~~~~

### `src/index.css`

~~~~~css
@import "tailwindcss";

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Native desktop dark scrollbar styling for Ubuntu GTK/Electron */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}

::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.7);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.9);
}
~~~~~

### `src/types/desktop.ts`

~~~~~ts
import type { DesktopAPI } from '../../electron/types';

export type {
  SavedBlueprint,
  ExportWorkspaceRequest,
  ExportWorkspaceResult,
  SaveFileResult,
  ImportBlueprintResult,
  DesktopAppInfo,
  GeminiSettingsInfo,
  GeminiStructuredRequest,
  DesktopAPI
} from '../../electron/types';

declare global {
  interface Window {
    desktopAPI?: DesktopAPI;
  }
}
~~~~~

### `src/SpecForgeStudio.tsx`

~~~~~tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Layers,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  Download,
  Cpu,
  Code2,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  HelpCircle,
  Wand2,
  Sliders,
  BookOpen,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
  ChevronRight,
  Eye,
  Zap,
  Lock,
  ListChecks,
  MessageSquare,
  FolderGit2,
  Settings,
  ArrowRight,
  Cloud,
  Save,
  FolderOpen,
  Share2,
  Info,
  Compass,
  Lightbulb,
  Smartphone as PhoneIcon,
  FolderUp,
  KeyRound,
  Upload,
  HardDrive,
  Folder,
  Bookmark
} from 'lucide-react';
import type { DesktopAppInfo, GeminiSettingsInfo, SavedBlueprint } from './types/desktop';

const LOCAL_DRAFT_STORAGE_KEY = 'specforge-studio:draft-v1';
const LOCAL_BLUEPRINTS_STORAGE_KEY = 'specforge-studio:blueprints-v1';
const LOCAL_PRESETS_STORAGE_KEY = 'specforge_saved_presets_v1';

// ============================================================================
// DUMMY-PROOF HELPER CHIPS & FILE PLACEMENT INSTRUCTIONS
// ============================================================================
const QUICK_FILL_CHIPS = {
  rolePersona: [
    'Senior Next.js 15 & React 19 Full-Stack Architect',
    'Senior Mobile Systems & Cross-Platform Engineer',
    'Senior Desktop Systems & Rust Security Architect',
    'Senior Python FastAPI & Distributed Systems Engineer'
  ],
  pinnedStack: [
    'Next.js 15 App Router, React 19, TypeScript 5.x, Tailwind CSS, TanStack Query v5, Zod, Vitest',
    'React Native 0.78 (TurboModules), TypeScript, Swift 6.0, Kotlin 2.0, SQLite, Jest + RNTL',
    'Tauri v2, Rust 1.87+, React 19, TypeScript, Vite, @tauri-apps/api/core, Vitest',
    'Electron, Node.js Main, contextBridge Preload, React 19 Sandboxed Renderer, Playwright'
  ],
  verificationCommands: [
    'pnpm typecheck && pnpm lint && pnpm test',
    'npm run typecheck && npm run lint && npm test',
    'cargo check --manifest-path src-tauri/Cargo.toml && cargo test && pnpm test',
    'pytest -v && ruff check . && mypy .'
  ],
  restrictedFiles: [
    'Do NOT manually edit src/generated/, prisma/generated/, openapi/generated/, or lockfiles.',
    'Do NOT edit ios/build/, android/app/build/, or Codegen artifacts by hand.',
    'Do NOT edit src-tauri/target/, Cargo.lock, or bypass tauri dev/build scripts.'
  ]
};

const FILE_USAGE_GUIDE = {
  'FULL_BLUEPRINT_REPORT.md': {
    whatIsIt: 'A complete, single-file master blueprint combining your project overview, task prompt, AGENTS.md, constitution, EARS spec, and vertical slices.',
    whereItGoes: 'Paste directly into a GitHub Issue, Pull Request description, Notion doc, or share with teammates for architectural review.',
    BeginnerTip: 'Use this when you want to share your entire AI specification in one clean, readable document!'
  },
  'TASK_PROMPT.md': {
    whatIsIt: 'Your main 5-Section Task Prompt with high-priority instructions at the top and bottom.',
    whereItGoes: 'Copy and paste this directly into the chat box of Google Antigravity, GitHub Copilot Chat, or a Google Jules task / GitHub Issue.',
    BeginnerTip: 'Start a fresh chat session for each task so the AI never suffers from "context rot"!'
  },
  'AGENTS.md': {
    whatIsIt: 'A permanent "README for AI Robots" that tells every coding agent your tech stack, folder structure, test commands, and rules automatically.',
    whereItGoes: 'Save this file as AGENTS.md in the very top (root) folder of your code project.',
    BeginnerTip: 'Once this file is in your project folder, you never have to re-explain your tech stack or test commands in chat again!'
  },
  '.specify/memory/constitution.md': {
    whatIsIt: 'Your non-negotiable project laws (like "Always write tests first" and "Never skip security checks").',
    whereItGoes: 'Save inside .specify/memory/constitution.md (or run /speckit.constitution in GitHub Spec Kit).',
    BeginnerTip: 'The AI checks this file before planning so it rejects bad shortcuts early.'
  },
  'specs/001-feature/spec.md': {
    whatIsIt: 'Plain-English description of WHAT the app should do using "WHEN [trigger], THE SYSTEM SHALL [action]" sentences.',
    whereItGoes: 'Save in specs/001-feature/spec.md (or generate via /speckit.specify).',
    BeginnerTip: 'Notice how there is zero code talk here—keeping tech choices out of this file stops the AI from guessing wrong early on.'
  },
  'specs/001-feature/tasks.md': {
    whatIsIt: 'A step-by-step checklist breaking your app into small, testable vertical slices instead of one giant overwhelming prompt.',
    whereItGoes: 'Save in specs/001-feature/tasks.md. Feed one task at a time to a fresh AI subagent.',
    BeginnerTip: 'Tasks marked [HITL] should be done with you watching in the IDE; tasks marked [AFK] can be handed off to background cloud agents.'
  },
  '.github/copilot-instructions.md': {
    whatIsIt: 'Automatic repository instructions specifically for GitHub Copilot.',
    whereItGoes: 'Save inside the .github/ folder of your project as .github/copilot-instructions.md.',
    BeginnerTip: 'GitHub Copilot reads this automatically on every chat message and Pull Request.'
  },
  'jules-setup.sh': {
    whatIsIt: 'A startup script that pre-installs your packages inside Google Jules’s cloud computer.',
    whereItGoes: 'In the Google Jules web dashboard, go to Codebases → Configuration → Initial Setup, paste this script, and click "Run and Snapshot".',
    BeginnerTip: 'Snapshotting makes Jules start up 5x faster on every future task!'
  },
  'bootstrap-agy.sh': {
    whatIsIt: 'A 1-click installer script for Google Antigravity (agy) that creates AGENTS.md, .agents/rules/, .agents/skills/, and specs/ automatically.',
    whereItGoes: 'Copy this script and paste it directly into the terminal inside Google Antigravity (or save as bootstrap-agy.sh and run: bash bootstrap-agy.sh).',
    BeginnerTip: 'Instead of creating 8 folders and files by hand, running this script sets up your entire Antigravity workspace in 1 second!'
  }
};

// ============================================================================
// PRESET TEMPLATES (Web, Mobile, Desktop) BASED ON THE DOCUMENT
// ============================================================================
const PRESETS = {
  web_nextjs: {
    label: 'Web App: Next.js 15 & React 19 SaaS Feature',
    platform: 'web',
    agent: 'antigravity',
    executionMode: 'HITL',
    plainIdea:
      'Build a team invoice approval workflow where workspace managers can filter pending invoices, preview line items, and approve or reject invoices with optimistic UI feedback and role-based audit logging.',
    userPersona: 'Workspace Finance Managers & Team Admins in a multi-tenant B2B SaaS app',
    // 5-Section Task Prompt Fields
    rolePersona: 'Senior Next.js 15 & React 19 Full-Stack Architect',
    roleFocus: 'App Router Server Components, TanStack Query v5 cache boundaries, and Zod Server Actions',
    objective: 'Implement the role-based invoice approval vertical slice with optimistic status transitions',
    observableOutcome: 'workspace managers can filter, approve, or reject invoices with zero full-page reloads and strict server-side ownership checks',
    targetFilesModify: '@src/app/(dashboard)/invoices/page.tsx, @src/features/invoices/components/InvoiceList.tsx, @src/features/invoices/components/InvoiceControls.tsx, @src/features/invoices/invoice-actions.ts',
    targetFilesRef: '@src/types/invoice.ts, @src/services/billing-service.ts, @src/lib/auth.ts',
    pinnedStack: 'Next.js 15 App Router, React 19, TypeScript 5.x (strict), Tailwind CSS, TanStack Query v5, Zustand (UI state only), Zod, Vitest, React Testing Library + MSW',
    unapprovedLibs: 'Do NOT introduce Redux, Axios, moment.js, or legacy Next.js Pages Router patterns (getServerSideProps).',
    visualContext: 'See attached mockup for InvoiceCard layout and inline rejection reason popover.',
    stateAndDataRules:
      "Keep route handlers and page.tsx synchronous composition shells; never fetch data inside page.tsx. Use params.then() or Promise.all([params, searchParams]).then() instead of top-level await params. Default feature components to async Server Components receiving plain props (id, statusFilter) and export a matching *Skeleton at the bottom of the same file. Restrict 'use client' strictly to leaf interactive subcomponents (InvoiceControls.tsx) using useOptimistic and useTransition.",
    runtimeAndSecurityLimits:
      'Validate all inputs with Zod at the Server Action boundary (@src/features/invoices/invoice-actions.ts), verify workspace manager role and tenant ownership on the server before mutating, and never trust client-supplied user IDs or role flags.',
    restrictedFiles: 'Do NOT manually edit src/generated/, prisma/generated/, openapi/generated/, or pnpm-lock.yaml.',
    taskSteps: [
      'Define the Zod input/output schemas (ApproveInvoiceSchema, RejectInvoiceSchema) and discriminated union return types in @src/features/invoices/invoice-schema.ts.',
      'Implement the server service logic in @src/services/billing-service.ts and wire validated Server Actions in @src/features/invoices/invoice-actions.ts with cache tag invalidation.',
      'Build @src/features/invoices/components/InvoiceList.tsx as an async Server Component with exported InvoiceListSkeleton, and wire synchronous <Suspense fallback={<InvoiceListSkeleton />}> in @src/app/(dashboard)/invoices/page.tsx.',
      "Implement the 'use client' leaf component @src/features/invoices/components/InvoiceControls.tsx using useOptimistic and useTransition for instant approve/reject feedback.",
      'Write behavior-first RTL + MSW integration tests verifying skeleton loading, accessible role queries (getByRole), and optimistic rollback on server failure.'
    ],
    uiStates: {
      loading: 'Render <InvoiceListSkeleton /> with matching card height inside page.tsx <Suspense> boundary.',
      empty: 'Render accessible empty state with "Clear Filters" action when no invoices match the URL status query.',
      error: 'Render ErrorBoundary fallback card with a retry callback and correlation ID.',
      offline: 'Disable mutation buttons with tooltip indicating offline network status.',
      disabled: 'Disable Approve/Reject controls when user role is Viewer or invoice is already locked.',
      success: 'Optimistically update badge to Approved/Rejected and persist audit log timestamp.'
    },
    exampleInput: '{"invoice_id": "inv_8841", "workspace_id": "ws_102", "decision": "REJECTED", "reason": "Missing PO number"}',
    exampleOutput: '{"status": "ok", "data": {"id": "inv_8841", "state": "REJECTED", "updated_at": "2026-11-09T22:15:00Z"}}',
    planFirstGate: true,
    verificationCommands: 'pnpm typecheck && pnpm lint && pnpm test --filter invoices',
    deliverableFormat: 'Generate an Implementation Plan artifact first and wait for approval. Upon completion, summarize modified files, RTL + MSW test results, and any remaining edge-case assumptions.',
    // AGENTS.md 10-Section Fields
    agentsProduct: 'Multi-tenant B2B financial workflow and spend management SaaS application used by finance managers and department leads.',
    agentsStack: 'TypeScript 5.7, Next.js 15 (App Router), React 19, Tailwind CSS v4, PostgreSQL 16, Prisma ORM, TanStack Query v5, Zustand, Zod, Vitest, React Testing Library, Mock Service Worker (MSW), Playwright.',
    agentsRepoStructure:
      'src/app/ -> Synchronous route shells, layouts, and <Suspense> boundaries\nsrc/features/<domain>/ -> Domain Server Components, leaf Client Components, and Server Actions\nsrc/services/ -> Pure business logic and data orchestration\nsrc/lib/ -> Shared infrastructure, auth session helpers, and DB client\nsrc/types/ -> Shared TypeScript interfaces and domain DTOs',
    agentsCommands:
      'Install: pnpm install\nDev Server: pnpm dev\nTypecheck: pnpm typecheck\nLint: pnpm lint\nUnit/Integration Tests: pnpm test\nSingle File Test: pnpm vitest run <path/to/file.test.tsx>\nE2E Tests: pnpm test:e2e\nProduction Build: pnpm build',
    agentsArchitecture:
      "- Keep route files (app/**/page.tsx) synchronous composition shells; never run inline DB/API queries in page.tsx.\n- Feature components default to async Server Components; place 'use client' strictly on interactive leaf components.\n- Page owns <Suspense>, Feature file exports matching *Skeleton at the bottom of the file.\n- Keep server data in Server Components or TanStack Query v5 cache; never copy server data into global Zustand stores or useEffect state.",
    agentsConventions:
      '- Prefer named exports for all components and services.\n- Use composition (children and React.ReactNode slots) instead of boolean layout props (e.g., avoid hasHeader, showFooter).\n- Use stable entity IDs (item.id) for React list keys; never use array index keys.\n- Calculate derived state inline during render; never compute derived state inside useEffect.',
    agentsTesting:
      '- Enforce Red-Green-Refactor TDD for every vertical slice.\n- Query DOM elements strictly via React Testing Library accessibility hierarchy: getByRole -> getByLabelText -> getByText.\n- Mock network boundaries with MSW; never mock internal custom hooks or use UI snapshot tests.',
    agentsSecurity:
      '- Enforce server-side workspace and resource ownership checks inside every Server Action and API route.\n- Treat client inputs (roles, prices, tenant IDs, user IDs) as untrusted; validate all external inputs with Zod at system boundaries.\n- Never log raw JWTs, API keys, or PII in server or client logs.',
    agentsDatabase:
      '- Prohibit destructive database migrations (DROP TABLE, DROP COLUMN) without explicit human approval.\n- Require a non-blocking backfill migration plan whenever adding required columns to populated tables.\n- Never edit already-applied migration files under prisma/migrations/.',
    agentsGenerated:
      'Never manually edit files in:\n- src/generated/\n- prisma/generated/\n- openapi/generated/\n- pnpm-lock.yaml\nRegenerate types via: pnpm db:generate && pnpm openapi:codegen',
    // SDD Fields
    constitutionRules:
      '1. TDD is non-negotiable: write failing behavior-first tests before application code.\n2. All database persistence must go through src/services/.\n3. Zero main-thread or SSR blocking on static route shells.\n4. Every external input must be validated with a Zod schema.',
    earsSpecs: [
      {
        when: 'a non-admin workspace member attempts to approve or reject an invoice',
        shall: 'deny the mutation at the Server Action boundary, log an unauthorized audit event, and return a typed FORBIDDEN error union'
      },
      {
        when: 'a workspace manager clicks Reject without providing a rejection note of at least 10 characters',
        shall: 'prevent submission and display an accessible inline validation message linked via aria-describedby'
      },
      {
        when: 'an invoice approval request succeeds or fails over the network',
        shall: 'immediately transition the UI via useOptimistic and automatically roll back to PENDING with a retry toast if the server returns an error'
      }
    ],
    verticalSlices: [
      {
        id: 'T001',
        mode: 'HITL',
        parallel: false,
        title: 'Invoice Approval Schema, Service & Ownership Guard',
        layers: 'Zod schema + billingService.updateInvoiceDecision() + Server Action auth guard + unit test'
      },
      {
        id: 'T002',
        mode: 'AFK',
        parallel: true,
        title: 'Async Server InvoiceList + Skeleton & Synchronous Page Shell',
        layers: 'page.tsx <Suspense> shell + async InvoiceList.tsx + InvoiceListSkeleton + MSW fixture'
      },
      {
        id: 'T003',
        mode: 'AFK',
        parallel: true,
        title: 'Optimistic Leaf InvoiceControls & RTL Integration Suite',
        layers: "'use client' InvoiceControls.tsx (useOptimistic/useTransition) + RTL getByRole & rollback test"
      }
    ]
  },

  mobile_rn: {
    label: 'Mobile App: React Native 0.78 TurboModule & Offline Sync',
    platform: 'mobile',
    agent: 'copilot',
    executionMode: 'HITL',
    plainIdea:
      'Build an offline-first field inspection checklist screen with hardware-backed biometric sign-off (iOS Secure Enclave / Android Keystore) and background SQLite synchronization over unstable cellular networks.',
    userPersona: 'Field Safety Inspectors working on iOS and Android devices in low-connectivity industrial sites',
    rolePersona: 'Senior Mobile Systems & Cross-Platform Engineer',
    roleFocus: 'React Native 0.78 New Architecture TurboModules, Swift 6.0, Kotlin 2.0 Coroutines, and offline-first SQLite',
    objective: 'Implement the Biometric Inspection Sign-Off TurboModule and offline-first Checklist screen',
    observableOutcome: 'inspectors can complete checklists offline at 60/120 fps and cryptographically sign reports via Secure Enclave / Keystore without blocking the main UI thread',
    targetFilesModify: '@src/specs/NativeBiometricSigner.ts, @ios/BiometricSigner/BiometricSignerImpl.swift, @android/app/src/main/java/com/app/biometrics/BiometricSignerModule.kt, @src/features/inspections/InspectionSignOffScreen.tsx',
    targetFilesRef: '@src/db/sqlite-sync.ts, @src/types/inspection.ts',
    pinnedStack: 'React Native 0.78 (New Architecture / Codegen TurboModules), TypeScript 5.x, iOS 18 Swift 6.0, Android API 35 Kotlin 2.0 (Coroutines / Dispatchers.IO), op-sqlite, Jest + React Native Testing Library (RNTL)',
    unapprovedLibs: 'Do NOT use legacy React Native Bridge modules, synchronous AsyncStorage for cryptographic keys, or unmaintained third-party biometric wrappers.',
    visualContext: 'Support both phone and tablet viewports in Light/Dark mode with Dynamic Type scaling up to 200%.',
    stateAndDataRules:
      'Persist all checklist progress locally in SQLite first with an outbox sync queue for 3G/offline transitions. Represent screen state as an explicit discriminated union covering loading, empty, offline (cached fallback), error (with retry), disabled, and success.',
    runtimeAndSecurityLimits:
      'ZERO main-thread blocking: execute all native bridge calls, biometric key generation, and SQLite I/O on background dispatch queues (Swift structured concurrency / Kotlin Dispatchers.IO). Store signing keys inside iOS Secure Enclave and Android Hardware-Backed Keystore (BiometricPrompt). Enforce WCAG 2.2 AA compliance, VoiceOver/TalkBack semantic traits, and 44x44pt / 48x48dp minimum touch targets.',
    restrictedFiles: 'Do NOT manually edit ios/build/, android/app/build/, or Codegen output directories.',
    taskSteps: [
      'Define the Codegen-compatible TypeScript TurboModule spec in @src/specs/NativeBiometricSigner.ts with structured error codes.',
      'Implement the iOS Swift 6.0 and Android Kotlin 2.0 native modules using background dispatch queues and hardware keystores, handling user cancellation and passcode fallback.',
      'Build @src/features/inspections/InspectionSignOffScreen.tsx handling loading, empty, offline, error, disabled, and success states with full VoiceOver/TalkBack labels and Dynamic Type support.',
      'Write Jest + RNTL component and mock TurboModule tests covering offline queuing, biometric cancellation, and successful cryptographic signature.'
    ],
    uiStates: {
      loading: 'Render skeleton shimmer without layout shift while querying local SQLite cache.',
      empty: 'Display accessible empty state with "Download Assigned Inspections" button.',
      error: 'Display non-modal banner with structured biometric/sync error code and "Retry Sign-Off" button.',
      offline: 'Show "Offline Mode — Queued for Sync" badge and commit signed payload to local SQLite outbox.',
      disabled: 'Disable "Sign & Submit" until all mandatory safety items are checked.',
      success: 'Display verified cryptographic signature hash and trigger background sync worker.'
    },
    exampleInput: '{"inspectionId": "insp_409", "payloadHash": "sha256:9f86d081884c7d659a2feaa0c55ad015"}',
    exampleOutput: '{"status": "SIGNED", "signatureBase64": "MEYCIQ...", "keyAlias": "enclave_insp_key_v1", "queuedOffline": true}',
    planFirstGate: true,
    verificationCommands: 'pnpm typecheck && pnpm lint && pnpm test -- InspectionSignOff',
    deliverableFormat: 'Output in order: (1) TypeScript TurboModule spec, (2) Native Swift & Kotlin implementations with thread-safety notes, (3) Accessible RN screen component, (4) RNTL test suite.',
    agentsProduct: 'Offline-first industrial field inspection mobile application for iOS and Android with hardware-backed cryptographic sign-off.',
    agentsStack: 'React Native 0.78 (TurboModules + Fabric), TypeScript 5.x, Swift 6.0 (iOS 17+), Kotlin 2.0 (Android Min SDK 26 / Target SDK 35), op-sqlite, Jest, React Native Testing Library.',
    agentsRepoStructure:
      'src/specs/ -> Codegen TurboModule & Fabric TypeScript specifications\nsrc/features/ -> Mobile screens, state machines, and UI widgets\nsrc/db/ -> Offline-first SQLite schema and background sync outbox\nios/ -> Native Swift 6.0 TurboModule implementations\nandroid/ -> Native Kotlin 2.0 TurboModule implementations',
    agentsCommands:
      'Install: pnpm install && npx pod-install\nTypecheck: pnpm typecheck\nLint: pnpm lint\nUnit/Widget Tests: pnpm test\nSingle Test: pnpm jest <path/to/test.tsx>\niOS Build Check: pnpm ios --mode Debug\nAndroid Build Check: pnpm android --mode debug',
    agentsArchitecture:
      '- All native bridge modules must use React Native New Architecture TurboModules with strict Codegen specs.\n- ZERO main-thread blocking: run all native hardware, crypto, and DB work on background queues (Swift Task.detached / Kotlin Dispatchers.IO).\n- Every screen must explicitly implement loading, empty, offline, error, disabled, and success states.',
    agentsConventions:
      '- Enforce WCAG 2.2 AA accessibility: every interactive element requires accessibilityRole, accessibilityLabel, and accessibilityState.\n- Support Dynamic Type text scaling without container clipping and respect edge-to-edge SafeAreaView insets.',
    agentsTesting:
      '- Mock native TurboModules at the spec boundary in Jest setup.\n- Assert behavior, accessibility roles/states, and offline state recovery using React Native Testing Library.',
    agentsSecurity:
      '- Store cryptographic keys and tokens exclusively in iOS Secure Enclave / Keychain and Android Hardware-Backed Keystore.\n- Handle biometric enrollment changes, lockout, and user cancellation gracefully.',
    agentsDatabase:
      '- All local SQLite schema migrations must be forward-compatible and preserve unsynced offline outbox rows.',
    agentsGenerated:
      'Never manually edit Codegen artifacts under ios/build/generated/ or android/app/build/generated/.',
    constitutionRules:
      '1. Zero main-thread frame drops (maintain 60/120 fps).\n2. Offline-first persistence: user actions must succeed locally when cellular connectivity drops.\n3. Hardware-backed keystore required for all auth and signing tokens.\n4. WCAG 2.2 Level AA and VoiceOver/TalkBack semantics mandatory on every widget.',
    earsSpecs: [
      {
        when: 'the device has no cellular or Wi-Fi connectivity during inspection sign-off',
        shall: 'sign the inspection payload using the local hardware keystore, store the signed record in the SQLite outbox, and display an Offline Queued confirmation state'
      },
      {
        when: 'the user cancels the native BiometricPrompt or FaceID sheet',
        shall: 'propagate a typed USER_CANCELLED code across the TurboModule bridge without crashing or clearing form state'
      }
    ],
    verticalSlices: [
      {
        id: 'T001',
        mode: 'HITL',
        parallel: false,
        title: 'TurboModule Codegen Spec & Background Swift/Kotlin Signer',
        layers: 'NativeBiometricSigner.ts + Swift 6.0 Secure Enclave + Kotlin 2.0 Keystore + mock bridge unit test'
      },
      {
        id: 'T002',
        mode: 'AFK',
        parallel: true,
        title: 'Offline SQLite Outbox & Accessible Sign-Off Screen',
        layers: 'SQLite outbox queue + 6-state InspectionSignOffScreen.tsx + VoiceOver/TalkBack labels + RNTL test'
      }
    ]
  },

  desktop_tauri: {
    label: 'Desktop App: Tauri v2 (Rust + Capabilities + IPC)',
    platform: 'desktop',
    agent: 'jules',
    executionMode: 'AFK',
    plainIdea:
      'Build a local-first encrypted log analyzer feature for our desktop app that lets engineers select a local log directory, parse and filter multi-gigabyte log files in Rust without freezing the UI, and export sanitized reports.',
    userPersona: 'Systems & Security Engineers running the desktop app on macOS, Windows, and Linux',
    rolePersona: 'Senior Desktop Systems & Rust Security Architect',
    roleFocus: 'Tauri v2 Rust backend (#[tauri::command]), least-privilege capabilities, and React 19 TypeScript frontend',
    objective: 'Implement the path-validated local log analyzer vertical slice across Rust backend, Tauri v2 IPC, and sandboxed UI',
    observableOutcome: 'users can scan local log files within scoped directories using background Rust threads with zero path traversal risk',
    targetFilesModify: '@src-tauri/src/lib.rs, @src-tauri/src/commands/log_analyzer.rs, @src-tauri/capabilities/default.json, @src/features/logs/LogAnalyzerPanel.tsx, @src/__mocks__/tauri-core.ts',
    targetFilesRef: '@src-tauri/tauri.conf.json, @vitest.config.ts',
    pinnedStack: 'Tauri v2, Rust 1.87+, TypeScript 5.x, React 19, Vite, @tauri-apps/api/core, Vitest',
    unapprovedLibs: 'NEVER import from deprecated Tauri v1 @tauri-apps/api/tauri. Do NOT enable allow-all shell or filesystem scopes.',
    visualContext: 'Desktop split-pane view with virtualized log table and progress bar during Rust file scan.',
    stateAndDataRules:
      'Manage shared Rust state via tauri::State<\'_, Mutex<AppState>> and return Result<LogSummaryDto, String> from every fallible #[tauri::command] for clean Promise rejection handling in TypeScript.',
    runtimeAndSecurityLimits:
      'Canonicalize and validate all incoming file paths in Rust to strictly prevent path traversal (../) outside the user-approved workspace directory. Declare explicit, least-privilege permissions inside src-tauri/capabilities/default.json. Preserve tauri.conf.json beforeDevCommand/beforeBuildCommand.',
    restrictedFiles: 'Do NOT manually edit src-tauri/target/, Cargo.lock, or change top-level npm run dev / build scripts to bypass tauri CLI.',
    taskSteps: [
      'Implement the Rust command parse_log_directory in @src-tauri/src/commands/log_analyzer.rs with #[tauri::command], path canonicalization against traversal, and Result<LogSummaryDto, String> return type.',
      'Register parse_log_directory inside tauri::generate_handler![...] in @src-tauri/src/lib.rs (keeping #[cfg_attr(mobile, tauri::mobile_entry_point)] intact).',
      'Grant least-privilege command and scoped directory permissions inside @src-tauri/capabilities/default.json.',
      'Build @src/features/logs/LogAnalyzerPanel.tsx invoking the command via import { invoke } from "@tauri-apps/api/core", and add a matching IPC mock in @src/__mocks__/ for Vitest.'
    ],
    uiStates: {
      loading: 'Display streaming scan progress bar with cancel button while Rust worker processes files.',
      empty: 'Show prompt to select an authorized log folder when no directory is loaded.',
      error: 'Render structured Rust Result::Err message (e.g., PathOutsideAllowedScope) with retry option.',
      offline: 'Operate 100% offline using local filesystem resources.',
      disabled: 'Disable Export button while scan is active or when 0 log entries match filter.',
      success: 'Render virtualized log table with severity counts and sanitized export confirmation.'
    },
    exampleInput: '{"directoryPath": "/Users/alice/workspace/logs", "severityFilter": "ERROR"}',
    exampleOutput: '{"totalLines": 142050, "matchedEntries": 28, "sanitizedPreview": ["[REDACTED_IP] Connection timeout"]}',
    planFirstGate: true,
    verificationCommands: 'cargo check --manifest-path src-tauri/Cargo.toml && cargo test --manifest-path src-tauri/Cargo.toml && pnpm typecheck && pnpm test',
    deliverableFormat: 'Generate an Implementation Plan first. Deliver Rust command module, lib.rs handler registration, capabilities/default.json diff, frontend component, and Cargo + Vitest test outputs.',
    agentsProduct: 'Cross-platform local-first security and log analysis desktop application built with Tauri v2 and Rust.',
    agentsStack: 'Tauri v2, Rust 1.87, React 19, TypeScript 5.x, Vite, Tailwind CSS, Cargo Test, Vitest.',
    agentsRepoStructure:
      'src-tauri/src/lib.rs -> Tauri v2 entry point and tauri::generate_handler![] registry\nsrc-tauri/src/commands/ -> Domain #[tauri::command] Rust modules\nsrc-tauri/capabilities/ -> Least-privilege Tauri v2 capability JSON files\nsrc/features/ -> Sandboxed React 19 UI components\nsrc/__mocks__/ -> Vitest mocks for @tauri-apps/api/core and Tauri plugins',
    agentsCommands:
      'Install: pnpm install\nDesktop Dev: pnpm tauri dev\nRust Check: cargo check --manifest-path src-tauri/Cargo.toml\nRust Tests: cargo test --manifest-path src-tauri/Cargo.toml\nFrontend Typecheck: pnpm typecheck\nFrontend Tests: pnpm test\nDesktop Build: pnpm tauri build',
    agentsArchitecture:
      '- Always import invoke from @tauri-apps/api/core (never v1 @tauri-apps/api/tauri).\n- Place shared Rust backend setup in src-tauri/src/lib.rs and register every command in tauri::generate_handler![].\n- Return Result<T, String> from fallible commands and wrap shared mutable state in tauri::State<\'_, Mutex<AppState>>.',
    agentsConventions:
      '- Never modify package.json dev/build scripts to call Vite directly; tauri dev/build orchestrates Vite.\n- Every new Tauri plugin or command invoked in UI must have a matching mock in src/__mocks__/ aliased in vitest.config.ts.',
    agentsTesting:
      '- Write Rust unit tests in each command module testing both valid inputs and path-traversal rejection.\n- Write Vitest + RTL tests for frontend views using mocked IPC responses.',
    agentsSecurity:
      '- Canonicalize and validate all file paths in Rust against path traversal (../../../etc/passwd) before reading or writing.\n- Enforce least-privilege permissions in src-tauri/capabilities/default.json; never grant allow-all shell or fs scopes.\n- Audit both pnpm-lock.yaml and Cargo.lock.',
    agentsDatabase:
      '- Local embedded SQLite files must reside inside app_data_dir() with strict file permissions.',
    agentsGenerated:
      'Never manually edit src-tauri/target/, dist/, or lockfiles.',
    constitutionRules:
      '1. Strict Tauri v2 API compliance (@tauri-apps/api/core + capabilities/default.json).\n2. Mandatory Rust path canonicalization to prevent directory traversal.\n3. Every #[tauri::command] must return Result<T, E> and be registered in generate_handler![].\n4. Dual test verification: both cargo test and pnpm test must pass.',
    earsSpecs: [
      {
        when: 'the frontend passes a directory path containing "../" or resolving outside the allowed workspace scope',
        shall: 'reject the call in Rust after path canonicalization and return Err("PathOutsideAllowedScope") without opening any file descriptor'
      },
      {
        when: 'a new #[tauri::command] is added to the Rust backend',
        shall: 'register the command in tauri::generate_handler![] in src-tauri/src/lib.rs and grant explicit permission in src-tauri/capabilities/default.json'
      }
    ],
    verticalSlices: [
      {
        id: 'T001',
        mode: 'HITL',
        parallel: false,
        title: 'Rust #[tauri::command] Log Parser with Path Canonicalization & Capabilities',
        layers: 'log_analyzer.rs + lib.rs generate_handler![] + capabilities/default.json + cargo test suite'
      },
      {
        id: 'T002',
        mode: 'AFK',
        parallel: true,
        title: 'Frontend LogAnalyzerPanel (@tauri-apps/api/core) & Vitest IPC Mocks',
        layers: 'LogAnalyzerPanel.tsx + src/__mocks__/tauri-core.ts + Vitest component test'
      }
    ]
  }
};

// ============================================================================
// HELPER: EXPONENTIAL BACKOFF GEMINI API CALLER (Desktop IPC + Web Fallback)
// ============================================================================
async function callGeminiStructured(
  systemPrompt: string,
  userQuery: string,
  responseSchema: Record<string, unknown>
): Promise<any> {
  if (typeof window !== 'undefined' && window.desktopAPI) {
    return window.desktopAPI.generateGeminiStructured({
      systemPrompt,
      userQuery,
      responseSchema
    });
  }

  throw new Error(
    'AI Auto-Architect requires the desktop app or a configured Gemini API key.'
  );
}

type ViewMode = 'simple' | 'intermediate' | 'pro';

const SIMPLE_ESSENTIAL_FILES: Array<{ key: string; label: string }> = [
  { key: 'TASK_PROMPT.md', label: '📋 1. Copy-Paste AI Prompt' },
  { key: 'AGENTS.md', label: '🤖 2. Project Rules (AGENTS.md)' },
  { key: 'bootstrap-agy.sh', label: '⚡ 3. 1-Click Auto-Setup' }
];

const INTERMEDIATE_CORE_FILES: Array<{ key: string; label: string; subtitle: string }> = [
  { key: 'TASK_PROMPT.md', label: 'TASK_PROMPT.md', subtitle: 'Your main AI task prompt' },
  { key: 'AGENTS.md', label: 'AGENTS.md', subtitle: 'Permanent project rules' },
  { key: 'specs/001-feature/spec.md', label: 'spec.md', subtitle: 'Feature requirements (EARS)' },
  { key: 'specs/001-feature/tasks.md', label: 'tasks.md', subtitle: 'Step-by-step feature slices' },
  {
    key: '.specify/memory/constitution.md',
    label: 'constitution.md',
    subtitle: 'Core non-negotiable laws'
  },
  { key: 'bootstrap-agy.sh', label: 'bootstrap-agy.sh', subtitle: '1-click Antigravity setup' }
];

interface IntermediateRulePreset {
  id: string;
  label: string;
  helper: string;
  targetField: 'stateAndDataRules' | 'runtimeAndSecurityLimits';
  technicalRule: string;
}

const INTERMEDIATE_RULE_PRESETS: IntermediateRulePreset[] = [
  {
    id: 'server_client_split',
    label: 'Keep data fetching separate from visual design (Server/Client split)',
    helper: 'Keeps data queries out of interactive UI leaves so state stays predictable and fast.',
    targetField: 'stateAndDataRules',
    technicalRule:
      "- Separate server data fetching from client UI rendering: keep queries/mutations in server or service boundaries and restrict 'use client' strictly to leaf interactive components."
  },
  {
    id: 'require_passing_tests',
    label: 'Require automated tests to pass before finishing tasks',
    helper: 'Prevents the AI from marking a task done until typecheck and tests succeed.',
    targetField: 'runtimeAndSecurityLimits',
    technicalRule:
      '- Gate every task completion on passing typecheck, lint, and scoped unit/integration tests without skipping or weakening assertions.'
  },
  {
    id: 'path_traversal_protection',
    label: 'Prevent file path hacks or security holes (Path Traversal protection)',
    helper: 'Enforces safe root boundary checks against ../ path escapes and untrusted inputs.',
    targetField: 'runtimeAndSecurityLimits',
    technicalRule:
      '- Enforce strict path canonicalization and root-boundary validation on every filesystem or IPC input to prevent path traversal (../) and injection vulnerabilities.'
  }
];

function deriveTracerBulletLayers(title: string, platform: string): string {
  const boundary =
    platform === 'desktop'
      ? 'Typed IPC Bridge'
      : platform === 'mobile'
        ? 'Native Module Boundary'
        : 'Validated API Boundary';
  const normalized = title.trim().toLowerCase();
  const dataLayer = normalized.includes('auth') ? 'Auth Schema' : 'Data Schema';
  return `${dataLayer} + Domain Service + ${boundary} + UI Slice + Automated Test`;
}

type ExpandableFieldKey = 'plainIdea' | 'objective' | 'observableOutcome';

function buildOfflineExpandedBullets(
  fieldKey: ExpandableFieldKey,
  currentValue: string,
  platform: string,
  userPersona: string
): string {
  const persona = (userPersona || 'target users').trim();
  const platformLabel =
    platform === 'desktop' ? 'desktop app' : platform === 'mobile' ? 'mobile app' : 'web app';
  if (fieldKey === 'objective') {
    return `(Includes input validation, loading/error states, and automated tests for our ${platformLabel}.)`;
  }
  if (fieldKey === 'observableOutcome') {
    return `(Verified with instant visual feedback, safe error recovery, and accessible controls for ${persona}.)`;
  }
  const topicHint = currentValue ? 'for this workflow' : `for the ${platformLabel}`;
  return [
    `- Provide clear loading, empty, and error feedback states ${topicHint}`,
    `- Validate all user inputs and keep actions responsive for ${persona}`,
    `- Include automated verification checks so core flows stay reliable`
  ].join('\n');
}

function ExpandedTextHighlight({
  fieldKey,
  text,
  onClear
}: {
  fieldKey: ExpandableFieldKey;
  text: string;
  onClear: () => void;
}) {
  return (
    <div
      data-testid={`expanded-highlight-${fieldKey}`}
      className="mt-2 bg-amber-500/15 border-l-2 border-amber-400 px-2.5 py-2 rounded text-xs text-amber-100 space-y-1.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Newly Expanded Options (Added to Input Above)</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-[11px] font-semibold text-amber-100 transition"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 transition"
          >
            Clear Highlight
          </button>
        </div>
      </div>
      <div className="bg-amber-500/15 border-l-2 border-amber-400 px-1 rounded whitespace-pre-wrap text-[11px] text-amber-50">
        {text}
      </div>
    </div>
  );
}

export type AutoFillSectionId =
  | 'role_objective'
  | 'context_stack'
  | 'constraints'
  | 'task_steps'
  | 'verification'
  | 'agentsmd'
  | 'sdd_constitution'
  | 'sdd_spec'
  | 'sdd_tasks';

/** Hover tooltip with info icon that explains a form setting in plain English. */
function InfoTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="group relative inline-flex items-center cursor-help text-slate-400 hover:text-indigo-300 transition shrink-0"
    >
      <Info className="w-3.5 h-3.5" aria-hidden="true" />
      <span
        role="tooltip"
        aria-hidden="true"
        className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 w-56 rounded-lg bg-slate-950 border border-indigo-500/40 px-2.5 py-1.5 text-[11px] font-normal normal-case tracking-normal text-slate-200 shadow-xl leading-snug"
      >
        {text}
      </span>
    </span>
  );
}

/** Context-aware section-level AI Auto-Fill button. */
function SectionAutoFillButton({
  sectionId,
  activeSection,
  onAutoFill
}: {
  sectionId: AutoFillSectionId;
  activeSection: AutoFillSectionId | null;
  onAutoFill: (id: AutoFillSectionId) => void;
}) {
  const isLoading = activeSection === sectionId;
  return (
    <button
      type="button"
      data-testid={`autofill-section-btn-${sectionId}`}
      disabled={isLoading}
      onClick={() => onAutoFill(sectionId)}
      className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium text-indigo-200 flex items-center gap-1 disabled:opacity-50 transition"
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      <span>{isLoading ? 'Auto-Filling...' : '✨ Auto-Fill Section'}</span>
    </button>
  );
}

/** Soft amber highlight card for reviewing section-level AI auto-fill suggestions. */
function SectionAutoFillHighlight({
  sectionId,
  text,
  onClear
}: {
  sectionId: AutoFillSectionId;
  text: string;
  onClear: () => void;
}) {
  return (
    <div
      data-testid={`section-autofill-highlight-${sectionId}`}
      className="rounded-xl bg-amber-500/10 border border-amber-400/40 p-2.5 text-xs text-amber-100 space-y-1.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>AI Section Auto-Fill Applied (highlighted for review)</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] font-semibold text-amber-200 transition"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 transition"
          >
            Clear Highlight
          </button>
        </div>
      </div>
      <div className="bg-amber-500/15 border-l-2 border-amber-400 px-2 py-1 rounded whitespace-pre-wrap text-[11px] text-amber-50">
        {text}
      </div>
    </div>
  );
}

/** Deterministic offline section-level smart auto-fill generator tailored to the user's main idea. */
export function buildOfflineSectionPatch(
  sectionId: AutoFillSectionId,
  plainIdea: string,
  userPersona: string,
  platform: string,
  currentForm: Record<string, any>
): { patch: Record<string, any>; summary: string } {
  const ideaSnippet = (plainIdea || 'Build a reliable, user-friendly application workflow')
    .trim()
    .split('\n')[0]
    .slice(0, 140);
  const personaSnippet = (userPersona || 'end users and team members').trim();

  switch (sectionId) {
    case 'role_objective': {
      const rolePersona =
        platform === 'mobile'
          ? 'Senior React Native (New Architecture) & Offline-First Mobile Architect'
          : platform === 'desktop'
            ? 'Senior Rust Systems & Tauri v2 / Electron Security Architect'
            : 'Senior Full-Stack Next.js 15 & React 19 Principal Engineer';
      const roleFocus =
        platform === 'mobile'
          ? '60fps native navigation, optimistic offline queues, and strict schema validation'
          : platform === 'desktop'
            ? 'Least-privilege IPC capabilities, path validation, and local SQLite persistence'
            : 'React 19 Server/Client boundaries, URL-synced filters, and accessible keyboard UX';
      const objective = `Architect and ship: ${ideaSnippet}`;
      const observableOutcome = `So that ${personaSnippet} can complete their workflow with instant visual feedback, clear validation states, and zero unhandled runtime errors.`;
      return {
        patch: { rolePersona, roleFocus, objective, observableOutcome },
        summary: `Persona: ${rolePersona}\nFocus: ${roleFocus}\nObjective: ${objective}\nOutcome: ${observableOutcome}`
      };
    }
    case 'context_stack': {
      const pinnedStack =
        platform === 'mobile'
          ? 'React Native 0.76+ (Fabric/TurboModules), TypeScript 5.8, Expo Router v4, Zod, Vitest'
          : platform === 'desktop'
            ? 'Rust 2024 / Tauri v2 (or Electron 35+), React 19, TypeScript 5.8, Tailwind CSS v4, Vitest'
            : 'Next.js 15 (App Router), React 19, TypeScript 5.8 (strict), Tailwind CSS v4, Zod, Vitest';
      const unapprovedLibs =
        'moment.js, untyped fetch wrappers, inline styles, unvalidated raw SQL strings';
      const visualContext = `Clean, high-contrast workspace tailored for ${personaSnippet} with keyboard shortcuts and responsive layout.`;
      return {
        patch: { pinnedStack, unapprovedLibs, visualContext },
        summary: `Pinned Stack: ${pinnedStack}\nRejected Patterns: ${unapprovedLibs}\nVisual Context: ${visualContext}`
      };
    }
    case 'constraints': {
      const stateAndDataRules = `- Validate all external inputs at module boundaries using strict schemas for: ${ideaSnippet}.\n- Keep server/persistence state separate from ephemeral UI state; use URL or durable local storage for user filters.`;
      const runtimeAndSecurityLimits = `- EnforceWCAG 2.2 AA keyboard navigation, focus rings, and explicit loading/error states for ${personaSnippet}.\n- Sanitize all file paths and user payloads; never expose secrets or internal stack traces in the UI.`;
      return {
        patch: { stateAndDataRules, runtimeAndSecurityLimits },
        summary: `${stateAndDataRules}\n${runtimeAndSecurityLimits}`
      };
    }
    case 'task_steps': {
      const taskSteps = [
        `1. Define strict TypeScript interfaces and validation schemas for: ${ideaSnippet}`,
        `2. Implement the core data & state layer with optimistic feedback and deterministic error recovery`,
        `3. Build the accessible UI component tree for ${personaSnippet} covering Loading, Empty, Error, Offline, Disabled, and Success states`,
        `4. Add unit and integration tests verifying happy-path and edge-case behavior`
      ];
      return {
        patch: { taskSteps },
        summary: taskSteps.join('\n')
      };
    }
    case 'verification': {
      const verificationCommands = 'npm run typecheck && npm run lint && npm test -- --run';
      const deliverableFormat =
        '1. Concise architectural summary\n2. Production-ready implementation diffs\n3. Verification test suite output';
      return {
        patch: { verificationCommands, deliverableFormat },
        summary: `Verification Commands: ${verificationCommands}\nDeliverable Contract:\n${deliverableFormat}`
      };
    }
    case 'agentsmd': {
      const agentsTechStack = `- Primary Goal: ${ideaSnippet}\n- Target Users: ${personaSnippet}\n- Stack: TypeScript 5.8 (strict), React 19, Tailwind CSS v4, Vitest`;
      const agentsCodeStyle = `- Prefer small, pure functions and explicit return types.\n- Enforce accessible roles/labels and deterministic state transitions.\n- Run typecheck and unit tests after every slice.`;
      return {
        patch: { agentsTechStack, agentsCodeStyle },
        summary: `${agentsTechStack}\n${agentsCodeStyle}`
      };
    }
    case 'sdd_constitution': {
      const sddConstitution = `1. Every vertical slice for "${ideaSnippet}" must ship with automated tests.\n2. All user inputs from ${personaSnippet} must be validated with clear, human-readable error states.\n3. No unapproved dependencies or silent catch blocks are permitted.`;
      return {
        patch: { sddConstitution },
        summary: sddConstitution
      };
    }
    case 'sdd_spec': {
      const sddSummary = `${ideaSnippet} — designed for ${personaSnippet} with full keyboard accessibility, fast feedback, and resilient error recovery.`;
      const sddWhy = `Eliminates manual friction and inconsistent state handling for ${personaSnippet}.`;
      const sddSuccessMetrics = `- 100% of core user flows pass automated verification tests.\n- Zero unhandled runtime errors across Loading, Empty, Error, and Success states.`;
      return {
        patch: { sddSummary, sddWhy, sddSuccessMetrics },
        summary: `Summary: ${sddSummary}\nRationale: ${sddWhy}\nSuccess Metrics:\n${sddSuccessMetrics}`
      };
    }
    case 'sdd_tasks': {
      const existingSlices = Array.isArray(currentForm.sddSlices) ? currentForm.sddSlices : [];
      const updatedSlices =
        existingSlices.length > 0
          ? existingSlices.map((sl: any, idx: number) =>
              idx === 0
                ? {
                    ...sl,
                    name: `End-to-End Slice: ${ideaSnippet.slice(0, 55)}`,
                    test: `Integration test verifying ${personaSnippet} can complete the primary flow and recover from errors`
                  }
                : sl
            )
          : [
              {
                id: 'SLICE-01',
                mode: 'HITL',
                name: `End-to-End Slice: ${ideaSnippet.slice(0, 55)}`,
                schema: 'Core TypeScript domain models & validation schema',
                api: 'State controller & persistence service handler',
                ui: 'Accessible UI view with Loading, Empty, Error, and Success states',
                test: `Integration test verifying ${personaSnippet} can complete the primary flow`
              }
            ];
      return {
        patch: { sddSlices: updatedSlices },
        summary: `Updated Slice 1: ${updatedSlices[0].name}\nTest Gate: ${updatedSlices[0].test}`
      };
    }
  }
}

/** Collapsible, tooltip-friendly plain-language explanation card for Intermediate Mode. */
function JargonTranslationCard({
  term,
  explanation
}: {
  term: string;
  explanation: string;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div
      title={explanation}
      className="rounded-xl bg-indigo-950/35 border border-indigo-500/30 px-3 py-2 text-xs text-indigo-100"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Plain-English Guide: {term}</span>
        </span>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[11px] text-indigo-300 hover:underline shrink-0"
        >
          {expanded ? 'Hide' : 'Explain'}
        </button>
      </div>
      {expanded && (
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{explanation}</p>
      )}
    </div>
  );
}

const DEFAULT_FORM = {
  ...PRESETS.web_nextjs,
  // Platform-specific extra config fields
  pointerStyle: '@path', // '@path' (Antigravity / Copilot CLI) or '#file' (VS Code)
  desktopFramework: 'tauri_v2', // 'tauri_v2' or 'electron'
  // Antigravity Rule Config
  agyRuleName: 'architecture-boundaries',
  agyTrigger: 'always_on', // 'always_on' | 'model_decision' | 'glob' | 'manual'
  agyGlobs: '*.tsx, src/features/**/*.ts',
  agyRuleDescription:
    'Enforces strict UI/Server boundary separation, state placement, and security validation rules.',
  // Antigravity Skill Config
  agySkillName: 'verify-vertical-slice',
  agySkillDescription:
    'Executes the project typecheck, linter, and scoped unit/integration test suite for a completed vertical slice. Use when verifying code changes before marking a task complete.',
  // Copilot Path-Specific Instruction Config
  copilotInstructionName: 'domain-boundaries',
  copilotApplyTo: 'src/features/**/*.tsx,src/app/**/*.tsx',
  copilotExcludeAgent: 'none', // 'none' | 'code-review' | 'cloud-agent'
  // Copilot Custom Agent Config
  copilotAgentName: 'implementation-planner',
  copilotAgentRole: 'planner', // 'planner' (read/search only) | 'implementer' (full tools)
  // Monorepo Nested AGENTS.md Config
  enableNestedAgents: true,
  nestedSubprojectPath: 'apps/mobile',
  nestedCommandOverrides:
    'Test Package Only: pnpm --filter @app/mobile test\nTypecheck Package: pnpm --filter @app/mobile typecheck',
  nestedLocalConstraints:
    'Enforce 60/120 fps frame budget; run all TurboModule calls on background queues.'
};

/**
 * Recursively validates that `value` structurally matches `defaults`.
 * When `requireAllFields` is true (used for array item schemas like `earsSpecs`),
 * every key in `defaults` must be present and match its type.
 */
function matchesDefaults(value: any, defaults: any, requireAllFields = false): boolean {
  if (typeof defaults !== 'object' || defaults === null) {
    return typeof value === typeof defaults;
  }
  if (typeof value !== 'object' || value === null) return false;
  if (Array.isArray(defaults)) {
    if (!Array.isArray(value)) return false;
    if (defaults.length === 0) return true;
    return value.every((item) => matchesDefaults(item, defaults[0], true));
  }
  if (Array.isArray(value)) return false;

  for (const key of Object.keys(defaults)) {
    if (requireAllFields && !(key in value)) {
      return false;
    }
    if (key in value && value[key] !== undefined) {
      if (!matchesDefaults(value[key], defaults[key], requireAllFields)) return false;
    }
  }
  return true;
}

/**
 * Runtime type guard for saved project presets stored in `localStorage`.
 */
function isValidSavedPreset(
  item: any
): item is { id: string; name: string; projectTitle: string; formState: any; updatedAt: number } {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.projectTitle === 'string' &&
    typeof item.updatedAt === 'number' &&
    matchesDefaults(item.formState, DEFAULT_FORM)
  );
}

/**
 * Reusable accessible modal hook: traps Tab focus, closes on Escape,
 * and restores focus without stealing focus on state re-renders.
 */
function useModalFocusTrap(
  isOpen: boolean,
  onClose: () => void,
  dialogRef: React.RefObject<HTMLElement | null>
) {
  const onCloseRef = React.useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    if (dialog) {
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialog.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === 'Tab' && dialog) {
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === dialog) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    };
  }, [isOpen, dialogRef]);
}

export default function SpecForgeStudio() {
  // Active workspace tab ('ideation' first in Simple Mode)
  const [activeTab, setActiveTab] = useState('ideation');
  // 3-way view selector: Simple (No-Code Wizard), Intermediate (Pro-Light), Pro (All 14 Files)
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const isSimpleMode = viewMode === 'simple';
  const isIntermediateMode = viewMode === 'intermediate';
  const isProMode = viewMode === 'pro';
  const dummyProofMode = isSimpleMode;
  const showPlainHelpers = !isProMode;
  // Optional toggle inside Simple/Intermediate dock to peek at all 14 files
  const [showAllSimpleFiles, setShowAllSimpleFiles] = useState(false);
  // Auto-Expand Options loading & visual highlight state
  const [expandingField, setExpandingField] = useState<ExpandableFieldKey | null>(null);
  const [expandedHighlights, setExpandedHighlights] = useState<
    Partial<Record<ExpandableFieldKey, string>>
  >({});
  // Section-level AI Auto-Fill loading & visual highlight state
  const [autoFillingSection, setAutoFillingSection] = useState<AutoFillSectionId | null>(null);
  const [sectionHighlights, setSectionHighlights] = useState<
    Partial<Record<AutoFillSectionId, string>>
  >({});
  // Mobile view switcher ('editor' | 'preview') for small screens
  const [mobilePane, setMobilePane] = useState('editor');
  // Active preview file in the right-hand artifact dock
  const [selectedArtifact, setSelectedArtifact] = useState('TASK_PROMPT.md');
  // Copy toast feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  // Status banner message
  const [statusMessage, setStatusMessage] = useState<{ type: string; text: string } | null>(null);
  // Collapsible Prompt Readiness Scorecard state
  const [showScorecard, setShowScorecard] = useState(true);
  const [pendingScorecardFocus, setPendingScorecardFocus] = useState<{
    focusId: string;
    token: number;
  } | null>(null);
  const scorecardFocusTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timeout refs to clean up on unmount or re-trigger
  const statusTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (scorecardFocusTimerRef.current) clearTimeout(scorecardFocusTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pendingScorecardFocus) return;
    const { focusId } = pendingScorecardFocus;
    const el = document.getElementById(focusId);
    if (!el) return;

    el.focus();
    if (typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    el.classList.add('ring-2', 'ring-indigo-500', 'transition-shadow', 'duration-500');

    if (scorecardFocusTimerRef.current) clearTimeout(scorecardFocusTimerRef.current);
    scorecardFocusTimerRef.current = setTimeout(() => {
      el.classList.remove('ring-2', 'ring-indigo-500', 'transition-shadow', 'duration-500');
    }, 2000);
    setPendingScorecardFocus(null);
  }, [pendingScorecardFocus, activeTab, viewMode, mobilePane]);

  /** Sets statusMessage and clears only if it is still the active message when the timer expires. */
  const setStatusMessageWithTimeout = (msg: { type: string; text: string } | null, duration: number = 4000) => {
    setStatusMessage(msg);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    if (msg !== null) {
      statusTimeoutRef.current = setTimeout(
        () => setStatusMessage((current) => (current === msg ? null : current)),
        duration
      );
    }
  };

  // Desktop & Local Blueprint Storage State
  const [desktopInfo, setDesktopInfo] = useState<DesktopAppInfo | null>(null);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [presetsModalOpen, setPresetsModalOpen] = useState(false);
  const [savedPresets, setSavedPresets] = useState<
    Array<{ id: string; name: string; projectTitle: string; formState: any; updatedAt: number }>
  >([]);
  const [presetNameInput, setPresetNameInput] = useState('');
  const presetsDialogRef = React.useRef<HTMLDivElement>(null);
  const cloudDialogRef = React.useRef<HTMLDivElement>(null);
  const settingsDialogRef = React.useRef<HTMLDivElement>(null);

  useModalFocusTrap(presetsModalOpen, () => setPresetsModalOpen(false), presetsDialogRef);
  useModalFocusTrap(cloudModalOpen, () => setCloudModalOpen(false), cloudDialogRef);
  useModalFocusTrap(settingsModalOpen, () => setSettingsModalOpen(false), settingsDialogRef);

  const [geminiSettings, setGeminiSettings] = useState<GeminiSettingsInfo>({
    hasKey: false,
    source: 'none'
  });
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isExportingFolder, setIsExportingFolder] = useState(false);

  const [projectTitle, setProjectTitle] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.projectTitle) return parsed.projectTitle;
      }
    } catch {
      // ignore malformed draft
    }
    return 'My Invoice Approval App';
  });
  const [blueprintTag, setBlueprintTag] = useState('');
  const [mySavedProjects, setMySavedProjects] = useState<SavedBlueprint[]>([]);
  const [sharedCloudProjects, setSharedCloudProjects] = useState<SavedBlueprint[]>([]);
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  // Core Form State initialized from saved draft or Web Next.js 15 preset
  const [form, setForm] = useState<any>(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.form) {
          return {
            ...DEFAULT_FORM,
            ...parsed.form,
            uiStates: {
              ...DEFAULT_FORM.uiStates,
              ...(parsed.form.uiStates || {})
            }
          };
        }
      }
    } catch {
      // ignore malformed draft
    }

    return DEFAULT_FORM;
  });

  // Track initially loaded or saved workspace state for unsaved-changes detection
  const [baselineState, setBaselineState] = useState({ projectTitle, form });

  // AI Loading & Socratic /grill-me Interview State
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isGrilling, setIsGrilling] = useState(false);
  const [grillQuestions, setGrillQuestions] = useState<
    Array<{ id: string; focusArea: string; question: string; options: string[] }>
  >([]);
  const [grillAnswers, setGrillAnswers] = useState<Record<string, string>>({});

  // Auto-save active draft locally so work survives app restarts
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_DRAFT_STORAGE_KEY,
        JSON.stringify({ projectTitle, form })
      );
    } catch (err) {
      console.warn('Draft auto-save skipped:', err);
    }
  }, [projectTitle, form]);

  // ============================================================================
  // DESKTOP INITIALIZATION & LOCAL BLUEPRINT STORAGE
  // ============================================================================
  const refreshBlueprints = async () => {
    if (window.desktopAPI) {
      const list = await window.desktopAPI.listBlueprints();
      setMySavedProjects(list);
      setSharedCloudProjects(list.filter((b) => Boolean(b.tag)));
      return;
    }

    try {
      const raw = localStorage.getItem(LOCAL_BLUEPRINTS_STORAGE_KEY);
      const list: SavedBlueprint[] = raw ? JSON.parse(raw) : [];
      list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setMySavedProjects(list);
      setSharedCloudProjects(list.filter((b) => Boolean(b.tag)));
    } catch {
      setMySavedProjects([]);
      setSharedCloudProjects([]);
    }
  };

  // ============================================================================
  // SAVED PROJECT PRESETS (LOCAL STORAGE)
  // ============================================================================
  const handleSavePreset = () => {
    const trimmed = presetNameInput.trim() || projectTitle.trim() || 'Untitled Preset';
    const snapshotTitle = projectTitle;
    const snapshotForm = form;
    const newPreset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      projectTitle: snapshotTitle,
      formState: snapshotForm,
      updatedAt: Date.now()
    };
    const next = [newPreset, ...savedPresets];
    try {
      localStorage.setItem(LOCAL_PRESETS_STORAGE_KEY, JSON.stringify(next));
      setSavedPresets(next);
      setPresetNameInput('');
      setBaselineState({ projectTitle: snapshotTitle, form: snapshotForm });
      setStatusMessageWithTimeout({
        type: 'success',
        text: `Saved preset "${trimmed}" to local storage.`
      });
    } catch (err: any) {
      setStatusMessageWithTimeout({
        type: 'error',
        text: `Failed to save preset: ${err?.message || err}`
      });
    }
  };

  const handleLoadPreset = (preset: {
    id: string;
    name: string;
    projectTitle: string;
    formState: any;
    updatedAt: number;
  }) => {
    if (JSON.stringify({ projectTitle, form }) !== JSON.stringify(baselineState)) {
      if (!window.confirm('You have unsaved changes in your active draft. Overwrite?')) {
        return;
      }
    }
    const newProjectTitle = preset.projectTitle || preset.name;
    const newForm = {
      ...DEFAULT_FORM,
      ...preset.formState,
      uiStates: {
        ...DEFAULT_FORM.uiStates,
        ...(preset.formState?.uiStates || {})
      }
    };
    setProjectTitle(newProjectTitle);
    setForm(newForm);
    setBaselineState({ projectTitle: newProjectTitle, form: newForm });
    setPresetsModalOpen(false);
    setStatusMessageWithTimeout({
      type: 'success',
      text: `Loaded preset "${preset.name}"!`
    });
  };

  const handleDeletePreset = (id: string, name: string) => {
    const next = savedPresets.filter((p) => p.id !== id);
    try {
      localStorage.setItem(LOCAL_PRESETS_STORAGE_KEY, JSON.stringify(next));
      setSavedPresets(next);
      setStatusMessageWithTimeout({
        type: 'info',
        text: `Deleted preset "${name}".`
      });
    } catch (err: any) {
      setStatusMessageWithTimeout({
        type: 'error',
        text: `Failed to delete preset: ${err?.message || err}`
      });
    }
  };

  const handleResetToDefaultPreset = () => {
    if (JSON.stringify({ projectTitle, form }) !== JSON.stringify(baselineState)) {
      if (!window.confirm('You have unsaved changes in your active draft. Overwrite?')) {
        return;
      }
    }
    const newProjectTitle = 'My Invoice Approval App';
    const newForm = {
      ...DEFAULT_FORM,
      uiStates: {
        ...DEFAULT_FORM.uiStates
      },
      earsSpecs: [...DEFAULT_FORM.earsSpecs],
      verticalSlices: [...DEFAULT_FORM.verticalSlices]
    };
    setProjectTitle(newProjectTitle);
    setForm(newForm);
    setBaselineState({ projectTitle: newProjectTitle, form: newForm });
    setPresetsModalOpen(false);
    setStatusMessageWithTimeout({
      type: 'info',
      text: 'Reset workspace to default blueprint.'
    });
  };

  useEffect(() => {
    void refreshBlueprints();
    try {
      const rawPresets = localStorage.getItem(LOCAL_PRESETS_STORAGE_KEY);
      if (rawPresets) {
        const parsed = JSON.parse(rawPresets);
        if (Array.isArray(parsed)) {
          setSavedPresets(parsed.filter(isValidSavedPreset));
        }
      }
    } catch {
      // ignore malformed presets
    }
    if (window.desktopAPI) {
      window.desktopAPI.getAppInfo().then(setDesktopInfo).catch(console.error);
      window.desktopAPI.getGeminiSettings().then(setGeminiSettings).catch(console.error);
    }
  }, []);

  const handleSaveGeminiKey = async (clearKey = false) => {
    if (!window.desktopAPI) return;
    setIsSavingSettings(true);
    try {
      const next = await window.desktopAPI.setGeminiApiKey(clearKey ? '' : geminiKeyInput);
      setGeminiSettings(next);
      setGeminiKeyInput('');
      setSettingsModalOpen(false);
      if (!clearKey && (next.warning || next.source === 'memory')) {
        setStatusMessage({
          type: 'warning',
          text:
            next.warning ||
            'OS keychain encryption is unavailable; Gemini API key is kept in process memory only for this session.'
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: clearKey
            ? 'Cleared stored Gemini API key.'
            : 'Saved Gemini API key securely on this Ubuntu desktop! AI Auto-Architect and /grill-me are ready.'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Could not save API key: ${err?.message || err}`
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Save current project locally on Ubuntu desktop (with optional Tag for filtering/sharing)
  const handleSaveToCloud = async (withTag = false) => {
    setIsSavingCloud(true);
    const savedTitleSnapshot = projectTitle;
    const savedFormSnapshot = form;
    try {
      const cleanId =
        savedTitleSnapshot
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'blueprint';

      const payload = {
        id: cleanId,
        title: savedTitleSnapshot || 'Untitled Blueprint',
        tag: withTag ? blueprintTag.trim().toLowerCase() : '',
        formState: JSON.stringify(savedFormSnapshot)
      };

      if (window.desktopAPI) {
        await window.desktopAPI.saveBlueprint(payload);
      } else {
        const raw = localStorage.getItem(LOCAL_BLUEPRINTS_STORAGE_KEY);
        const list: SavedBlueprint[] = raw ? JSON.parse(raw) : [];
        const record: SavedBlueprint = {
          ...payload,
          updatedAt: Date.now()
        };
        const next = [record, ...list.filter((item) => item.id !== record.id)];
        localStorage.setItem(LOCAL_BLUEPRINTS_STORAGE_KEY, JSON.stringify(next));
      }

      setBaselineState({ projectTitle: savedTitleSnapshot, form: savedFormSnapshot });
      await refreshBlueprints();
      setStatusMessage({
        type: 'success',
        text: withTag
          ? `Saved "${savedTitleSnapshot}" locally with tag "#${blueprintTag || 'untagged'}". You can also export it as a .specforge.json file!`
          : `Saved "${savedTitleSnapshot}" to your Ubuntu desktop workspace!`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Failed to save blueprint: ${err?.message || err}`
      });
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleLoadFromCloud = (item: SavedBlueprint) => {
    try {
      const parsed = JSON.parse(item.formState);
      const loadedTitle = item.title || 'Loaded Project';
      const loadedForm = {
        ...DEFAULT_FORM,
        ...parsed,
        uiStates: {
          ...DEFAULT_FORM.uiStates,
          ...(parsed?.uiStates || {})
        }
      };
      setForm(loadedForm);
      setProjectTitle(loadedTitle);
      setBaselineState({ projectTitle: loadedTitle, form: loadedForm });
      if (item.tag) setBlueprintTag(item.tag);
      setCloudModalOpen(false);
      setStatusMessage({
        type: 'success',
        text: `Loaded "${item.title}"! All generated files and sections are updated.`
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Could not parse saved project data.'
      });
    }
  };

  const handleDeleteCloudItem = async (id: string) => {
    try {
      if (window.desktopAPI) {
        await window.desktopAPI.deleteBlueprint(id);
      } else {
        const raw = localStorage.getItem(LOCAL_BLUEPRINTS_STORAGE_KEY);
        const list: SavedBlueprint[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          LOCAL_BLUEPRINTS_STORAGE_KEY,
          JSON.stringify(list.filter((item) => item.id !== id))
        );
      }
      await refreshBlueprints();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportBlueprintJson = async (item: SavedBlueprint) => {
    try {
      if (window.desktopAPI) {
        const res = await window.desktopAPI.exportBlueprintFile(item);
        if (!res.canceled && res.filePath) {
          setStatusMessageWithTimeout({
            type: 'success',
            text: `Exported blueprint JSON to ${res.filePath}`
          });
        }
        return;
      }
      await handleDownloadFile(`${item.id || 'blueprint'}.specforge.json`, JSON.stringify(item, null, 2));
    } catch (err: any) {
      console.error('Export blueprint error:', err);
      setStatusMessage({
        type: 'error',
        text: `Export failed: ${err?.message || err}`
      });
    }
  };

  const handleImportBlueprintJson = async () => {
    if (!window.desktopAPI) return;
    try {
      const res = await window.desktopAPI.importBlueprintFile();
      if (res.canceled) return;
      if (res.error || !res.blueprint) {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Could not import blueprint JSON.'
        });
        return;
      }
      const saved = await window.desktopAPI.saveBlueprint({
        id: res.blueprint.id,
        title: res.blueprint.title,
        tag: res.blueprint.tag,
        formState: res.blueprint.formState
      });
      await refreshBlueprints();
      handleLoadFromCloud(saved);
    } catch (err: any) {
      console.error('Import blueprint error:', err);
      setStatusMessage({
        type: 'error',
        text: `Import failed: ${err?.message || err}`
      });
    }
  };

  // Helper to update form fields
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateUiState = (stateKey, value) => {
    setForm((prev) => ({
      ...prev,
      uiStates: { ...prev.uiStates, [stateKey]: value }
    }));
  };

  // Load a preset template
  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    setForm((prev) => ({
      ...prev,
      ...preset
    }));
    setStatusMessageWithTimeout({
      type: 'success',
      text: `Loaded "${preset.label}" preset across all prompt, AGENTS.md, and SDD sections.`
    }, 4000);
  };

  // Inject Domain Boundary Invariant Preset into Section 3
  const applyDomainInvariants = (domainType) => {
    if (domainType === 'web') {
      updateField('platform', 'web');
      updateField(
        'stateAndDataRules',
        "1. Keep route files (app/**/page.tsx and layout.tsx) synchronous composition shells; never fetch data in page.tsx. Use params.then() instead of top-level await params.\n2. Feature components default to async Server Components receiving plain props; export a matching *Skeleton at the bottom of the same file. Parent page.tsx wraps features in <Suspense fallback={<FeatureSkeleton />}.\n3. Restrict 'use client' strictly to leaf interactive components using useOptimistic and useTransition.\n4. Keep server data in Server Components or TanStack Query v5 cache; never copy server state into Zustand or useEffect. Use React.ReactNode slots instead of boolean layout props."
      );
      updateField(
        'runtimeAndSecurityLimits',
        "Validate all external inputs with Zod at the 'use server' Action boundary, verify resource ownership on the server before mutating, and test behavior with React Testing Library (getByRole -> getByLabelText -> getByText) + MSW."
      );
    } else if (domainType === 'mobile') {
      updateField('platform', 'mobile');
      updateField(
        'stateAndDataRules',
        '1. Offline-first capability using local SQLite/Room cache with an outbox queue for unstable 3G/cellular transitions.\n2. Explicitly implement a discriminated union / sealed interface for all 6 UI states: loading, empty, offline, error (with retry), disabled, and success.'
      );
      updateField(
        'runtimeAndSecurityLimits',
        '1. ZERO main-thread blocking: run all native bridge calls (Codegen TurboModules / Platform Channels), crypto, and disk I/O on background dispatch queues (Swift structured concurrency / Kotlin Coroutines Dispatchers.IO).\n2. Store sensitive tokens inside iOS Secure Enclave / Keychain and Android Hardware-Backed Keystore (BiometricPrompt).\n3. Enforce WCAG 2.2 AA compliance, VoiceOver/TalkBack semantic traits, minimum touch targets, and Dynamic Type text scaling without clipping.'
      );
    } else if (domainType === 'desktop_tauri') {
      updateField('platform', 'desktop');
      updateField('desktopFramework', 'tauri_v2');
      updateField(
        'stateAndDataRules',
        "1. Import invoke strictly from '@tauri-apps/api/core' (NEVER deprecated v1 '@tauri-apps/api/tauri').\n2. Define Rust commands with #[tauri::command] returning Result<OutputDto, String> and manage shared state via tauri::State<'_, Mutex<AppState>>.\n3. Register every command inside tauri::generate_handler![...] in src-tauri/src/lib.rs."
      );
      updateField(
        'runtimeAndSecurityLimits',
        '1. Canonicalize and validate all incoming file paths in Rust to prevent path traversal (../../../etc/passwd) outside allowed directories.\n2. Declare explicit, least-privilege permissions in src-tauri/capabilities/default.json (never allow-all scopes).\n3. Preserve tauri.conf.json build chain and add matching IPC mocks in src/__mocks__/ for Vitest.'
      );
    } else if (domainType === 'desktop_electron') {
      updateField('platform', 'desktop');
      updateField('desktopFramework', 'electron');
      updateField(
        'stateAndDataRules',
        "1. Enforce 3-Tier Process Isolation: Main Process (ipcMain.handle) <-> Preload Script (contextBridge.exposeInMainWorld) <-> Sandboxed Renderer UI.\n2. Expose only narrow, domain-specific methods on window.desktopAPI calling ipcRenderer.invoke('domain:action', payload); never expose raw ipcRenderer."
      );
      updateField(
        'runtimeAndSecurityLimits',
        "1. Enforce the 3 Absolute Laws of Electron Security on BrowserWindow: contextIsolation: true, nodeIntegration: false, and sandbox: true.\n2. Inject strict Content-Security-Policy headers (default-src 'self'; script-src 'self') and validate all IPC payloads with Zod/schema checks in ipcMain.handle() before invoking OS filesystem or shell APIs."
      );
    }
    setStatusMessageWithTimeout({
      type: 'info',
      text: `Injected production ${domainType.toUpperCase()} architectural boundary invariants into Section 3.`
    }, 3500);
  };

  // ============================================================================
  // AI MAGIC AUTO-ARCHITECT (Transforms plain language into all sections)
  // ============================================================================
  const clearExpandedHighlight = (fieldKey: ExpandableFieldKey) => {
    setExpandedHighlights((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleAutoExpandField = async (fieldKey: ExpandableFieldKey) => {
    const currentValue = String(form[fieldKey] || '').trim();
    setExpandingField(fieldKey);

    try {
      let addedText = '';
      const canCallAI = Boolean(window.desktopAPI && geminiSettings.hasKey);

      if (canCallAI) {
        try {
          const systemPrompt =
            'You are a Senior Product & Software Architect. Given a user draft, return 3 concise, plain-language engineering bullets that flesh out edge cases, user feedback states, and validation.';
          const userQuery = `Field: ${fieldKey}\nPlatform: ${form.platform}\nUsers: ${form.userPersona}\nCurrent Text: ${currentValue}`;
          const schema = {
            type: 'OBJECT',
            properties: {
              bullets: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['bullets']
          };
          const res = await callGeminiStructured(systemPrompt, userQuery, schema);
          if (Array.isArray(res?.bullets) && res.bullets.length > 0) {
            addedText = res.bullets
              .map((b: string) => (b.trim().startsWith('-') ? b.trim() : `- ${b.trim()}`))
              .join('\n');
          }
        } catch {
          // Fall back to deterministic offline expander if Gemini call fails
        }
      }

      if (!addedText) {
        addedText = buildOfflineExpandedBullets(
          fieldKey,
          currentValue,
          form.platform,
          form.userPersona
        );
      }

      const separator = fieldKey === 'plainIdea' ? '\n' : ' ';
      const nextVal = currentValue ? `${currentValue}${separator}${addedText}` : addedText;
      updateField(fieldKey, nextVal);
      setExpandedHighlights((prev) => ({
        ...prev,
        [fieldKey]: addedText
      }));
    } finally {
      setExpandingField(null);
    }
  };

  const clearSectionHighlight = (sectionId: AutoFillSectionId) => {
    setSectionHighlights((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const handleAutoFillSection = async (sectionId: AutoFillSectionId) => {
    setAutoFillingSection(sectionId);
    try {
      const fallback = buildOfflineSectionPatch(
        sectionId,
        form.plainIdea,
        form.userPersona,
        form.platform,
        form
      );
      let patch = fallback.patch;
      let summary = fallback.summary;
      const canCallAI = Boolean(window.desktopAPI && geminiSettings.hasKey);

      if (canCallAI) {
        try {
          const systemPrompt =
            'You are a Principal Software Architect. Suggest a concise, production-ready summary of updates for the requested specification section based on the user idea.';
          const userQuery = `Section: ${sectionId}\nIdea: ${form.plainIdea}\nUsers: ${form.userPersona}\nPlatform: ${form.platform}`;
          const schema = {
            type: 'OBJECT',
            properties: {
              summary: { type: 'STRING' }
            },
            required: ['summary']
          };
          const res = await callGeminiStructured(systemPrompt, userQuery, schema);
          if (typeof res?.summary === 'string' && res.summary.trim()) {
            summary = res.summary.trim();
          }
        } catch {
          // Fall back to deterministic offline section auto-fill
        }
      }

      setForm((prev) => ({
        ...prev,
        ...patch
      }));
      setSectionHighlights((prev) => ({
        ...prev,
        [sectionId]: summary
      }));
    } finally {
      setAutoFillingSection(null);
    }
  };

  const applyOfflineSmartTemplates = () => {
    const idea = form.plainIdea.trim();
    const persona = (form.userPersona || 'end users').trim();
    const shortIdea = idea.length > 90 ? `${idea.slice(0, 87)}...` : idea;

    setForm((prev: any) => {
      const existingEars = Array.isArray(prev.earsSpecs) ? [...prev.earsSpecs] : [];
      const firstEars = {
        when: `a user interacts with ${shortIdea}`,
        shall: `complete the workflow reliably for ${persona} with clear status feedback and error recovery`
      };
      const updatedEars =
        existingEars.length > 0 ? [firstEars, ...existingEars.slice(1)] : [firstEars];

      return {
        ...prev,
        objective: `Build and verify: ${idea} (for ${persona}).`,
        observableOutcome: `Users (${persona}) can complete "${shortIdea}" end-to-end with validated inputs, clear loading/empty/error states, and passing automated tests.`,
        agentsProduct: `${idea} — built for ${persona}.`,
        earsSpecs: updatedEars
      };
    });

    setStatusMessage({
      type: 'success',
      text: 'Built your custom AI instructions using Offline Smart Templates! (Add a free Gemini key in AI Key settings anytime for deeper AI generation.)'
    });
  };

  const handleMagicAutoArchitect = async () => {
    if (!form.plainIdea.trim()) {
      setStatusMessage({
        type: 'warning',
        text: 'Please describe your plain-language app or feature idea first!'
      });
      return;
    }

    if (window.desktopAPI && !geminiSettings.hasKey) {
      applyOfflineSmartTemplates();
      return;
    }

    setIsGeneratingAll(true);
    setStatusMessage({
      type: 'info',
      text: 'Synthesizing 5-Section Prompt Contract, 10-Section AGENTS.md, EARS Specs, and Vertical Slices from your plain language idea...'
    });

    const systemPrompt = `You are a Principal Spec-Driven Development (SDD) & Context Engineering Architect specializing in Google Antigravity, GitHub Copilot, and Google Jules workflows.
Given the user's plain-language app/feature idea, target platform (${form.platform}), and target coding agent (${form.agent}), synthesize a complete, deeply technical, production-grade specification across all required fields.
Strictly enforce:
- For Web: Next.js 15 App Router, synchronous page.tsx shells, async Server Components with exported *Skeleton, 'use client' only on leaf components with useOptimistic/useTransition, Zod-validated 'use server' Actions, TanStack Query v5, RTL + MSW tests.
- For Mobile: React Native 0.78 TurboModules / Flutter Platform Channels / Swift 6.0 / Kotlin 2.0, ZERO main-thread blocking (background dispatch queues), offline-first SQLite, iOS Secure Enclave / Android Keystore, WCAG 2.2 AA + VoiceOver/TalkBack, 6 explicit UI states.
- For Desktop: Tauri v2 (@tauri-apps/api/core, #[tauri::command] returning Result<T, String>, Mutex<AppState>, capabilities/default.json, Rust path canonicalization) OR Electron 3 Absolute Security Laws (contextIsolation: true, nodeIntegration: false, sandbox: true, contextBridge).
- EARS Requirements: Phrased strictly as trigger ("when") and system reaction ("shall") with zero tech-stack bias in the EARS statements.
- Vertical Slices: End-to-end tracer bullets cutting across DB/Schema + Service/Backend + UI + Test, classified as HITL or AFK.`;

    const userQuery = `Plain-Language Idea: ${form.plainIdea}
Target Users / Persona: ${form.userPersona}
Target Platform: ${form.platform}
Target Agent Harness: ${form.agent}
Execution Preference: ${form.executionMode}`;

    const schema = {
      type: 'OBJECT',
      properties: {
        rolePersona: { type: 'STRING' },
        roleFocus: { type: 'STRING' },
        objective: { type: 'STRING' },
        observableOutcome: { type: 'STRING' },
        targetFilesModify: { type: 'STRING' },
        targetFilesRef: { type: 'STRING' },
        pinnedStack: { type: 'STRING' },
        unapprovedLibs: { type: 'STRING' },
        stateAndDataRules: { type: 'STRING' },
        runtimeAndSecurityLimits: { type: 'STRING' },
        restrictedFiles: { type: 'STRING' },
        taskSteps: { type: 'ARRAY', items: { type: 'STRING' } },
        uiStates: {
          type: 'OBJECT',
          properties: {
            loading: { type: 'STRING' },
            empty: { type: 'STRING' },
            error: { type: 'STRING' },
            offline: { type: 'STRING' },
            disabled: { type: 'STRING' },
            success: { type: 'STRING' }
          },
          required: ['loading', 'empty', 'error', 'offline', 'disabled', 'success']
        },
        exampleInput: { type: 'STRING' },
        exampleOutput: { type: 'STRING' },
        verificationCommands: { type: 'STRING' },
        agentsProduct: { type: 'STRING' },
        agentsStack: { type: 'STRING' },
        agentsRepoStructure: { type: 'STRING' },
        agentsCommands: { type: 'STRING' },
        agentsArchitecture: { type: 'STRING' },
        agentsConventions: { type: 'STRING' },
        agentsTesting: { type: 'STRING' },
        agentsSecurity: { type: 'STRING' },
        agentsDatabase: { type: 'STRING' },
        agentsGenerated: { type: 'STRING' },
        constitutionRules: { type: 'STRING' },
        earsSpecs: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              when: { type: 'STRING' },
              shall: { type: 'STRING' }
            },
            required: ['when', 'shall']
          }
        },
        verticalSlices: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              mode: { type: 'STRING' },
              parallel: { type: 'BOOLEAN' },
              title: { type: 'STRING' },
              layers: { type: 'STRING' }
            },
            required: ['id', 'mode', 'parallel', 'title', 'layers']
          }
        }
      },
      required: [
        'rolePersona',
        'roleFocus',
        'objective',
        'observableOutcome',
        'targetFilesModify',
        'pinnedStack',
        'stateAndDataRules',
        'runtimeAndSecurityLimits',
        'taskSteps',
        'uiStates',
        'exampleInput',
        'exampleOutput',
        'verificationCommands',
        'agentsProduct',
        'agentsStack',
        'agentsArchitecture',
        'earsSpecs',
        'verticalSlices'
      ]
    };

    try {
      const data = await callGeminiStructured(systemPrompt, userQuery, schema);
      setForm((prev) => ({
        ...prev,
        ...data,
        uiStates: { ...prev.uiStates, ...(data.uiStates || {}) }
      }));
      setStatusMessage({
        type: 'success',
        text: 'AI Auto-Architect complete! All 5 Prompt Sections, 10 AGENTS.md Sections, and SDD Artifacts have been populated.'
      });
    } catch {
      applyOfflineSmartTemplates();
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // ============================================================================
  // AI SOCRATIC INTERVIEWER (/grill-me & /speckit.clarify Simulator)
  // ============================================================================
  const handleRunGrillMe = async () => {
    if (!form.plainIdea.trim()) return;
    setIsGrilling(true);
    setStatusMessage({
      type: 'info',
      text: 'Running /grill-me Socratic ambiguity analysis on your plain-language specification...'
    });

    const systemPrompt = `Act as Google Antigravity's /grill-me and GitHub Spec Kit's /speckit.clarify Socratic Design Interviewer.
Analyze the user's plain-language app/feature description and identify 3 high-impact edge cases, permission boundaries, failure recovery states, or data lifecycle ambiguities that are currently underspecified.
For each question, provide 3 concrete multiple-choice options where the first option is your recommended engineering choice marked with "(Recommended)", plus an EARS requirement template that corresponds to resolving this question.`;

    const schema = {
      type: 'OBJECT',
      properties: {
        questions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              focusArea: { type: 'STRING' },
              question: { type: 'STRING' },
              options: { type: 'ARRAY', items: { type: 'STRING' } }
            },
            required: ['id', 'focusArea', 'question', 'options']
          }
        }
      },
      required: ['questions']
    };

    try {
      const res = await callGeminiStructured(
        systemPrompt,
        `Idea: ${form.plainIdea}\nPlatform: ${form.platform}\nUsers: ${form.userPersona}`,
        schema
      );
      const qList = res.questions || [];
      setGrillQuestions(qList);
      const initialAnswers = {};
      qList.forEach((q) => {
        if (q.options && q.options.length > 0) {
          initialAnswers[q.id] = q.options[0];
        }
      });
      setGrillAnswers(initialAnswers);
      setStatusMessage({
        type: 'success',
        text: 'Socratic /grill-me interview ready! Select your edge-case decisions below to fold them into your spec & prompt.'
      });
    } catch (err) {
      // Fallback high-value Socratic questions if offline
      const fallback = [
        {
          id: 'q1',
          focusArea: 'Authorization & Resource Ownership',
          question: 'How should the system behave when an authenticated user attempts to mutate a record belonging to another workspace or role tier?',
          options: [
            '(Recommended) Enforce strict server-side ownership validation at the action/IPC boundary, reject with typed FORBIDDEN error, and record an audit log entry.',
            'Filter unauthorized items in the UI layer only and rely on client-side session claims.',
            'Allow soft- queueing of the request for administrator approval.'
          ]
        },
        {
          id: 'q2',
          focusArea: 'Concurrency & Optimistic Rollback',
          question: 'When a mutation is triggered over an unstable connection or fails validation, what state transition should occur?',
          options: [
            '(Recommended) Apply immediate optimistic UI transition, preserve user form input on error, and expose a deterministic Retry callback.',
            'Block the entire screen with a modal spinner until the server responds.',
            'Silently discard failed mutations and refresh the route.'
          ]
        },
        {
          id: 'q3',
          focusArea: 'Data Lifecycle & Destructive Actions',
          question: 'Should record removal or rejection permanently delete rows or use soft-archival?',
          options: [
            '(Recommended) Use immutable soft-archival (archived_at timestamp + status enum) to preserve backward compatibility and audit trails.',
            'Execute hard SQL DELETE statements immediately.',
            'Move records to a temporary client-side cache.'
          ]
        }
      ];
      setGrillQuestions(fallback);
      setGrillAnswers({
        q1: fallback[0].options[0],
        q2: fallback[1].options[0],
        q3: fallback[2].options[0]
      });
      setStatusMessage({
        type: 'info',
        text: 'Loaded Socratic /grill-me interview questions.'
      });
    } finally {
      setIsGrilling(false);
    }
  };

  const applyGrillAnswersToSpec = () => {
    const newEars = Object.entries(grillAnswers).map(([qId, ans]) => {
      const qObj = grillQuestions.find((q) => q.id === qId);
      const cleanAns = ans.replace(/^\(Recommended\)\s*/i, '');
      return {
        when: `handling ${qObj ? qObj.focusArea.toLowerCase() : 'edge-case state'}`,
        shall: cleanAns
      };
    });

    const summaryLines = Object.entries(grillAnswers)
      .map(([qId, ans]) => {
        const qObj = grillQuestions.find((q) => q.id === qId);
        return `- [${qObj?.focusArea || 'Clarified Decision'}]: ${ans}`;
      })
      .join('\n');

    setForm((prev) => ({
      ...prev,
      earsSpecs: [...prev.earsSpecs, ...newEars],
      runtimeAndSecurityLimits: `${prev.runtimeAndSecurityLimits}\n\nClarified Edge-Case Decisions (/grill-me):\n${summaryLines}`
    }));

    setStatusMessageWithTimeout({
      type: 'success',
      text: 'Folded your /grill-me Socratic answers into Section 3 Constraints and spec.md EARS requirements!'
    }, 4000);
  };

  // ============================================================================
  // GENERATED ARTIFACTS COMPILER (Real-time synthesis of all files)
  // ============================================================================
  const formatPointer = (str: unknown) => {
    if (typeof str !== 'string' || !str) return '';
    if (form.pointerStyle === '#file') {
      return str.replace(/@([^\s,;]+)/g, '#file:$1');
    }
    return str.replace(/#file:([^\s,;]+)/g, '@$1');
  };

  const artifacts = useMemo(() => {
    // 1. 5-Section Task Prompt (Primacy & Recency Contract)
    const agentCommandPrefix =
      form.agent === 'antigravity'
        ? form.planFirstGate
          ? '/plan /grill-me '
          : ''
        : form.agent === 'copilot'
        ? form.planFirstGate
          ? '/plan '
          : ''
        : '// Jules Task Contract\n';

    const stepsFormatted = form.taskSteps
      .map((s, idx) => `${idx + 1}. ${formatPointer(s)}`)
      .join('\n');

    const uiStatesFormatted = Object.entries(form.uiStates)
      .map(([k, v]) => `  - **${k.toUpperCase()}**: ${v}`)
      .join('\n');

    const taskPromptMd = `${agentCommandPrefix}# 1. ROLE & OBJECTIVE (Primacy Anchor)
Act as a ${form.rolePersona} specializing in ${form.roleFocus}.
OBJECTIVE: ${form.objective} so that ${form.observableOutcome}.

# 2. CONTEXT & PINNED STACK
- **Target Files to Modify**: ${formatPointer(form.targetFilesModify)}
- **Reference Interfaces & Services**: ${formatPointer(form.targetFilesRef)}
- **Pinned Stack**: ${form.pinnedStack}
- **Library Guardrail**: ${form.unapprovedLibs}
- **Visual / Issue Context**: ${form.visualContext}

# 3. ARCHITECTURAL INVARIANTS & CONSTRAINTS
- **State & Boundary Rules**:
${form.stateAndDataRules}
- **Runtime, Hardware & Security Limits**:
${form.runtimeAndSecurityLimits}
- **Restricted / Generated Files**: ${form.restrictedFiles}

# 4. SCOPED VERTICAL-SLICE TASK STEPS & STATE EXAMPLES
Execute the following steps in sequential order:
${stepsFormatted}

- **Required Explicit UI & Domain State Transitions**:
${uiStatesFormatted}

- **Concrete Input / Output Contract**:
  - Given Input: \`${form.exampleInput}\`
  - Expected Output: \`${form.exampleOutput}\`

# 5. VERIFICATION LOOP & OUTPUT CONTRACT (Recency Anchor)
${
  form.planFirstGate
    ? '- **Plan First (Human Approval Gate)**: Generate a structured Implementation Plan artifact first and pause for my approval before modifying any source code files.\n'
    : ''
}- **Red-Green-Refactor TDD & Automated Verification**: Write behavior-first unit/integration tests covering happy path, validation failure, and unauthorized access BEFORE or alongside implementation. Run \`${form.verificationCommands}\` until the suite is 100% green.
- **Deliverable Contract**: ${form.deliverableFormat}`;

    // 2. Root AGENTS.md (10-Section Open Standard)
    const agentsMd = `# AGENTS.md — Persistent Repository Context & Agent Contract

## Product
${form.agentsProduct}

## Stack
${form.agentsStack}

## Repository Structure
\`\`\`text
${form.agentsRepoStructure}
\`\`\`

## Commands
\`\`\`bash
${form.agentsCommands}
\`\`\`

## Architecture
${form.agentsArchitecture}

## Coding Conventions
${form.agentsConventions}

## Testing
${form.agentsTesting}

## Security
${form.agentsSecurity}

## Database
${form.agentsDatabase}

## Generated Files
${form.agentsGenerated}
`;

    // 3. Monorepo Nested AGENTS.md (Local Subproject Overrides)
    const nestedAgentsMd = `# AGENTS.md (${form.nestedSubprojectPath})
> Supplementary subproject instructions. Precedence: Nearest AGENTS.md in directory tree wins. Inherits root \`/AGENTS.md\` policies.

## Commands (Local Overrides)
\`\`\`bash
${form.nestedCommandOverrides}
\`\`\`

## Subproject Architecture & Runtime Constraints
${form.nestedLocalConstraints}
`;

    // 4. Google Antigravity Modular Rule (.agents/rules/<name>.md)
    const safeTrigger = ['always_on', 'model_decision', 'glob', 'manual'].includes(form.agyTrigger)
      ? form.agyTrigger
      : 'always_on';
    const quotedGlobs = form.agyGlobs.startsWith('"') ? form.agyGlobs : `"${form.agyGlobs}"`;

    const agyRuleFrontmatter =
      safeTrigger === 'glob'
        ? `---\ntrigger: glob\nglobs: ${quotedGlobs}\ndescription: ${form.agyRuleDescription}\n---`
        : `---\ntrigger: ${safeTrigger}\ndescription: ${form.agyRuleDescription}\n---`;

    const agyRuleMd = `${agyRuleFrontmatter}

# ${form.agyRuleName.toUpperCase()} — Architectural & Security Invariants

## Mandatory Boundary Rules
${form.stateAndDataRules}

## Runtime & Security Enforcement
${form.runtimeAndSecurityLimits}

## Do-Not-Edit Paths
${form.restrictedFiles}
`;

    // 5. Google Antigravity Agent Skill (.agents/skills/<name>/SKILL.md)
    const agySkillMd = `---
name: ${form.agySkillName}
description: "${form.agySkillDescription}"
---

# Skill: ${form.agySkillName}

## Operational Habit & Execution Flow
1. Do NOT read helper script internals into context. Always invoke the black-box verification script with \`--help\` first:
   \`\`\`bash
   ./.agents/skills/${form.agySkillName}/scripts/verify-slice.sh --help
   \`\`\`
2. Execute the Red-Green-Refactor verification loop:
   \`\`\`bash
   ${form.verificationCommands}
   \`\`\`
3. If any check fails, inspect the failing assertion or compiler diagnostic, fix the root cause without weakening tests, and re-run until exit code is 0.
`;

    // 6. GitHub Copilot Repository-Wide Instructions (.github/copilot-instructions.md)
    const copilotRepoMd = `# GitHub Copilot Repository Instructions

## Product & Pinned Tech Stack
${form.agentsProduct}
- **Pinned Stack**: ${form.pinnedStack}
- **Disallowed Libraries**: ${form.unapprovedLibs}

## Core Architecture & State Invariants
${form.agentsArchitecture}

## Verification Commands
Always run and verify before completing a task:
\`\`\`bash
${form.verificationCommands}
\`\`\`

## Security & Generated Files
${form.agentsSecurity}
${form.agentsGenerated}
`;

    // 7. GitHub Copilot Path-Specific Instructions (.github/instructions/<name>.instructions.md)
    const excludeLine =
      form.copilotExcludeAgent !== 'none' ? `\nexcludeAgent: "${form.copilotExcludeAgent}"` : '';
    const copilotPathMd = `---
applyTo: "${form.copilotApplyTo}"${excludeLine}
---

# Path-Scoped Engineering Rules (${form.copilotInstructionName})

## Component & Boundary Contract
${form.stateAndDataRules}

## Required UI State Matrix
${uiStatesFormatted}

## Testing & Verification
${form.agentsTesting}
`;

    // 8. GitHub Copilot Custom Agent Profile (.github/agents/<name>.agent.md)
    const agentTools =
      form.copilotAgentRole === 'planner'
        ? '["read", "search"]'
        : '["read", "search", "edit", "execute", "playwright/*"]';

    const copilotAgentMd = `---
name: ${form.copilotAgentName}
description: "${
      form.copilotAgentRole === 'planner'
        ? 'Researches the codebase, interviews the developer on edge cases, and produces a vertical-slice technical specification without modifying source files.'
        : 'Implements approved vertical slices following Red-Green-Refactor TDD and boundary invariants.'
    }"
tools: ${agentTools}
handoffs:
  - label: Implement Approved Plan
    agent: agent
    prompt: Implement the vertical slices outlined in the approved plan above following Red-Green-Refactor TDD and run ${form.verificationCommands} for each step.
    send: false
---

# Role Persona
Act as a ${form.rolePersona} specializing in ${form.roleFocus}.

## Non-Negotiable Constraints
${form.stateAndDataRules}
${form.runtimeAndSecurityLimits}
`;

    // 9. GitHub Copilot Cloud Agent Setup Workflow (.github/workflows/copilot-setup-steps.yml)
    const copilotSetupYml = `name: "Copilot Setup Steps"
on:
  workflow_dispatch:
  push:
    paths:
      - .github/workflows/copilot-setup-steps.yml

jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js & pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Install dependencies & pre-warm test runners
        run: |
          pnpm install --frozen-lockfile
          ${form.verificationCommands}
`;

    // 10. Google Jules VM Snapshot Setup Script & API Payload (jules-setup.sh)
    const julesSetupSh = `#!/usr/bin/env bash
# Google Jules — Codebases -> Configuration -> Initial Setup (Run and Snapshot)
set -e

# 1. Inspect pre-installed Ubuntu VM tool versions
set +x; . /opt/environment_summary.sh

# 2. Install project dependencies and compile bindings
pnpm install

# 3. Validate build, typecheck, and test suite for VM Snapshot
${form.verificationCommands}

echo "Jules VM Snapshot validated and ready for autonomous tasks!"

# ----------------------------------------------------------------------------
# Programmatic Jules v1alpha API Payload (POST https://jules.googleapis.com/v1alpha/sessions)
# ----------------------------------------------------------------------------
# {
#   "prompt": ${JSON.stringify(form.objective)},
#   "requirePlanApproval": true,
#   "automationMode": "AUTO_CREATE_PR"
# }
`;

    // 11. Spec-Driven Development: .specify/memory/constitution.md
    const constitutionMd = `# Project Constitution (.specify/memory/constitution.md)
> Immutable engineering principles governing every Spec Kit, Antigravity, Copilot, and Jules session.

## Non-Negotiable Engineering Guardrails
${form.constitutionRules}

## Mandatory Verification Gate
Every pull request and subagent vertical slice must pass:
\`\`\`bash
${form.verificationCommands}
\`\`\`

## Restricted Paths
${form.restrictedFiles}
`;

    // 12. Spec-Driven Development: specs/001-feature/spec.md (Zone A: What & Why + EARS)
    const earsFormatted = form.earsSpecs
      .map(
        (item, idx) =>
          `${idx + 1}. **WHEN** ${item.when}, **THE SYSTEM SHALL** ${item.shall}.`
      )
      .join('\n');

    const specMd = `# Feature Specification (specs/001-feature/spec.md)
> **Zone A — Product Intent ("What & Why")**: Deliberately free of implementation stack bias.

## 1. Plain-Language Summary & User Intent
${form.plainIdea}

## 2. Target User Persona
${form.userPersona}

## 3. Observable Acceptance Criteria (EARS Notation)
${earsFormatted}

## 4. Required User Experience States
${uiStatesFormatted}
`;

    // 13. Spec-Driven Development: specs/001-feature/tasks.md (Zone B: Vertical Slices)
    const slicesFormatted = form.verticalSlices
      .map(
        (s) =>
          `- [ ] **${s.id}** ${s.parallel ? '[P] ' : ''}[${s.mode}] **${s.title}**\n  - *End-to-End Tracer Layers*: ${s.layers}\n  - *Verification*: \`${form.verificationCommands}\``
      )
      .join('\n\n');

    const tasksMd = `# Dependency-Ordered Vertical-Slice Tasks (specs/001-feature/tasks.md)
> **Zone B — Technical Execution ("How & Verify")**: Each task cuts a thin end-to-end tracer bullet across schema, service, boundary, UI, and tests.
> Legend: \`[HITL]\` = Interactive Human-in-the-Loop Co-Piloting | \`[AFK]\` = Autonomous Cloud/Subagent | \`[P]\` = Parallelizable (/fleet or /teamwork)

${slicesFormatted}
`;

    // 14. One-Command Google Antigravity (agy) Workspace Bootstrapper Script
    const agyBootstrapSh = `#!/usr/bin/env bash
# ============================================================================
# SpecForge Studio -> Google Antigravity (agy) 1-Click Workspace Importer
# Usage: Paste this into your Antigravity terminal or run: bash bootstrap-agy.sh
# ============================================================================
set -e

echo "🚀 Initializing Google Antigravity (agy) Spec-Driven Workspace..."

mkdir -p .agents/rules
mkdir -p ".agents/skills/${form.agySkillName}/scripts"
mkdir -p .specify/memory
mkdir -p specs/001-feature

cat << 'EOF_AGENTS' > AGENTS.md
${agentsMd}
EOF_AGENTS

cat << 'EOF_RULE' > ".agents/rules/${form.agyRuleName}.md"
${agyRuleMd}
EOF_RULE

cat << 'EOF_SKILL' > ".agents/skills/${form.agySkillName}/SKILL.md"
${agySkillMd}
EOF_SKILL

cat << 'EOF_VERIFY_SH' > ".agents/skills/${form.agySkillName}/scripts/verify-slice.sh"
#!/usr/bin/env bash
if [[ "$1" == "--help" ]]; then
  echo "Usage: ./verify-slice.sh — Runs typecheck, linter, and scoped tests."
  exit 0
fi
${form.verificationCommands}
EOF_VERIFY_SH
chmod +x ".agents/skills/${form.agySkillName}/scripts/verify-slice.sh"

cat << 'EOF_CONSTITUTION' > .specify/memory/constitution.md
${constitutionMd}
EOF_CONSTITUTION

cat << 'EOF_SPEC' > specs/001-feature/spec.md
${specMd}
EOF_SPEC

cat << 'EOF_TASKS' > specs/001-feature/tasks.md
${tasksMd}
EOF_TASKS

cat << 'EOF_PROMPT' > TASK_PROMPT.md
${taskPromptMd}
EOF_PROMPT

echo "✅ Success! Created AGENTS.md, .agents/rules/${form.agyRuleName}.md, .agents/skills/${form.agySkillName}/SKILL.md, specs/, and TASK_PROMPT.md"
echo "👉 Next step in Antigravity chat or agy CLI, run:"
echo "   /plan /grill-me Implement the vertical slice in @TASK_PROMPT.md"
`;

    // 15. Shareable Full Blueprint Report (Master Markdown Document)
    const fullBlueprintReportMd = `# ${projectTitle || 'SpecForge Studio Blueprint'} — Full Architectural & SDD Specification Report
> Generated by **SpecForge Studio** (2026 Multi-Platform Prompt & SDD Workbench)

---

## 📋 1. Project Overview & Target Stack
- **Project Title**: ${projectTitle || 'Untitled Blueprint'}
- **Target Surface**: \`${form.platform}\`
- **Target AI Agent**: \`${form.agent}\`
- **Role Persona**: ${form.rolePersona} (${form.roleFocus})
- **Pinned Stack**: ${form.pinnedStack}
- **Disallowed Libraries**: ${form.unapprovedLibs}

### Plain-Language Idea & User Intent
${form.plainIdea}

### Target User Persona
${form.userPersona}

---

## 🎯 2. 5-Section Task Prompt (\`TASK_PROMPT.md\`)

\`\`\`markdown
${taskPromptMd}
\`\`\`

---

## 🤖 3. Repository Agent Contract (\`AGENTS.md\`)

\`\`\`markdown
${agentsMd}
\`\`\`

---

## ⚖️ 4. Project Constitution (\`.specify/memory/constitution.md\`)

\`\`\`markdown
${constitutionMd}
\`\`\`

---

## 📐 5. EARS Feature Specification (\`specs/001-feature/spec.md\`)

### Observable Acceptance Criteria (EARS Notation)
${earsFormatted}

### Required User Experience States
${uiStatesFormatted}

---

## 🧩 6. Vertical-Slice Task Breakdown (\`specs/001-feature/tasks.md\`)

${slicesFormatted}
`;

    return {
      'FULL_BLUEPRINT_REPORT.md': {
        title: 'FULL_BLUEPRINT_REPORT.md (Master Shareable Spec Report)',
        badge: 'Master Spec Report',
        content: fullBlueprintReportMd
      },
      'bootstrap-agy.sh': {
        title: 'bootstrap-agy.sh (1-Click Antigravity Setup)',
        badge: '1-Click Setup',
        content: agyBootstrapSh
      },
      'TASK_PROMPT.md': {
        title: 'TASK_PROMPT.md (5-Section AI Prompt)',
        badge: 'Main AI Prompt',
        content: taskPromptMd
      },
      'AGENTS.md': {
        title: 'AGENTS.md (Project Rules for All AI Tools)',
        badge: 'Project Rules',
        content: agentsMd
      },
      [`${form.nestedSubprojectPath}/AGENTS.md`]: {
        title: `${form.nestedSubprojectPath}/AGENTS.md (Sub-Folder Rules)`,
        badge: 'Sub-Folder Rules',
        content: nestedAgentsMd
      },
      [`.agents/rules/${form.agyRuleName}.md`]: {
        title: `.agents/rules/${form.agyRuleName}.md`,
        badge: 'Antigravity Rule',
        content: agyRuleMd
      },
      [`.agents/skills/${form.agySkillName}/SKILL.md`]: {
        title: `.agents/skills/${form.agySkillName}/SKILL.md`,
        badge: 'Antigravity Skill',
        content: agySkillMd
      },
      '.github/copilot-instructions.md': {
        title: '.github/copilot-instructions.md',
        badge: 'Copilot Repo Rules',
        content: copilotRepoMd
      },
      [`.github/instructions/${form.copilotInstructionName}.instructions.md`]: {
        title: `.github/instructions/${form.copilotInstructionName}.instructions.md`,
        badge: 'Copilot File Rule',
        content: copilotPathMd
      },
      [`.github/agents/${form.copilotAgentName}.agent.md`]: {
        title: `.github/agents/${form.copilotAgentName}.agent.md`,
        badge: 'Copilot Custom Agent',
        content: copilotAgentMd
      },
      '.github/workflows/copilot-setup-steps.yml': {
        title: '.github/workflows/copilot-setup-steps.yml',
        badge: 'Copilot Cloud Setup',
        content: copilotSetupYml
      },
      'jules-setup.sh': {
        title: 'jules-setup.sh (Cloud Environment Setup)',
        badge: 'Google Jules',
        content: julesSetupSh
      },
      '.specify/memory/constitution.md': {
        title: '.specify/memory/constitution.md (Core Project Laws)',
        badge: 'Core Laws',
        content: constitutionMd
      },
      'specs/001-feature/spec.md': {
        title: 'specs/001-feature/spec.md (Step-by-Step Goal Checks)',
        badge: 'Goal Checks',
        content: specMd
      },
      'specs/001-feature/tasks.md': {
        title: 'specs/001-feature/tasks.md (Step-by-Step Task Breakdown)',
        badge: 'Task Breakdown',
        content: tasksMd
      }
    };
  }, [form, projectTitle]);

  const isDockFiltered = !isProMode && !showAllSimpleFiles;
  const simpleAllowedKeys = SIMPLE_ESSENTIAL_FILES.map((item) => item.key);
  const intermediateAllowedKeys = INTERMEDIATE_CORE_FILES.map((item) => item.key);
  const allowedDockKeys = isSimpleMode ? simpleAllowedKeys : intermediateAllowedKeys;

  const handleChangeViewMode = (nextMode: ViewMode) => {
    setViewMode(nextMode);
    if (nextMode !== 'pro') {
      setShowAllSimpleFiles(false);
    }
    if (nextMode === 'simple') {
      if (activeTab !== 'ideation' && activeTab !== 'guide') {
        setActiveTab('ideation');
      }
    } else if (nextMode === 'intermediate') {
      if (
        activeTab !== 'ideation' &&
        activeTab !== 'prompt5' &&
        activeTab !== 'agentsmd' &&
        activeTab !== 'sdd'
      ) {
        setActiveTab('ideation');
      }
    }
  };

  // Ensure selectedArtifact key exists when dynamic paths or filtered dock modes change
  const currentArtifactKey =
    artifacts[selectedArtifact] &&
    (!isDockFiltered ||
      allowedDockKeys.includes(selectedArtifact) ||
      (isSimpleMode && selectedArtifact === 'FULL_BLUEPRINT_REPORT.md'))
      ? selectedArtifact
      : 'TASK_PROMPT.md';
  const currentArtifact = artifacts[currentArtifactKey];
  const currentFileGuide = FILE_USAGE_GUIDE[currentArtifactKey] || {
    whatIsIt: 'Auto-generated agent instruction or configuration file tailored to your project.',
    whereItGoes: `Save this file inside your project repository at path: ${currentArtifactKey}`,
    BeginnerTip: 'Keep this file committed in Git so every AI session follows the exact same rules.'
  };

  // Filtered cross-device shared projects by optional sync code
  const filteredSharedProjects = useMemo(() => {
    const code = blueprintTag.trim().toLowerCase();
    if (!code) return sharedCloudProjects;
    return sharedCloudProjects.filter((p) => (p.tag || '').toLowerCase().includes(code));
  }, [sharedCloudProjects, blueprintTag]);

  // Validation & Guardrail Diagnostics (translated into plain-language health checks)
  const diagnostics = useMemo(() => {
    const agyRuleBytes = new Blob([
      artifacts[`.agents/rules/${form.agyRuleName}.md`]?.content || ''
    ]).size;
    const copilotAgentChars = (
      artifacts[`.github/agents/${form.copilotAgentName}.agent.md`]?.content || ''
    ).length;
    const promptChars = (artifacts['TASK_PROMPT.md']?.content || '').length;
    const estTokens = Math.ceil(promptChars / 4);
    const agyRuleLimit = 24000;
    const copilotAgentLimit = 30000;
    const isRuleSizeSafe = agyRuleBytes < agyRuleLimit;
    const isCopilotSizeSafe = copilotAgentChars < copilotAgentLimit;
    const isPromptLong = estTokens > 4000;

    return {
      agyRuleBytes,
      agyRuleLimit,
      copilotAgentChars,
      copilotAgentLimit,
      estTokens,
      isRuleSizeSafe,
      isCopilotSizeSafe,
      isPromptLong,
      ruleSizeMessage: isRuleSizeSafe
        ? 'Rule file is well under size limits (AI will read it fully)'
        : 'Rule file is getting too large — shorten it so your AI reads every rule',
      copilotSizeMessage: isCopilotSizeSafe
        ? 'Custom agent file is well under size limits (Copilot will read it fully)'
        : 'Custom agent file is getting a bit long — trim extra lines so Copilot reads it all',
      promptLengthMessage: !isPromptLong
        ? 'Prompt size is safe for fast AI responses'
        : 'Your prompt is getting a bit long; consider starting a fresh AI chat',
      memorySafetyMessage:
        estTokens < 120000
          ? 'Instructions fit safely within AI memory limits'
          : 'Your prompt is getting a bit long; consider starting a fresh AI chat',
      hasPrimacyAnchor: Boolean(form.rolePersona && form.objective),
      hasRecencyAnchor: Boolean(form.verificationCommands && form.deliverableFormat)
    };
  }, [artifacts, form]);

  const uiStateEntries = useMemo(
    () => Object.entries((form.uiStates || {}) as Record<string, string>),
    [form.uiStates]
  );

  const firstIncompleteUiState = useMemo(
    () =>
      uiStateEntries.find(([, v]) => typeof v !== 'string' || v.trim().length <= 5)?.[0] ??
      uiStateEntries[0]?.[0],
    [uiStateEntries]
  );

  // Prompt Readiness Scorecard evaluation (6 checks)
  const scorecardItems = useMemo(() => {
    const trimmedText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
    const requiredUiStateKeys = ['loading', 'empty', 'error', 'offline', 'disabled', 'success'];
    const uiStates =
      form.uiStates && typeof form.uiStates === 'object' ? form.uiStates : {};

    return [
      {
        id: 'plainIdea',
        label: 'Plain-language idea defined (> 20 chars)',
        passed: trimmedText(form.plainIdea).length > 20,
        tab: 'ideation',
        focusId: 'plain-idea-input'
      },
      {
        id: 'pinnedStack',
        label: 'Pinned stack & disallowed libraries specified',
        passed:
          trimmedText(form.pinnedStack).length > 5 &&
          trimmedText(form.unapprovedLibs).length > 5,
        tab: 'prompt5',
        focusId: 'field-pinnedStack'
      },
      {
        id: 'targetFiles',
        label: 'Target files to modify specified (@path or #file)',
        passed:
          trimmedText(form.targetFilesModify).length > 2 &&
          (form.targetFilesModify.includes('@') ||
            form.targetFilesModify.includes('#file') ||
            form.targetFilesModify.includes('/')),
        tab: 'prompt5',
        focusId: 'field-targetFilesModify'
      },
      {
        id: 'uiStates',
        label: 'All 6 UI state transitions defined (Loading, Empty, Error, Offline, Disabled, Success)',
        passed: requiredUiStateKeys.every((key) => trimmedText(uiStates[key]).length > 5),
        tab: 'prompt5',
        focusId: 'field-uiStates'
      },
      {
        id: 'verificationCommands',
        label: 'Exact verification shell commands provided',
        passed: trimmedText(form.verificationCommands).length > 5,
        tab: 'prompt5',
        focusId: 'field-verificationCommands'
      },
      {
        id: 'earsCriteria',
        label: 'At least 2 EARS WHEN / THE SYSTEM SHALL acceptance criteria defined',
        passed:
          Array.isArray(form.earsSpecs) &&
          form.earsSpecs.filter(
            (e: any) =>
              e &&
              typeof e === 'object' &&
              trimmedText(e.when).length > 3 &&
              trimmedText(e.shall).length > 3
          ).length >= 2,
        tab: 'sdd',
        focusId: 'field-earsSpecs'
      }
    ];
  }, [form]);

  // Native OS clipboard copy (with browser fallback)
  const handleCopy = async (text: string, keyLabel: string) => {
    try {
      if (window.desktopAPI) {
        await window.desktopAPI.copyToClipboard(text);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(keyLabel);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedKey(null), 2200);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  // Save single file via native OS Save Dialog (or browser Blob fallback)
  const handleDownloadFile = async (filename: string, content: string) => {
    try {
      const cleanName = filename.split('/').pop() || 'artifact.md';
      if (window.desktopAPI) {
        const res = await window.desktopAPI.saveFileDialog(cleanName, content);
        if (!res.canceled && res.filePath) {
          setStatusMessageWithTimeout({
            type: 'success',
            text: `Saved ${cleanName} to ${res.filePath}`
          });
        }
        return;
      }

      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Download file error:', err);
      setStatusMessage({
        type: 'error',
        text: `Download failed: ${err?.message || err}`
      });
    }
  };

  const handleDownloadAllBundle = async () => {
    try {
      const combined = Object.entries(artifacts)
        .map(
          ([path, obj]) =>
            `================================================================================\nFILE PATH: ${path}\n================================================================================\n\n${obj.content}\n\n`
        )
        .join('\n');
      await handleDownloadFile('specforge-complete-agent-bundle.txt', combined);
    } catch (err: any) {
      console.error('Download all error:', err);
      setStatusMessage({
        type: 'error',
        text: `Download all failed: ${err?.message || err}`
      });
    }
  };

  const handleExportToFolder = async () => {
    if (!window.desktopAPI) {
      await handleDownloadAllBundle();
      return;
    }
    setIsExportingFolder(true);
    try {
      const files = Object.entries(artifacts).map(([relativePath, obj]) => ({
        relativePath,
        content: obj.content
      }));
      const res = await window.desktopAPI.exportWorkspaceDialog({ files });
      if (!res.canceled && res.targetDir) {
        setStatusMessage({
          type: 'success',
          text: `Exported ${res.writtenCount} SpecForge files directly into ${res.targetDir}`
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Folder export failed: ${err?.message || err}`
      });
    } finally {
      setIsExportingFolder(false);
    }
  };

  // List mutators for steps, EARS, and Vertical Slices
  const addStep = () =>
    updateField('taskSteps', [...form.taskSteps, 'Implement next verifiable step and unit test.']);
  const removeStep = (idx) =>
    updateField(
      'taskSteps',
      form.taskSteps.filter((_, i) => i !== idx)
    );
  const editStep = (idx, val) => {
    const copy = [...form.taskSteps];
    copy[idx] = val;
    updateField('taskSteps', copy);
  };

  const addEars = () =>
    updateField('earsSpecs', [
      ...form.earsSpecs,
      { when: 'a user triggers [condition]', shall: 'validate and return [observable outcome]' }
    ]);
  const removeEars = (idx) =>
    updateField(
      'earsSpecs',
      form.earsSpecs.filter((_, i) => i !== idx)
    );
  const editEars = (idx, field, val) => {
    const copy = [...form.earsSpecs];
    copy[idx] = { ...copy[idx], [field]: val };
    updateField('earsSpecs', copy);
  };

  const addSlice = () => {
    const nextNum = String(form.verticalSlices.length + 1).padStart(3, '0');
    updateField('verticalSlices', [
      ...form.verticalSlices,
      {
        id: `T${nextNum}`,
        mode: 'AFK',
        parallel: true,
        title: 'New End-to-End Vertical Slice',
        layers: 'Schema + Service + Boundary + UI + Integration Test'
      }
    ]);
  };
  const removeSlice = (idx) =>
    updateField(
      'verticalSlices',
      form.verticalSlices.filter((_, i) => i !== idx)
    );
  const editSlice = (idx, field, val) => {
    const copy = [...form.verticalSlices];
    copy[idx] = { ...copy[idx], [field]: val };
    updateField('verticalSlices', copy);
  };

  const handleToggleIntermediateRule = (rule: IntermediateRulePreset) => {
    setForm((prev) => {
      const current = String(prev[rule.targetField] || '');
      const hasRule = current.includes(rule.technicalRule);
      const nextValue = hasRule
        ? current
            .split('\n')
            .filter((line) => line.trim() !== rule.technicalRule)
            .join('\n')
            .trim()
        : current.trim()
          ? `${current.trim()}\n${rule.technicalRule}`
          : rule.technicalRule;
      return {
        ...prev,
        [rule.targetField]: nextValue
      };
    });
  };

  const updateIntermediateSlice = (
    idx: number,
    patch: { title?: string; needsHumanReview?: boolean; parallel?: boolean }
  ) => {
    setForm((prev) => {
      const copy = [...prev.verticalSlices];
      const existing = copy[idx];
      if (!existing) return prev;
      const nextTitle = patch.title !== undefined ? patch.title : existing.title;
      const nextMode =
        patch.needsHumanReview !== undefined
          ? patch.needsHumanReview
            ? 'HITL'
            : 'AFK'
          : existing.mode;
      const nextParallel = patch.parallel !== undefined ? patch.parallel : existing.parallel;
      copy[idx] = {
        ...existing,
        title: nextTitle,
        mode: nextMode,
        parallel: nextParallel,
        layers: deriveTracerBulletLayers(nextTitle, prev.platform)
      };
      return {
        ...prev,
        verticalSlices: copy
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 pb-16 lg:pb-0">
      {/* ====================================================================
          TOP HEADER BAR, DESKTOP ACTIONS & NAVIGATION TABS
         ==================================================================== */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  SpecForge Studio
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ubuntu Desktop
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Turn plain-English ideas into foolproof AI Coding Prompts, AGENTS.md &amp; Spec Files
              </p>
            </div>
          </div>

          {/* Right Toolbar: Beginner Explanations Toggle, Presets, Blueprints, AI Key, Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 3-Way View Mode Selector: Simple / Intermediate / Pro */}
            <div
              role="group"
              aria-label="Workspace View Mode"
              className="inline-flex items-center rounded-lg bg-slate-900/90 border border-slate-700/80 p-0.5 gap-0.5"
            >
              {(
                [
                  {
                    id: 'simple' as const,
                    label: 'Simple',
                    title: 'No-Code Wizard'
                  },
                  {
                    id: 'intermediate' as const,
                    label: 'Intermediate',
                    title: 'Pro-Light (4 Tabs + Jargon Guide)'
                  },
                  {
                    id: 'pro' as const,
                    label: 'Pro',
                    title: 'All 14 Files & Raw Code'
                  }
                ] as const
              ).map((mode) => {
                const active = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleChangeViewMode(mode.id)}
                    title={mode.title}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                      active
                        ? mode.id === 'simple'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm'
                          : mode.id === 'intermediate'
                            ? 'bg-indigo-500/30 text-indigo-100 border border-indigo-400/50 shadow-sm'
                            : 'bg-slate-700 text-white border border-slate-500/60 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {mode.id === 'simple' && <Lightbulb className="w-3 h-3 text-amber-400" />}
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Saved Projects Presets Drawer/Modal Button */}
            <button
              onClick={() => setPresetsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 flex items-center gap-1.5 transition"
              title="Save, load, or delete local project presets"
            >
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>📂 Saved Projects ({savedPresets.length})</span>
            </button>

            {/* Local Blueprints Manager Button */}
            <button
              onClick={() => setCloudModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/50 flex items-center gap-1.5 transition"
              title="Save, load, import, or export project blueprints"
            >
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>Blueprints ({mySavedProjects.length})</span>
            </button>

            {/* AI Key Settings Button */}
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              title="Configure optional Gemini API key for AI Auto-Architect and /grill-me"
            >
              <KeyRound
                className={`w-3.5 h-3.5 ${
                  geminiSettings.hasKey ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span className="hidden md:inline">
                {geminiSettings.hasKey ? 'AI Ready' : 'AI Key'}
              </span>
            </button>

            {/* Quick Example Presets */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 px-1.5">Examples:</span>
              <button
                onClick={() => applyPreset('web_nextjs')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  form.platform === 'web'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Web App
              </button>
              <button
                onClick={() => applyPreset('mobile_rn')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  form.platform === 'mobile'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Mobile App
              </button>
              <button
                onClick={() => applyPreset('desktop_tauri')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  form.platform === 'desktop'
                    ? 'bg-amber-600 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Computer App
              </button>
            </div>

            <button
              onClick={handleExportToFolder}
              disabled={isExportingFolder}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-sm disabled:opacity-60"
              title="Write all generated files directly into a project folder on disk"
            >
              <FolderUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isExportingFolder ? 'Exporting...' : 'Export to Repo'}
              </span>
            </button>

            <button
              onClick={handleDownloadAllBundle}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white transition flex items-center gap-1.5 shadow-sm"
              title="Save single combined bundle text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bundle</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/60 bg-slate-950/50">
          {(isSimpleMode
            ? [
                {
                  id: 'ideation',
                  label: '1. Describe Your App',
                  icon: Sparkles,
                  badge: 'Step 1'
                },
                {
                  id: 'guide',
                  label: '2. How to Use Your Files',
                  icon: Compass,
                  badge: 'Step 2'
                }
              ]
            : isIntermediateMode
              ? [
                  {
                    id: 'ideation',
                    label: '1. Idea & AI Setup',
                    icon: Sparkles,
                    badge: 'Step 1'
                  },
                  {
                    id: 'prompt5',
                    label: '2. Custom AI Prompt',
                    icon: Terminal,
                    badge: 'Step 2'
                  },
                  {
                    id: 'agentsmd',
                    label: '3. Project Rules',
                    icon: BookOpen,
                    badge: 'Step 3'
                  },
                  {
                    id: 'sdd',
                    label: '4. Feature Checklist',
                    icon: Layers,
                    badge: 'Step 4'
                  }
                ]
              : [
                  {
                    id: 'guide',
                    label: '0. How to Use (Dummy-Proof Guide)',
                    icon: Compass,
                    badge: 'Read First'
                  },
                  {
                    id: 'ideation',
                    label: '1. Plain-English Idea & AI Auto-Fill',
                    icon: Sparkles,
                    badge: 'Step 1'
                  },
                  {
                    id: 'prompt5',
                    label: '2. Task Prompt Builder (5 Sections)',
                    icon: Terminal,
                    badge: 'Step 2'
                  },
                  {
                    id: 'agentsmd',
                    label: '3. AGENTS.md (Project Rules)',
                    icon: BookOpen,
                    badge: 'Step 3'
                  },
                  {
                    id: 'platform_files',
                    label: '4. Copilot, Antigravity & Jules Files',
                    icon: FolderGit2,
                    badge: 'Step 4'
                  },
                  {
                    id: 'sdd',
                    label: '5. Spec & Task Slices (spec.md / tasks.md)',
                    icon: Layers,
                    badge: 'Step 5'
                  }
                ]
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobilePane('editor');
                }}
                className={`py-2.5 sm:py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ====================================================================
          LOCAL BLUEPRINTS & JSON IMPORT/EXPORT MODAL
         ==================================================================== */}
      {cloudModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCloudModalOpen(false);
          }}
        >
          <div
            ref={cloudDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cloud-dialog-title"
            tabIndex={-1}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 id="cloud-dialog-title" className="text-base font-bold text-white">
                    Local Desktop Blueprints &amp; Portable Backups
                  </h2>
                  <p className="text-xs text-slate-400">
                    Saved offline on your Ubuntu machine, with 1-click JSON export/import.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCloudModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            {/* Save Current Blueprint Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Save Current Project Blueprint
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., Kanban Productivity App"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Tag / Filter Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={blueprintTag}
                    onChange={(e) => setBlueprintTag(e.target.value)}
                    placeholder="e.g., work-2026"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-cyan-200"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleSaveToCloud(false)}
                  disabled={isSavingCloud}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  Save Blueprint Locally
                </button>
                <button
                  onClick={() => handleSaveToCloud(true)}
                  disabled={isSavingCloud}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Save with Tag
                </button>
                {window.desktopAPI && (
                  <button
                    onClick={handleImportBlueprintJson}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Import .specforge.json
                  </button>
                )}
              </div>
              {desktopInfo && (
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  Storage Folder: {desktopInfo.blueprintsDir}
                </p>
              )}
            </div>

            {/* Load Saved Projects List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* All Local Blueprints */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Saved on This Computer ({mySavedProjects.length})
                </h4>
                {mySavedProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    No blueprints saved yet. Click &quot;Save Blueprint Locally&quot; above.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {mySavedProjects.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Saved'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleLoadFromCloud(item)}
                            className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 text-xs font-medium hover:bg-emerald-600/30"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleExportBlueprintJson(item)}
                            className="p-1 text-slate-400 hover:text-cyan-300"
                            title="Export .specforge.json"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCloudItem(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Delete blueprint"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tagged Blueprints */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  Tagged Blueprints ({filteredSharedProjects.length})
                </h4>
                {filteredSharedProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    No tagged blueprints match &quot;{blueprintTag || 'all'}&quot;.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {filteredSharedProjects.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-white truncate">
                              {item.title}
                            </p>
                            {item.tag && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                #{item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Saved'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleLoadFromCloud(item)}
                            className="px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteCloudItem(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DESKTOP AI SETTINGS MODAL (GEMINI API KEY)
         ==================================================================== */}
      {settingsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSettingsModalOpen(false);
          }}
        >
          <div
            ref={settingsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
            tabIndex={-1}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 id="settings-dialog-title" className="text-base font-bold text-white">
                    Desktop AI Settings (Optional)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Powers &quot;AI Auto-Architect&quot; and live &quot;/grill-me&quot; interviews.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={
                    geminiSettings.hasKey
                      ? 'text-emerald-400 font-semibold'
                      : 'text-amber-300 font-semibold'
                  }
                >
                  {geminiSettings.hasKey
                    ? `Configured (${geminiSettings.source}: ${geminiSettings.maskedKey})`
                    : 'Not Configured (Offline Presets & Builders still work)'}
                </span>
              </div>
              {desktopInfo && (
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Environment:</span>
                  <span className="font-mono">
                    {desktopInfo.platform}/{desktopInfo.arch} ({desktopInfo.osRelease})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Gemini API Key (stored locally via OS encryption when available)
              </label>
              <input
                type="password"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIza..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono text-white"
              />
              <p className="text-[11px] text-slate-500">
                You can also launch the app with <code>GEMINI_API_KEY</code> set in your Ubuntu shell environment.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {(geminiSettings.source === 'stored' || geminiSettings.source === 'memory') && (
                <button
                  onClick={() => handleSaveGeminiKey(true)}
                  disabled={isSavingSettings}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900/70 text-rose-200 border border-rose-500/40 text-xs font-semibold"
                >
                  Clear Saved Key
                </button>
              )}
              <button
                onClick={() => handleSaveGeminiKey(false)}
                disabled={isSavingSettings || !geminiKeyInput.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                {isSavingSettings ? 'Saving...' : 'Save API Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SAVED PROJECT PRESETS MODAL (LOCAL STORAGE)
         ==================================================================== */}
      {presetsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPresetsModalOpen(false);
          }}
        >
          <div
            ref={presetsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="presets-dialog-title"
            tabIndex={-1}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Folder className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 id="presets-dialog-title" className="text-base font-bold text-white">
                    Saved Project Presets
                  </h2>
                  <p className="text-xs text-slate-400">
                    Save and switch between multiple named project configurations locally.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPresetsModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            {/* Save Current as Preset */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                Save Current as Preset
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  placeholder={projectTitle || 'Preset name (e.g., E-Commerce Blueprint)'}
                  aria-label="Preset Name"
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSavePreset}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow transition shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Current as Preset
                </button>
              </div>
            </div>

            {/* Saved Presets List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  Saved Presets ({savedPresets.length})
                </h4>
                <button
                  onClick={handleResetToDefaultPreset}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                >
                  Reset to Default
                </button>
              </div>

              {savedPresets.length === 0 ? (
                <p className="text-xs text-slate-500 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center">
                  No project presets saved yet. Enter a name above and click &quot;Save Current as Preset&quot;.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {savedPresets.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Saved'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleLoadPreset(item)}
                          aria-label={`Load preset ${item.name}`}
                          className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/30 border border-amber-500/30"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeletePreset(item.id, item.name)}
                          aria-label={`Delete preset ${item.name}`}
                          className="p-1.5 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30"
                          title={`Delete preset ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Optional Status Toast Banner */}
      {statusMessage && (
        <div
          className={`max-w-[1600px] w-full mx-auto px-4 sm:px-6 pt-3 ${
            cloudModalOpen || settingsModalOpen || presetsModalOpen ? 'fixed inset-x-0 top-0 z-[60]' : ''
          }`}
        >
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : statusMessage.type === 'warning'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs underline opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN SPLIT WORKSPACE: LEFT INPUT BUILDERS | RIGHT LIVE ARTIFACT DOCK
         ==================================================================== */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: STRUCTURED INPUT AREAS (7 COLS) */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            mobilePane === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* ----------------------------------------------------------------
              TAB 0: DUMMY-PROOF STEP-BY-STEP GUIDE & FILE CHEAT SHEET
             ---------------------------------------------------------------- */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              {/* Hero Welcome Card */}
              <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  Zero-Jargon Quick Start Guide
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  How to Turn Any Idea into a Production App (Without the AI Breaking Your Code)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When you type a normal sentence like <em>"Build me an app that does X"</em> into
                  an AI coding tool, the AI has to guess 50 hidden details at once—and halfway
                  through, it forgets its own rules. This app fixes that by turning your plain idea
                  into <strong>two things</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400">
                      1. Permanent Project Rules (AGENTS.md)
                    </span>
                    <p className="text-xs text-slate-300">
                      You drop this file into your project folder <strong>once</strong>. Every time
                      Google Antigravity, GitHub Copilot, or Google Jules opens your project, it
                      automatically reads your tech stack, folder map, and test commands.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-400">
                      2. A 5-Section Task Prompt (TASK_PROMPT.md)
                    </span>
                    <p className="text-xs text-slate-300">
                      You paste this into the AI chat box for each feature you want built. It puts
                      your most important rules at the <strong>very top</strong> and{' '}
                      <strong>very bottom</strong> where AI models pay the most attention.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('ideation')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Step 1: Type Your Plain-English Idea →
                  </button>
                  <button
                    onClick={() => setCloudModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700"
                  >
                    <Cloud className="w-4 h-4 text-indigo-400" />
                    Load or Save Across Devices
                  </button>
                </div>
              </div>

              {/* 4-Step Dummy-Proof Checklist */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-400" />
                  Follow These 4 Simple Steps:
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      step: 'Step 1',
                      title: 'Type your plain-English idea & click the purple "AI Auto-Architect" button',
                      desc: 'Don’t worry about knowing technical terms! Just describe what you want users to be able to do in Tab 1, pick whether it’s a Web, Mobile, or Computer app, and click the purple button. The AI will fill out all the technical boxes for you.',
                      actionLabel: 'Go to Tab 1 (Idea & Auto-Fill)',
                      targetTab: 'ideation'
                    },
                    {
                      step: 'Step 2',
                      title: 'Answer the 3 Multiple-Choice "/grill-me" Questions',
                      desc: 'Still in Tab 1, click "Run /grill-me Socratic Design Interview". It will ask you 3 simple multiple-choice questions (with the Recommended choice already selected!) so the AI doesn’t have to guess edge cases.',
                      actionLabel: 'Try /grill-me in Tab 1',
                      targetTab: 'ideation'
                    },
                    {
                      step: 'Step 3',
                      title: 'Save AGENTS.md into your project folder',
                      desc: 'In the right-hand preview panel (or tap "Preview & Copy Files" at the bottom on mobile), click the "AGENTS.md" pill, click Copy or Download, and save it in your main code folder.',
                      actionLabel: 'Preview AGENTS.md Now',
                      targetArtifact: 'AGENTS.md'
                    },
                    {
                      step: 'Step 4',
                      title: 'Copy TASK_PROMPT.md and paste it into your AI Coding Agent',
                      desc: 'Select "TASK_PROMPT.md" in the preview panel, click Copy File, and paste it straight into Google Antigravity, GitHub Copilot Chat, or Google Jules!',
                      actionLabel: 'Preview TASK_PROMPT.md Now',
                      targetArtifact: 'TASK_PROMPT.md'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                            {item.step}
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (item.targetTab) setActiveTab(item.targetTab);
                          if (item.targetArtifact) {
                            setSelectedArtifact(item.targetArtifact);
                            setMobilePane('preview');
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold shrink-0 self-start sm:self-center"
                      >
                        {item.actionLabel} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dedicated Card: How to Import into Google Antigravity (agy) */}
              <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      How to Import Into Google Antigravity (<code>agy</code>)
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArtifact('bootstrap-agy.sh');
                      setMobilePane('preview');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Preview 1-Click bootstrap-agy.sh →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Option A: Import Generated Blueprints */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                      Option A: Import Your Generated Rules &amp; Prompt Into Any agy Project
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                      <li>
                        Select <code>bootstrap-agy.sh</code> in the right-hand preview panel and
                        click <strong>Copy File</strong>.
                      </li>
                      <li>
                        Open your project folder in the <strong>Antigravity App / IDE</strong> or run{' '}
                        <code>agy</code> in your terminal.
                      </li>
                      <li>
                        Paste the copied script into the Antigravity terminal and press{' '}
                        <strong>Enter</strong>. It automatically creates <code>AGENTS.md</code>,{' '}
                        <code>.agents/rules/</code>, <code>.agents/skills/</code>,{' '}
                        <code>specs/</code>, and <code>TASK_PROMPT.md</code>!
                      </li>
                      <li>
                        In the Antigravity prompt box, type:{' '}
                        <code className="text-indigo-300">
                          /plan /grill-me Implement @TASK_PROMPT.md
                        </code>
                      </li>
                    </ol>
                  </div>

                  {/* Option B: Import SpecForge Studio App Itself */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                      Option B: Import This SpecForge Studio Web App Itself Into agy
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                      <li>
                        In your terminal, create a Vite React app and open it in Antigravity:
                        <pre className="mt-1 p-2 rounded bg-slate-900 text-cyan-200 font-mono text-[11px] overflow-x-auto">
                          {`npm create vite@latest specforge -- --template react\ncd specforge\nnpm i lucide-react firebase tailwindcss\nagy .`}
                        </pre>
                      </li>
                      <li>
                        Copy the code of <code>SpecForgeStudio.jsx</code> from this editor into{' '}
                        <code>src/App.jsx</code>.
                      </li>
                      <li>
                        Run <code>npm run dev</code> inside <code>agy</code> (or ask{' '}
                        <code>agy</code> to deploy it to Firebase Hosting / Cloud Run so you have a
                        permanent personal URL on all your devices!).
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Visual Cheat Sheet: Where Does Each Generated File Go? */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-cyan-400" />
                    Cheat Sheet: Where Do I Put Each File?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any file below to preview it on the right and see exactly where to paste
                    or save it.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(FILE_USAGE_GUIDE).map(([fileKey, info]) => (
                    <div
                      key={fileKey}
                      onClick={() => {
                        setSelectedArtifact(fileKey);
                        setMobilePane('preview');
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                        currentArtifactKey === fileKey
                          ? 'bg-indigo-950/40 border-indigo-500/60'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-300">
                          {fileKey}
                        </span>
                        <span className="text-[10px] text-cyan-400">Click to preview →</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{info.whatIsIt}</p>
                      <p className="text-[11px] text-emerald-300/90">
                        <strong>Where it goes:</strong> {info.whereItGoes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 1: PLAIN-LANGUAGE IDEA, AGENT HARNESS & SOCRATIC /GRILL-ME
             ---------------------------------------------------------------- */}
          {activeTab === 'ideation' && (
            <div className="space-y-6">
              {dummyProofMode && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start gap-3 text-xs text-amber-100">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Simple Mode Tip:</strong> Describe your idea in plain English below,
                    pick your app type and AI tool, then click{' '}
                    <strong>&quot;✨ Step 1: Turn My Idea Into AI Instructions&quot;</strong>. No
                    coding knowledge or API key required!
                  </div>
                </div>
              )}

              {/* Plain Language Brain Dump Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-indigo-400" />
                      {dummyProofMode
                        ? 'Describe What You Want to Build'
                        : 'Plain-Language App or Feature Idea ("The What & Why")'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {dummyProofMode ? (
                        <>
                          Write your idea in everyday language. Click{' '}
                          <strong className="text-indigo-300">
                            ✨ Step 1: Turn My Idea Into AI Instructions
                          </strong>{' '}
                          to update all your AI prompt and setup files automatically.
                        </>
                      ) : (
                        <>
                          Describe what you want to build in everyday language. Click{' '}
                          <strong className="text-indigo-300">AI Auto-Architect All Fields</strong>{' '}
                          to populate every prompt section, AGENTS.md, and SDD file automatically.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <label
                          htmlFor="plain-idea-input"
                          className="block text-xs font-medium text-slate-300"
                        >
                          {dummyProofMode
                            ? 'What should your app do?'
                            : 'Plain-Language Feature / Application Idea'}
                        </label>
                        <InfoTooltip text="Write your main app or feature idea in everyday language. All AI auto-fill buttons use this as their core context." />
                      </div>
                      <button
                        type="button"
                        disabled={expandingField === 'plainIdea'}
                        onClick={() => handleAutoExpandField('plainIdea')}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium text-indigo-200 disabled:opacity-50 transition"
                      >
                        {expandingField === 'plainIdea'
                          ? 'Expanding options...'
                          : '✨ Auto-Expand Options'}
                      </button>
                    </div>
                    <textarea
                      id="plain-idea-input"
                      rows={4}
                      value={form.plainIdea}
                      onChange={(e) => updateField('plainIdea', e.target.value)}
                      placeholder="e.g., Build a real-time team Kanban board where managers can drag tasks, assign reviewers, and export CSV reports with strict role permissions..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {expandedHighlights.plainIdea && (
                      <ExpandedTextHighlight
                        fieldKey="plainIdea"
                        text={expandedHighlights.plainIdea}
                        onClear={() => clearExpandedHighlight('plainIdea')}
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label
                        htmlFor="user-persona-input"
                        className="block text-xs font-medium text-slate-300"
                      >
                        {dummyProofMode
                          ? 'Who will use this app?'
                          : 'Target Users & Problem Context'}
                      </label>
                      <InfoTooltip text="Describes who is using the app and what problem it solves for them." />
                    </div>
                    <input
                      id="user-persona-input"
                      type="text"
                      value={form.userPersona}
                      onChange={(e) => updateField('userPersona', e.target.value)}
                      placeholder="e.g., Project managers and software engineers working across desktop and mobile..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Target Agent, Platform & Execution Architecture Matrix */}
                {dummyProofMode ? (
                  <div className="space-y-4 pt-2">
                    {/* 1. Platform Visual Picker */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>What kind of app are you making?</span>
                        <InfoTooltip text="Selects the right tech stack and security rules for Web, Mobile, or Desktop." />
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            value: 'web',
                            emoji: '🌐',
                            title: 'Website / Web App',
                            desc: 'Runs in a web browser like Chrome or Brave'
                          },
                          {
                            value: 'mobile',
                            emoji: '📱',
                            title: 'Phone App',
                            desc: 'Runs on iPhone and Android phones'
                          },
                          {
                            value: 'desktop',
                            emoji: '💻',
                            title: 'Computer App',
                            desc: 'Runs on Ubuntu, Windows, or Mac desktop'
                          }
                        ].map((option) => {
                          const selected = form.platform === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                applyDomainInvariants(
                                  option.value === 'desktop' ? 'desktop_tauri' : option.value
                                )
                              }
                              className={`text-left rounded-xl p-3 border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                selected
                                  ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span aria-hidden="true">{option.emoji}</span>
                                <span>{option.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 2. AI Tool Visual Picker */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>Which AI tool are you pasting this into?</span>
                        <InfoTooltip text="Formats file references and slash commands for your chosen AI coding assistant." />
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            value: 'antigravity',
                            emoji: '🚀',
                            title: 'Google Antigravity (agy)'
                          },
                          {
                            value: 'copilot',
                            emoji: '🐙',
                            title: 'GitHub Copilot'
                          },
                          {
                            value: 'jules',
                            emoji: '☁️',
                            title: 'Google Jules'
                          }
                        ].map((option) => {
                          const selected = form.agent === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => updateField('agent', option.value)}
                              className={`text-left rounded-xl p-3 border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                selected
                                  ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span aria-hidden="true">{option.emoji}</span>
                                <span>{option.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 3. Execution Style Visual Picker */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>How do you want the AI to work?</span>
                        <InfoTooltip text="Choose whether the AI pauses for your review (HITL) or runs autonomously in the background (AFK)." />
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          {
                            value: 'HITL',
                            emoji: '👀',
                            title: 'Step-by-Step with Me Watching',
                            desc: 'The AI asks before changing files'
                          },
                          {
                            value: 'AFK',
                            emoji: '🤖',
                            title: 'Build It Automatically in the Background',
                            desc: 'The AI finishes the whole task on its own'
                          }
                        ].map((option) => {
                          const selected = form.executionMode === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => updateField('executionMode', option.value)}
                              className={`text-left rounded-xl p-3 border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                selected
                                  ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span aria-hidden="true">{option.emoji}</span>
                                <span>{option.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* Target Agent Harness */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Target Coding Agent
                        </label>
                        <InfoTooltip text="Tailors rule files and slash commands for Antigravity, Copilot, or Jules." />
                      </div>
                      <select
                        value={form.agent}
                        onChange={(e) => updateField('agent', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="antigravity">Google Antigravity (App / IDE / agy CLI)</option>
                        <option value="copilot">GitHub Copilot (IDE / CLI / Cloud Agent)</option>
                        <option value="jules">Google Jules (Async Cloud VM Contractor)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {form.agent === 'antigravity' &&
                          'Supports /plan, /grill-me, /boost, /teamwork, 24KB .agents/rules/*.md & SKILL.md.'}
                        {form.agent === 'copilot' &&
                          'Supports 5-tier instructions, .agent.md handoffs, /plan, /fleet & #runSubagent.'}
                        {form.agent === 'jules' &&
                          'Clones repo into Ubuntu VM. Capped at 5 tasks/day (beta), 5MB initial PNG/JPEG.'}
                      </p>
                    </div>

                    {/* Target Application Domain */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Target Domain Architecture
                        </label>
                        <InfoTooltip text="Automatically primes architecture and security rules for Web, Mobile, or Desktop." />
                      </div>
                      <select
                        value={form.platform}
                        onChange={(e) =>
                          applyDomainInvariants(
                            e.target.value === 'desktop' ? 'desktop_tauri' : e.target.value
                          )
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="web">Web App (Next.js 15 / React 19 / TanStack)</option>
                        <option value="mobile">Mobile App (RN TurboModules / Flutter / Native)</option>
                        <option value="desktop">Desktop App (Tauri v2 Rust / Electron)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Automatically primes boundary invariants for Server/Client, Native Bridges,
                        or IPC.
                      </p>
                    </div>

                    {/* Execution Mode */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Slice Execution Mode
                        </label>
                        <InfoTooltip text="HITL pauses for human review; AFK runs slices autonomously in a cloud VM or subagent." />
                      </div>
                      <select
                        value={form.executionMode}
                        onChange={(e) => updateField('executionMode', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="HITL">HITL (Human-in-the-Loop Co-Piloted)</option>
                        <option value="AFK">AFK (Autonomous Cloud VM / Subagent)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {form.executionMode === 'HITL'
                          ? 'Best for foundational architecture, auth boundaries, and UX nuances.'
                          : 'Best for well-scoped vertical slices delegated to Jules, Cloud Agent, or /fleet.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Magic Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleMagicAutoArchitect}
                    disabled={isGeneratingAll}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition"
                  >
                    {isGeneratingAll ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>
                      {isGeneratingAll
                        ? 'Building Your AI Instructions...'
                        : dummyProofMode
                        ? '✨ Step 1: Turn My Idea Into AI Instructions'
                        : 'AI Auto-Architect All Prompt & Repo Files'}
                    </span>
                  </button>

                  <button
                    onClick={handleRunGrillMe}
                    disabled={isGrilling}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
                  >
                    {isGrilling ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                    )}
                    <span>
                      {isGrilling
                        ? 'Checking for Missing Details...'
                        : dummyProofMode
                        ? '❓ Step 2: Check My Idea for Missing Details (3 Quick Questions)'
                        : 'Run /grill-me Socratic Design Interview'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Socratic Design Interview Card (/grill-me / /speckit.clarify) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      {dummyProofMode ? (
                        'Step 2: Quick Check for Missing Details'
                      ) : (
                        <>
                          Stage 3: Socratic Design Interview (<code>/grill-me</code> &amp;{' '}
                          <code>/speckit.clarify</code>)
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {dummyProofMode
                        ? 'Answer 3 quick multiple-choice questions to catch edge cases before the AI starts building.'
                        : 'Resolve hidden edge cases, permissions, and recovery states before locking the technical plan. Recommended choices are marked first.'}
                    </p>
                  </div>
                  {grillQuestions.length === 0 && (
                    <button
                      onClick={handleRunGrillMe}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      Generate Questions <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {grillQuestions.length === 0 ? (
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs text-slate-400">
                    {dummyProofMode ? (
                      <>
                        Click{' '}
                        <strong>
                          &quot;❓ Step 2: Check My Idea for Missing Details (3 Quick
                          Questions)&quot;
                        </strong>{' '}
                        above to double-check permissions, offline behavior, and error handling.
                      </>
                    ) : (
                      <>
                        Click <strong>&quot;Run /grill-me Socratic Design Interview&quot;</strong>{' '}
                        above to let the AI inspect your plain-language idea and ask targeted
                        multiple-choice edge-case questions—just like Google Antigravity&apos;s{' '}
                        <code>/grill-me</code> command.
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {grillQuestions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {q.focusArea}
                          </span>
                          <span className="text-xs text-slate-500">Question {qIdx + 1}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-200">{q.question}</p>
                        <div className="space-y-1.5 pt-1">
                          {(q.options || []).map((opt, oIdx) => {
                            const isSelected = grillAnswers[q.id] === opt;
                            return (
                              <label
                                key={oIdx}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-indigo-950/50 border-indigo-500/60 text-indigo-100'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`grill-${q.id}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    setGrillAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                  }
                                  className="mt-0.5 accent-indigo-500"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                        {/* Custom write-in option */}
                        <div className="pt-1">
                          <input
                            type="text"
                            value={grillAnswers[q.id] || ''}
                            onChange={(e) =>
                              setGrillAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            placeholder="Or write in a custom architectural decision..."
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={applyGrillAnswersToSpec}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Fold Clarified Decisions into Prompt &amp; spec.md EARS Criteria
                    </button>
                  </div>
                )}
              </div>

              {dummyProofMode && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                  <button
                    onClick={() => handleChangeViewMode('intermediate')}
                    className="text-xs text-indigo-300 hover:text-indigo-200 underline underline-offset-4 transition"
                  >
                    Try Intermediate Mode (4 Tabs + Jargon Guide)
                  </button>
                  <button
                    onClick={() => handleChangeViewMode('pro')}
                    className="text-xs text-slate-400 hover:text-indigo-300 underline underline-offset-4 transition"
                  >
                    Switch to Pro Mode to edit 5-Section Prompts, AGENTS.md &amp; EARS Specs
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 2: 5-SECTION TASK PROMPT BUILDER (Primacy & Recency Contract)
             ---------------------------------------------------------------- */}
          {activeTab === 'prompt5' && (
            <div className="space-y-5">
              {showPlainHelpers && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start gap-3 text-xs text-amber-100">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Why 5 Sections?</strong> AI coding models pay the most attention to the{' '}
                    <strong>very beginning (Section 1)</strong> and the{' '}
                    <strong>very end (Section 5)</strong> of a prompt. Not sure what to type in a
                    box? Click any of the <strong>Quick-Fill Chips</strong> under the inputs!
                  </div>
                </div>
              )}

              {/* Section 1: Role Persona & Primary Objective (Top-Priority Rules) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <span>Section 1 • Top-Priority Rules (AI Attention Top Section)</span>
                      <InfoTooltip text="Putting your most important instructions at the top of the prompt where AI reads them best." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Role Persona &amp; Primary Objective
                    </h3>
                  </div>
                  <SectionAutoFillButton
                    sectionId="role_objective"
                    activeSection={autoFillingSection}
                    onAutoFill={handleAutoFillSection}
                  />
                </div>

                {sectionHighlights.role_objective && (
                  <SectionAutoFillHighlight
                    sectionId="role_objective"
                    text={sectionHighlights.role_objective}
                    onClear={() => clearSectionHighlight('role_objective')}
                  />
                )}

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="Primacy Anchor"
                    explanation="Putting your most important rules and AI role at the very top of the prompt where the AI reads them best."
                  />
                )}

                {showPlainHelpers && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">1-Click Role Chips:</span>
                    {QUICK_FILL_CHIPS.rolePersona.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => updateField('rolePersona', chip)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-200 border border-slate-700"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Senior Engineering Persona
                      </label>
                      <InfoTooltip text="Sets the AI's expert mindset and seniority level for writing production code." />
                    </div>
                    <input
                      type="text"
                      value={form.rolePersona}
                      onChange={(e) => updateField('rolePersona', e.target.value)}
                      placeholder="e.g., Senior iOS Engineer / Senior Next.js 15 Architect"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Domain Specialization Focus
                      </label>
                      <InfoTooltip text="Pinpoints the specific technical specialty the AI should prioritize." />
                    </div>
                    <input
                      type="text"
                      value={form.roleFocus}
                      onChange={(e) => updateField('roleFocus', e.target.value)}
                      placeholder="e.g., SwiftUI memory optimization / Rust Tauri v2 IPC"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <label className="block text-xs font-medium text-slate-300">
                          1-Sentence Feature / Fix Objective
                        </label>
                        <InfoTooltip text="A concise, single-sentence statement of the exact feature or fix to build." />
                      </div>
                      <button
                        type="button"
                        disabled={expandingField === 'objective'}
                        onClick={() => handleAutoExpandField('objective')}
                        className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-medium text-indigo-200 disabled:opacity-50 transition"
                      >
                        {expandingField === 'objective'
                          ? 'Expanding options...'
                          : '✨ Auto-Expand Options'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.objective}
                      onChange={(e) => updateField('objective', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    {expandedHighlights.objective && (
                      <ExpandedTextHighlight
                        fieldKey="objective"
                        text={expandedHighlights.objective}
                        onClear={() => clearExpandedHighlight('objective')}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <label className="block text-xs font-medium text-slate-300">
                          Observable User Outcome ("so that...")
                        </label>
                        <InfoTooltip text="Describes the tangible benefit a real user experiences once the feature works." />
                      </div>
                      <button
                        type="button"
                        disabled={expandingField === 'observableOutcome'}
                        onClick={() => handleAutoExpandField('observableOutcome')}
                        className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-medium text-indigo-200 disabled:opacity-50 transition"
                      >
                        {expandingField === 'observableOutcome'
                          ? 'Expanding options...'
                          : '✨ Auto-Expand Options'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.observableOutcome}
                      onChange={(e) => updateField('observableOutcome', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    {expandedHighlights.observableOutcome && (
                      <ExpandedTextHighlight
                        fieldKey="observableOutcome"
                        text={expandedHighlights.observableOutcome}
                        onClear={() => clearExpandedHighlight('observableOutcome')}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Target Context, Pinned Stack & File Pointers */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <span>Section 2 • Narrow Reasoning Boundaries</span>
                      <InfoTooltip text="Tells the AI which files to edit, which files to read, and which exact libraries to use." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Target Context, Pinned Stack &amp; File Pointers
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="context_stack"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    {/* Pointer Syntax Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => updateField('pointerStyle', '@path')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                          form.pointerStyle === '@path'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        @path/to/file (Antigravity / CLI)
                      </button>
                      <button
                        onClick={() => updateField('pointerStyle', '#file')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                          form.pointerStyle === '#file'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        #file:path (VS Code Copilot)
                      </button>
                    </div>
                  </div>
                </div>

                {sectionHighlights.context_stack && (
                  <SectionAutoFillHighlight
                    sectionId="context_stack"
                    text={sectionHighlights.context_stack}
                    onClear={() => clearSectionHighlight('context_stack')}
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label
                        htmlFor="field-targetFilesModify"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Target Files to Modify
                      </label>
                      <InfoTooltip text="Exact file paths the AI is allowed to create or edit for this task." />
                    </div>
                    <input
                      id="field-targetFilesModify"
                      type="text"
                      value={form.targetFilesModify}
                      onChange={(e) => updateField('targetFilesModify', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm font-mono text-cyan-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Reference Files &amp; Interfaces (Read-Only Context)
                      </label>
                      <InfoTooltip text="Existing files the AI should read to understand types and patterns without modifying them." />
                    </div>
                    <input
                      type="text"
                      value={form.targetFilesRef}
                      onChange={(e) => updateField('targetFilesRef', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <label
                          htmlFor="field-pinnedStack"
                          className="block text-xs font-medium text-slate-300"
                        >
                          Pinned Stack &amp; Exact SDK Versions
                        </label>
                        <InfoTooltip text="Locks in framework and library versions so the AI doesn't use outdated syntax." />
                      </div>
                      <textarea
                        id="field-pinnedStack"
                        rows={2}
                        value={form.pinnedStack}
                        onChange={(e) => updateField('pinnedStack', e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      {showPlainHelpers && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {QUICK_FILL_CHIPS.pinnedStack.map((stackChip, idx) => (
                            <button
                              key={idx}
                              onClick={() => updateField('pinnedStack', stackChip)}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700 truncate max-w-[220px]"
                            >
                              Use: {stackChip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Unapproved Libraries &amp; Deprecated Patterns to Reject
                        </label>
                        <InfoTooltip text="Libraries or legacy patterns the AI is strictly forbidden from introducing." />
                      </div>
                      <textarea
                        rows={2}
                        value={form.unapprovedLibs}
                        onChange={(e) => updateField('unapprovedLibs', e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Visual Mockup / GitHub Issue Context
                      </label>
                      <InfoTooltip text="Optional design notes, Figma references, or GitHub issue context." />
                    </div>
                    <input
                      type="text"
                      value={form.visualContext}
                      onChange={(e) => updateField('visualContext', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Architectural Invariants, Runtime & Security Constraints */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span>Section 3 • Non-Negotiable Boundaries</span>
                      <InfoTooltip text="Strict architectural and security rules the AI must never violate." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Architectural Invariants, Runtime &amp; Security Constraints
                    </h3>
                  </div>

                  {/* Quick Domain Boundary Injectors */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <SectionAutoFillButton
                      sectionId="constraints"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <span className="text-[11px] text-slate-400">Inject Rules:</span>
                    <button
                      onClick={() => applyDomainInvariants('web')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-300 border border-slate-700"
                    >
                      + Next.js 15 / React 19
                    </button>
                    <button
                      onClick={() => applyDomainInvariants('mobile')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 border border-slate-700"
                    >
                      + Mobile TurboModules
                    </button>
                    <button
                      onClick={() => applyDomainInvariants('desktop_tauri')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 border border-slate-700"
                    >
                      + Tauri v2 (6 Rules)
                    </button>
                    <button
                      onClick={() => applyDomainInvariants('desktop_electron')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-rose-300 border border-slate-700"
                    >
                      + Electron (3 Security Laws)
                    </button>
                  </div>
                </div>

                {sectionHighlights.constraints && (
                  <SectionAutoFillHighlight
                    sectionId="constraints"
                    text={sectionHighlights.constraints}
                    onClear={() => clearSectionHighlight('constraints')}
                  />
                )}

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="State Invariants & TurboModules"
                    explanation="Invariants are 'never-break' data & security laws (like keeping secrets out of the browser). TurboModules are high-speed bridges used when React Native apps talk to native phone hardware."
                  />
                )}

                <div className="space-y-3">
                  {isIntermediateMode ? (
                    <div className="space-y-2.5">
                      <p className="text-xs font-medium text-slate-300">
                        Plain-English Engineering Rules (check the rules you want enforced):
                      </p>
                      <div className="space-y-2">
                        {INTERMEDIATE_RULE_PRESETS.map((rule) => {
                          const checked = String(form[rule.targetField] || '').includes(
                            rule.technicalRule
                          );
                          return (
                            <label
                              key={rule.id}
                              className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                                checked
                                  ? 'bg-indigo-500/15 border-indigo-400/50 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleIntermediateRule(rule)}
                                className="mt-0.5 accent-indigo-500 rounded"
                              />
                              <div className="space-y-0.5">
                                <span className="block text-xs font-semibold">{rule.label}</span>
                                <span className="block text-[11px] text-slate-400">
                                  {rule.helper}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <details className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2 text-[11px] text-slate-400">
                        <summary className="cursor-pointer font-medium text-slate-300 select-none">
                          View generated technical rules added to your prompt
                        </summary>
                        <div className="mt-2 space-y-2 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                          <div>
                            <span className="text-indigo-300 font-semibold">
                              State &amp; Data Rules:
                            </span>
                            {'\n'}
                            {form.stateAndDataRules}
                          </div>
                          <div>
                            <span className="text-amber-300 font-semibold">
                              Runtime &amp; Security Limits:
                            </span>
                            {'\n'}
                            {form.runtimeAndSecurityLimits}
                          </div>
                        </div>
                      </details>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <label className="block text-xs font-medium text-slate-300">
                            State Placement &amp; Architectural Boundary Rules (Direct Imperatives)
                          </label>
                          <InfoTooltip text="Defines where state lives (server vs. client) and how modules communicate." />
                        </div>
                        <textarea
                          rows={4}
                          value={form.stateAndDataRules}
                          onChange={(e) => updateField('stateAndDataRules', e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <label className="block text-xs font-medium text-slate-300">
                            Runtime, Threading, Accessibility &amp; Security Constraints
                          </label>
                          <InfoTooltip text="Performance budgets, UI thread safety, accessibility standards, and security rules." />
                        </div>
                        <textarea
                          rows={3}
                          value={form.runtimeAndSecurityLimits}
                          onChange={(e) => updateField('runtimeAndSecurityLimits', e.target.value)}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Restricted / Generated Files (Forbidden to Edit by Hand)
                      </label>
                      <InfoTooltip text="Lockfiles, build outputs, or migrations that the AI must never manually edit." />
                    </div>
                    <input
                      type="text"
                      value={form.restrictedFiles}
                      onChange={(e) => updateField('restrictedFiles', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-rose-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Scoped Vertical-Slice Task Steps & Concrete Examples */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span>Section 4 • Sequential Sub-Steps &amp; State Matrix</span>
                      <InfoTooltip text="Step-by-step implementation order, UI states, and concrete input/output examples." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Scoped Vertical-Slice Steps &amp; Concrete Examples
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="task_steps"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <button
                      onClick={addStep}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1 hover:bg-emerald-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Step
                    </button>
                  </div>
                </div>

                {sectionHighlights.task_steps && (
                  <SectionAutoFillHighlight
                    sectionId="task_steps"
                    text={sectionHighlights.task_steps}
                    onClear={() => clearSectionHighlight('task_steps')}
                  />
                )}

                {/* Ordered Steps */}
                <div className="space-y-2">
                  {form.taskSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => editStep(idx, e.target.value)}
                        className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => removeStep(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Remove step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 6 UI States Matrix */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Explicit UI &amp; Domain State Transitions (Loading, Empty, Error, Offline, Disabled, Success)
                    </label>
                    <InfoTooltip text="Ensures the AI designs every screen state instead of only coding the happy path." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {uiStateEntries.map(([stateKey, desc]) => (
                      <div
                        key={stateKey}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2.5"
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
                          {stateKey} State
                        </span>
                        <input
                          id={stateKey === firstIncompleteUiState ? 'field-uiStates' : undefined}
                          aria-label={`${stateKey} State`}
                          type="text"
                          value={String(desc ?? '')}
                          onChange={(e) => updateUiState(stateKey, e.target.value)}
                          className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Input / Output */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Concrete Example Input Payload
                      </label>
                      <InfoTooltip text="A real sample input so the AI knows the exact data shape to expect." />
                    </div>
                    <input
                      type="text"
                      value={form.exampleInput}
                      onChange={(e) => updateField('exampleInput', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Expected Output / Sorting Contract
                      </label>
                      <InfoTooltip text="The exact output or UI result the AI should produce for the sample input." />
                    </div>
                    <input
                      type="text"
                      value={form.exampleOutput}
                      onChange={(e) => updateField('exampleOutput', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Verification Loop & Output Contract (Final Instructions) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <span>Section 5 • Final Instructions (AI Attention Bottom Section)</span>
                      <InfoTooltip text="Putting your verification commands at the very bottom ensures the AI runs tests right before finishing." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Verification Loop &amp; Output Contract
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="verification"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.planFirstGate}
                        onChange={(e) => updateField('planFirstGate', e.target.checked)}
                        className="accent-indigo-500 rounded"
                      />
                      <span>Require Plan-First Approval Gate</span>
                      <InfoTooltip text="Asks the AI to show a step-by-step plan and wait for your approval before editing files." />
                    </label>
                  </div>
                </div>

                {sectionHighlights.verification && (
                  <SectionAutoFillHighlight
                    sectionId="verification"
                    text={sectionHighlights.verification}
                    onClear={() => clearSectionHighlight('verification')}
                  />
                )}

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="Recency Anchor"
                    explanation="Putting exact test and verification commands at the very bottom of the prompt so the AI runs checks right before finishing."
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label
                        htmlFor="field-verificationCommands"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Exact Verification Shell Commands (Typecheck, Lint, Scoped Tests)
                      </label>
                      <InfoTooltip text="Shell commands the AI must execute and pass before reporting its work complete." />
                    </div>
                    <input
                      id="field-verificationCommands"
                      type="text"
                      value={form.verificationCommands}
                      onChange={(e) => updateField('verificationCommands', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-purple-200 focus:outline-none focus:border-indigo-500"
                    />
                    {showPlainHelpers && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="text-[10px] text-slate-400">1-Click Test Commands:</span>
                        {QUICK_FILL_CHIPS.verificationCommands.map((cmd, idx) => (
                          <button
                            key={idx}
                            onClick={() => updateField('verificationCommands', cmd)}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-200 font-mono border border-slate-700"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-medium text-slate-300">
                        Required Deliverable Format &amp; Summary Contract
                      </label>
                      <InfoTooltip text="Specifies how the AI should format its final response and verification report." />
                    </div>
                    <textarea
                      rows={2}
                      value={form.deliverableFormat}
                      onChange={(e) => updateField('deliverableFormat', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 3: AGENTS.MD (10-SECTION STANDARD) & MONOREPO LAYERING
             ---------------------------------------------------------------- */}
          {activeTab === 'agentsmd' && (
            <div className="space-y-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>Root <code>AGENTS.md</code> Builder (10-Section Open Standard)</span>
                      <InfoTooltip text="Permanent repository guide automatically read by Antigravity, GitHub Copilot, and Google Jules." />
                    </h2>
                    <p className="text-xs text-slate-400">
                      Natively discovered by Google Jules, GitHub Copilot, and Google Antigravity.
                      Separates durable repository context from transient task prompts.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="agentsmd"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <button
                      onClick={() => setSelectedArtifact('AGENTS.md')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
                    >
                      Preview AGENTS.md →
                    </button>
                  </div>
                </div>

                {sectionHighlights.agentsmd && (
                  <SectionAutoFillHighlight
                    sectionId="agentsmd"
                    text={sectionHighlights.agentsmd}
                    onClear={() => clearSectionHighlight('agentsmd')}
                  />
                )}

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="10-Section AGENTS.md"
                    explanation="A standardized README written specifically for AI coding agents so Antigravity, Copilot, and Jules automatically follow your project's build and testing rules."
                  />
                )}

                {/* All 10 Standard Sections */}
                <div className="space-y-4">
                  {[
                    {
                      num: '1',
                      heading: '## Product',
                      key: 'agentsProduct',
                      rows: 2,
                      hint: 'Include: 1-2 sentence description of what the app does and who uses it. Exclude: Marketing prose or temporary feature specs.'
                    },
                    {
                      num: '2',
                      heading: '## Stack',
                      key: 'agentsStack',
                      rows: 2,
                      hint: 'Include: Pinned frameworks, languages, DB engines, ORMs, styling tools, test runners. Exclude: Uninstalled technologies.'
                    },
                    {
                      num: '3',
                      heading: '## Repository Structure',
                      key: 'agentsRepoStructure',
                      rows: 4,
                      hint: 'Include: Directory-to-responsibility mapping (app/, features/, services/, lib/). Exclude: Exhaustive file-by-file listings.'
                    },
                    {
                      num: '4',
                      heading: '## Commands',
                      key: 'agentsCommands',
                      rows: 5,
                      hint: 'Include: Exact, verified CLI commands for install, dev, unit test, single-file test filter, typecheck, lint, E2E, build.'
                    },
                    {
                      num: '5',
                      heading: '## Architecture',
                      key: 'agentsArchitecture',
                      rows: 4,
                      hint: 'Include: Project-specific boundaries the model cannot infer on its own. Exclude: Generic platitudes like "Use clean architecture".'
                    },
                    {
                      num: '6',
                      heading: '## Coding Conventions',
                      key: 'agentsConventions',
                      rows: 3,
                      hint: 'Include: Conventions not enforced by linters (named exports, error classes, state rules). Exclude: Copy-pasting Prettier/ESLint rules.'
                    },
                    {
                      num: '7',
                      heading: '## Testing',
                      key: 'agentsTesting',
                      rows: 3,
                      hint: 'Include: Behavior-first assertions over internal state, deterministic fixtures, running affected tests first.'
                    },
                    {
                      num: '8',
                      heading: '## Security',
                      key: 'agentsSecurity',
                      rows: 3,
                      hint: 'Include: Server-side resource ownership checks, untrusted client inputs (roles, prices, IDs), secret redaction.'
                    },
                    {
                      num: '9',
                      heading: '## Database',
                      key: 'agentsDatabase',
                      rows: 2,
                      hint: 'Include: Rules prohibiting destructive migrations without approval, backfill plans, forbidding edits to applied migrations.'
                    },
                    {
                      num: '10',
                      heading: '## Generated Files',
                      key: 'agentsGenerated',
                      rows: 3,
                      hint: 'Include: Explicit paths the agent must never edit by hand (src/generated/, lockfiles) + regeneration commands.'
                    }
                  ].map((sec) => (
                    <div
                      key={sec.key}
                      className="rounded-xl bg-slate-950/90 border border-slate-800/90 p-3.5 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold font-mono text-indigo-300">
                          Section {sec.num}: {sec.heading}
                        </span>
                        <span className="text-[11px] text-slate-400">{sec.hint}</span>
                      </div>
                      <textarea
                        rows={sec.rows}
                        value={form[sec.key]}
                        onChange={(e) => updateField(sec.key, e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Monorepo Nested AGENTS.md Builder */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Monorepo Layering: Nested Subproject <code>AGENTS.md</code>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Agents walk the directory tree and give precedence to the nearest{' '}
                      <code>AGENTS.md</code> file. Keep subproject files slim with local command
                      overrides only.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact(`${form.nestedSubprojectPath}/AGENTS.md`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs hover:bg-slate-700"
                  >
                    Preview Nested File →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Subproject Folder Path
                    </label>
                    <input
                      type="text"
                      value={form.nestedSubprojectPath}
                      onChange={(e) => updateField('nestedSubprojectPath', e.target.value)}
                      placeholder="apps/mobile or services/payments"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Local Package Command Overrides
                    </label>
                    <input
                      type="text"
                      value={form.nestedCommandOverrides}
                      onChange={(e) => updateField('nestedCommandOverrides', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Service / App-Specific Constraints (Without Duplicating Root AGENTS.md)
                  </label>
                  <textarea
                    rows={2}
                    value={form.nestedLocalConstraints}
                    onChange={(e) => updateField('nestedLocalConstraints', e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 4: PLATFORM INSTRUCTIONAL & CONFIG FILES SUITE
             ---------------------------------------------------------------- */}
          {activeTab === 'platform_files' && (
            <div className="space-y-5">
              {/* 1. Google Antigravity Rules & Skills */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Google Antigravity • .agents/rules/*.md &amp; .agents/skills/*/SKILL.md
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Modular Rules &amp; Agent Skills Configurator
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        diagnostics.isRuleSizeSafe
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      🟢 Rule Size: {diagnostics.ruleSizeMessage}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Rule File Name (<code>.agents/rules/</code>)
                    </label>
                    <input
                      type="text"
                      value={form.agyRuleName}
                      onChange={(e) =>
                        updateField('agyRuleName', e.target.value.replace(/\//g, '-'))
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Slashes are automatically turned into hyphens so Antigravity always finds your
                      rule file.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      When Should Antigravity Load This Rule?
                    </label>
                    <select
                      value={form.agyTrigger}
                      onChange={(e) => updateField('agyTrigger', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="always_on">always_on (Loaded in every chat)</option>
                      <option value="model_decision">
                        model_decision (AI loads it automatically when relevant)
                      </option>
                      <option value="glob">glob (Loaded when editing matching files)</option>
                      <option value="manual">manual (Loaded only when you @-mention it)</option>
                    </select>
                    <p className="text-[11px] text-amber-300/80 mt-1">
                      Uses standard underscore names so Antigravity loads your rule reliably every
                      time.
                    </p>
                  </div>
                </div>

                {form.agyTrigger === 'glob' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      File Match Pattern (Automatically quoted for safe formatting)
                    </label>
                    <input
                      type="text"
                      value={form.agyGlobs}
                      onChange={(e) => updateField('agyGlobs', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-cyan-200"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Agent Skill Bundle Name (<code>.agents/skills/&lt;name&gt;/SKILL.md</code>)
                    </label>
                    <input
                      type="text"
                      value={form.agySkillName}
                      onChange={(e) => updateField('agySkillName', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Skill Summary (What it does &amp; when the AI should use it)
                    </label>
                    <input
                      type="text"
                      value={form.agySkillDescription}
                      onChange={(e) => updateField('agySkillDescription', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedArtifact(`.agents/rules/${form.agyRuleName}.md`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs"
                  >
                    Preview .agents/rules/{form.agyRuleName}.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact(`.agents/skills/${form.agySkillName}/SKILL.md`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs"
                  >
                    Preview .agents/skills/{form.agySkillName}/SKILL.md →
                  </button>
                </div>
              </div>

              {/* 2. GitHub Copilot 5-Tier Instructions & Custom Agent Handoffs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      GitHub Copilot • .github/instructions/*.instructions.md &amp; .agent.md
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Path-Scoped Instructions &amp; Specialist Agent Pipeline
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    🟢 Agent File Size: {diagnostics.copilotSizeMessage}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Instruction Name
                    </label>
                    <input
                      type="text"
                      value={form.copilotInstructionName}
                      onChange={(e) => updateField('copilotInstructionName', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      YAML <code>applyTo</code> Glob Pattern
                    </label>
                    <input
                      type="text"
                      value={form.copilotApplyTo}
                      onChange={(e) => updateField('copilotApplyTo', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Optional <code>excludeAgent</code> Filter
                    </label>
                    <select
                      value={form.copilotExcludeAgent}
                      onChange={(e) => updateField('copilotExcludeAgent', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="none">Active for All Copilot Agents</option>
                      <option value="code-review">excludeAgent: "code-review"</option>
                      <option value="cloud-agent">excludeAgent: "cloud-agent"</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Custom Agent Profile (<code>.github/agents/&lt;name&gt;.agent.md</code>)
                    </label>
                    <input
                      type="text"
                      value={form.copilotAgentName}
                      onChange={(e) => updateField('copilotAgentName', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tool Restriction &amp; Handoff Mode
                    </label>
                    <select
                      value={form.copilotAgentRole}
                      onChange={(e) => updateField('copilotAgentRole', e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="planner">
                        Planner / Reviewer (Restricted tools: ["read", "search"] + Handoff)
                      </option>
                      <option value="implementer">
                        Implementer (Full tools: ["read", "search", "edit", "execute", "playwright/*"])
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedArtifact('.github/copilot-instructions.md')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview .github/copilot-instructions.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact(
                        `.github/instructions/${form.copilotInstructionName}.instructions.md`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview .instructions.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact(`.github/agents/${form.copilotAgentName}.agent.md`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview .agent.md →
                  </button>
                  <button
                    onClick={() =>
                      setSelectedArtifact('.github/workflows/copilot-setup-steps.yml')
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs"
                  >
                    Preview copilot-setup-steps.yml →
                  </button>
                </div>
              </div>

              {/* 3. Google Jules Cloud VM Snapshot & API Config */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Google Jules • Ubuntu VM Snapshot &amp; API Contract
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Jules Initial Setup (Run and Snapshot) &amp; Plan Steering
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact('jules-setup.sh')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs"
                  >
                    Preview jules-setup.sh →
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Generates the exact initialization script for{' '}
                  <strong>Codebases → Configuration → Initial Setup</strong> (including{' '}
                  <code>. /opt/environment_summary.sh</code>) plus the Jules v1alpha API payload with{' '}
                  <code>"requirePlanApproval": true</code> so API sessions do not auto-approve
                  complex architectural plans without human review.
                </p>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 5: SPEC-DRIVEN DEVELOPMENT (SDD) PIPELINE BUILDER
             ---------------------------------------------------------------- */}
          {activeTab === 'sdd' && (
            <div className="space-y-5">
              {/* Stage 1: Project Constitution */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <span>Stage 1 • Core Project Laws (.specify/memory/constitution.md)</span>
                      <InfoTooltip text="Permanent non-negotiable engineering laws that every feature and AI session must obey." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Immutable Engineering Principles
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="sdd_constitution"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <button
                      onClick={() => setSelectedArtifact('.specify/memory/constitution.md')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs"
                    >
                      Preview constitution.md →
                    </button>
                  </div>
                </div>
                {sectionHighlights.sdd_constitution && (
                  <SectionAutoFillHighlight
                    sectionId="sdd_constitution"
                    text={sectionHighlights.sdd_constitution}
                    onClear={() => clearSectionHighlight('sdd_constitution')}
                  />
                )}
                <textarea
                  rows={4}
                  value={form.constitutionRules}
                  onChange={(e) => updateField('constitutionRules', e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Stage 2: Step-by-Step Goal Checks (When/Then Rules) (spec.md) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <span>Stage 2 • Feature Goals &amp; When/Then Rules (No Tech-Stack Bias)</span>
                      <InfoTooltip text="Defines observable user behavior using WHEN [trigger] -> THE SYSTEM SHALL [reaction] rules." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Step-by-Step Goal Checks (When/Then Rules) (<code>spec.md</code>)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pair concrete trigger conditions (<strong>WHEN</strong>) with explicit
                      observable system reactions (<strong>THE SYSTEM SHALL</strong>).
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="sdd_spec"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <button
                      id={form.earsSpecs.length === 0 ? 'field-earsSpecs' : undefined}
                      onClick={addEars}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Goal Check
                    </button>
                    <button
                      onClick={() => setSelectedArtifact('specs/001-feature/spec.md')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs"
                    >
                      Preview spec.md →
                    </button>
                  </div>
                </div>

                {sectionHighlights.sdd_spec && (
                  <SectionAutoFillHighlight
                    sectionId="sdd_spec"
                    text={sectionHighlights.sdd_spec}
                    onClear={() => clearSectionHighlight('sdd_spec')}
                  />
                )}

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="EARS Notation"
                    explanation="A simple 'WHEN [trigger] -> THE SYSTEM SHALL [result]' format that removes ambiguity so your AI writes exact behavior and tests."
                  />
                )}

                <div className="space-y-3">
                  {form.earsSpecs.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">
                          Goal Check #{idx + 1} (When / Then)
                        </span>
                        <button
                          onClick={() => removeEars(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            WHEN (Trigger Condition)
                          </span>
                          <input
                            id={idx === 0 ? 'field-earsSpecs' : undefined}
                            type="text"
                            value={item.when}
                            onChange={(e) => editEars(idx, 'when', e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            THE SYSTEM SHALL (Observable Reaction)
                          </span>
                          <input
                            type="text"
                            value={item.shall}
                            onChange={(e) => editEars(idx, 'shall', e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage 3: Step-by-Step Task Breakdown (tasks.md) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span>Stage 3 • Full-Feature Task Breakdown &amp; Parallel Execution</span>
                      <InfoTooltip text="Breaks your project into end-to-end mini-features (data + UI + tests) instead of disconnected layers." />
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      Step-by-Step Task Breakdown (Full Features, Not Horizontal Layers) (
                      <code>tasks.md</code>)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Build one complete feature slice at a time across data, service, boundary,
                      UI, and tests. Tag <code>[HITL]</code> (Human Review) vs <code>[AFK]</code>{' '}
                      (Automatic) and <code>[P]</code> for parallel execution.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SectionAutoFillButton
                      sectionId="sdd_tasks"
                      activeSection={autoFillingSection}
                      onAutoFill={handleAutoFillSection}
                    />
                    <button
                      onClick={addSlice}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Feature Task
                    </button>
                    <button
                      onClick={() => setSelectedArtifact('specs/001-feature/tasks.md')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs"
                    >
                      Preview tasks.md →
                    </button>
                  </div>
                </div>

                {sectionHighlights.sdd_tasks && (
                  <SectionAutoFillHighlight
                    sectionId="sdd_tasks"
                    text={sectionHighlights.sdd_tasks}
                    onClear={() => clearSectionHighlight('sdd_tasks')}
                  />
                )}

                {isIntermediateMode && (
                  <JargonTranslationCard
                    term="Vertical Slices"
                    explanation="Building one complete working mini-feature end-to-end (data, UI, and tests) at a time instead of unfinished horizontal layers."
                  />
                )}

                <div className="space-y-3">
                  {form.verticalSlices.map((slice, idx) =>
                    isIntermediateMode ? (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-indigo-300">
                              {slice.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                slice.mode === 'HITL'
                                  ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                                  : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
                              }`}
                            >
                              {slice.mode === 'HITL'
                                ? '[HITL] Human Review'
                                : '[AFK] Runs Automatically'}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove task ${slice.id}`}
                            onClick={() => removeSlice(idx)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            What does this checklist item build?
                          </label>
                          <input
                            type="text"
                            aria-label={`Task ${idx + 1} title`}
                            value={slice.title}
                            onChange={(e) =>
                              updateIntermediateSlice(idx, { title: e.target.value })
                            }
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slice.mode === 'HITL'}
                              onChange={(e) =>
                                updateIntermediateSlice(idx, {
                                  needsHumanReview: e.target.checked
                                })
                              }
                              className="accent-amber-500 rounded"
                            />
                            <span>
                              Needs human review (<code>[HITL]</code>) — uncheck to run
                              automatically (<code>[AFK]</code>)
                            </span>
                          </label>

                          <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slice.parallel}
                              onChange={(e) =>
                                updateIntermediateSlice(idx, { parallel: e.target.checked })
                              }
                              className="accent-emerald-500 rounded"
                            />
                            <span>Can run in parallel</span>
                          </label>
                        </div>

                        <p className="text-[11px] text-emerald-300/90 bg-emerald-950/30 border border-emerald-500/20 rounded-lg px-2.5 py-1.5">
                          Auto-generated tracer bullet layers:{' '}
                          <span className="font-mono text-emerald-200">{slice.layers}</span>
                        </p>
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={slice.id}
                              onChange={(e) => editSlice(idx, 'id', e.target.value)}
                              className="w-16 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs font-mono font-bold text-indigo-300"
                            />
                            <select
                              value={slice.mode}
                              onChange={(e) => editSlice(idx, 'mode', e.target.value)}
                              className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white"
                            >
                              <option value="HITL">[HITL] Co-Piloted</option>
                              <option value="AFK">[AFK] Autonomous</option>
                            </select>
                            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={slice.parallel}
                                onChange={(e) => editSlice(idx, 'parallel', e.target.checked)}
                                className="accent-emerald-500"
                              />
                              <span>[P] Parallelizable</span>
                            </label>
                          </div>
                          <button
                            onClick={() => removeSlice(idx)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                              Slice Title
                            </span>
                            <input
                              type="text"
                              value={slice.title}
                              onChange={(e) => editSlice(idx, 'title', e.target.value)}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                              End-to-End Integration Layers Included
                            </span>
                            <input
                              type="text"
                              value={slice.layers}
                              onChange={(e) => editSlice(idx, 'layers', e.target.value)}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono text-emerald-200"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            RIGHT COLUMN: LIVE MULTI-FILE ARTIFACT INSPECTOR & EXPORT DOCK (5 COLS)
           ==================================================================== */}
        <div
          className={`lg:col-span-5 ${
            mobilePane === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-28 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-8.5rem)]">
            {dummyProofMode && (
              <div className="p-4 border-b border-indigo-500/30 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                    Ready to Build? Choose Your Next Step
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl bg-slate-950/80 border border-indigo-500/40 p-3 space-y-2">
                    <div className="text-xs font-semibold text-white">
                      Option A — Easiest (No Folders Needed)
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(artifacts['TASK_PROMPT.md'].content, 'NEXT_STEP_PROMPT')
                      }
                      className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
                    >
                      {copiedKey === 'NEXT_STEP_PROMPT' ? (
                        <>
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Copied! Now paste this into Antigravity or Copilot Chat</span>
                        </>
                      ) : (
                        <span>📋 Copy Prompt to Paste into AI Chat</span>
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-200">
                      Option B — Full Project Setup (1-Click Folder Save)
                    </div>
                    <button
                      type="button"
                      onClick={handleExportToFolder}
                      disabled={isExportingFolder}
                      className="w-full py-2 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                    >
                      <span>
                        {isExportingFolder
                          ? 'Putting Files Into Your Folder...'
                          : '📁 Put All Files Into My Project Folder'}
                      </span>
                    </button>
                    <p className="text-[11px] text-slate-400">
                      Pick an empty folder on your computer and we will put all the rule files in
                      the right places automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Artifact Dock Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">
                    Live Generated Artifact &amp; File Suite
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(currentArtifact.content, currentArtifactKey)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
                  >
                    {copiedKey === currentArtifactKey ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy File
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile(currentArtifactKey, currentArtifact.content)
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Save current file to disk"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportToFolder}
                    disabled={isExportingFolder}
                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
                    title="Export all generated files directly to a repository folder"
                  >
                    <FolderUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Shareable Spec Report Action Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtifact('FULL_BLUEPRINT_REPORT.md');
                    void handleCopy(
                      artifacts['FULL_BLUEPRINT_REPORT.md'].content,
                      'FULL_BLUEPRINT_REPORT_COPY'
                    );
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Copy the complete single-file Markdown blueprint report to your clipboard"
                >
                  {copiedKey === 'FULL_BLUEPRINT_REPORT_COPY' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Copied Full Spec Report!</span>
                    </>
                  ) : (
                    <span>📋 Copy Full Spec Report</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtifact('FULL_BLUEPRINT_REPORT.md');
                    void handleDownloadFile(
                      'FULL_BLUEPRINT_REPORT.md',
                      artifacts['FULL_BLUEPRINT_REPORT.md'].content
                    );
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Download FULL_BLUEPRINT_REPORT.md as a shareable Markdown file"
                >
                  <span>📄 Export Shareable Spec Report (.md)</span>
                </button>
              </div>

              {/* Collapsible Prompt Readiness Scorecard */}
              {(() => {
                const passedCount = scorecardItems.filter((item) => item.passed).length;
                const totalCount = scorecardItems.length;
                const allPassed = passedCount === totalCount;
                return (
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800/90 overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={showScorecard}
                      aria-controls="prompt-readiness-checklist"
                      onClick={() => setShowScorecard((prev) => !prev)}
                      className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-slate-800/60 transition"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          className={`w-4 h-4 ${
                            allPassed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        />
                        <span>Prompt Readiness Scorecard</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            allPassed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {passedCount}/{totalCount} Ready
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {showScorecard ? 'Hide ▲' : 'Show ▼'}
                      </span>
                    </button>

                    {showScorecard && (
                      <div
                        id="prompt-readiness-checklist"
                        className="px-3 pb-2.5 pt-1 border-t border-slate-800/80 space-y-1.5"
                      >
                        {scorecardItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 text-[11px] py-0.5"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              {item.passed ? (
                                <CheckCircle2
                                  aria-hidden="true"
                                  className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                                />
                              ) : (
                                <AlertTriangle
                                  aria-hidden="true"
                                  className="w-3.5 h-3.5 text-amber-400 shrink-0"
                                />
                              )}
                              <span className="sr-only">
                                {item.passed ? 'Passed: ' : 'Needs attention: '}
                              </span>
                              <span
                                className={`truncate ${
                                  item.passed ? 'text-slate-300' : 'text-amber-200 font-medium'
                                }`}
                              >
                                {item.label}
                              </span>
                            </div>
                            {!item.passed && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (isSimpleMode && item.tab !== 'ideation' && item.tab !== 'guide') {
                                    setViewMode('pro');
                                  } else if (
                                    isIntermediateMode &&
                                    item.tab !== 'ideation' &&
                                    item.tab !== 'prompt5' &&
                                    item.tab !== 'agentsmd' &&
                                    item.tab !== 'sdd'
                                  ) {
                                    setViewMode('pro');
                                  }
                                  setActiveTab(item.tab);
                                  setMobilePane('editor');
                                  setPendingScorecardFocus({
                                    focusId: item.focusId,
                                    token: Date.now()
                                  });
                                }}
                                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-semibold shrink-0 transition"
                              >
                                Fix Now
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* File Selector Pills */}
              <div
                className={`flex flex-wrap items-center gap-1.5 overflow-y-auto pr-1 ${
                  isDockFiltered && isIntermediateMode ? 'max-h-48' : 'max-h-28'
                }`}
              >
                {isDockFiltered && isSimpleMode
                  ? SIMPLE_ESSENTIAL_FILES.map(({ key: fileKey, label }) => {
                      const active = fileKey === currentArtifactKey;
                      return (
                        <button
                          key={fileKey}
                          onClick={() => setSelectedArtifact(fileKey)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 border ${
                            active
                              ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/60 font-semibold'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800/70'
                          }`}
                        >
                          <span>{label}</span>
                        </button>
                      );
                    })
                  : isDockFiltered && isIntermediateMode
                    ? INTERMEDIATE_CORE_FILES.map(({ key: fileKey, label, subtitle }) => {
                        const active = fileKey === currentArtifactKey;
                        return (
                          <button
                            key={fileKey}
                            onClick={() => setSelectedArtifact(fileKey)}
                            title={subtitle}
                            className={`px-2.5 py-1.5 rounded-lg text-left transition flex flex-col gap-0.5 border ${
                              active
                                ? 'bg-indigo-500/25 text-indigo-100 border-indigo-400/60'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800/70'
                            }`}
                          >
                            <span className="text-[11px] font-mono font-semibold">{label}</span>
                            <span className="text-[10px] text-slate-400 leading-tight">
                              {subtitle}
                            </span>
                          </button>
                        );
                      })
                    : Object.entries(artifacts).map(([fileKey, item]) => {
                        const active = fileKey === currentArtifactKey;
                        const tooltip =
                          FILE_USAGE_GUIDE[fileKey]?.whatIsIt || item.title || fileKey;
                        return (
                          <button
                            key={fileKey}
                            onClick={() => setSelectedArtifact(fileKey)}
                            title={tooltip}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition flex items-center gap-1.5 border ${
                              active
                                ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/60 font-semibold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/70'
                            }`}
                          >
                            <span>{fileKey}</span>
                          </button>
                        );
                      })}
                {!isProMode && (
                  <button
                    type="button"
                    onClick={() => setShowAllSimpleFiles((prev) => !prev)}
                    className="px-2 py-1 text-[11px] font-medium text-indigo-300 hover:text-indigo-200 underline underline-offset-2 transition"
                  >
                    {showAllSimpleFiles
                      ? isSimpleMode
                        ? 'Show 3 essential files only'
                        : 'Show 6 core files only'
                      : 'Show all 14 advanced files'}
                  </button>
                )}
              </div>

              {/* Live Prompt Health & AI Memory Bar (Intermediate & Pro Modes) */}
              {!isSimpleMode && (
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div
                      title="Top/Bottom Focus: Top-Priority Rules and Final Instructions are active, and rule files are within safe limits"
                      className="rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-2 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-emerald-300">🟢 Rule Size</span>
                        <span className="text-[10px] text-slate-400">Top/Bottom Focus: Ready</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{diagnostics.ruleSizeMessage}</p>
                    </div>
                    <div
                      title="Prompt size health check for fast, accurate AI responses"
                      className="rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-2 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-cyan-300">🔵 Prompt Length</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {diagnostics.promptLengthMessage}
                      </p>
                    </div>
                    <div
                      title="AI Memory Limits check so the AI never forgets your instructions"
                      className="rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-2 space-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-purple-300">🟣 Memory Safety</span>
                        <span className="text-[10px] text-slate-400">AI Memory Limits: OK</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {diagnostics.memorySafetyMessage}
                      </p>
                    </div>
                  </div>
                  {(diagnostics.isPromptLong ||
                    !diagnostics.isRuleSizeSafe ||
                    !diagnostics.isCopilotSizeSafe) && (
                    <div className="rounded-lg bg-amber-500/15 border border-amber-400/40 px-3 py-2 text-amber-100 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Your prompt is getting a bit long; consider starting a fresh AI chat or
                        trimming extra notes so the AI stays focused.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active File Path Subbar */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-300 truncate">{currentArtifact.title}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase">
                {currentArtifact.badge}
              </span>
            </div>

            {/* Plain-Language "Where Does This File Go?" Banner */}
            {showPlainHelpers && (
              <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-500/30 space-y-1 text-xs">
                <p className="text-indigo-200 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{currentFileGuide.whatIsIt}</span>
                </p>
                <p className="text-emerald-300 text-[11px]">
                  <strong>Where to put it:</strong> {currentFileGuide.whereItGoes}
                </p>
              </div>
            )}

            {/* Code / Markdown Viewer */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-200 select-all">
              <pre className="whitespace-pre-wrap break-words">{currentArtifact.content}</pre>
            </div>

            {/* Quick-Start Operational Checklist Footer */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Tip: Trigger <code>/handoff</code> before 120k tokens to prevent persona drift.
              </span>
              <button
                onClick={() => handleCopy(currentArtifact.content, currentArtifactKey)}
                className="text-indigo-300 hover:underline font-medium"
              >
                Copy {currentArtifactKey}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ====================================================================
          MOBILE BOTTOM BAR (SWITCH BETWEEN INPUTS & LIVE PREVIEW ON PHONES)
         ==================================================================== */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around gap-2">
        <button
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            mobilePane === 'editor'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. Fill Details &amp; Guide</span>
        </button>
        <button
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            mobilePane === 'preview'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>2. Preview &amp; Copy Files</span>
        </button>
      </div>
    </div>
  );
}
~~~~~

### `src/__tests__/pathSecurity.test.ts`

~~~~~ts
import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { resolveSafeChildPath, sanitizeBlueprintId } from '../../electron/pathSecurity';

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return { ...actual, lstatSync: vi.fn(actual.lstatSync) };
});

describe('resolveSafeChildPath', () => {
  const root = '/home/sinnoh/projects/demo-repo';

  it('resolves valid nested relative paths safely inside rootDir', () => {
    expect(resolveSafeChildPath(root, 'AGENTS.md')).toBe(path.join(root, 'AGENTS.md'));
    expect(resolveSafeChildPath(root, '.agents/rules/architecture-boundaries.md')).toBe(
      path.join(root, '.agents', 'rules', 'architecture-boundaries.md')
    );
    expect(resolveSafeChildPath(root, '.github/workflows/copilot-setup-steps.yml')).toBe(
      path.join(root, '.github', 'workflows', 'copilot-setup-steps.yml')
    );
  });

  it('handles mixed and trailing slashes safely', () => {
    expect(resolveSafeChildPath(root, 'foo\\bar/baz')).toBe(path.join(root, 'foo', 'bar', 'baz'));
    expect(resolveSafeChildPath(root, 'foo/bar/')).toBe(path.join(root, 'foo', 'bar'));
  });

  it('handles safe dot-segments and rejects root-equivalent dot path', () => {
    expect(resolveSafeChildPath(root, './AGENTS.md')).toBe(path.join(root, 'AGENTS.md'));
    expect(() => resolveSafeChildPath(root, '.')).toThrow(/Path traversal/);
  });

  it('rejects parent directory traversal attempts', () => {
    expect(() => resolveSafeChildPath(root, '../etc/passwd')).toThrow(/Path traversal/);
    expect(() => resolveSafeChildPath(root, '.agents/../../outside.txt')).toThrow(/Path traversal/);
    expect(() => resolveSafeChildPath(root, '..')).toThrow(/Path traversal/);
  });

  it('rejects absolute paths and null bytes', () => {
    expect(() => resolveSafeChildPath(root, '/etc/passwd')).toThrow(/Absolute paths/);
    expect(() => resolveSafeChildPath(root, 'foo\0bar.md')).toThrow(/null byte/);
    expect(() => resolveSafeChildPath(root, '')).toThrow(/empty/);
  });

  it('rejects trailing dots in path segments', () => {
    expect(() => resolveSafeChildPath(root, 'folder./AGENTS.md')).toThrow(/trailing dots/);
  });

  if (process.platform !== 'win32') {
    it('allows valid POSIX filenames containing colons on non-Windows platforms', () => {
      expect(resolveSafeChildPath(root, '.agents/rules/notes: overview.md')).toBe(
        path.join(root, '.agents', 'rules', 'notes: overview.md')
      );
    });
  }
});

describe('resolveSafeChildPath symlink handling', () => {
  let tmpDir: string;
  let realRoot: string;
  let symRoot: string;
  let outsideDir: string;

  beforeAll(() => {
    tmpDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'pathSecurity-')));
    realRoot = path.join(tmpDir, 'real-root');
    symRoot = path.join(tmpDir, 'sym-root');
    outsideDir = path.join(tmpDir, 'outside');

    fs.mkdirSync(realRoot);
    fs.mkdirSync(outsideDir);
    fs.symlinkSync(realRoot, symRoot);

    const innerDir = path.join(realRoot, 'inner');
    fs.mkdirSync(innerDir);
    fs.symlinkSync(outsideDir, path.join(innerDir, 'escape'));
    fs.writeFileSync(path.join(outsideDir, 'secret.txt'), 'secret', 'utf8');
    fs.symlinkSync(path.join(outsideDir, 'secret.txt'), path.join(realRoot, 'direct-escape.txt'));
    fs.symlinkSync(realRoot, path.join(realRoot, 'self-link'));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('handles root directory that is itself a symlink to another directory', () => {
    const result = resolveSafeChildPath(symRoot, 'inner/file.txt');
    expect(result).toBe(path.join(realRoot, 'inner', 'file.txt'));
  });

  it('rejects deeply nested relative paths where subdirectories or files are symlinks escaping out', () => {
    expect(() => resolveSafeChildPath(symRoot, 'inner/escape/secret.txt')).toThrow(/Path traversal/);
    expect(() => resolveSafeChildPath(symRoot, 'direct-escape.txt')).toThrow(/Path traversal/);
    expect(() => resolveSafeChildPath(symRoot, 'self-link')).toThrow(/Path traversal/);
  });

  it('normalizes windows style backslashes', () => {
    const result = resolveSafeChildPath(symRoot, 'inner\\file.txt');
    expect(result).toBe(path.join(realRoot, 'inner', 'file.txt'));
  });

  it.each(['inside', 'outside'])('rejects dangling symlinks targeting missing paths %s root', (target) => {
    const linkName = `dangling-${target}`;
    const targetDir = target === 'inside' ? realRoot : outsideDir;
    fs.symlinkSync(path.join(targetDir, 'missing'), path.join(realRoot, linkName));

    expect(() => resolveSafeChildPath(symRoot, linkName)).toThrow(/dangling symlink/);
    expect(() => resolveSafeChildPath(symRoot, `${linkName}/file.txt`)).toThrow(/dangling symlink/);
  });

  it('preserves the fallback for genuinely nonexistent nested paths', () => {
    expect(resolveSafeChildPath(symRoot, 'missing/nested/file.txt')).toBe(
      path.join(realRoot, 'missing', 'nested', 'file.txt')
    );
  });

  it('allows existing symlinks whose targets remain inside root', () => {
    fs.symlinkSync(path.join(realRoot, 'inner'), path.join(realRoot, 'safe-link'));
    expect(resolveSafeChildPath(symRoot, 'safe-link/file.txt')).toBe(path.join(realRoot, 'inner', 'file.txt'));
  });

  it('propagates unexpected lstat errors', () => {
    const error = Object.assign(new Error('Permission denied'), { code: 'EACCES' });
    const stat = vi.mocked(fs.lstatSync).mockImplementationOnce(() => {
      throw error;
    });
    try {
      expect(() => resolveSafeChildPath(symRoot, 'missing/file.txt')).toThrow(error);
    } finally {
      stat.mockReset();
    }
  });
});

describe('sanitizeBlueprintId', () => {
  it('normalizes project titles into safe filename slugs', () => {
    expect(sanitizeBlueprintId('My Invoice Approval App!')).toBe('my-invoice-approval-app');
    expect(sanitizeBlueprintId('../../../evil')).toBe('evil');
  });

  it('handles empty/whitespace blueprint titles safely', () => {
    expect(sanitizeBlueprintId('   ')).toMatch(/^blueprint-\d+$/);
    expect(sanitizeBlueprintId('')).toMatch(/^blueprint-\d+$/);
    expect(sanitizeBlueprintId(null as any)).toMatch(/^blueprint-\d+$/);
    expect(sanitizeBlueprintId(undefined as any)).toMatch(/^blueprint-\d+$/);
  });

  it('falls back to timestamped blueprint id if empty after sanitization', () => {
    expect(sanitizeBlueprintId('///')).toMatch(/^blueprint-\d+$/);
  });
});
~~~~~

### `src/__tests__/electronMainSecurity.test.ts`

~~~~~ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('electron', () => {
  const ipcHandlers = new Map<string, Function>();
  class BrowserWindow {
    webContents = {
      setWindowOpenHandler: vi.fn(),
      on: vi.fn()
    };
    on = vi.fn();
    loadFile = vi.fn();
    loadURL = vi.fn();

    constructor() {}
    static getAllWindows() {
      return [];
    }
  }

  return {
    app: {
      isPackaged: true,
      getPath: vi.fn().mockReturnValue('/mock/app/path'),
      getName: vi.fn().mockReturnValue('MockApp'),
      setName: vi.fn(),
      whenReady: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      getAppPath: vi.fn().mockReturnValue('/mock/app')
    },
    ipcMain: {
      handle: vi.fn((channel: string, handler: Function) => {
        ipcHandlers.set(channel, handler);
      }),
      _getHandlers: () => ipcHandlers
    },
    dialog: {
      showSaveDialog: vi.fn(),
      showOpenDialog: vi.fn()
    },
    BrowserWindow,
    shell: {
      openExternal: vi.fn()
    },
    safeStorage: {
      isEncryptionAvailable: vi.fn().mockReturnValue(true),
      encryptString: vi.fn((text: string) => Buffer.from(`enc:${text}`, 'utf8')),
      decryptString: vi.fn((buf: Buffer) => {
        const s = buf.toString('utf8');
        return s.startsWith('enc:') ? s.slice(4) : s;
      })
    }
  };
});

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  openSync: vi.fn(),
  closeSync: vi.fn(),
  renameSync: vi.fn(),
  readFileSync: vi.fn(),
  chmodSync: vi.fn(),
  readdirSync: vi.fn(),
  unlinkSync: vi.fn(),
  realpathSync: vi.fn((p: string) => p),
  lstatSync: vi.fn(),
  readlinkSync: vi.fn()
}));

// Mock os
vi.mock('os', () => ({
  homedir: vi.fn().mockReturnValue('/mock/home'),
  type: vi.fn().mockReturnValue('MockOS'),
  release: vi.fn().mockReturnValue('1.0.0')
}));

process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'development';

import * as fs from 'fs';
import * as path from 'path';
import '../../electron/main';
import { resolveSafeChildPath } from '../../electron/pathSecurity';
import { app, ipcMain, safeStorage } from 'electron';

describe('Electron Main Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (safeStorage.isEncryptionAvailable as any).mockReturnValue(true);
  });

  const mockEvent = {
    senderFrame: {
      url: require('url').pathToFileURL(require('path').resolve(__dirname, '../../dist/index.html')).href
    }
  };

  describe('resolveSafeChildPath guards', () => {
    it('should reject relative paths containing .. traversal', () => {
      expect(() => resolveSafeChildPath('/mock/root', '../outside.txt')).toThrow('Path traversal rejected');
      expect(() => resolveSafeChildPath('/mock/root', 'folder/../../outside.txt')).toThrow('Path traversal rejected');
    });

    it('should reject absolute paths', () => {
      expect(() => resolveSafeChildPath('/mock/root', '/absolute/path.txt')).toThrow('Absolute paths are not permitted');
    });

    it('should reject null bytes', () => {
      expect(() => resolveSafeChildPath('/mock/root', 'file\0.txt')).toThrow('Invalid relative path: null byte');
    });

    it('should resolve safe relative paths', () => {
      const result = resolveSafeChildPath('/mock/root', 'safe/file.txt');
      expect(result).toBe('/mock/root/safe/file.txt');
    });
  });

  describe('dialog:exportWorkspace handler', () => {
    it('should handle empty or malformed payloads safely', async () => {
      const handlers = (ipcMain as any)._getHandlers();
      const handler = handlers.get('dialog:exportWorkspace');
      expect(handler).toBeDefined();

      const emptyFilesResult = await handler(mockEvent, { files: [] });
      expect(emptyFilesResult).toEqual({ canceled: true, error: 'No artifact files provided' });

      const nullPayloadResult = await handler(mockEvent, null);
      expect(nullPayloadResult).toEqual({ canceled: true, error: 'No artifact files provided' });

      const malformedPayloadResult = await handler(mockEvent, { files: 'not an array' });
      expect(malformedPayloadResult).toEqual({ canceled: true, error: 'No artifact files provided' });
    });
  });

  describe('settings atomic file writes', () => {
    let realFs: typeof import('fs');
    let realOs: typeof import('os');
    let directory: string;
    let settingsPath: string;
    const save = (key: string) => (ipcMain as any)._getHandlers().get('settings:setGeminiKey')(mockEvent, key);

    beforeEach(async () => {
      realFs = await vi.importActual<typeof import('fs')>('fs');
      realOs = await vi.importActual<typeof import('os')>('os');
      directory = realFs.mkdtempSync(path.join(realOs.tmpdir(), 'specforge-settings-'));
      settingsPath = path.join(directory, 'settings.json');
      vi.mocked(app.getPath).mockReturnValue(directory);
      (safeStorage.isEncryptionAvailable as any).mockReturnValue(true);
      (safeStorage.encryptString as any).mockImplementation((text: string) => Buffer.from(`enc:${text}`, 'utf8'));
      for (const name of [
        'existsSync',
        'mkdirSync',
        'openSync',
        'closeSync',
        'writeFileSync',
        'renameSync',
        'unlinkSync'
      ] as const) {
        vi.mocked(fs[name]).mockImplementation(realFs[name] as any);
      }
    });

    afterEach(() => {
      vi.mocked(app.getPath).mockReturnValue('/mock/app/path');
      realFs.rmSync(directory, { recursive: true, force: true });
    });

    it('uses distinct temporary paths even when the clock is fixed and stores encrypted key only', () => {
      const clock = vi.spyOn(Date, 'now').mockReturnValue(1234);
      try {
        save('first-key');
        save('second-key');
        const paths = vi.mocked(fs.openSync).mock.calls.map(([file]) => file);
        expect(new Set(paths).size).toBe(2);
        expect(fs.openSync).toHaveBeenCalledWith(expect.any(String), 'wx', 0o600);
        const written = JSON.parse(realFs.readFileSync(settingsPath, 'utf8'));
        expect(written).toEqual({
          geminiKeyEncrypted: Buffer.from('enc:second-key', 'utf8').toString('base64')
        });
        expect(written.geminiKeyPlain).toBeUndefined();
      } finally {
        clock.mockRestore();
      }
    });

    it('preserves an existing temporary file when exclusive creation fails', () => {
      let collisionPath = '';
      vi.mocked(fs.openSync).mockImplementationOnce((file, flags, mode) => {
        collisionPath = String(file);
        realFs.writeFileSync(file, 'other writer');
        return realFs.openSync(file, flags, mode);
      });
      realFs.writeFileSync(settingsPath, 'original settings');
      expect(() => save('new-key')).toThrow();
      expect(realFs.readFileSync(collisionPath, 'utf8')).toBe('other writer');
      expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('original settings');
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it.each(['writeFileSync', 'renameSync'] as const)(
      'cleans up its own file after %s fails',
      (operation) => {
        realFs.writeFileSync(settingsPath, 'original settings');
        vi.mocked(fs[operation]).mockImplementationOnce(() => {
          throw new Error('injected failure');
        });
        expect(() => save('new-key')).toThrow('injected failure');
        expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('original settings');
        expect(realFs.readdirSync(directory)).toEqual(['settings.json']);
        expect(fs.closeSync).toHaveBeenCalledTimes(1);
        expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
      }
    );

    if (process.platform !== 'win32') {
      it('clears settings with private permissions before atomic replacement under a permissive umask', () => {
        realFs.writeFileSync(settingsPath, 'original settings', { mode: 0o644 });
        const previousUmask = process.umask(0);
        vi.mocked(fs.renameSync).mockImplementationOnce((source, destination) => {
          expect(realFs.statSync(source).mode & 0o777).toBe(0o600);
          expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('original settings');
          realFs.renameSync(source, destination);
        });
        try {
          save('');
          expect(realFs.readFileSync(settingsPath, 'utf8')).toBe('{}');
          expect(realFs.statSync(settingsPath).mode & 0o777).toBe(0o600);
        } finally {
          process.umask(previousUmask);
        }
      });
    }
  });

  describe('settings:setGeminiKey and settings:getGeminiKey handlers', () => {
    it('should handle malformed payloads safely', async () => {
      const handlers = (ipcMain as any)._getHandlers();
      const handler = handlers.get('settings:setGeminiKey');
      expect(handler).toBeDefined();

      await expect(() => handler(mockEvent, null)).toThrow('API key must be a string');
      await expect(() => handler(mockEvent, 123)).toThrow('API key must be a string');
      await expect(() => handler(mockEvent, {})).toThrow('API key must be a string');
    });

    it('refuses unencrypted plaintext disk persistence when safeStorage encryption is unavailable and keeps key in memory only', async () => {
      const prevEnvKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const handlers = (ipcMain as any)._getHandlers();
        const setHandler = handlers.get('settings:setGeminiKey');
        const getHandler = handlers.get('settings:getGeminiKey');

        (safeStorage.isEncryptionAvailable as any).mockReturnValue(false);
        (fs.existsSync as any).mockReturnValue(false);

        const result = await setHandler(mockEvent, 'AIzaSySecretKey1234');
        expect(result.hasKey).toBe(true);
        expect(result.source).toBe('memory');
        expect(result.maskedKey).toBe('AIza••••1234');
        expect(result.warning).toMatch(/OS keychain encryption is unavailable/i);

        // Must NOT write any plaintext API key to settings.json
        expect(fs.openSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalled();

        // Reading key within the same process returns the in-memory session key
        const current = await getHandler(mockEvent);
        expect(current).toEqual({
          hasKey: true,
          source: 'memory',
          maskedKey: 'AIza••••1234'
        });

        // Clearing resets in-memory key cleanly
        const cleared = await setHandler(mockEvent, '');
        expect(cleared).toEqual({
          hasKey: false,
          source: 'none',
          maskedKey: undefined
        });
      } finally {
        if (prevEnvKey !== undefined) {
          process.env.GEMINI_API_KEY = prevEnvKey;
        }
        warnSpy.mockRestore();
      }
    });
  });
});
~~~~~

### `src/__tests__/accessibilityContracts.test.tsx`

~~~~~tsx
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import SpecForgeStudio from '../SpecForgeStudio';

// Setup mock desktopAPI to prevent errors during rendering
function createMockDesktopAPI() {
  return {
    getPlatform: vi.fn().mockResolvedValue('darwin'),
    getSettings: vi.fn().mockResolvedValue({ theme: 'system', geminiApiKey: '' }),
    setGeminiApiKey: vi.fn().mockResolvedValue(undefined),
    listBlueprints: vi.fn().mockResolvedValue([]),
    saveBlueprint: vi.fn().mockResolvedValue(undefined),
    deleteBlueprint: vi.fn().mockResolvedValue(undefined),
    exportWorkspaceDialog: vi.fn().mockResolvedValue({ success: true, folderPath: '/mock/path' }),
    generateGeminiStructured: vi.fn().mockResolvedValue({ artifacts: {} }),
    openExternalUrl: vi.fn().mockResolvedValue(undefined),
    getAppInfo: vi.fn().mockResolvedValue({ version: '1.0.0', name: 'SpecForge' }),
    getGeminiSettings: vi.fn().mockResolvedValue({ geminiApiKey: '' })
  };
}

describe('Accessibility Contracts', () => {
  let mockApi: ReturnType<typeof createMockDesktopAPI>;

  beforeEach(() => {
    localStorage.clear();
    mockApi = createMockDesktopAPI();
    // @ts-ignore
    window.desktopAPI = mockApi;
  });

  it('verifies that 3-way view mode selector buttons toggle aria-pressed', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const simpleBtn = viewSelector.getByRole('button', { name: 'Simple' });
    const intermediateBtn = viewSelector.getByRole('button', { name: 'Intermediate' });
    const proBtn = viewSelector.getByRole('button', { name: 'Pro' });

    // Initial state: Simple mode should be active by default
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');

    // Click Intermediate
    fireEvent.click(intermediateBtn);
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('true');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');

    // Click Pro
    fireEvent.click(proBtn);
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('true');

    // Click Simple again
    fireEvent.click(simpleBtn);
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('verifies Simple Mode platform, AI tool, and execution style pickers maintain accurate aria-pressed attributes', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Pickers are rendered in Simple Mode, which is the default.

    // Platform Picker Test
    // Default is "Web App"
    const webBtn = screen.getByRole('button', { name: /Website \/ Web App/i });
    const phoneBtn = screen.getByRole('button', { name: /Phone App/i });
    expect(webBtn.getAttribute('aria-pressed')).toBe('true');
    expect(phoneBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(phoneBtn);
    expect(webBtn.getAttribute('aria-pressed')).toBe('false');
    expect(phoneBtn.getAttribute('aria-pressed')).toBe('true');

    // AI Tool Picker Test
    // Default is Antigravity
    const antigravityBtn = screen.getByRole('button', { name: /Antigravity/i });
    const julesBtn = screen.getByRole('button', { name: /Google Jules/i });
    expect(antigravityBtn.getAttribute('aria-pressed')).toBe('true');
    expect(julesBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(julesBtn);
    expect(antigravityBtn.getAttribute('aria-pressed')).toBe('false');
    expect(julesBtn.getAttribute('aria-pressed')).toBe('true');

    // Execution Style Picker Test
    // Default is HITL
    const hitlBtn = screen.getByRole('button', { name: /Step-by-Step with Me Watching/i });
    const afkBtn = screen.getByRole('button', { name: /Build It Automatically in the Background/i });
    expect(hitlBtn.getAttribute('aria-pressed')).toBe('true');
    expect(afkBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(afkBtn);
    expect(hitlBtn.getAttribute('aria-pressed')).toBe('false');
    expect(afkBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('verifies that primary inputs (#plain-idea-input, #user-persona-input) are accessible via their associated labels', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // plainIdea input check
    // The label is: What should your app do?
    const ideaInput = screen.getByLabelText(/What should your app do\?/i);
    expect(ideaInput.id).toBe('plain-idea-input');
    expect(ideaInput.tagName.toLowerCase()).toBe('textarea');

    // userPersona input check
    // The label is: Who will use this app?
    const personaInput = screen.getByLabelText(/Who will use this app\?/i);
    expect(personaInput.id).toBe('user-persona-input');
    expect(personaInput.tagName.toLowerCase()).toBe('input');
  });

  it('verifies Blueprints modal traps focus, applies ARIA semantics, and closes on Escape', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const openButton = screen.getByRole('button', { name: /Blueprints \(/i });
    openButton.focus();
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog', { name: /Local Desktop Blueprints/i });
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Local Desktop Blueprints/i })).toBeNull();
    });

    expect(document.activeElement).toBe(openButton);
  });

  it('verifies AI Settings modal traps focus, applies ARIA semantics, and closes on Escape', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const openButton = screen.getByRole('button', { name: /AI Key/i });
    openButton.focus();
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog', { name: /Desktop AI Settings/i });
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Desktop AI Settings/i })).toBeNull();
    });

    expect(document.activeElement).toBe(openButton);
  });

  it.each([
    [/Blueprints \(/i, /Local Desktop Blueprints/i, 'e.g., work-2026'],
    [/AI Key/i, /Desktop AI Settings/i, 'AIza...']
  ])(
    'keeps focus during edits and dismisses only on direct backdrop press (%s)',
    async (buttonName, dialogName, placeholder) => {
      render(<SpecForgeStudio />);
      await waitFor(() => expect(mockApi.listBlueprints).toHaveBeenCalled());

      const openButton = screen.getByRole('button', { name: buttonName });
      openButton.focus();
      fireEvent.click(openButton);
      const dialog = screen.getByRole('dialog', { name: dialogName });
      const input = within(dialog).getByPlaceholderText(placeholder);
      input.focus();
      fireEvent.change(input, { target: { value: 'test edit' } });
      expect(document.activeElement).toBe(input);

      // A press inside followed by a release/click on the backdrop must stay open.
      const backdrop = dialog.parentElement!;
      fireEvent.mouseDown(input);
      fireEvent.mouseUp(backdrop);
      fireEvent.click(backdrop);
      expect(screen.getByRole('dialog', { name: dialogName })).toBe(dialog);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog', { name: dialogName })).toBeNull();
      expect(document.activeElement).toBe(openButton);

      fireEvent.click(openButton);
      fireEvent.mouseDown(screen.getByRole('dialog', { name: dialogName }).parentElement!);
      expect(screen.queryByRole('dialog', { name: dialogName })).toBeNull();
      expect(document.activeElement).toBe(openButton);
    }
  );
});
~~~~~

### `src/__tests__/artifactIntegrity.test.tsx`

~~~~~tsx
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import SpecForgeStudio from '../SpecForgeStudio';
import type { DesktopAPI } from '../types/desktop';

function createMockDesktopAPI(): DesktopAPI {
  return {
    isDesktop: true,
    getAppInfo: vi.fn().mockResolvedValue({
      name: 'SpecForge Studio',
      version: '1.0.0',
      platform: 'linux',
      arch: 'x64',
      osRelease: 'Linux 6.8.0',
      userDataDir: '/home/test/.config/SpecForge Studio',
      blueprintsDir: '/home/test/.config/SpecForge Studio/blueprints'
    }),
    copyToClipboard: vi.fn().mockResolvedValue(true),
    saveFileDialog: vi.fn().mockResolvedValue({
      canceled: false,
      filePath: '/tmp/test.md'
    }),
    exportWorkspaceDialog: vi.fn().mockResolvedValue({
      canceled: false,
      basePath: '/tmp/export'
    }),
    listBlueprints: vi.fn().mockResolvedValue([]),
    saveBlueprint: vi.fn().mockResolvedValue({ id: '1', title: 'test', updatedAt: 1, formState: '{}' }),
    deleteBlueprint: vi.fn().mockResolvedValue(true),
    exportBlueprintFile: vi.fn().mockResolvedValue({ canceled: false }),
    importBlueprintFile: vi.fn().mockResolvedValue({ canceled: false }),
    getGeminiSettings: vi.fn().mockResolvedValue({ hasKey: false, source: 'none' }),
    setGeminiApiKey: vi.fn().mockResolvedValue({ hasKey: true, source: 'stored', maskedKey: 'AIza...' }),
    generateGeminiStructured: vi.fn().mockResolvedValue({}),
    openExternalUrl: vi.fn().mockResolvedValue(true),
  };
}

describe('Artifact Integrity Test', () => {
  let mockApi: DesktopAPI;

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = createMockDesktopAPI();
    window.desktopAPI = mockApi;
    localStorage.clear();
  });

  it('validates structural integrity of all 15 generated output files in Pro mode', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const proBtn = viewSelector.getByRole('button', { name: 'Pro' });
    fireEvent.click(proBtn);
    expect(proBtn.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /Export to Repo/i }));
    await waitFor(() => {
      expect(mockApi.exportWorkspaceDialog).toHaveBeenCalledTimes(1);
    });

    const payload = (mockApi.exportWorkspaceDialog as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const files = payload.files;

    // 1. Verify all 15 expected files and their exact relative paths
    expect(files).toHaveLength(15);
    expect(files.map((f: any) => f.relativePath)).toEqual(
      expect.arrayContaining([
        'FULL_BLUEPRINT_REPORT.md',
        'bootstrap-agy.sh',
        'TASK_PROMPT.md',
        'AGENTS.md',
        'apps/mobile/AGENTS.md',
        '.agents/rules/architecture-boundaries.md',
        '.agents/skills/verify-vertical-slice/SKILL.md',
        '.github/copilot-instructions.md',
        '.github/instructions/domain-boundaries.instructions.md',
        '.github/agents/implementation-planner.agent.md',
        '.github/workflows/copilot-setup-steps.yml',
        'jules-setup.sh',
        '.specify/memory/constitution.md',
        'specs/001-feature/spec.md',
        'specs/001-feature/tasks.md'
      ])
    );

    // Verify non-empty content
    for (const file of files) {
      expect(file.content.trim().length).toBeGreaterThan(0);
    }

    // 2. Verify bootstrap-agy.sh
    const bootstrapAgy = files.find((f: any) => f.relativePath === 'bootstrap-agy.sh');
    expect(bootstrapAgy).toBeDefined();
    expect(bootstrapAgy.content).toMatch(/mkdir -p/);

    // Count opening heredocs with EOF and closing EOFs
    const openingEOF = (bootstrapAgy.content.match(/<<\s*['"]?EOF[^'"]*['"]?/g) || []).length;
    const closingEOF = (bootstrapAgy.content.match(/^EOF_.*$/gm) || []).length;

    expect(openingEOF).toBeGreaterThan(0);
    expect(openingEOF).toEqual(closingEOF);

    // 3. Verify Antigravity rule & AGENTS.md size limits (< 24,000 bytes)
    const agyRuleFile = files.find((f: any) =>
      f.relativePath.startsWith('.agents/rules/') && f.relativePath.endsWith('.md')
    );
    expect(agyRuleFile).toBeDefined();
    const agyRuleBytes = new Blob([agyRuleFile.content]).size;
    expect(agyRuleBytes).toBeLessThan(24000);

    const agentsMd = files.find((f: any) => f.relativePath === 'AGENTS.md');
    expect(agentsMd).toBeDefined();
    const agentsMdBytes = new Blob([agentsMd.content]).size;
    expect(agentsMdBytes).toBeLessThan(24000);
  });
});
~~~~~

### `src/__tests__/SpecForgeStudio.test.tsx`

~~~~~tsx
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Lexer } from 'marked';
import SpecForgeStudio from '../SpecForgeStudio';
import type { DesktopAPI } from '../types/desktop';

function createMockDesktopAPI(): DesktopAPI {
  return {
    isDesktop: true,
    getAppInfo: vi.fn().mockResolvedValue({
      name: 'SpecForge Studio',
      version: '1.0.0',
      platform: 'linux',
      arch: 'x64',
      osRelease: 'Linux 6.8.0',
      userDataDir: '/home/test/.config/SpecForge Studio',
      blueprintsDir: '/home/test/.config/SpecForge Studio/blueprints'
    }),
    copyToClipboard: vi.fn().mockResolvedValue(true),
    saveFileDialog: vi.fn().mockResolvedValue({
      canceled: false,
      filePath: '/home/test/TASK_PROMPT.md'
    }),
    exportWorkspaceDialog: vi.fn().mockResolvedValue({
      canceled: false,
      targetDir: '/home/test/my-repo',
      writtenCount: 15,
      writtenFiles: ['AGENTS.md', 'TASK_PROMPT.md', 'FULL_BLUEPRINT_REPORT.md']
    }),
    listBlueprints: vi.fn().mockResolvedValue([]),
    saveBlueprint: vi.fn().mockImplementation(async (bp) => ({
      id: bp.id || 'my-app',
      title: bp.title,
      tag: bp.tag || '',
      updatedAt: Date.now(),
      formState: bp.formState
    })),
    deleteBlueprint: vi.fn().mockResolvedValue(true),
    exportBlueprintFile: vi.fn().mockResolvedValue({ canceled: true }),
    importBlueprintFile: vi.fn().mockResolvedValue({ canceled: true }),
    getGeminiSettings: vi.fn().mockResolvedValue({ hasKey: false, source: 'none' }),
    setGeminiApiKey: vi.fn().mockResolvedValue({
      hasKey: true,
      source: 'stored',
      maskedKey: 'AIza••••1234'
    }),
    generateGeminiStructured: vi.fn().mockResolvedValue({}),
    openExternalUrl: vi.fn().mockResolvedValue(true)
  };
}

describe('SpecForgeStudio Desktop UI', () => {
  let mockApi: DesktopAPI;

  beforeEach(() => {
    localStorage.clear();
    mockApi = createMockDesktopAPI();
    window.desktopAPI = mockApi;
  });

  it('renders Ubuntu Desktop header, navigation tabs, and live artifact dock', async () => {
    render(<SpecForgeStudio />);
    expect(screen.getByText('SpecForge Studio')).toBeTruthy();
    expect(screen.getByText('Ubuntu Desktop')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Export to Repo/i })).toBeTruthy();

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });
  });

  it('exports all 15 generated files in Simple Mode via desktopAPI.exportWorkspaceDialog', async () => {
    render(<SpecForgeStudio />);
    const exportBtn = screen.getByRole('button', { name: /Export to Repo/i });
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(mockApi.exportWorkspaceDialog).toHaveBeenCalledTimes(1);
    });
    const callArg = (mockApi.exportWorkspaceDialog as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArg.files).toHaveLength(15);
    expect(
      callArg.files.some(
        (f: { relativePath: string }) => f.relativePath === 'FULL_BLUEPRINT_REPORT.md'
      )
    ).toBe(true);
    expect(callArg.files.some((f: { relativePath: string }) => f.relativePath === 'AGENTS.md')).toBe(
      true
    );
    expect(
      callArg.files.some((f: { relativePath: string }) => f.relativePath === 'TASK_PROMPT.md')
    ).toBe(true);
    expect(
      callArg.files.some(
        (f: { relativePath: string }) => f.relativePath === '.specify/memory/constitution.md'
      )
    ).toBe(true);
  });

  it('defaults to Simple Mode with 2 tabs and 3 dock pills, then reveals all 6 tabs and diagnostics in Pro Mode', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const simpleBtn = viewSelector.getByRole('button', { name: 'Simple' });
    const intermediateBtn = viewSelector.getByRole('button', { name: 'Intermediate' });
    const proBtn = viewSelector.getByRole('button', { name: 'Pro' });

    // Header 3-way selector & simplified navigation tabs
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('false');
    expect(proBtn.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /1\. Describe Your App/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /2\. How to Use Your Files/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /2\. Task Prompt Builder/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /5\. Spec & Task Slices/i })).toBeNull();
    expect(
      screen.getByRole('button', {
        name: /Switch to Pro Mode to edit 5-Section Prompts, AGENTS\.md & EARS Specs/i
      })
    ).toBeTruthy();

    // Decluttered right-hand dock in Simple Mode
    expect(screen.getByRole('button', { name: /📋 1\. Copy-Paste AI Prompt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /🤖 2\. Project Rules \(AGENTS\.md\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /⚡ 3\. 1-Click Auto-Setup/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();
    expect(screen.queryByText(/Top\/Bottom Focus:/i)).toBeNull();
    expect(screen.queryByText(/AI Memory Limits:/i)).toBeNull();

    // Expand all 14 files temporarily inside Simple Mode
    fireEvent.click(screen.getByRole('button', { name: /Show all 14 advanced files/i }));
    expect(screen.getByRole('button', { name: '.github/copilot-instructions.md' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Show 3 essential files only/i }));
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();

    // Switch to Pro Mode via 3-way selector
    fireEvent.click(proBtn);
    expect(proBtn.getAttribute('aria-pressed')).toBe('true');
    expect(simpleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /2\. Task Prompt Builder \(5 Sections\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /3\. AGENTS\.md \(Project Rules\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /4\. Copilot, Antigravity & Jules Files/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /5\. Spec & Task Slices/i })).toBeTruthy();
    expect(screen.getByText(/Top\/Bottom Focus:/i)).toBeTruthy();
    expect(screen.getByText(/AI Memory Limits:/i)).toBeTruthy();

    // Verify renamed professional headings across Pro tabs
    fireEvent.click(screen.getByRole('button', { name: /2\. Task Prompt Builder \(5 Sections\)/i }));
    expect(
      screen.getByText(/Top-Priority Rules \(AI Attention Top Section\)/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Final Instructions \(AI Attention Bottom Section\)/i)
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /5\. Spec & Task Slices/i }));
    expect(
      screen.getByText(/Step-by-Step Goal Checks \(When\/Then Rules\)/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Step-by-Step Task Breakdown \(Full Features, Not Horizontal Layers\)/i)
    ).toBeTruthy();
  });

  it('supports Intermediate Mode with 4 tabs, jargon translation cards, and 6 core dock files while exporting all 14 files', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    const intermediateBtn = viewSelector.getByRole('button', { name: 'Intermediate' });
    fireEvent.click(intermediateBtn);
    expect(intermediateBtn.getAttribute('aria-pressed')).toBe('true');

    // Intermediate Mode shows 4 essential tabs and hides Guide & Platform Files tabs
    expect(screen.getByRole('button', { name: /1\. Idea & AI Setup/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /2\. Custom AI Prompt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /3\. Project Rules/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /4\. Feature Checklist/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /4\. Copilot, Antigravity & Jules Files/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /0\. How to Use/i })).toBeNull();

    // Right-Hand Artifact Dock shows 6 core files with subtitles (and hides extra files unless expanded)
    expect(screen.getByRole('button', { name: /TASK_PROMPT\.md Your main AI task prompt/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /AGENTS\.md Permanent project rules/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /spec\.md Feature requirements \(EARS\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /tasks\.md Step-by-step feature slices/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /constitution\.md Core non-negotiable laws/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /bootstrap-agy\.sh 1-click Antigravity setup/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '.github/copilot-instructions.md' })).toBeNull();

    // Navigate to Custom AI Prompt & verify JargonTranslationCard explanations
    fireEvent.click(screen.getByRole('button', { name: /2\. Custom AI Prompt/i }));
    expect(screen.getByText(/Plain-English Guide: Primacy Anchor/i)).toBeTruthy();
    expect(screen.getByText(/Plain-English Guide: State Invariants & TurboModules/i)).toBeTruthy();
    expect(screen.getByText(/Plain-English Guide: Recency Anchor/i)).toBeTruthy();

    // Navigate to Feature Checklist & verify EARS + Vertical Slices jargon cards
    fireEvent.click(screen.getByRole('button', { name: /4\. Feature Checklist/i }));
    expect(screen.getByText(/Plain-English Guide: EARS Notation/i)).toBeTruthy();
    expect(screen.getByText(/Plain-English Guide: Vertical Slices/i)).toBeTruthy();

    // Export to Repo still exports all 15 generated files
    fireEvent.click(screen.getByRole('button', { name: /Export to Repo/i }));
    await waitFor(() => {
      expect(mockApi.exportWorkspaceDialog).toHaveBeenCalledTimes(1);
    });
    const payload = (mockApi.exportWorkspaceDialog as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(payload.files).toHaveLength(15);
  });

  it('translates Intermediate Mode plain-English rule checkboxes and simplified task slicer into technical artifacts', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const viewSelector = within(screen.getByRole('group', { name: /Workspace View Mode/i }));
    fireEvent.click(viewSelector.getByRole('button', { name: 'Intermediate' }));

    // Custom AI Prompt: Plain-English Rule Builder replaces raw textareas
    fireEvent.click(screen.getByRole('button', { name: /2\. Custom AI Prompt/i }));
    expect(
      screen.queryByLabelText(/State Placement & Architectural Boundary Rules/i)
    ).toBeNull();

    fireEvent.click(
      screen.getByLabelText(/Keep data fetching separate from visual design/i)
    );
    fireEvent.click(
      screen.getByLabelText(/Require automated tests to pass before finishing tasks/i)
    );
    fireEvent.click(
      screen.getByLabelText(/Prevent file path hacks or security holes/i)
    );

    const promptPreview = document.querySelector('pre');
    expect(promptPreview?.textContent).toContain('Separate server data fetching from client UI rendering');
    expect(promptPreview?.textContent).toContain('Gate every task completion on passing typecheck');
    expect(promptPreview?.textContent).toContain('Enforce strict path canonicalization');

    // Feature Checklist: Simplified Task Slicer updates title, HITL/AFK mode, and auto-generated layers
    fireEvent.click(screen.getByRole('button', { name: /4\. Feature Checklist/i }));
    const firstTitleInput = screen.getByLabelText('Task 1 title');
    fireEvent.change(firstTitleInput, { target: { value: 'Auth Token Verification Slice' } });

    const hitlCheckboxes = screen.getAllByLabelText(/Needs human review \(\[HITL\]\)/i);
    // Toggle first slice mode
    const initialChecked = (hitlCheckboxes[0] as HTMLInputElement).checked;
    fireEvent.click(hitlCheckboxes[0]);

    // Preview tasks.md to verify output updates with title, mode tag, and auto-generated layers
    fireEvent.click(screen.getByRole('button', { name: /tasks\.md Step-by-step feature slices/i }));
    const tasksPreview = document.querySelector('pre');
    expect(tasksPreview?.textContent).toContain('Auth Token Verification Slice');
    expect(tasksPreview?.textContent).toContain('Auth Schema + Domain Service');
    expect(tasksPreview?.textContent).toContain(initialChecked ? '[AFK]' : '[HITL]');
  });

  it('uses Offline Smart Templates when clicking Turn My Idea Into AI Instructions without an API key', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Visual pickers are rendered in Simple Mode
    expect(screen.getByRole('button', { name: /Phone App/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Google Jules/i })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Build It Automatically in the Background/i })
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', { name: /Runs on Ubuntu, Windows, or Mac desktop/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /Google Jules/i }));

    const ideaBox = screen.getByLabelText(/What should your app do\?/i);
    fireEvent.change(ideaBox, {
      target: { value: 'Build a personal habit streak tracker with daily reminders' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Step 1: Turn My Idea Into AI Instructions/i })
    );

    expect(
      screen.getByText(/Built your custom AI instructions using Offline Smart Templates!/i)
    ).toBeTruthy();
    expect(mockApi.generateGeminiStructured).not.toHaveBeenCalled();

    // TASK_PROMPT.md live preview should now include the user's plain-English idea
    const promptPreview = document.querySelector('pre');
    expect(promptPreview?.textContent).toContain(
      'Build a personal habit streak tracker with daily reminders'
    );
  });

  it('expands input text via ✨ Auto-Expand Options, highlights newly added lines, and clears highlight on Accept All', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const ideaBox = screen.getByLabelText(/What should your app do\?/i) as HTMLTextAreaElement;
    fireEvent.change(ideaBox, {
      target: { value: 'Build a personal budget planner' }
    });

    const expandBtn = screen.getByRole('button', { name: /✨ Auto-Expand Options/i });
    fireEvent.click(expandBtn);

    await waitFor(() => {
      expect(screen.getByTestId('expanded-highlight-plainIdea')).toBeTruthy();
    });

    expect(ideaBox.value).toContain('Build a personal budget planner');
    expect(ideaBox.value).toContain('Provide clear loading, empty, and error feedback states');
    expect(screen.getByText(/Newly Expanded Options/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Accept All/i }));
    expect(screen.queryByTestId('expanded-highlight-plainIdea')).toBeNull();
    // Expanded text remains locked in the textarea
    expect(ideaBox.value).toContain('Provide clear loading, empty, and error feedback states');
  });

  it('auto-fills individual prompt & SDD sections with soft amber highlight review and displays plain-English hover tooltips', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const ideaBox = screen.getByLabelText(/What should your app do\?/i) as HTMLTextAreaElement;
    fireEvent.change(ideaBox, {
      target: { value: 'Build an encrypted medical appointment scheduler for clinics' }
    });

    // Switch to Pro mode and open the Task Prompt Builder tab
    fireEvent.click(screen.getByRole('button', { name: /^Pro$/i }));
    fireEvent.click(screen.getByRole('button', { name: /2\. Task Prompt Builder/i }));

    // Verify helpful hover tooltip is present on Section 1 heading
    expect(
      screen.getByTitle(
        /Putting your most important instructions at the top of the prompt where AI reads them best\./i
      )
    ).toBeTruthy();

    // Click ✨ Auto-Fill Section on Section 1 (role_objective)
    const section1Btn = screen.getByTestId('autofill-section-btn-role_objective');
    fireEvent.click(section1Btn);

    await waitFor(() => {
      expect(screen.getByTestId('section-autofill-highlight-role_objective')).toBeTruthy();
    });

    const highlightBox = screen.getByTestId('section-autofill-highlight-role_objective');
    expect(highlightBox.textContent).toContain(
      'Architect and ship: Build an encrypted medical appointment scheduler for clinics'
    );

    // Dismiss highlight via Accept All
    fireEvent.click(screen.getByRole('button', { name: /Accept All/i }));
    expect(screen.queryByTestId('section-autofill-highlight-role_objective')).toBeNull();
  });

  it('opens AI Settings modal and saves Gemini API key via desktopAPI', async () => {
    render(<SpecForgeStudio />);
    fireEvent.click(screen.getByTitle(/Configure optional Gemini API key/i));
    const input = screen.getByPlaceholderText('AIza...');
    fireEvent.change(input, { target: { value: 'AIzaTestKey1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Save API Key/i }));

    await waitFor(() => {
      expect(mockApi.setGeminiApiKey).toHaveBeenCalledWith('AIzaTestKey1234');
    });
  });

  it('saves, loads, resets, and deletes project presets via localStorage (specforge_saved_presets_v1)', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Change plainIdea to a custom value
    const ideaTextarea = screen.getByLabelText(/What should your app do\?/i) as HTMLTextAreaElement;
    fireEvent.change(ideaTextarea, {
      target: { value: 'Custom Fintech Ledger Idea for Preset Test' }
    });
    expect(ideaTextarea.value).toBe('Custom Fintech Ledger Idea for Preset Test');

    // Open Saved Projects modal
    const savedProjectsBtn = screen.getByRole('button', { name: /📂 Saved Projects \(0\)/i });
    fireEvent.click(savedProjectsBtn);

    expect(screen.getByText('Saved Project Presets')).toBeTruthy();

    // Save Current as Preset
    const presetNameInput = screen.getByLabelText('Preset Name');
    fireEvent.change(presetNameInput, { target: { value: 'Fintech Preset Alpha' } });

    const savePresetBtn = screen.getByRole('button', { name: /Save Current as Preset/i });
    fireEvent.click(savePresetBtn);

    // Verify localStorage updated
    const rawSaved = localStorage.getItem('specforge_saved_presets_v1');
    expect(rawSaved).toBeTruthy();
    const parsedSaved = JSON.parse(rawSaved!);
    expect(parsedSaved).toHaveLength(1);
    expect(parsedSaved[0].name).toBe('Fintech Preset Alpha');
    expect(parsedSaved[0].formState.plainIdea).toBe('Custom Fintech Ledger Idea for Preset Test');

    // Reset to Default
    const resetBtn = screen.getByRole('button', { name: /Reset to Default/i });
    fireEvent.click(resetBtn);

    // Verify plainIdea was reset to the default value
    expect(ideaTextarea.value).not.toBe('Custom Fintech Ledger Idea for Preset Test');
    expect(ideaTextarea.value).toContain('team invoice approval workflow');

    // Re-open Saved Projects modal and Load the saved preset
    fireEvent.click(screen.getByRole('button', { name: /📂 Saved Projects \(1\)/i }));
    const loadPresetBtn = screen.getByRole('button', { name: /Load preset Fintech Preset Alpha/i });
    fireEvent.click(loadPresetBtn);

    // Verify custom plainIdea is restored
    expect(ideaTextarea.value).toBe('Custom Fintech Ledger Idea for Preset Test');

    // Re-open Saved Projects modal and Delete the preset
    fireEvent.click(screen.getByRole('button', { name: /📂 Saved Projects \(1\)/i }));
    const deletePresetBtn = screen.getByRole('button', {
      name: /Delete preset Fintech Preset Alpha/i
    });
    fireEvent.click(deletePresetBtn);

    expect(JSON.parse(localStorage.getItem('specforge_saved_presets_v1')!)).toHaveLength(0);
    expect(screen.getByText(/No project presets saved yet/i)).toBeTruthy();
  });


  it('handles duplicate preset names and invalid JSON in localStorage gracefully', async () => {
    // 1. Invalid JSON
    localStorage.setItem('specforge_saved_presets_v1', '{ invalid json');
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Should still open with 0 saved presets since invalid JSON is caught
    const savedProjectsBtn = screen.getByRole('button', { name: /📂 Saved Projects \(0\)/i });
    expect(savedProjectsBtn).toBeTruthy();

    // 2. Duplicate preset names
    fireEvent.click(savedProjectsBtn);

    const presetNameInput = screen.getByLabelText('Preset Name');
    fireEvent.change(presetNameInput, { target: { value: 'Duplicate Name' } });

    const savePresetBtn = screen.getByRole('button', { name: /Save Current as Preset/i });
    fireEvent.click(savePresetBtn);

    // The previous click saves the preset, but also clears the input field.
    // So we need to type 'Duplicate Name' again
    fireEvent.change(presetNameInput, { target: { value: 'Duplicate Name' } });

    // Save another one with the same name
    fireEvent.click(savePresetBtn);

    const rawSaved = localStorage.getItem('specforge_saved_presets_v1');
    expect(rawSaved).toBeTruthy();
    const parsedSaved = JSON.parse(rawSaved!);

    expect(parsedSaved).toHaveLength(2);
    expect(parsedSaved[0].name).toBe('Duplicate Name');
    expect(parsedSaved[1].name).toBe('Duplicate Name');
    expect(parsedSaved[0].id).not.toBe(parsedSaved[1].id);
  });

  it('rejects malformed saved presets with invalid array item schemas on startup', async () => {
    localStorage.setItem(
      'specforge_saved_presets_v1',
      JSON.stringify([
        {
          id: 'bad-preset-1',
          name: 'Corrupted EARS Preset',
          projectTitle: 'Corrupted',
          updatedAt: Date.now(),
          formState: {
            earsSpecs: ['not-an-object-item']
          }
        }
      ])
    );

    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    expect(screen.getByRole('button', { name: /📂 Saved Projects \(0\)/i })).toBeTruthy();
  });

  it('generates, copies, and exports a valid Markdown Shareable Spec Report (FULL_BLUEPRINT_REPORT.md)', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const copyReportBtn = screen.getByRole('button', { name: /📋 Copy Full Spec Report/i });
    const exportReportBtn = screen.getByRole('button', {
      name: /📄 Export Shareable Spec Report \(\.md\)/i
    });
    expect(copyReportBtn).toBeTruthy();
    expect(exportReportBtn).toBeTruthy();

    fireEvent.click(copyReportBtn);

    await waitFor(() => {
      expect(mockApi.copyToClipboard).toHaveBeenCalledTimes(1);
    });

    const copiedMarkdown = (mockApi.copyToClipboard as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(typeof copiedMarkdown).toBe('string');
    expect(copiedMarkdown).toContain('Full Architectural & SDD Specification Report');
    expect(copiedMarkdown).toContain('## 📋 1. Project Overview & Target Stack');
    expect(copiedMarkdown).toContain('- **Target Surface**: `web`');
    expect(copiedMarkdown).not.toContain('Target Surface**: `undefined`');
    expect(copiedMarkdown).toContain('## 🎯 2. 5-Section Task Prompt (`TASK_PROMPT.md`)');
    expect(copiedMarkdown).toContain('## 🤖 3. Repository Agent Contract (`AGENTS.md`)');
    expect(copiedMarkdown).toContain(
      '## ⚖️ 4. Project Constitution (`.specify/memory/constitution.md`)'
    );
    expect(copiedMarkdown).toContain(
      '## 📐 5. EARS Feature Specification (`specs/001-feature/spec.md`)'
    );
    expect(copiedMarkdown).toContain(
      '## 🧩 6. Vertical-Slice Task Breakdown (`specs/001-feature/tasks.md`)'
    );

    const tokens = Lexer.lex(copiedMarkdown);
    expect(tokens.length).toBeGreaterThan(10);
    const headings = tokens.filter((t) => t.type === 'heading');
    expect(headings.length).toBeGreaterThanOrEqual(7);

    fireEvent.click(exportReportBtn);

    await waitFor(() => {
      expect(mockApi.saveFileDialog).toHaveBeenCalledWith(
        'FULL_BLUEPRINT_REPORT.md',
        copiedMarkdown
      );
    });
  });

  it('evaluates Prompt Readiness Scorecard live and navigates/focuses missing fields on Fix Now', async () => {
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    // Initially all 6 checks pass with the default preset
    expect(screen.getByText('Prompt Readiness Scorecard')).toBeTruthy();
    expect(screen.getByText('6/6 Ready')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Fix Now' })).toBeNull();

    // Clear the plain-language idea in Simple Mode so the first check fails
    const plainIdeaInput = document.getElementById('plain-idea-input') as HTMLTextAreaElement;
    expect(plainIdeaInput).toBeTruthy();
    fireEvent.change(plainIdeaInput, { target: { value: 'Too short' } });

    expect(screen.getByText('5/6 Ready')).toBeTruthy();
    const fixButtons = screen.getAllByRole('button', { name: 'Fix Now' });
    expect(fixButtons).toHaveLength(1);

    // Switch to another tab first, then click Fix Now to verify it switches back to ideation and focuses the field
    fireEvent.click(screen.getByRole('button', { name: /2\. How to Use Your Files/i }));
    expect(document.getElementById('plain-idea-input')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Fix Now' }));

    await waitFor(() => {
      const focusedEl = document.getElementById('plain-idea-input');
      expect(focusedEl).toBeTruthy();
      expect(document.activeElement).toBe(focusedEl);
    });
  });

  it('displays a confirmation prompt when resetting or loading a preset with unsaved changes', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm');
    render(<SpecForgeStudio />);

    await waitFor(() => {
      expect(mockApi.listBlueprints).toHaveBeenCalled();
    });

    const ideaTextarea = screen.getByLabelText(/What should your app do\?/i) as HTMLTextAreaElement;
    fireEvent.change(ideaTextarea, {
      target: { value: 'Draft with unsaved changes' }
    });

    // Try Resetting (Cancel the confirm)
    confirmSpy.mockReturnValueOnce(false);
    const savedProjectsBtn = screen.getByRole('button', { name: /📂 Saved Projects \(0\)/i });
    fireEvent.click(savedProjectsBtn);
    const resetBtn = screen.getByRole('button', { name: /Reset to Default/i });
    fireEvent.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes in your active draft. Overwrite?');
    expect(ideaTextarea.value).toBe('Draft with unsaved changes');

    // Save preset so we can test Load guard
    const presetNameInput = screen.getByLabelText('Preset Name');
    fireEvent.change(presetNameInput, { target: { value: 'My Unsaved Draft Preset' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Current as Preset/i }));

    // Edit again so draft diverges from saved baseline
    fireEvent.change(ideaTextarea, {
      target: { value: 'Even more unsaved changes' }
    });

    // Try Loading (Cancel)
    confirmSpy.mockReturnValueOnce(false);
    const loadPresetBtn = screen.getByRole('button', { name: /Load preset My Unsaved Draft Preset/i });
    fireEvent.click(loadPresetBtn);

    expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes in your active draft. Overwrite?');
    expect(ideaTextarea.value).toBe('Even more unsaved changes');

    // Try Loading (Confirm)
    confirmSpy.mockReturnValueOnce(true);
    fireEvent.click(loadPresetBtn);
    expect(ideaTextarea.value).toBe('Draft with unsaved changes');

    confirmSpy.mockRestore();
  });
});
~~~~~

### `scripts/launch-ubuntu.sh`

~~~~~bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="${APP_DIR}/release/linux-unpacked/specforge-studio"

if [ ! -x "${BIN}" ]; then
  echo "Built binary not found at ${BIN}. Building now..."
  npm --prefix "${APP_DIR}" run electron:build
fi

exec "${BIN}" --no-sandbox "$@"
~~~~~

### `scripts/install-desktop-entry.sh`

~~~~~bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UNPACKED_BIN="${APP_DIR}/release/linux-unpacked/specforge-studio"
APPIMAGE_BIN="$(ls -t "${APP_DIR}"/release/SpecForge\ Studio-*.AppImage 2>/dev/null | head -n 1 || true)"
ICON_PATH="${APP_DIR}/build/icons/512x512.png"
DESKTOP_DIR="${HOME}/.local/share/applications"
DESKTOP_FILE="${DESKTOP_DIR}/specforge-studio.desktop"

if [ -x "${UNPACKED_BIN}" ]; then
  EXEC_TARGET="\"${UNPACKED_BIN}\" --no-sandbox"
elif [ -x "${APPIMAGE_BIN}" ]; then
  EXEC_TARGET="\"${APPIMAGE_BIN}\" --no-sandbox"
else
  echo "Error: Built desktop binary not found in ${APP_DIR}/release/. Run 'npm run electron:build' first."
  exit 1
fi

mkdir -p "${DESKTOP_DIR}"
cat << EOF > "${DESKTOP_FILE}"
[Desktop Entry]
Version=1.0
Type=Application
Name=SpecForge Studio
Comment=AI Coding Agent Prompt & Context Architect
Exec=${EXEC_TARGET} %U
Icon=${ICON_PATH}
Terminal=false
Categories=Development;IDE;Utility;
StartupWMClass=specforge-studio
EOF

chmod +x "${DESKTOP_FILE}"
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "${DESKTOP_DIR}" >/dev/null 2>&1 || true
fi

echo "Installed desktop launcher: ${DESKTOP_FILE}"
~~~~~

### `build/icon.svg`

~~~~~xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="55%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#083344" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#22d3ee" />
    </linearGradient>
    <linearGradient id="forgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e0e7ff" />
      <stop offset="100%" stop-color="#a5f3fc" />
    </linearGradient>
  </defs>

  <!-- Rounded Ubuntu squircle background -->
  <rect x="24" y="24" width="464" height="464" rx="108" fill="url(#bgGrad)" />
  <rect x="24" y="24" width="464" height="464" rx="108" fill="none" stroke="url(#accentGrad)" stroke-width="10" stroke-opacity="0.7" />

  <!-- Subtle blueprint grid lines -->
  <g stroke="#6366f1" stroke-opacity="0.16" stroke-width="2">
    <line x1="96" y1="144" x2="416" y2="144" />
    <line x1="96" y1="256" x2="416" y2="256" />
    <line x1="96" y1="368" x2="416" y2="368" />
    <line x1="144" y1="96" x2="144" y2="416" />
    <line x1="256" y1="96" x2="256" y2="416" />
    <line x1="368" y1="96" x2="368" y2="416" />
  </g>

  <!-- Central Hexagon / Spec Core -->
  <polygon
    points="256,88 394,168 394,344 256,424 118,344 118,168"
    fill="#0f172a"
    fill-opacity="0.78"
    stroke="url(#accentGrad)"
    stroke-width="12"
    stroke-linejoin="round"
  />

  <!-- Prompt/Code chevrons + Forge spark -->
  <path
    d="M196 206 L148 256 L196 306"
    fill="none"
    stroke="#22d3ee"
    stroke-width="18"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M316 206 L364 256 L316 306"
    fill="none"
    stroke="#818cf8"
    stroke-width="18"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Central vertical slice / diamond -->
  <path
    d="M256 172 L292 256 L256 340 L220 256 Z"
    fill="url(#forgeGrad)"
  />
  <!-- Top right sparkle -->
  <circle cx="386" cy="126" r="16" fill="#34d399" />
  <circle cx="386" cy="126" r="24" fill="#34d399" fill-opacity="0.25" />
</svg>
~~~~~
