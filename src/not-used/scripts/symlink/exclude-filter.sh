#!/usr/bin/env bash
set -euo pipefail

# --- Function: should_exclude ---
# Purpose: Check if a directory name matches any exclude pattern
# Arguments:
#   $1 name - directory name to check
#   $@ patterns - array of exclude patterns
should_exclude() {
    local name="$1"
    shift
    local patterns=("$@")
    
    for pattern in "${patterns[@]}"; do
        if [[ "$name" == $pattern ]]; then
            return 0  # should exclude
        fi
    done
    
    return 1  # should not exclude
}