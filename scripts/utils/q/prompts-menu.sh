#!/bin/bash

PROMPTS_DIR="$HOME/.aws/amazonq/prompts"

if [ ! -d "$PROMPTS_DIR" ]; then
    echo "Amazon Q prompts directory not found: $PROMPTS_DIR"
    echo "Creating directory..."
    mkdir -p "$PROMPTS_DIR"
    echo "Directory created. Add your .md prompt files there."
    read -p "Press Enter to continue..."
    exit 0
fi

files=()
for file in "$PROMPTS_DIR"/*.md; do
    if [ -f "$file" ]; then
        files+=("$(basename "$file")")
    fi
done

if [ ${#files[@]} -eq 0 ]; then
    echo "No .md files found in $PROMPTS_DIR"
    echo
    read -p "Would you like to open the prompts directory? (y/n): " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
        if command -v explorer.exe &> /dev/null; then
            explorer.exe "$(wslpath -w "$PROMPTS_DIR")"
        else
            xdg-open "$PROMPTS_DIR" 2>/dev/null || open "$PROMPTS_DIR" 2>/dev/null
        fi
    fi
    exit 0
fi

# Add "Open Directory" option
files=("📁 Open Directory" "${files[@]}")

selected=0
total=${#files[@]}

show_menu() {
    clear
    echo
    echo "Amazon Q Prompts Menu"
    echo "===================="
    echo "Use ↑/↓ arrows, Enter to select, q/Esc to quit"
    echo
    
    for i in "${!files[@]}"; do
        if [ $i -eq $selected ]; then
            echo "→ ${files[$i]}"
        else
            echo "  ${files[$i]}"
        fi
    done
}

while true; do
    show_menu
    
    read -rsn1 key
    case "$key" in
        $'\x1b')
            read -rsn1 -t 0.1 key2
            if [ $? -eq 0 ]; then
                read -rsn1 key3
                case "$key2$key3" in
                    '[A') # Up arrow
                        ((selected > 0)) && ((selected--))
                        ;;
                    '[B') # Down arrow
                        ((selected < total-1)) && ((selected++))
                        ;;
                esac
            else
                break  # Pure Esc key
            fi
            ;;
        '') # Enter
            if [ $selected -eq 0 ]; then
                # Open directory
                if command -v explorer.exe &> /dev/null; then
                    explorer.exe "$(wslpath -w "$PROMPTS_DIR")"
                else
                    xdg-open "$PROMPTS_DIR" 2>/dev/null || open "$PROMPTS_DIR" 2>/dev/null
                fi
            else
                # Open selected file
                file="${files[$selected]}"
                code "$PROMPTS_DIR/$file"
            fi
            break
            ;;
        'q'|'Q')
            break
            ;;
    esac
done

clear