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
