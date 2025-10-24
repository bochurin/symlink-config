# Chat History Backup - Folder Rules

## Naming Convention

### Session Files
- **Format**: `session-YYYY-MM-DD-a.md` (always use -a suffix if -b exists)
- **Multiple sessions**: `session-YYYY-MM-DD-a.md`, `session-YYYY-MM-DD-b.md`, etc.
- **Descriptive suffix**: Only when multiple distinct topics on same day (e.g., `session-2025-10-24-os-encapsulation.md`)

### Index File
- **File**: `chat-history.md`
- **Purpose**: Overview of all sessions with links
- **Format**: Chronological list with topics, key changes, and phase progression

## File Organization

### Session Content
Each session file should include:
- **Session Overview**: Date, version, focus
- **Key Accomplishments**: Major changes and implementations
- **Technical Implementation**: Code changes and patterns
- **Conversation Highlights**: Important discussions and decisions
- **Commits**: List of commits made during session
- **Documentation Updates**: Changes to docs
- **Phase Status**: Current phase and next steps

### Index Updates
When adding new session:
1. Add entry to `chat-history.md`
2. Include session number, date, and link
3. List main topics covered
4. Note key changes and version progression
5. Indicate phase changes

## Maintenance

### Regular Updates
- Add session file after each development session
- Update chat-history.md index with new entry
- Keep session files focused and concise
- Use consistent formatting across all sessions

### Cleanup
- Combine related sessions when appropriate
- Remove redundant information
- Keep index synchronized with actual files
- Maintain chronological order
