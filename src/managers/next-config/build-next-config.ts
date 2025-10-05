import * as fs from 'fs'
import * as path from 'path'
import { SymlinkConfig, SymlinkEntry } from '../../types'
import { getWorkspaceRoot } from '../../shared/state'

export function buildNextConfig(): string {
  try {
    const configFiles = findConfigFiles()
    const masterConfig = createMasterConfig(configFiles)
    return JSON.stringify(masterConfig, null, 2)
  } catch {
    return ''
  }
}

function findConfigFiles(): string[] {
  const configFiles: string[] = []
  const workspaceRoot = getWorkspaceRoot()

  function scanDirectory(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          scanDirectory(fullPath)
        } else if (entry.name === 'symlink.config.json') {
          configFiles.push(fullPath)
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  scanDirectory(workspaceRoot)
  return configFiles
}

function createMasterConfig(configFiles: string[]): SymlinkConfig {
  const masterConfig: SymlinkConfig = {
    directories: [],
    files: [],
    exclude_paths: []
  }

  for (const configFile of configFiles) {
    const config = loadConfig(configFile)
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
    source: pathToAtSyntax(entry.source, configDir)
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

function loadConfig(configPath: string): SymlinkConfig | null {
  try {
    const content = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed to load config ${configPath}:`, error)
    return null
  }
}
