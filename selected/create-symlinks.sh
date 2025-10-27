#!/bin/bash
echo "Applying symlink configuration..."

cd /home/bochu/projects/symlink-config/selected || exit 1

# Root files
echo "Creating root directory..."
mkdir -p "root"
echo "Linking root files..."
ln -sfv "../../package.json" "root/package.json"
ln -sfv "../../symlink-config.code-workspace" "root/symlink-config.code-workspace"
ln -sfv "../../.gitignore" "root/_gitignore"
ln -sfv "../../tsconfig.json" "root/tsconfig.json"

# Source files
echo "Creating src directory..."
mkdir -p "src"
echo "Linking source files..."
ln -sfv "../../src/main.ts" "src/main.ts"

# Test workspace files
echo "Creating test-ws-unix directory..."
mkdir -p "test-ws-unix"
echo "Linking test workspace files..."
ln -sfv "../../test-ws-unix/.vscode/settings.json" "test-ws-unix/vscode_-_settings.json"
echo "Done!"
