#!/usr/bin/env bash
set -euo pipefail
DATA_DIR="${OUBEI_DATA_DIR:-/var/lib/oubei}"
DEST_DIR="${1:-/var/backups/oubei}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$DEST_DIR/$STAMP/media"
cp "$DATA_DIR/site.db" "$DEST_DIR/$STAMP/site.db"
if [[ -d "$DATA_DIR/media" ]]; then cp -a "$DATA_DIR/media/." "$DEST_DIR/$STAMP/media/"; fi
echo "$DEST_DIR/$STAMP"
