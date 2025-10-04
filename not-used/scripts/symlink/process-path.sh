#!/usr/bin/env bash

# Symlink Config Extension - Core Processing Script
# Adapted from CVHere project symlink management system

set -euo pipefail
shopt -s extglob

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Import helpers ---
source "$SCRIPT_DIR/../shared/relative-path.sh"
source "$SCRIPT_DIR/../shared/append-to-gitignore.sh"
source "$SCRIPT_DIR/../shared/normalize-windows-path.sh"

source "$SCRIPT_DIR/resolve-path.sh"
source "$SCRIPT_DIR/create-symlink.sh"
source "$SCRIPT_DIR/exclude-filter.sh"
source "$SCRIPT_DIR/remove-old-symlinks.sh"
source "$SCRIPT_DIR/colors.sh"

# init_jq

# --- Arguments ---
config_dir="$1"
mode="${2:-full}"
root_dir="${3:-$config_dir}"
config_file="$config_dir/symlink.config.json"

INDENT=$'\t'

EXCLUDE_PATTERNS=()
platform="$(uname -s)"

# --- Step 0: privilege escalation (Linux/macOS only) ---
if [[ "$mode" == "full" || "$mode" == "clean" ]]; then
    if [[ "$platform" == "Linux" || "$platform" == "Darwin" ]]; then
        echo -e "${WARNING_COLOR}⚠️  Administrator privileges required. Requesting elevation...${RESET}"
        # require_admin "$0" "$@"
        exit 0
    fi
fi

# --- Step 1: Windows header (setup before cleanup) ---
bat_file=""
if [[ "$platform" == MINGW* || "$platform" == MSYS* || "$platform" == CYGWIN* ]]; then
    if [[ "$config_dir" == "$root_dir" && -z "${BAT_FILE_GLOBAL:-}" ]]; then
        ts="$(date '+%Y%m%d%H%M%S')"
        bat_file="process_symlinks_${mode}_${ts}.bat"
        export BAT_FILE_GLOBAL="$bat_file"

        cmdline="$0 $*"
        # append_to_bat "REM =============================================" "$bat_file"
        # append_to_bat "REM Run started: $ts" "$bat_file"
        # append_to_bat "REM Command: $cmdline" "$bat_file"
        # append_to_bat "REM =============================================" "$bat_file"
        # append_to_bat "" "$bat_file"
    else
        bat_file="${BAT_FILE_GLOBAL:-}"
    fi
fi

# --- Step 2: cleanup ---
echo -e "${INDENT}🧹 Checking for old symlinks in .gitignore"
remove_old_symlinks "$config_dir" "$mode"

echo -e "${SKIP_COLOR}📋 Using existing .gitignore entries for bat generation${RESET}"

rel_config="${config_file#$root_dir/}"

# --- Step 3: load exclude patterns ---
if [[ -f "$config_file" ]]; then
    # TODO: Implement jq alternative for extension context
    # while read -r pattern; do
    #     [[ -n "$pattern" ]] && EXCLUDE_PATTERNS+=("$pattern")
    # done < <("$JQ_CMD" -r '.exclude_paths[]?' "$config_file")
    if [[ ${#EXCLUDE_PATTERNS[@]} -gt 0 ]]; then
        echo -e "${EXCLUDE_COLOR}📦 Exclude patterns: ${EXCLUDE_PATTERNS[*]}${RESET}"
    fi
fi

# --- Helper: process symlink section ---
process_symlink_section() {
    local section="$1"   # "directories" or "files"
    local type="$2"      # "dir" or "file"

    # TODO: Implement JSON parsing for extension context
    # mapfile -t entries < <("$JQ_CMD" -c "try .${section}[] catch empty" "$config_file")

    # if [[ ${#entries[@]} -eq 0 ]]; then
    #     echo -e "${INDENT}${SKIP_COLOR}📭 No $type symlinks found${RESET}"
    #     return
    # fi

    # for entry in "${entries[@]}"; do
    #     raw_target=$(echo "$entry" | "$JQ_CMD" -r '.target')
    #     raw_source=$(echo "$entry" | "$JQ_CMD" -r '.source')

    #     target=$(resolve_path "$config_dir" "$raw_target")
    #     source=$(resolve_path "$config_dir" "$raw_source")

    #     rel_source=$(relative_path "$(dirname "$target")" "$source")
    #     rel_target=$(relative_path "$config_dir" "$target")

    #     create_symlink "$target" "$rel_source" "$type" "$mode"
    #     if [[ $? -eq 0 ]]; then
    #         if append_to_gitignore "$rel_target" "$config_dir" "SymLinks"; then
    #             echo -e "${GITIGNORE_COLOR}➕ Added to .gitignore: $rel_target${RESET}"
    #         else
    #             echo -e "${SKIP_COLOR}🟰 Already listed in .gitignore: $rel_target${RESET}"
    #         fi
    #     fi
    # done
    
    echo -e "${INDENT}${SKIP_COLOR}📭 No $type symlinks found (JSON parsing not implemented)${RESET}"
}

# --- Step 4: process symlinks ---
if [[ "$mode" != "clean" && "$mode" != "dry" && -f "$config_file" ]]; then
    echo -e "${PROCESS_HEADER_COLOR}📦 Processing symlinks from ./$rel_config${RESET}"

    process_symlink_section "directories" "dir"
    process_symlink_section "files" "file"

elif [[ "$mode" == "clean" || "$mode" == "dry" ]]; then
    echo -e "${INDENT}${WARNING_COLOR}⚠️ Mode '$mode' — skipping symlink creation${RESET}"
elif [[ ! -f "$config_file" ]]; then
    echo -e "${WARNING_COLOR}⚠️ No config file found in ./${config_dir#$root_dir/} — skipping symlink creation${RESET}"
fi

# --- Step 5: recurse ---
find "$config_dir" -mindepth 1 -maxdepth 1 -type d | while read -r subdir; do
    if [[ -L "$subdir" ]]; then
        echo -e "${INDENT}${SKIP_COLOR}🔁 Skipping symlink directory: $subdir${RESET}"
        continue
    fi
    subname="$(basename "$subdir")"
    rel_subdir="${subdir#$root_dir/}"
    if should_exclude "$subname" "${EXCLUDE_PATTERNS[@]}"; then
        echo -e "${INDENT}${EXCLUDE_COLOR}🚫 Skipping excluded directory: ./$rel_subdir${RESET}"
        continue
    fi
    echo -e "${RECURSE_COLOR}🔍 Recursing into: ./$rel_subdir${RESET}"
    "$SCRIPT_DIR/process-path.sh" "$subdir" "$mode" "$root_dir"
done

# --- Step 6: Windows instructions ---
if [[ "$platform" == MINGW* || "$platform" == MSYS* || "$platform" == CYGWIN* ]]; then
    if [[ "$config_dir" == "$root_dir" && -n "$bat_file" ]]; then
        # append_to_bat "" "$bat_file"
        project_root="$(cd "$SCRIPT_DIR/../../.." && pwd -W)"
        # project_root_win="$(normalize_windows_path "$project_root")"

        echo ""
        echo "============================================================"
        echo "⚠️  On Windows, please run the following batch file"
        echo "    as Administrator in CMD (already copied to clipboard):"
        echo ""
        echo "    $bat_file"
        echo "============================================================"
        echo ""

        printf "%s" "$bat_file" | clip.exe
        echo "📋 The command '$bat_file' has been copied to your clipboard."

        read -r -p "👉 Do you want me to open an elevated CMD in the project root now? [y/N]: " answer
        case "$answer" in
            [yY]|[yY][eE][sS])
                # powershell.exe -Command "Start-Process cmd -ArgumentList '/k cd /d \"$project_root_win\"' -Verb RunAs"
                ;;
            *)
                echo -e "${WARNING_COLOR}ℹ️ Skipping auto-launch. Open an elevated CMD and paste the command (already in clipboard).${RESET}"
                ;;
        esac
    fi
fi

echo ""   # final newline