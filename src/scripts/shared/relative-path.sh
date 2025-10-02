#!/usr/bin/env bash
set -euo pipefail

# Shared utility: relative-path.sh
# Compute the relative path from one directory to another

relative_path() {
    local from="$1"
    local to="$2"

    # Normalize inputs
    from="${from%/}"
    to="${to%/}"
    from="${from#./}"
    to="${to#./}"

    # Split paths into arrays
    IFS='/' read -r -a from_parts <<< "$from"
    IFS='/' read -r -a to_parts <<< "$to"

    # Find common prefix
    local i=0
    while [[ $i -lt ${#from_parts[@]} && $i -lt ${#to_parts[@]} && "${from_parts[$i]}" == "${to_parts[$i]}" ]]; do
        ((i++))
    done

    # Build "up" path
    local up=""
    for ((j=i; j<${#from_parts[@]}; j++)); do
        up+="../"
    done

    # Build "down" path
    local down=""
    for ((j=i; j<${#to_parts[@]}; j++)); do
        down+="${to_parts[$j]}/"
    done

    # Combine
    echo "${up}${down%/}"
}