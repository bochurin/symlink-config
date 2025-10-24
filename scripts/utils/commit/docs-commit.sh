#!/bin/bash
# Symlink Config Documentation Commit Script

echo "=== Symlink Config Documentation Commit ==="

# Check for auto-confirm flag
AUTO_CONFIRM=false
if [ "$1" = "--auto" ] || [ "$1" = "-y" ]; then
    AUTO_CONFIRM=true
    shift  # Remove the flag from arguments
fi

# Function to commit documentation files
commit_docs() {
    local suggested_message="$1"

    git reset HEAD . >/dev/null 2>&1 || true
    git add .docs/ README.md */README.md */*/README.md

    if git diff --cached --quiet; then
        echo "No documentation changes to commit."
        return 1
    fi

    echo "Documentation files to commit:"
    git diff --cached --name-only | sed 's/^/  - /'
    echo

    # Read default message from file if it exists
    default_message="Update project documentation"
    if [ -f "docs-commit-message.txt" ]; then
        default_message=$(cat docs-commit-message.txt)
        echo "Default commit message from docs-commit-message.txt:"
        echo "$default_message"
        echo
    fi

    if [ -n "$suggested_message" ]; then
        message="$suggested_message"
        echo "Using provided commit message: $message"
    elif [ "$AUTO_CONFIRM" = true ]; then
        message="$default_message"
        echo "Auto-confirming with default message: $message"
    else
        echo "Press Enter to use default message, or type your own:"
        read -r message
        if [ -z "$message" ]; then
            message="$default_message"
        fi

        read -p "Commit these documentation files? (y/N): " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            echo "Commit cancelled."
            return 1
        fi
    fi

    git commit -m "$message"
    echo "✅ Documentation committed."

    # Clear the default message file after successful commit
    if [ -f "docs-commit-message.txt" ]; then
        > docs-commit-message.txt
        echo "✅ Docs commit message cleared."
    fi

    return 0
}

# Main workflow
suggested_message="$1"
commit_docs "$suggested_message"

echo "✅ Documentation commit workflow complete!"