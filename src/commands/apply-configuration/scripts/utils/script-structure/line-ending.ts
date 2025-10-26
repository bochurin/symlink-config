export function lineEnding(targetOS: 'windows' | 'unix'): string {
  return targetOS === 'windows' ? '\r\n' : '\n'
}
