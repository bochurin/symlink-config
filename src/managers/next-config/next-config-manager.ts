import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { SymlinkConfig, SymlinkEntry } from '../../types'

let workspaceRoot: string
let lastGeneratedContent: string | undefined

function init(root: string) {
  workspaceRoot = root
}

function initialize() {
  const nextConfigPath = path.join(workspaceRoot, 'next.symlink.config.json')
  try {
    if (fs.existsSync(nextConfigPath)) {
      lastGeneratedContent = fs.readFileSync(nextConfigPath, 'utf8')
      console.log('Initialized next config manager with existing file content')
    }
  } catch (error) {
    console.error('Failed to initialize next config manager:', error)
  }
}

async function generateNextConfig() {
  try {
    const configFiles = await findConfigFiles()
    const masterConfig = await createMasterConfig(configFiles)
    await writeNextConfig(masterConfig)

    console.log(`Generated next config from ${configFiles.length} config files`)
  } catch (error) {
    console.error('Failed to generate next config:', error)
  }
}

function handleNextConfigChange() {
  const nextConfigPath = path.join(workspaceRoot, 'next.symlink.config.json')

  try {
    const currentContent = fs.readFileSync(nextConfigPath, 'utf8')

    if (currentContent !== lastGeneratedContent) {
      vscode.window.showWarningMessage(
        'next.symlink.config.json was manually modified. Reverting to auto-generated version.',
        'OK',
      )

      if (lastGeneratedContent) {
        fs.writeFileSync(nextConfigPath, lastGeneratedContent, 'utf8')
      }
    }
  } catch (error) {
    console.error('Failed to handle next config change:', error)
  }
}

function handleNextConfigDelete() {
  vscode.window.showWarningMessage(
    'next.symlink.config.json was deleted. Regenerating...',
    'OK',
  )

  generateNextConfig()
}

async function findConfigFiles(): Promise<string[]> {
  const files = await vscode.workspace.findFiles('**/symlink.config.json')
  return files.map(uri => uri.fsPath)
}

async function createMasterConfig(
  configFiles: string[],
): Promise<SymlinkConfig> {
  const masterConfig: SymlinkConfig = {
    directories: [],
    files: [],
    exclude_paths: [],
  }

  for (const configFile of configFiles) {
    const config = await loadConfig(configFile)
    if (!config) continue

    const configDir = path.dirname(configFile)
    const relativeConfigDir = path.relative(workspaceRoot, configDir)

    if (config.directories) {
      for (const entry of config.directories) {
        masterConfig.directories!.push(
          convertToAtSyntax(entry, relativeConfigDir),
        )
      }
    }

    if (config.files) {
      for (const entry of config.files) {
        masterConfig.files!.push(convertToAtSyntax(entry, relativeConfigDir))
      }
    }

    if (config.exclude_paths) {
      masterConfig.exclude_paths!.push(...config.exclude_paths)
    }
  }

  masterConfig.exclude_paths = [...new Set(masterConfig.exclude_paths)]
  return masterConfig
}

function convertToAtSyntax(
  entry: SymlinkEntry,
  configDir: string,
): SymlinkEntry {
  return {
    target: pathToAtSyntax(entry.target, configDir),
    source: pathToAtSyntax(entry.source, configDir),
  }
}

function pathToAtSyntax(originalPath: string, configDir: string): string {
  if (originalPath.startsWith('@')) {
    return originalPath
  }

  const absolutePath = path.resolve(
    path.join(workspaceRoot, configDir),
    originalPath,
  )
  const relativePath = path.relative(workspaceRoot, absolutePath)

  return '@' + relativePath.replace(/\\\\/g, '/')
}

async function loadConfig(configPath: string): Promise<SymlinkConfig | null> {
  try {
    const content = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed to load config ${configPath}:`, error)
    return null
  }
}

async function writeNextConfig(config: SymlinkConfig) {
  const nextConfigPath = path.join(workspaceRoot, 'next.symlink.config.json')
  const content = JSON.stringify(config, null, 2)
  lastGeneratedContent = content
  fs.writeFileSync(nextConfigPath, content, 'utf8')
}

export const nextConfigManager = {
  init,
  initialize,
  generateNextConfig,
  handleNextConfigChange,
  handleNextConfigDelete,
}
