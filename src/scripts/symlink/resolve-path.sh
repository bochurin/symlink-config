#!/usr/bin/env bash
set -euo pipefail

# --- Function: resolve_path ---
# Purpose:
#   Normalize a raw path from symlink.config.json into an absolute/usable path.
#   Supports two conventions:
#     - Paths starting with '@' are treated as relative to the project root.
#     - All other paths are treated as relative to the config directory.
#
# Arguments:
#   $1 config_dir - directory where symlink.config.json resides
#   $2 raw_path   - path string from the config (may start with '@')
#
# Output:
#   Prints the resolved path to stdout.
resolve_path() {
    local config_dir="$1"   # base directory of the config file
    local raw_path="$2"     # raw path string from config

    if [[ "$raw_path" == @* ]]; then
        # Example: "@src/module" → "src/module"
        echo "${raw_path:1}"
    else
        # Example: "templates" → "<config_dir>/templates"
        echo "$config_dir/$raw_path"
    fi
}