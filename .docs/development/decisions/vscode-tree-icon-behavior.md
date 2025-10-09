# VSCode TreeItem Icon Behavior Discovery

**Date**: 09.10.2025  
**Context**: Tree view development and icon integration  
**Discovery**: VSCode TreeItem icon behavior depends on CollapsibleState

## Problem

During tree view development, directory nodes were showing file icons instead of folder icons despite setting proper `resourceUri` paths ending with `/`.

## Investigation

Initial assumption was that `resourceUri` alone determines icon type:
- Files: `vscode.Uri.file('/path/to/file.js')` → JavaScript icon
- Directories: `vscode.Uri.file('/path/to/folder/')` → Folder icon

However, directories were consistently showing file icons.

## Root Cause Discovery

VSCode determines icon type by **combining** `resourceUri` with `collapsibleState`:

### **Files (CollapsibleState.None)**:
```typescript
resourceUri: vscode.Uri.file('/path/to/file.js')
collapsibleState: vscode.TreeItemCollapsibleState.None
// Result: JavaScript file icon from theme
```

### **Directories (CollapsibleState.Collapsed/Expanded)**:
```typescript
resourceUri: vscode.Uri.file('/path/to/folder/')
collapsibleState: vscode.TreeItemCollapsibleState.Collapsed  // or Expanded
// Result: Folder icon from theme
```

### **Critical Finding**:
```typescript
resourceUri: vscode.Uri.file('/path/to/folder/')
collapsibleState: vscode.TreeItemCollapsibleState.None
// Result: File icon (treated as file despite folder path!)
```

## Documentation Gap

The official VSCode TreeItem documentation states:

> "When a file or folder ThemeIcon is specified, icon is derived from the current file icon theme for the specified theme icon using TreeItem.resourceUri (if provided)."

**Missing information**: The documentation doesn't mention that `collapsibleState` affects icon derivation. It only describes the relationship between `iconPath` and `resourceUri`, not the role of `collapsibleState`.

## Solution Implementation

```typescript
const collapsibleState = hasChildren
  ? vscode.TreeItemCollapsibleState.Expanded      // Has children → Expanded
  : treeNode.type === 'dir'
    ? vscode.TreeItemCollapsibleState.Collapsed   // Directory without children → Collapsed
    : vscode.TreeItemCollapsibleState.None        // File → None
```

## Complete Icon Logic

VSCode TreeItem icon determination follows this hierarchy:

1. **Custom iconPath** (string/IconPath) → Uses custom icon, ignores resourceUri
2. **Falsy iconPath + resourceUri + Collapsed/Expanded** → Theme folder icon
3. **Falsy iconPath + resourceUri + None** → Theme file icon (based on extension)
4. **Falsy iconPath + no resourceUri + Collapsed/Expanded** → Default folder icon
5. **Falsy iconPath + no resourceUri + None** → Default file icon

## Impact

This discovery explains why many VSCode extensions have inconsistent folder icons - developers often set `CollapsibleState.None` for directories without children, causing them to appear as files.

## Best Practice

For proper theme icon integration:
- **Files**: Always use `CollapsibleState.None`
- **Directories with children**: Use `CollapsibleState.Expanded` or `Collapsed`
- **Directories without children**: Use `CollapsibleState.Collapsed` (not `None`)

## Documentation Recommendation

VSCode documentation should be updated to clarify:

> "Icon derivation from resourceUri depends on collapsibleState. Directories require CollapsibleState.Collapsed or Expanded to display as folder icons, regardless of children count."