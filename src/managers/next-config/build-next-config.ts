import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { SymlinkConfig, SymlinkEntry } from '../../types'
import { getWorkspaceRoot } from '../../state'

export async function buildNextConfig(): Promise<string> {
  try {
    const configFiles = await findConfigFiles()
    const masterConfig = await createMasterConfig(configFiles)
    return JSON.stringify(masterConfig, null, 2)
  } catch {
    return ''
  }
}

async function findConfigFiles(): Promise<string[]> {
  const files = await vscode.workspace.findFiles('**/symlink.config.json')
  return files.map((uri) => uri.fsPath)
}

async function createMasterConfig(configFiles: string[]): Promise<SymlinkConfig> {
  const masterConfig: SymlinkConfig = {
    directories: [],
    files: [],
    exclude_paths: [],
  }

  for (const configFile of configFiles) {
    const config = await loadConfig(configFile)
    if (!config) continue

    const configDir = path.dirname(configFile)
    const relativeConfigDir = path.relative(getWorkspaceRoot(), configDir)

    if (config.directories) {
      for (const entry of config.directories) {
        masterConfig.directories!.push(convertToAtSyntax(entry, relativeConfigDir))
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

function convertToAtSyntax(entry: SymlinkEntry, configDir: string): SymlinkEntry {
  return {
    target: pathToAtSyntax(entry.target, configDir),
    source: pathToAtSyntax(entry.source, configDir),
  }
}

function pathToAtSyntax(originalPath: string, configDir: string): string {
  if (originalPath.startsWith('@')) {
    return originalPath
  }

  const absolutePath = path.resolve(path.join(getWorkspaceRoot(), configDir), originalPath)
  const relativePath = path.relative(getWorkspaceRoot(), absolutePath)

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