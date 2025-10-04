export function buildExclusions(): Record<string, boolean> {
  try {
    const exclusions: Record<string, boolean> = {}
    
    // Add service files to exclusions
    exclusions['next.symlink.config.json'] = true
    
    return exclusions
  } catch {
    return {}
  }
}