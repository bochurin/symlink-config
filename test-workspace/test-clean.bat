@echo off
echo Testing clean script...

echo Checking vscode-settings-sl.json...
if exist "vscode-settings-sl.json" (
  echo Found vscode-settings-sl.json, removing...
  del "vscode-settings-sl.json"
  if exist "vscode-settings-sl.json" (
    echo ERROR: Failed to remove vscode-settings-sl.json
  ) else (
    echo SUCCESS: Removed vscode-settings-sl.json
  )
) else (
  echo vscode-settings-sl.json not found
)

echo Done!
pause