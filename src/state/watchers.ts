import { Watcher } from './types'

const watchers = new Map<string, Watcher>()

export function registerWatcher(name: string, watcher: Watcher) {
  watchers.get(name)?.dispose()
  watchers.set(name, watcher)
}

export function getWatchers(...names: string[]): Watcher[] {
  return names.map((name) => watchers.get(name)).filter((w) => w !== undefined)
}

export function disposeWatchers(...names: string[]) {
  if (names.length === 0) {
    watchers.forEach((watcher) => watcher.dispose())
    watchers.clear()
  } else {
    names.forEach((name) => {
      watchers.get(name)?.dispose()
      watchers.delete(name)
    })
  }
}
