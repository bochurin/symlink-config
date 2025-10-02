#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colors.sh"

# --- Function: remove_old_symlinks ---
# Purpose: Remove old symlinks based on .gitignore SymLinks block
# Arguments:
#   $1 config_dir - directory to process
#   $2 mode - processing mode (full, clean, dry)
remove_old_symlinks() {
    local config_dir="$1"
    local mode="$2"
    
    local gitignore_file="$config_dir/.gitignore"
    
    if [[ ! -f "$gitignore_file" ]]; then
        echo -e "\t${SKIP_COLOR}📭 No .gitignore file found${RESET}"
        return 0
    fi
    
    # Look for SymLinks block in .gitignore
    local in_symlinks_block=false
    local symlink_count=0
    
    while IFS= read -r line; do
        # Remove trailing whitespace and carriage returns
        line=$(echo "$line" | sed 's/[[:space:]]*$//')
        
        if [[ "$line" == "# SymLinks" ]]; then
            in_symlinks_block=true
            continue
        elif [[ "$line" == "# End SymLinks" ]]; then
            in_symlinks_block=false
            continue
        elif [[ "$in_symlinks_block" == true && -n "$line" && "$line" != \#* ]]; then
            # This is a symlink entry
            local symlink_path="$config_dir/$line"
            
            if [[ -L "$symlink_path" ]]; then
                ((symlink_count++))
                if [[ "$mode" == "dry" ]]; then
                    echo -e "\t${WARNING_COLOR}🧪 DRY: Would remove symlink: $line${RESET}"
                else
                    echo -e "\t${WARNING_COLOR}🗑️ Removing old symlink: $line${RESET}"
                    rm -f "$symlink_path"
                fi
            elif [[ -e "$symlink_path" ]]; then
                echo -e "\t${ERROR_COLOR}⚠️ Path exists but is not a symlink: $line${RESET}"
            fi
        fi
    done < "$gitignore_file"
    
    if [[ $symlink_count -eq 0 ]]; then
        echo -e "\t${SKIP_COLOR}📭 No symlinks found in .gitignore SymLinks block${RESET}"
    else
        echo -e "\t${SUCCESS_COLOR}✅ Processed $symlink_count symlink entries${RESET}"
    fi
}