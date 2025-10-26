# Root Scripts Directory

## Overview

Development and build utility scripts in the root `scripts/` directory.

## Structure

### `scripts/shared/`
- **`init-jq.sh`** - Initialize jq JSON processor for build scripts

### `scripts/utils/`

#### `scripts/utils/commit/`
- **`code-commit.sh`** - Automated code commit with standardized messages
- **`docs-commit.sh`** - Automated documentation commit with standardized messages  
- **`docs-commit-message.txt`** - Template for documentation commit messages

#### `scripts/utils/q/`
- **`prompts-menu.sh`** - Amazon Q prompts management menu

### `scripts/build-package.sh`
- **Purpose**: Build script for package.json generation (currently unused)
- **Status**: Placeholder for future build automation

## Usage

### Commit Scripts
```bash
# Commit code changes
bash scripts/utils/commit/code-commit.sh

# Commit documentation changes  
bash scripts/utils/commit/docs-commit.sh

# Auto-commit with generated message
bash scripts/utils/commit/docs-commit.sh --auto
```

### Q Prompts Menu
```bash
# Open prompts management menu
bash scripts/utils/q/prompts-menu.sh
```

## Architecture Notes

- **Shell-based**: All scripts use bash for cross-platform compatibility
- **Modular structure**: Organized by function (commit, q, shared utilities)
- **Standardized messaging**: Consistent commit message formats
- **Development workflow**: Supports documentation and code development cycles