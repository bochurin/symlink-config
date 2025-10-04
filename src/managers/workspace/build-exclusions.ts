export function buildExclusions(): Record<string, boolean> {
  try {
    const exclusions: Record<string, boolean> = {}
    
    // Service configuration files
    exclusions['next.symlink.config.json'] = true
    
    // Future: Add other service files here
    // exclusions['*.symlink.config.json'] = true
    
    return exclusions
  } catch {
    return {}
  }
}