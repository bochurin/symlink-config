#!/usr/bin/env bash
set -euo pipefail   # Exit on error, unset vars are errors, fail on pipeline errors

# --- Function: init_jq ---
# Purpose:
#   Initialize the jq command wrapper ($JQ_CMD) so that other scripts
#   can reliably call jq regardless of platform (Linux, macOS, Windows Git Bash).
#
# Behavior:
#   - Checks if `jq` is available in PATH.
#   - On Windows (Git Bash / MSYS), jq may be installed as `jq.exe`,
#     so that is checked as a fallback.
#   - If neither is found, print an error and exit.
#   - Exports JQ_CMD so that child scripts/functions can use it.
#
# Usage:
#   Call init_jq once at the start of a script.
#   Then use "$JQ_CMD" instead of calling jq directly.
init_jq() {
    if command -v jq &> /dev/null; then
        JQ_CMD="jq"
    elif command -v jq.exe &> /dev/null; then
        JQ_CMD="jq.exe"
    else
        echo "❌ Error: jq not found in PATH. Please install jq to parse JSON." >&2
        exit 1
    fi

    export JQ_CMD
}