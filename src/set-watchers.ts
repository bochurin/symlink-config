import * as vscode from 'vscode'
import { useFileWatcher, useConfigWatcher } from './hooks'
import { getWorkspaceRoot } from './state'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as symlinkConfigManager from './managers/symlink-config'
import * as fileExcludeManager from './managers/file-exclude'

export function setWatchers() {
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
    onCreate: () => queue(() => nextConfigManager.handleEvent('modified')),
    onChange: () => queue(() => nextConfigManager.handleEvent('modified')),
    onDelete: () => queue(() => nextConfigManager.handleEvent('modified'))
  })

  const nextConfigWatcher = useFileWatcher({
    pattern: '**/next.symlink.config.json',
    onChange: (uri) =>
      isRootFile(uri, 'next.symlink.config.json') &&
      queue(() => nextConfigManager.handleEvent('modified')),
    onDelete: (uri) =>
      isRootFile(uri, 'next.symlink.config.json') &&
      queue(() => nextConfigManager.handleEvent('deleted'))
  })

  const gitignoreWatcher = useFileWatcher({
    pattern: '**/.gitignore',
    onChange: (uri) =>
      isRootFile(uri, '.gitignore') &&
      queue(() => gitignoreManager.handleEvent('modified')),
    onDelete: (uri) =>
      isRootFile(uri, '.gitignore') &&
      queue(() => gitignoreManager.handleEvent('deleted'))
  })

  const configWatcher = useConfigWatcher({
    sections: [
      {
        section: 'symlink-config',
        parameters: [
          {
            parameter: 'gitignoreServiceFiles',
            onChange: (section, parameter, payload) => {
              processingQueue = processingQueue.then(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload)
              )
            }
          },
          {
            parameter: 'hideServiceFiles',
            onChange: (section, parameter, payload) => {
              processingQueue = processingQueue.then(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload)
              )
            }
          },
          {
            parameter: 'hideSymlinkConfigs',
            onChange: (section, parameter, payload) => {
              processingQueue = processingQueue.then(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload)
              )
            }
          }
        ]
      },
      {
        section: 'files',
        parameters: {
          parameter: 'exclude',
          onChange: () => {
            processingQueue = processingQueue.then(() =>
              fileExcludeManager.handleEvent()
            )
          }
        }
      }
    ]
  })

  // set watcher disposals
  return () => {
    configWatcher.dispose()
    gitignoreWatcher.dispose()
    nextConfigWatcher.dispose()
    symlinkConfigWatcher.dispose()
  }
}
