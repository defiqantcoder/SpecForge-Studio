#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="${APP_DIR}/release/linux-unpacked/specforge-studio"

if [ ! -x "${BIN}" ]; then
  echo "Built binary not found at ${BIN}. Building now..."
  npm --prefix "${APP_DIR}" run electron:build
fi

exec "${BIN}" --no-sandbox "$@"
