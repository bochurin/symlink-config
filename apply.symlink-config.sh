#!/bin/bash
echo "Applying symlink configuration..."

cd /home/bochu/projects/symlink-config || exit 1

# Root files
echo "Creating selected/root directory..."
mkdir -p "selected/root"
echo "Linking root files..."
ln -sfv "../../apply.symlink-config.sh" "selected/root/apply.symlink-config.sh"
ln -sfv "../../package.json" "selected/root/package.json"
ln -sfv "../../README.md" "selected/root/README.md"
ln -sfv "../../symlink-config.code-workspace" "selected/root/symlink-config.code-workspace"
ln -sfv "../../.gitignore" "selected/root/_gitignore"
ln -sfv "../../tsconfig.json" "selected/root/tsconfig.json"

# Source files
echo "Creating selected/src directory..."
mkdir -p "selected/src"
echo "Linking source files..."
ln -sfv "../../src/main.ts" "selected/src/main.ts"

# Test workspace files
echo "Creating selected/test-ws-unix directory..."
mkdir -p "selected/test-ws-unix"
echo "Linking test workspace files..."
ln -sfv "../../test-ws-unix/.vscode/settings.json" "selected/test-ws-unix/vscode_-_settings.json"
echo "Done!"
