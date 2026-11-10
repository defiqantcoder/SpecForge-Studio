# SpecForge Studio (Ubuntu 24.04 Desktop App)

SpecForge Studio is an offline-first Electron + React + TypeScript desktop application for **Ubuntu 24.04 LTS** that turns plain-English feature ideas into Spec-Driven Development (SDD) artifacts, 5-section task prompts, `AGENTS.md`, GitHub Copilot instructions/agents, Google Antigravity rules/skills, Google Jules VM setup scripts, and EARS vertical-slice plans.

## Desktop Features

- **100% Offline Prompt & Spec Architect**: Works out of the box with presets, EARS builders, vertical-slice planners, and live token/size diagnostics.
- **1-Click Export to Repository Folder**: Write all 14 generated files (`AGENTS.md`, `TASK_PROMPT.md`, `.agents/...`, `.github/...`, `.specify/...`, `specs/...`, `bootstrap-agy.sh`, `jules-setup.sh`) directly into any local code repository via Ubuntu's native folder picker.
- **Local Blueprint Storage**: Automatically persists your active draft and lets you save, load, tag, import, and export `.specforge.json` blueprints in `~/.config/SpecForge Studio/blueprints/`.
- **Optional Gemini AI Integration**: Configure a Gemini API key in **AI Key** settings (encrypted via OS `safeStorage` when available, or via `GEMINI_API_KEY`) to enable **AI Magic Auto-Architect** and **`/grill-me`** Socratic interviews.
- **Hardened Electron Architecture**: Runs with `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, strict CSP headers, and path-traversal validation on every file export.

## Installing on Ubuntu 24.04

Download the latest binaries from the [GitHub Releases](https://github.com/defiqantcoder/specforge-studio/releases) page, or build them locally:

1. **Debian / Ubuntu `.deb` Package (Recommended)**:
   ```bash
   sudo apt install ./release/specforge-studio_1.0.0_amd64.deb
   ```
2. **Portable AppImage**:
   ```bash
   chmod +x ./release/"SpecForge Studio-1.0.0.AppImage"
   ./release/"SpecForge Studio-1.0.0.AppImage" --no-sandbox
   ```
   *(Note: `--no-sandbox` is required for unprivileged AppImage/unpacked binaries on Ubuntu 24.04 due to `kernel.apparmor_restrict_unprivileged_userns=1`.)*
3. **Unpacked Binary / Launcher Script**:
   ```bash
   ./scripts/launch-ubuntu.sh
   ```
4. **Add to Ubuntu Application Launcher (no sudo required)**:
   ```bash
   ./scripts/install-desktop-entry.sh
   ```

## Development & Build Scripts

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:c7991d31bb07d8ec032befb02550851840e78c8907c5d483e42623a8765c1a2f -->

The Electron development and start workflows require Node.js **22.12.0 or later**. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), then install and select Node.js 22:

```bash
nvm install 22
nvm use 22
node --version
```

<!-- /coderabbit-ai-generated:v1 -->

```bash
# Install dependencies
npm install

# Run unit & component tests
npm test

# Typecheck frontend + Electron main/preload
npm run typecheck

# Launch in Electron dev mode (Vite HMR + Electron)
npm run electron:dev

# Launch built desktop app directly
npm run electron:start

# Build Ubuntu .deb, .AppImage, and linux-unpacked binaries into ./release/
npm run electron:build
```

## Project Structure

- `electron/main.ts` — Electron main process, native Ubuntu dialogs, local blueprint storage, safeStorage Gemini key settings, and IPC handlers.
- `electron/preload.ts` — Strict `contextBridge` API (`window.desktopAPI`).
- `electron/pathSecurity.ts` — Path traversal protection & blueprint ID sanitization.
- `src/SpecForgeStudio.tsx` — React 19 + Tailwind CSS v4 SpecForge Studio UI.
- `build/` — Vector and PNG application icons (`48x48` through `512x512`).
- `scripts/` — Ubuntu 24.04 launcher and `.desktop` entry installer.
