import { useFileWatcher, FileWatchEvent } from './hooks/use-file-watcher'
import { isRootFile, isSymlink } from './shared/file-ops'
import { useConfigWatcher } from './hooks/use-config-watcher'

import {
  FILE_NAMES,
  CONFIG_SECTIONS,
  CONFIG_PARAMETERS,
} from './shared/constants'

import { handleEvent as handleGitignoreEvent } from './managers/gitignore-file'
import { handleEvent as handleNextConfigEvent } from './managers/next-config-file'
import { handleEvent as handleCurrentConfigEvent } from './managers/current-config'
import { handleEvent as handleFileExcludeEvent } from './managers/file-exclude-settings'
import { handleEvent as handleSymlinkConfigEvent } from './managers/symlink-settings'

export function setWatchers(treeProvider?: any) {
  let processingQueue = Promise.resolve()

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
        (events) => queue(() => handleNextConfigEvent(FileWatchEvent.Modified)),
        (events) => treeProvider?.refresh(),
      ],
    },
  })

  const nextConfigWatcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.NEXT_SYMLINK_CONFIG}`,
    filter: (uri, event) => isRootFile(uri),
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (events) => {
        queue(() => handleNextConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })

  const currentConfigWatcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.CURRENT_SYMLINK_CONFIG}`,
    filter: (uri, event) => isRootFile(uri),
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handler: (events) => {
        queue(() => handleCurrentConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })

  const gitignoreWatcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.GITIGNORE}`,
    filter: (uri, event) => isRootFile(uri),
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (events) => queue(() => handleGitignoreEvent()),
    },
  })

  // Watch all files for symlink changes with debouncing
  const symlinkWatcher = useFileWatcher({
    pattern: '**/*',
    debounce: 500,
    filter: (uri, event) => isSymlink(uri),
    events: {
      on: [FileWatchEvent.Created, FileWatchEvent.Deleted],
      handler: (events) => queue(() => handleCurrentConfigEvent('modified')),
    },
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
