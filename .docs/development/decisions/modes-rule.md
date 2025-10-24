# CRITICAL RULE: COMPLETE vs INCREMENTAL MODES

## THE DIFFERENCE IS **SCOPE**, NOT SAFETY BEHAVIOR!

### What modes control:
- **Complete mode**: Process ALL symlinks from all configs
- **Incremental mode**: Process only CHANGED/MODIFIED symlinks

### What modes DO NOT control:
- ❌ Safety logic (both modes ALWAYS only remove symlinks, warn about real files)
- ❌ How symlinks are processed (identical safety behavior)
- ❌ Existence checking in safety logic (symlink checks handle non-existent paths)

### Implementation:
- **Same safety logic**: Both modes use identical `removeSymlink()` function
- **Different scope**: Complete mode processes more items, incremental processes fewer
- **No conditional safety**: Never wrap safety logic in existence checks based on mode

## REMEMBER: SCOPE ≠ SAFETY