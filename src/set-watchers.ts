import * as vscode from 'vscode'
import { gitignoreManager } from './managers/gitignore'
import { nextConfigManager } from './managers/next-config'
import { useFileWatcher } from './hooks'

export function setWatchers(workspaceRoot: string) {
  gitignoreManager.init(workspaceRoot)
  nextConfigManager.init(workspaceRoot)

  const watchers: vscode.FileSystemWatcher[] = []

  nextConfigManager.initialize()

  watchers.push(
    useFileWatcher({
      pattern: '**/symlink.config.json',
      onCreate: () => nextConfigManager.generateNextConfig(),
      onChange: () => nextConfigManager.generateNextConfig(),
      onDelete: () => nextConfigManager.generateNextConfig(),
    }),
  )

  watchers.push(
    useFileWatcher({
      pattern: 'next.symlink.config.json',
      ignoreCreateEvents: true,
      onChange: () => nextConfigManager.handleNextConfigChange(),
      onDelete: [
        () => nextConfigManager.handleNextConfigDelete(),
        () => gitignoreManager.updateBasedOnConfiguration(),
      ],
    }),
  )

  watchers.push(
    useFileWatcher({
      pattern: '**/.gitignore',
      onCreate: () => gitignoreManager.updateBasedOnConfiguration(),
      onChange: () => gitignoreManager.updateBasedOnConfiguration(),
      onDelete: () => gitignoreManager.updateBasedOnConfiguration(),
    }),
  )

  watchers.push(
    useFileWatcher({
      pattern: '.git',
      ignoreChangeEvents: true,
      onCreate: () => gitignoreManager.updateBasedOnConfiguration(),
      onDelete: () => gitignoreManager.updateBasedOnConfiguration(),
    }),
  )

  nextConfigManager.generateNextConfig()
  gitignoreManager.updateBasedOnConfiguration()

  return () => watchers.forEach(w => w.dispose())
}
