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
