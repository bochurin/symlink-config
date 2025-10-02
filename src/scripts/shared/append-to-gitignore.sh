#!/usr/bin/env bash
set -euo pipefail

# Shared utility: append-to-gitignore.sh
# Manage entries inside .gitignore files with labeled blocks

append_to_gitignore() {
    local target="$1"
    local gitignore_dir="$2"
    local block_name="${3:-}"

    local gitignore_path="$gitignore_dir/.gitignore"

    # Ensure .gitignore exists
    touch "$gitignore_path"

    # If the target is already listed, do nothing
    if grep -Fxq "$target" "$gitignore_path"; then
        return 1
    fi

    # If a block name is provided, try to insert into that block
    if [[ -n "$block_name" ]]; then
        local begin="# $block_name"
        local end="# End $block_name"

        if grep -Fxq "$begin" "$gitignore_path" && grep -Fxq "$end" "$gitignore_path"; then
            # Insert new entry before END marker
            awk -v path="$target" -v begin="$begin" -v end="$end" '
                $0 == begin { print; in_block=1; next }
                in_block && $0 == end {
                    print path
                    in_block=0
                }
                { print }
            ' "$gitignore_path" > "$gitignore_path.tmp" && mv "$gitignore_path.tmp" "$gitignore_path"
        else
            {
                echo "$begin"
                echo "$target"
                echo "$end"
            } >> "$gitignore_path"
        fi
    else
        echo "$target" >> "$gitignore_path"
    fi

    return 0
}