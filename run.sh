#!/usr/bin/env bash
# Quick-start dev server (Vite + inline API). Live reload, port 5173.
# Usage:  ./run.sh

set -e
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "→ Installing dependencies (first run only)..."
  npm install
fi

if [ ! -f ".env.local" ]; then
  echo "⚠  .env.local is missing. Create it with MONGODB_URI=... before continuing."
  exit 1
fi

echo "→ Starting Okiro dev server at http://localhost:5173"
npm run dev
