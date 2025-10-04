#!/usr/bin/env bash
set -euo pipefail

# Shared utility: normalize-windows-path.sh
# Convert Unix-style paths to Windows-style paths

normalize_windows_path() {
    local raw="$1"
    
    # Replace all forward slashes with backslashes
    local normalized="${raw//\//\\}"
    
    echo "$normalized"
}