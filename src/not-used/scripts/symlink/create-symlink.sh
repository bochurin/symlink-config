#!/usr/bin/env bash
#
# create-symlink.sh
# Cross-platform symlink creation helper for VSCode extension
# Adapted from CVHere project
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Import colors
source "$SCRIPT_DIR/colors.sh"
source "$SCRIPT_DIR/../shared/relative-path.sh"
source "$SCRIPT_DIR/../shared/normalize-windows-path.sh"

# --- Function: create_symlink ---
# Arguments:
#   $1 target - the path where the symlink should be created
#   $2 source - the path the symlink should point to
#   $3 type   - "file" or "dir"
#   $4 mode   - optional: full (default), dry, clean
create_symlink() {
    local target="$1"
    local source="$2"
    local type="$3"       # must be "file" or "dir"
    local mode="${4:-full}"

    local bat_file="${BAT_FILE_GLOBAL:-process_symlinks.bat}"

    # Validate type argument
    if [[ "$type" != "file" && "$type" != "dir" ]]; then
        echo -e "\t${ERROR_COLOR}⛔️ Unknown symlink type: $type${RESET}"
        return 1
    fi

    # Clean mode → skip
    if [[ "$mode" == "clean" ]]; then
        echo -e "\t${WARNING_COLOR}🧹 Clean mode: skipping creation for $target${RESET}"
        return 0
    fi

    # If target exists and is not a symlink → refuse
    if [[ -e "$target" && ! -L "$target" ]]; then
        echo -e "\t${ERROR_COLOR}⛔️ Target exists and is not a symlink: $target${RESET}"
        return 1
    fi

    # Detect platform
    local platform
    platform="$(uname -s)"

    case "$platform" in
        # --- Unix-like systems (Linux, macOS) ---
        Linux|Darwin)
            local remove_cmd="rm -f \"$target\""
            local link_cmd="ln -s \"$source\" \"$target\""

            if [[ "$mode" == "dry" ]]; then
                echo -e "\t${WARNING_COLOR}🧪 DRY: $remove_cmd${RESET}"
                echo -e "\t${WARNING_COLOR}🧪 DRY: $link_cmd${RESET}"
                return 0
            fi

            # Ensure parent directory exists
            local target_dir
            target_dir="$(dirname -- "$target")"
            if [[ "$target_dir" != "." ]]; then
                mkdir -p "$target_dir" || {
                    echo -e "\t${ERROR_COLOR}⛔️ Failed to create directory: $target_dir${RESET}"
                    return 1
                }
            fi

            if [[ -L "$target" ]]; then
                echo -e "\t${WARNING_COLOR}🧹 Removing existing symlink: $target${RESET}"
                rm -f "$target"
            fi

            echo -e "\t${SUCCESS_COLOR}🔗 Linking: $target ← $source${RESET}"
            ln -s "$source" "$target"
            ;;

        # --- Windows environments (Git Bash, MSYS, Cygwin) ---
        MINGW*|MSYS*|CYGWIN*)
            # Normalize paths for Windows
            local source_win target_win target_dir target_dir_win
            source_win="$(cygpath -w "$source" 2>/dev/null || echo "$source")"
            target_win="$(cygpath -w "$target" 2>/dev/null || echo "$target")"
            target_dir="$(dirname -- "$target")"

            local mkdir_cmd=""
            if [[ "$target_dir" != "." ]]; then
                target_dir_win="$(cygpath -w "$target_dir" 2>/dev/null || echo "$target_dir")"
                mkdir_cmd="mkdir \"$target_dir_win\" 2>nul"
            fi

            local remove_cmd link_cmd
            if [[ "$type" == "dir" ]]; then
                remove_cmd="rmdir \"$target_win\" 2>nul"
                link_cmd="mklink /D \"$target_win\" \"$source_win\""
            else
                remove_cmd="del \"$target_win\" 2>nul"
                link_cmd="mklink \"$target_win\" \"$source_win\""
            fi

            if [[ "$mode" == "dry" ]]; then
                if [[ -n "$mkdir_cmd" ]]; then
                    echo -e "\t${WARNING_COLOR}🧪 DRY: $mkdir_cmd${RESET}"
                fi
                echo -e "\t${WARNING_COLOR}🧪 DRY: $remove_cmd${RESET}"
                echo -e "\t${WARNING_COLOR}🧪 DRY: $link_cmd${RESET}"
                return 0
            fi

            echo -e "\t${PROCESS_HEADER_COLOR}🪟 Preparing Windows symlink commands${RESET}"
            # In extension context, these commands would be executed via Node.js child_process
            # For now, just log what would be done
            if [[ -n "$mkdir_cmd" ]]; then
                echo -e "\t${GRAY}  $mkdir_cmd${RESET}"
            fi
            echo -e "\t${GRAY}  $remove_cmd${RESET}"
            echo -e "\t${GRAY}  $link_cmd${RESET}"
            return 0
            ;;

        *)
            echo -e "\t${ERROR_COLOR}⛔️ Unknown platform: $platform${RESET}"
            return 1
            ;;
    esac

    # Verify symlink creation on Unix
    if [[ "$platform" == "Linux" || "$platform" == "Darwin" ]]; then
        if [[ ! -L "$target" ]]; then
            echo -e "\t${ERROR_COLOR}⛔️ Symlink creation failed: $target${RESET}"
            return 1
        fi
    fi
}