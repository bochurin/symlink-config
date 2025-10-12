import * as vscode from 'vscode'
import { useFileWatcher, FileWatchEvent } from './hooks/use-file-watcher'
import { useConfigWatcher } from './hooks/use-config-watcher'
import { getWorkspaceRoot } from './state'
import { FILE_NAMES, CONFIG_SECTIONS, CONFIG_PARAMETERS } from './shared/constants'
import { handleEvent as handleGitignoreEvent } from './managers/gitignore-file'
import { handleEvent as handleNextConfigEvent } from './managers/next-config-file'
import { handleEvent as handleCurrentConfigEvent } from './managers/current-config'
import { handleEvent as handleFileExcludeEvent } from './managers/file-exclude-settings'
import { handleEvent as handleSymlinkConfigEvent } from './managers/symlink-settings'

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
    pattern: `**/${FILE_NAMES.SYMLINK_CONFIG}`,
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handler: [
        () => queue(() => handleNextConfigEvent(FileWatchEvent.Modified)),
        () => treeProvider?.refresh(),
      ],
    },
  })

  const nextConfigWatcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.NEXT_SYMLINK_CONFIG}`,
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (uri, event) => {
        if (isRootFile(uri, FILE_NAMES.NEXT_SYMLINK_CONFIG)) {
          queue(() => handleNextConfigEvent(event))
          treeProvider?.refresh()
        }
      },
    },
  })

  const currentConfigWatcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.CURRENT_SYMLINK_CONFIG}`,
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handler: (uri) => {
        if (isRootFile(uri, FILE_NAMES.CURRENT_SYMLINK_CONFIG)) {
          treeProvider?.refresh()
        }
      },
    },
  })

  const gitignoreWatcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.GITIGNORE}`,
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (uri) =>
        isRootFile(uri, FILE_NAMES.GITIGNORE) && queue(() => handleGitignoreEvent()),
    },
  })

  // Watch all files for symlink changes
  const symlinkWatcher = useFileWatcher({
    pattern: '**/*',
    events: {
      on: [FileWatchEvent.Created, FileWatchEvent.Deleted],
      handler: async (uri) => {
        try {
          const stats = await vscode.workspace.fs.stat(uri)
          if (stats.type === vscode.FileType.SymbolicLink) {
            queue(() => handleCurrentConfigEvent('modified'))
          }
        } catch {
          // File might be deleted, check if it was a symlink by triggering regeneration
          // since we can't check deleted files
          queue(() => handleCurrentConfigEvent('modified'))
        }
      }
    }
  })

  const configWatcher = useConfigWatcher({
    sections: [
      {
        section: CONFIG_SECTIONS.SYMLINK_CONFIG,
        parameters: [
          {
            parameter: CONFIG_PARAMETERS.GITIGNORE_SERVICE_FILES,
            onChange: (section, parameter, payload) => {
              queue(() => handleSymlinkConfigEvent(section, parameter, payload))
            },
          },
          {
            parameter: CONFIG_PARAMETERS.HIDE_SERVICE_FILES,
            onChange: (section, parameter, payload) => {
              queue(() => handleSymlinkConfigEvent(section, parameter, payload))
            },
          },
          {
            parameter: CONFIG_PARAMETERS.HIDE_SYMLINK_CONFIGS,
            onChange: (section, parameter, payload) => {
              queue(() => handleSymlinkConfigEvent(section, parameter, payload))
            },
          },
        ],
      },
      {
        section: CONFIG_SECTIONS.FILES,
        parameters: {
          parameter: CONFIG_PARAMETERS.EXCLUDE,
          onChange: () => {
            queue(() => handleFileExcludeEvent())
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
    symlinkWatcher.dispose()
  }
}
