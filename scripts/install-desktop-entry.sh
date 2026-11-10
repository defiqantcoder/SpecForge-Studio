#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UNPACKED_BIN="${APP_DIR}/release/linux-unpacked/specforge-studio"
APPIMAGE_BIN="${APP_DIR}/release/SpecForge Studio-1.0.0.AppImage"
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
