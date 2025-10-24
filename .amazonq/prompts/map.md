Update documentation for recent code changes.

## Process

Update affected documentation in `.docs/reference/source-code-map/`

1. Read `.README.md` to get last update timestamp and rules of mapping
2. Use files modified dates to find all files created/modified since that timestamp
3. Use git to find which files were removed since last commit
4. Read all changed files to understand modifications
5. Update README.md with current timestamp .last-update`

## Files to Check

- All TypeScript files in src/ that changed
- Related documentation files in ./docs
- Modify references in documentation if it's needed
- Progress log if significant changes

## Output

- Updated source-code-map/ files
