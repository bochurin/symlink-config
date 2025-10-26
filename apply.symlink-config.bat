@echo off
echo Applying symlink configuration...
mklink  "c:\Users\bochu\Projects\symlink-config\selected\root\apply.symlink-config.bat" "..\..\apply.symlink-config.bat"
mklink  "c:\Users\bochu\Projects\symlink-config\selected\root\README.md" "..\..\README.md"
mklink  "c:\Users\bochu\Projects\symlink-config\selected\root\symlink-config.code-workspace" "..\..\symlink-config.code-workspace"
mklink  "c:\Users\bochu\Projects\symlink-config\selected\root\_gitignore" "..\..\.gitignore"
mklink  "c:\Users\bochu\Projects\symlink-config\selected\root\tsconfig.json" "..\..\tsconfig.json"
mklink  "c:\Users\bochu\Projects\symlink-config\selected\src\main.ts" "..\..\src\main.ts"
mklink  "c:\Users\bochu\Projects\symlink-config\selected\test-workspace\vscode_-_settings.json" "..\..\test-ws-win\.vscode\settings.json"
