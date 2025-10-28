import { normalizePath } from './normalize-path'

// TODO: Refactor to accept Uri[] or (string | Uri)[] for consistency with other file-ops
export function findCommonPath(paths: string[]): string {
  if (paths.length === 1) {
    return normalizePath(paths[0], true)
  }

  const normalized = paths.map((p) => p.split(/[\\/]/))
  const shortest = normalized.reduce((min, current) =>
    current.length < min.length ? current : min,
  )

  let commonLength = 0
  for (let i = 0; i < shortest.length; i++) {
    if (normalized.every((p) => p[i] === shortest[i])) {
      commonLength = i + 1
    } else {
      break
    }
  }

  const commonPath = shortest.slice(0, commonLength).join('/')
  return normalizePath(commonPath, true)
}
