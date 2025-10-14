import { createSymlinkConfigWatcher } from './symlink-config-watcher'
import { createNextConfigWatcher } from './next-config-watcher'
import { createCurrentConfigWatcher } from './current-config-watcher'
import { createGitignoreWatcher } from './gitignore-watcher'
import { createSymlinksWatcher } from './symlinks-watcher'
import { createConfigWatcher } from './config-watcher'

export function runAll() {
  createConfigWatcher()
  createGitignoreWatcher()
  createNextConfigWatcher()
  createCurrentConfigWatcher()
  createSymlinkConfigWatcher()
  createSymlinksWatcher()
}
