import * as vscode from 'vscode'
import { useFileWatcher, useConfigWatcher } from './hooks'
import { getWorkspaceRoot } from './state'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as symlinkConfigManager from './managers/symlink-config'
import * as fileExcludeManager from './managers/file-exclude'
import { FileEvent } from './managers'

export function setWatchers(treeProvider?: any) {
  let processingQueue = Promise.resolve()

  const isRootFile = (uri: vscode.Uri, filename: string) => {
    const root = getWorkspaceRoot()
    const path = uri.fsPath.split('\\').join('/') + '/'
    return path === root + filename + '/'
  }

  const queue = (fn: () => Promise<void>) =>
    (processingQueue = processingQueue.then(fn))

  const symlinkConfigWatcher = useFileWatcher({
    pattern: '**/symlink.config.json',
    onCreate: [
      () => queue(() => nextConfigManager.handleEvent(FileEvent.Modified)),
      () => treeProvider?.refresh(),
    ],
    onChange: [
      () => queue(() => nextConfigManager.handleEvent(FileEvent.Modified)),
      () => treeProvider?.refresh(),
    ],
    onDelete: [
      () => queue(() => nextConfigManager.handleEvent(FileEvent.Modified)),
      () => treeProvider?.refresh(),
    ],
  })

  const nextConfigWatcher = useFileWatcher({
    pattern: '**/next.symlink.config.json',
    onChange: (uri) => {
      if (isRootFile(uri, 'next.symlink.config.json')) {
        queue(() => nextConfigManager.handleEvent(FileEvent.Modified))
        treeProvider?.refresh()
      }
    },
    onDelete: (uri) => {
      if (isRootFile(uri, 'next.symlink.config.json')) {
        queue(() => nextConfigManager.handleEvent(FileEvent.Deleted))
        treeProvider?.refresh()
      }
    },
  })

  const currentConfigWatcher = useFileWatcher({
    pattern: '**/current-symlink.config.json',
    onCreate: (uri) => {
      if (isRootFile(uri, 'current-symlink.config.json')) {
        treeProvider?.refresh()
      }
    },
    onChange: (uri) => {
      if (isRootFile(uri, 'current-symlink.config.json')) {
        treeProvider?.refresh()
      }
    },
    onDelete: (uri) => {
      if (isRootFile(uri, 'current-symlink.config.json')) {
        treeProvider?.refresh()
      }
    },
  })

  const gitignoreWatcher = useFileWatcher({
    pattern: '**/.gitignore',
    onChange: (uri) =>
      isRootFile(uri, '.gitignore') &&
      queue(() => gitignoreManager.handleEvent()),
    onDelete: (uri) =>
      isRootFile(uri, '.gitignore') &&
      queue(() => gitignoreManager.handleEvent()),
  })

  const configWatcher = useConfigWatcher({
    sections: [
      {
        section: 'symlink-config',
        parameters: [
          {
            parameter: 'gitignoreServiceFiles',
            onChange: (section, parameter, payload) => {
              queue(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload),
              )
            },
          },
          {
            parameter: 'hideServiceFiles',
            onChange: (section, parameter, payload) => {
              queue(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload),
              )
            },
          },
          {
            parameter: 'hideSymlinkConfigs',
            onChange: (section, parameter, payload) => {
              queue(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload),
              )
            },
          },
        ],
      },
      {
        section: 'files',
        parameters: {
          parameter: 'exclude',
          onChange: () => {
            queue(() => fileExcludeManager.handleEvent())
          },
        },
      },
    ],
  })

  // set watcher disposals
  return () => {
    configWatcher.dispose()
    gitignoreWatcher.dispose()
    nextConfigWatcher.dispose()
    currentConfigWatcher.dispose()
    symlinkConfigWatcher.dispose()
  }
}
