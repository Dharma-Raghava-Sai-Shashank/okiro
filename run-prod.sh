#!/usr/bin/env bash
# Production-mode local server: builds the static bundle once, then serves it
# from Node with the /api/* handlers mounted. Port 4173.
# Usage:  ./run-prod.sh

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

echo "→ Building production bundle..."
npm run build

echo "→ Starting Okiro production server at http://localhost:4173"
node serve.js
