@echo off
echo Applying symlink configuration...

cd /d "%~dp0.." || exit /b 1


REM Root files
mkdir "selected\root"
mklink "selected\root\package.json" "..\package.json"
mklink "selected\root\README.md" "..\README.md"
mklink "selected\root\symlink-config.code-workspace" "..\symlink-config.code-workspace"
mklink "selected\root\_gitignore" "..\.gitignore"
mklink "selected\root\tsconfig.json" "..\tsconfig.json"

REM Source files
mkdir "selected\src"
mklink "selected\src\main.ts" "..\src\main.ts"

REM Test workspace files
mkdir "selected\test-ws-win"
mklink "selected\test-ws-win\vscode_-_settings.json" "..\test-ws-win\.vscode\settings.json"

pause
