#!/usr/bin/env bash
# Semantic color mapping for symlink extension

# Basic colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
RESET='\033[0m'

# Semantic assignments for symlink operations
PROCESS_HEADER_COLOR="$BLUE"
EXCLUDE_COLOR="$GRAY"
SKIP_COLOR="$GRAY"
RECURSE_COLOR="$CYAN"
WARNING_COLOR="$YELLOW"
ERROR_COLOR="$RED"
SUCCESS_COLOR="$GREEN"
GITIGNORE_COLOR='\033[0;36m'   # soft cyan for .gitignore operations