export function osSpecificPath(
  pathString: string,
  targetOS: 'windows' | 'unix',
): string {
  return targetOS === 'windows' ? pathString.replace(/\//g, '\\\\') : pathString
}
