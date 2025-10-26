export function ifExists(
  path: string,
  actions: string[],
  targetOS: 'windows' | 'unix',
): string[] {
  return targetOS === 'windows'
    ? [
        `if exist "${path}" (`,
        ...actions.map(action => `  ${action}`),
        ')'
      ]
    : [
        `if [ -e "${path}" ]; then`,
        ...actions.map(action => `  ${action}`),
        'fi'
      ]
}

export function ifNotExists(
  path: string,
  actions: string[],
  targetOS: 'windows' | 'unix',
  elseActions?: string[],
): string[] {
  if (targetOS === 'windows') {
    const lines = [
      `if not exist "${path}" (`,
      ...actions.map(action => `  ${action}`)
    ]
    if (elseActions) {
      lines.push(') else (')
      lines.push(...elseActions.map(action => `  ${action}`))
    }
    lines.push(')')
    return lines
  } else {
    const lines = [
      `if [ ! -e "${path}" ]; then`,
      ...actions.map(action => `  ${action}`)
    ]
    if (elseActions) {
      lines.push('else')
      lines.push(...elseActions.map(action => `  ${action}`))
    }
    lines.push('fi')
    return lines
  }
}

export function ifDirectoryNotExists(
  path: string,
  actions: string[],
  targetOS: 'windows' | 'unix',
): string[] {
  return targetOS === 'windows'
    ? [
        `if not exist "${path}" (`,
        ...actions.map(action => `  ${action}`),
        ')'
      ]
    : [
        `if [ ! -d "${path}" ]; then`,
        ...actions.map(action => `  ${action}`),
        'fi'
      ]
}

export function ifSourceExistsElseError(
  sourcePath: string,
  actions: string[],
  errorMessage: string,
  targetOS: 'windows' | 'unix',
): string[] {
  return targetOS === 'windows'
    ? [
        `if exist "${sourcePath}" (`,
        ...actions.map(action => `  ${action}`),
        ') else (',
        `  echo ${errorMessage}`,
        ')'
      ]
    : [
        `if [ -e "${sourcePath}" ]; then`,
        ...actions.map(action => `  ${action}`),
        'else',
        `  echo "${errorMessage}"`,
        'fi'
      ]
}
