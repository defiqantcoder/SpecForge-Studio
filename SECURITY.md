# Security Policy

## Security Model & Architecture

SpecForge Studio is built with an offline-first architecture designed to maximize user privacy and security on Ubuntu environments.

We adhere to a strict 3-tier Electron isolation model:

1.  **Hardened `BrowserWindow` (`electron/main.ts`)**:
    *   `contextIsolation: true`: Ensures scripts running in the renderer process do not have access to the Node.js environment or Electron's internal APIs.
    *   `nodeIntegration: false`: Prevents the renderer process from using Node.js features directly.
    *   `sandbox: true`: Runs the renderer in a Chromium sandbox.
    *   Strict Content Security Policy (CSP) enforcement.
    *   URL parsing and validation on `setWindowOpenHandler` and `will-navigate`.
    *   Sender frame validation (`assertTrustedIpcSender`) on every IPC handler to prevent unauthorized IPC messages.
2.  **Narrow Preload Bridge (`electron/preload.ts`)**:
    *   Exposes only specific, typed domain methods via `window.desktopAPI` using `contextBridge`.
3.  **Path-Traversal Guard (`electron/pathSecurity.ts`)**:
    *   `resolveSafeChildPath` rigorously validates every relative export path.
    *   Rejects `..` traversal attempts, absolute paths, null bytes, and root-equivalent `.` writes to ensure file operations are strictly confined.

## Data Storage & API Keys

*   **Offline-First**: By default, no network connection is required. Instructions and specifications are generated using offline smart templates.
*   **Encrypted Key Storage**: When using the optional Gemini AI integration, API keys are securely encrypted at rest using the operating system's native keyring (via Electron's `safeStorage` API). Operations using these keys are executed solely within the isolated Main process.

## Reporting a Vulnerability

If you discover a security vulnerability in SpecForge Studio, please **do not** report it via public GitHub issues.

Instead, please send an email to `starwarshellyeah69@pm.me` with the subject `[SECURITY] Vulnerability Report`. We aim to review and respond to all vulnerability reports within 48 hours. Please include detailed steps to reproduce the issue.
