export function filePermissions(targetOS: 'windows' | 'unix'): number | undefined {
  return targetOS === 'windows' ? undefined : 0o755
}
