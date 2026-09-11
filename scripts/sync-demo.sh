#!/usr/bin/env bash
# Builds a standalone demo project and copies its dist/ output into
# public/demos/<slug>/, so it can be served nested under this portfolio
# (same origin, iframed by ProjectDetail).
#
# Usage: ./scripts/sync-demo.sh <slug> <path-to-demo-repo>
# Example: ./scripts/sync-demo.sh fisiofit ../fisiofit-landing

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <slug> <path-to-demo-repo>" >&2
  exit 1
fi

SLUG="$1"
SRC_REPO="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTFOLIO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="$PORTFOLIO_ROOT/public/demos/$SLUG"

if [ ! -d "$SRC_REPO" ]; then
  echo "Demo repo not found: $SRC_REPO" >&2
  exit 1
fi

echo "Building $SLUG in $SRC_REPO..."
( cd "$SRC_REPO" && npm run build )

if [ ! -d "$SRC_REPO/dist" ]; then
  echo "Build did not produce a dist/ folder in $SRC_REPO" >&2
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete "$SRC_REPO/dist/" "$DEST/"

echo "Synced $SLUG -> public/demos/$SLUG"
