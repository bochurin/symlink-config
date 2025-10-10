import * as vscode from 'vscode'
import { useFileWatcher, FileWatchEvent } from './hooks/use-file-watcher'
import { useConfigWatcher } from './hooks/use-config-watcher'
import { getWorkspaceRoot } from './state'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as symlinkConfigManager from './managers/symlink-config'
import * as fileExcludeManager from './managers/file-exclude'

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
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handler: [
        () =>
          queue(() => nextConfigManager.handleEvent(FileWatchEvent.Modified)),
        () => treeProvider?.refresh(),
      ],
    },
  })

  const nextConfigWatcher = useFileWatcher({
    pattern: '**/next.symlink.config.json',
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (uri, event) => {
        if (isRootFile(uri, 'next.symlink.config.json')) {
          queue(() => nextConfigManager.handleEvent(event))
          treeProvider?.refresh()
        }
      },
    },
  })

  const currentConfigWatcher = useFileWatcher({
    pattern: '**/current-symlink.config.json',
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handler: (uri) => {
        if (isRootFile(uri, 'current-symlink.config.json')) {
          treeProvider?.refresh()
        }
      },
    },
  })

  const gitignoreWatcher = useFileWatcher({
    pattern: '**/.gitignore',
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (uri) =>
        isRootFile(uri, '.gitignore') &&
        queue(() => gitignoreManager.handleEvent()),
    },
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
